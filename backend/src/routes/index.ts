import type { FastifyPluginAsync } from 'fastify';
import { healthRoute } from './health.route.js';
import { keysRoute } from './keys.route.js';
import { chatRoute } from './chat.route.js';
import { statsRoute } from './stats.route.js';

export const registerRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(healthRoute);
  await fastify.register(keysRoute);
  await fastify.register(chatRoute);
  await fastify.register(statsRoute);
};