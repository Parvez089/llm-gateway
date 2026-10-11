import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { logger } from './lib/logger.js';
import { redis } from './lib/redis.js';
import mongoose from 'mongoose';

export async function buildApp() {
  const app = Fastify({
    loggerInstance: logger,
    requestIdHeader: 'x-request-id',
    genReqId: () =>
      `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, { origin: true });
  await app.register(helmet);

  app.get('/health', async () => {
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

  return app;
}