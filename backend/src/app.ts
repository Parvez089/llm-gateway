import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { logger } from './lib/logger.js';
import { registerRoutes } from './routes/index.js';

export async function buildApp() {
  const app = Fastify({
    loggerInstance: logger,
    requestIdHeader: 'x-request-id',
    genReqId: () =>
      `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, {
  origin: 'http://localhost:3000',
  credentials: true,
});
  await app.register(helmet);

  // Register all routes
  await app.register(registerRoutes);

  return app;
}