import { RequestLog } from '../../models/RequestLog.js';

export type StatsRange = '1h' | '24h' | '7d' | '30d';

export type StatsResponse = {
  range: StatsRange;
  since: string;
  totalRequests: number;
  totalCost: number;
  cacheHitRate: number;
  successRate: number;
  modelUsage: Record<string, number>;
  tierUsage: { cheap: number; quality: number };
  latency: { p50: number; p95: number; avg: number };
  statusBreakdown: Record<string, number>;
};

function getRangeMs(range: StatsRange): number {
  switch (range) {
    case '1h': return 60 * 60 * 1000;
    case '24h': return 24 * 60 * 60 * 1000;
    case '7d': return 7 * 24 * 60 * 60 * 1000;
    case '30d': return 30 * 24 * 60 * 60 * 1000;
  }
}

export async function getStats(range: StatsRange = '24h'): Promise<StatsResponse> {
  const since = new Date(Date.now() - getRangeMs(range));

  const logs = await RequestLog.find({ createdAt: { $gte: since } }).lean();

  const totalRequests = logs.length;

  if (totalRequests === 0) {
    return {
      range,
      since: since.toISOString(),
      totalRequests: 0,
      totalCost: 0,
      cacheHitRate: 0,
      successRate: 0,
      modelUsage: {},
      tierUsage: { cheap: 0, quality: 0 },
      latency: { p50: 0, p95: 0, avg: 0 },
      statusBreakdown: {},
    };
  }

  const totalCost = logs.reduce((sum, l) => sum + (l.costUsd ?? 0), 0);
  const cacheHits = logs.filter((l) => l.cacheHit).length;
  const successCount = logs.filter((l) => l.status >= 200 && l.status < 300).length;

  // Model usage
  const modelUsage: Record<string, number> = {};
  const tierUsage = { cheap: 0, quality: 0 };
  const statusBreakdown: Record<string, number> = {};

  for (const log of logs) {
    modelUsage[log.model] = (modelUsage[log.model] ?? 0) + 1;
    tierUsage[log.tier] = (tierUsage[log.tier] ?? 0) + 1;
    const statusKey = String(log.status);
    statusBreakdown[statusKey] = (statusBreakdown[statusKey] ?? 0) + 1;
  }

  // Latency percentiles
  const sortedLatencies = logs.map((l) => l.latencyMs).sort((a, b) => a - b);
  const p50 = sortedLatencies[Math.floor(sortedLatencies.length * 0.5)] ?? 0;
  const p95 = sortedLatencies[Math.floor(sortedLatencies.length * 0.95)] ?? 0;
  const avg =
    sortedLatencies.reduce((sum, l) => sum + l, 0) / sortedLatencies.length;

  return {
    range,
    since: since.toISOString(),
    totalRequests,
    totalCost,
    cacheHitRate: cacheHits / totalRequests,
    successRate: successCount / totalRequests,
    modelUsage,
    tierUsage,
    latency: {
      p50: Math.round(p50),
      p95: Math.round(p95),
      avg: Math.round(avg),
    },
    statusBreakdown,
  };
}