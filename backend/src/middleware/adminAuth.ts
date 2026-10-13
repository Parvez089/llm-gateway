import type { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../config/env.js';

export async function adminAuth(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({
      error: {
        code: 'MISSING_ADMIN_KEY',
        message: 'Admin key required',
        requestId: req.id,
      },
    });
  }

  const providedKey = authHeader.slice(7).trim();

  if (providedKey !== env.ADMIN_KEY) {
    req.log.warn('Invalid admin key attempt');
    return reply.code(403).send({
      error: {
        code: 'INVALID_ADMIN_KEY',
        message: 'Invalid admin key',
        requestId: req.id,
      },
    });
  }
}