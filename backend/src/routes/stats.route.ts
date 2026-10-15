import type { FastifyPluginAsync } from 'fastify';
import { adminAuth } from '../middleware/adminAuth.js';
import { getStats, type StatsRange } from '../services/logging/statsService.js';

const VALID_RANGES: StatsRange[] = ['1h', '24h', '7d', '30d'];

export const statsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/v1/stats',
    { preHandler: adminAuth },
    async (req, reply) => {
      const query = req.query as { range?: string };
      const range = (query.range ?? '24h') as StatsRange;

      if (!VALID_RANGES.includes(range)) {
        return reply.code(400).send({
          error: {
            code: 'INVALID_RANGE',
            message: `Range must be one of: ${VALID_RANGES.join(', ')}`,
            requestId: req.id,
          },
        });
      }

      const stats = await getStats(range);

      return reply.code(200).send(stats);
    }
  );
};