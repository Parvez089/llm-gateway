import type { FastifyPluginAsync } from 'fastify';
import { apiKeyAuth } from '../middleware/apiKeyAuth.js';
import { ChatRequestSchema, type ChatResponse } from '../types/api.js';
import { routerEngine } from '../services/router/routerEngine.js';
import { providerRegistry } from '../services/provider/providerRegistry.js';
import { calculateCost } from '../services/cost/costCalculator.js';
import { callWithFallback } from '../services/resilience/fallbackChain.js';
import { logRequest } from '../services/logging/requestLogger.js';
import { rateLimit } from '../middleware/rateLimit.js';
import {
  getCached,
  setCached,
  acquireLock,
  releaseLock,
} from '../services/cache/cacheService.js';
import { FALLBACK_CHAINS, MODELS } from '../config/models.js';

export const chatRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    '/v1/chat',
    { preHandler: [apiKeyAuth, rateLimit] },
    async (req, reply) => {
      const parsed = ChatRequestSchema.safeParse(req.body);

      if (!parsed.success) {
        logRequest({
          requestId: req.id,
          apiKeyId: req.apiKey!._id,
          model: 'unknown',
          tier: 'cheap',
          routingScore: 0,
          cacheHit: false,
          fallbackUsed: false,
          status: 400,
          latencyMs: 0,
          inputTokens: 0,
          outputTokens: 0,
          costUsd: 0,
          errorType: 'INVALID_REQUEST',
        });

        return reply.code(400).send({
          error: {
            code: 'INVALID_REQUEST',
            message: parsed.error.issues[0]?.message ?? 'Invalid request body',
            requestId: req.id,
          },
        });
      }

      const body = parsed.data;
      const startTime = Date.now();

      // 1. Routing
      const route = routerEngine.route(body.prompt, body.routing);
      const tier = route.tier;
      const chain = FALLBACK_CHAINS[tier];
      const firstModel = chain[0]!;
      const modelConfig = MODELS[firstModel as keyof typeof MODELS];

      // 2. Cache key inputs
      const cacheInput = {
        prompt: body.prompt,
        system: body.system,
        model: firstModel,
        temperature: body.temperature,
        maxTokens: body.maxTokens,
      };

      // 3. Cache lookup (only if cache enabled)
      if (body.cache) {
        const cached = await getCached(cacheInput);
        if (cached) {
          const latencyMs = Date.now() - startTime;

          req.log.info({ cacheHit: true, latencyMs }, 'Cache hit');

          logRequest({
            requestId: req.id,
            apiKeyId: req.apiKey!._id,
            model: cached.model,
            tier: cached.tier,
            routingScore: cached.routingScore,
            cacheHit: true,
            fallbackUsed: false,
            status: 200,
            latencyMs,
            inputTokens: cached.inputTokens,
            outputTokens: cached.outputTokens,
            costUsd: 0, // no cost on cache hit
            errorType: null,
          });

          const response: ChatResponse = {
            id: req.id,
            output: cached.output,
            meta: {
              model: cached.model,
              tier: cached.tier,
              routingScore: cached.routingScore,
              cacheHit: true,
              fallbackUsed: false,
              latencyMs,
              tokens: {
                input: cached.inputTokens,
                output: cached.outputTokens,
              },
              costUsd: 0,
            },
          };

          return reply.code(200).send(response);
        }
      }

      // 4. Cache miss — acquire lock (stampede protection)
      let lockAcquired = false;
      if (body.cache) {
        lockAcquired = await acquireLock(cacheInput);
      }

      // 5. Get provider
      const provider = providerRegistry.get(modelConfig.provider);
      if (!provider) {
        if (lockAcquired) await releaseLock(cacheInput);

        logRequest({
          requestId: req.id,
          apiKeyId: req.apiKey!._id,
          model: firstModel,
          tier,
          routingScore: route.score,
          cacheHit: false,
          fallbackUsed: false,
          status: 500,
          latencyMs: Date.now() - startTime,
          inputTokens: 0,
          outputTokens: 0,
          costUsd: 0,
          errorType: 'PROVIDER_NOT_FOUND',
        });

        return reply.code(500).send({
          error: {
            code: 'PROVIDER_NOT_FOUND',
            message: `Provider ${modelConfig.provider} not available`,
            requestId: req.id,
          },
        });
      }

      // 6. Call LLM
      try {
        const result = await callWithFallback(provider, chain, {
          prompt: body.prompt,
          system: body.system,
          temperature: body.temperature,
          maxTokens: body.maxTokens,
        });

        const latencyMs = Date.now() - startTime;
        const costUsd = calculateCost(
          result.modelUsed,
          result.response.inputTokens,
          result.response.outputTokens
        );

        // 7. Store in cache (only if cache enabled)
        if (body.cache) {
          await setCached(cacheInput, {
            output: result.response.output,
            model: result.modelUsed,
            tier,
            routingScore: route.score,
            inputTokens: result.response.inputTokens,
            outputTokens: result.response.outputTokens,
            costUsd,
          });
        }

        req.log.info(
          {
            modelUsed: result.modelUsed,
            fallbackUsed: result.fallbackUsed,
            attempts: result.attempts.length,
            latencyMs,
            cacheHit: false,
          },
          'Chat completed'
        );

        logRequest({
          requestId: req.id,
          apiKeyId: req.apiKey!._id,
          model: result.modelUsed,
          tier,
          routingScore: route.score,
          cacheHit: false,
          fallbackUsed: result.fallbackUsed,
          status: 200,
          latencyMs,
          inputTokens: result.response.inputTokens,
          outputTokens: result.response.outputTokens,
          costUsd,
          errorType: null,
        });

        const response: ChatResponse = {
          id: req.id,
          output: result.response.output,
          meta: {
            model: result.modelUsed,
            tier,
            routingScore: route.score,
            cacheHit: false,
            fallbackUsed: result.fallbackUsed,
            latencyMs,
            tokens: {
              input: result.response.inputTokens,
              output: result.response.outputTokens,
            },
            costUsd,
          },
        };

        return reply.code(200).send(response);
      } catch (err) {
        const latencyMs = Date.now() - startTime;

        req.log.error({ err }, 'All models in fallback chain failed');

        logRequest({
          requestId: req.id,
          apiKeyId: req.apiKey!._id,
          model: firstModel,
          tier,
          routingScore: route.score,
          cacheHit: false,
          fallbackUsed: true,
          status: 502,
          latencyMs,
          inputTokens: 0,
          outputTokens: 0,
          costUsd: 0,
          errorType: 'LLM_ERROR',
        });

        return reply.code(502).send({
          error: {
            code: 'LLM_ERROR',
            message: 'All LLM providers failed. Please try again later.',
            requestId: req.id,
          },
        });
      } finally {
        // 8. Release lock if we acquired it
        if (lockAcquired) {
          await releaseLock(cacheInput);
        }
      }
    }
  );
};