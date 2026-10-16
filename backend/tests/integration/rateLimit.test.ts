import { buildApp } from '../../src/app.js';
import { ApiKey } from '../../src/models/ApiKey.js';
import { generateApiKey } from '../../src/lib/hash.js';
import { connectMongo, closeMongo } from '../../src/lib/mongo.js';
import { redis } from '../../src/lib/redis.js';

type App = Awaited<ReturnType<typeof buildApp>>;

describe.skip('Rate Limit Integration', () => {
  let app: App;
  let testApiKey: string;
  let testKeyId: string;

  beforeAll(async () => {
    await connectMongo();
    app = await buildApp();
    await app.ready();

    const { key, keyHash, keyPrefix } = generateApiKey();
    testApiKey = key;

    const apiKey = await ApiKey.create({
      name: 'RateLimit Test Key',
      keyHash,
      keyPrefix,
      rateLimit: { capacity: 3, refillPerSec: 0.1 },
      isActive: true,
    });
    testKeyId = apiKey._id.toString();

    await redis.del(`rl:${testKeyId}`);
  });

  afterAll(async () => {
    await redis.del(`rl:${testKeyId}`);
    await ApiKey.deleteMany({ name: 'RateLimit Test Key' });
    await app.close();
    await closeMongo();
  });

  it('should include rate limit headers on request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/chat',
      headers: { authorization: `Bearer ${testApiKey}` },
      payload: { prompt: 'test rate limit', cache: false },
    });

    expect(response.headers['x-ratelimit-limit']).toBe('3');
    expect(response.headers['x-ratelimit-remaining']).toBeDefined();
  }, 30000);

  it('should return 429 after capacity exhausted', async () => {
    await redis.del(`rl:${testKeyId}`);

    let hitLimit = false;
    for (let i = 0; i < 6; i++) {
      const response = await app.inject({
        method: 'POST',
        url: '/v1/chat',
        headers: { authorization: `Bearer ${testApiKey}` },
        payload: { prompt: `rate limit test ${i}`, cache: false },
      });

      if (response.statusCode === 429) {
        hitLimit = true;
        const body = JSON.parse(response.body);
        expect(body.error.code).toBe('RATE_LIMIT_EXCEEDED');
        expect(response.headers['retry-after']).toBeDefined();
        break;
      }
    }

    expect(hitLimit).toBe(true);
  }, 30000);
});
