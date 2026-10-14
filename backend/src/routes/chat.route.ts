import type { FastifyPluginAsync } from 'fastify';
import { apiKeyAuth } from '../middleware/apiKeyAuth.js';
import { ChatRequestSchema, type ChatResponse } from '../types/api.js';
import { routerEngine } from '../services/router/routerEngine.js';
import { providerRegistry } from '../services/provider/providerRegistry.js';
import { calculateCost } from '../services/cost/costCalculator.js';
import { callWithFallback } from '../services/resilience/fallbackChain.js';
import { FALLBACK_CHAINS, MODELS } from '../config/models.js';

export const chatRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    '/v1/chat',
    { preHandler: apiKeyAuth },
    async (req, reply) => {
      const parsed = ChatRequestSchema.safeParse(req.body);

      if (!parsed.success) {
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

      // 2. Get provider
      const provider = providerRegistry.get(modelConfig.provider);
      if (!provider) {
        return reply.code(500).send({
          error: {
            code: 'PROVIDER_NOT_FOUND',
            message: `Provider ${modelConfig.provider} not available`,
            requestId: req.id,
          },
        });
      }

      // 3. Call LLM with fallback chain
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

        req.log.info(
          {
            modelUsed: result.modelUsed,
            fallbackUsed: result.fallbackUsed,
            attempts: result.attempts.length,
            latencyMs,
          },
          'Chat completed'
        );

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
        req.log.error({ err }, 'All models in fallback chain failed');
        return reply.code(502).send({
          error: {
            code: 'LLM_ERROR',
            message: 'All LLM providers failed. Please try again later.',
            requestId: req.id,
          },
        });
      }
    }
  );
};