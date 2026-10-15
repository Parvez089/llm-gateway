import { RequestLog } from '../../models/RequestLog.js';
import { logger } from '../../lib/logger.js';
import type { Types } from 'mongoose';

export type LogRequestData = {
  requestId: string;
  apiKeyId: Types.ObjectId | string;
  model: string;
  tier: 'cheap' | 'quality';
  routingScore: number;
  cacheHit: boolean;
  fallbackUsed: boolean;
  status: number;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  errorType: string | null;
};

/**
 * Log a request to MongoDB asynchronously.
 * Does NOT block the response — fire and forget.
 */
export function logRequest(data: LogRequestData): void {
  RequestLog.create(data).catch((err) => {
    logger.error({ err, requestId: data.requestId }, 'Failed to write request log');
  });
}