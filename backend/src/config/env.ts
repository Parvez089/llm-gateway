import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  REDIS_URL: z.string().url(),
  MONGO_URL: z.string().url(),
  ADMIN_KEY: z.string().min(32, 'ADMIN_KEY must be at least 32 chars'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;