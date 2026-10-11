import { buildApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { connectMongo, closeMongo } from './lib/mongo.js';
import { closeRedis } from './lib/redis.js';

async function main() {
  const app = await buildApp();

  await connectMongo();
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
  logger.info(`Gateway listening on http://localhost:${env.PORT}`);

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down...`);
    await app.close();
    await closeRedis();
    await closeMongo();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  logger.error({ err }, 'Fatal startup error');
  process.exit(1);
});