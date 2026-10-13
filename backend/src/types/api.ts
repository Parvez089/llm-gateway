import { z } from 'zod';

// POST /v1/keys request body
export const CreateKeySchema = z.object({
  name: z.string().min(1).max(100),
  rateLimit: z
    .object({
      capacity: z.number().int().min(1).max(10000).default(60),
      refillPerSec: z.number().min(0.1).max(1000).default(1),
    })
    .optional(),
});

export type CreateKeyInput = z.infer<typeof CreateKeySchema>;

// POST /v1/keys response
export type CreateKeyResponse = {
  id: string;
  name: string;
  key: string;        // ⚠️ Only returned once!
  keyPrefix: string;
  rateLimit: {
    capacity: number;
    refillPerSec: number;
  };
  createdAt: string;
};

// POST /v1/chat request body
export const ChatRequestSchema = z.object({
  prompt: z.string().min(1).max(100000),
  system: z.string().max(10000).optional(),
  routing: z.enum(['auto', 'cheap', 'quality']).default('auto'),
  temperature: z.number().min(0).max(2).default(0.3),
  maxTokens: z.number().int().min(1).max(32000).optional(),
  cache: z.boolean().default(true),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// POST /v1/chat response
export type ChatResponse = {
  id: string;
  output: string;
  meta: {
    model: string;
    tier: 'cheap' | 'quality';
    routingScore: number;
    cacheHit: boolean;
    fallbackUsed: boolean;
    latencyMs: number;
    tokens: { input: number; output: number };
    costUsd: number;
  };
};

// Error response
export type ApiError = {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
};