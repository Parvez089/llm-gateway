import type { FastifyPluginAsync } from 'fastify';
import { apiKeyAuth } from '../middleware/apiKeyAuth.js';
import { ChatRequestSchema, type ChatResponse } from '../types/api.js';

export const chatRoute: FastifyPluginAsync = async (fastify) => {
  // POST /v1/chat - LLM routing endpoint
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

      // TODO: Day 3 - Implement routing + real LLM call
      // For now, mock response
      const mockOutput = `[MOCK] Echo: ${body.prompt.slice(0, 100)}`;

      const latencyMs = Date.now() - startTime;

      const response: ChatResponse = {
        id: req.id,
        output: mockOutput,
        meta: {
          model: 'mock',
          tier: 'cheap',
          routingScore: 20,
          cacheHit: false,
          fallbackUsed: false,
          latencyMs,
          tokens: {
            input: body.prompt.length,
            output: mockOutput.length,
          },
          costUsd: 0,
        },
      };

      return reply.code(200).send(response);
    }
  );
};