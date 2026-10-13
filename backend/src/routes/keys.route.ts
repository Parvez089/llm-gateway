import type { FastifyPluginAsync } from 'fastify';
import { adminAuth } from '../middleware/adminAuth.js';
import { ApiKey } from '../models/ApiKey.js';
import { generateApiKey } from '../lib/hash.js';
import { CreateKeySchema, type CreateKeyResponse } from '../types/api.js';

export const keysRoute: FastifyPluginAsync = async (fastify) => {
  // POST /v1/keys - Create a new API key (admin only)
  fastify.post(
    '/v1/keys',
    { preHandler: adminAuth },
    async (req, reply) => {
      const parsed = CreateKeySchema.safeParse(req.body);

      if (!parsed.success) {
        return reply.code(400).send({
          error: {
            code: 'INVALID_REQUEST',
            message: parsed.error.issues[0]?.message ?? 'Invalid request body',
            requestId: req.id,
          },
        });
      }

      const { name, rateLimit } = parsed.data;
      const { key, keyHash, keyPrefix } = generateApiKey();

      const finalRateLimit = rateLimit ?? { capacity: 60, refillPerSec: 1 };

      const apiKey = await ApiKey.create({
        name,
        keyHash,
        keyPrefix,
        rateLimit: finalRateLimit,
        isActive: true,
      });

      req.log.info({ keyId: apiKey._id, name }, 'API key created');

      const response: CreateKeyResponse = {
        id: apiKey._id.toString(),
        name: apiKey.name,
        key, // ⚠️ Only returned once!
        keyPrefix: apiKey.keyPrefix,
        rateLimit: {
          capacity: apiKey.rateLimit?.capacity ?? finalRateLimit.capacity,
          refillPerSec: apiKey.rateLimit?.refillPerSec ?? finalRateLimit.refillPerSec,
        },
        createdAt: apiKey.createdAt.toISOString(),
      };

      return reply.code(201).send(response);
    }
  );
};