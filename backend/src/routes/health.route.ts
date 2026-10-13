import { redis } from '../lib/redis.js';
import type { FastifyPluginAsync } from 'fastify';

import mongoose from 'mongoose';

export const healthRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async () => {
    const redisOk = redis.status === 'ready';
    const mongoOk = mongoose.connection.readyState === 1;

    return {
      status: redisOk && mongoOk ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        redis: redisOk ? 'up' : 'down',
        mongo: mongoOk ? 'up' : 'down',
      },
    };
  });
};