export type Tier = 'cheap' | 'quality';

export type RoutingMode = 'auto' | 'cheap' | 'quality';

export type RoutingDecision = {
  tier: Tier;
  score: number;
  reason: string;
};