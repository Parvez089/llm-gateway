import type { FastifyRequest, FastifyReply } from 'fastify';
import { ApiKey, type ApiKeyDoc } from '../models/ApiKey.js';
import { sha256 } from '../lib/hash.js';

declare module 'fastify' {
  interface FastifyRequest {
    apiKey?: ApiKeyDoc;
  }
}

export async function apiKeyAuth(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({
      error: {
        code: 'MISSING_API_KEY',
        message: 'Authorization header required: Bearer <api_key>',
        requestId: req.id,
      },
    });
  }

  const rawKey = authHeader.slice(7).trim();
  const keyHash = sha256(rawKey);

  const apiKey = await ApiKey.findOne({ keyHash, isActive: true });

  if (!apiKey) {
    req.log.warn({ keyPrefix: rawKey.slice(0, 12) }, 'Invalid API key');
    return reply.code(401).send({
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid or revoked API key',
        requestId: req.id,
      },
    });
  }

  // Attach to request for downstream use
  req.apiKey = apiKey;

  // Update lastUsedAt (async, don't block request)
  ApiKey.updateOne({ _id: apiKey._id }, { $set: { lastUsedAt: new Date() } }).catch(
    (err) => req.log.error({ err }, 'Failed to update lastUsedAt')
  );
}