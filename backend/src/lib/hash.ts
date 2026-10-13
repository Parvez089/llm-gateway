import crypto from 'node:crypto';

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function generateApiKey(): { key: string; keyHash: string; keyPrefix: string } {
  // Generate random key: sk_live_<32 bytes hex>
  const randomBytes = crypto.randomBytes(24).toString('hex');
  const key = `sk_live_${randomBytes}`;
  const keyHash = sha256(key);
  const keyPrefix = key.slice(0, 12); // "sk_live_a1b2"

  return { key, keyHash, keyPrefix };
}

export function generateAdminKey(): string {
  return crypto.randomBytes(32).toString('hex');
}