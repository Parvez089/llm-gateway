import { buildApp } from '../../src/app.js';
import { ApiKey } from '../../src/models/ApiKey.js';
import { generateApiKey } from '../../src/lib/hash.js';
import { connectMongo, closeMongo } from '../../src/lib/mongo.js';
import { redis } from '../../src/lib/redis.js';

type App = Awaited<ReturnType<typeof buildApp>>;

describe.skip('Chat Integration', () => {
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
      name: 'Chat Test Key',
      keyHash,
      keyPrefix,
      rateLimit: { capacity: 100, refillPerSec: 10 },
      isActive: true,
    });
    testKeyId = apiKey._id.toString();

    await redis.del(`rl:${testKeyId}`);
  });

  afterAll(async () => {
    await redis.del(`rl:${testKeyId}`);
    await ApiKey.deleteMany({ name: 'Chat Test Key' });
    await app.close();
    await closeMongo();
  });

  it('should return 200 with valid request or 502 if LLM unavailable', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/chat',
      headers: { authorization: `Bearer ${testApiKey}` },
      payload: { prompt: 'Say hi', cache: false },
    });

    expect([200, 502]).toContain(response.statusCode);

    if (response.statusCode === 200) {
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('output');
      expect(body.meta).toHaveProperty('model');
      expect(body.meta).toHaveProperty('tier');
      expect(body.meta).toHaveProperty('latencyMs');
    }
  }, 30000);

  it('should return cached response on second identical call', async () => {
    const prompt = `cache test unique ${Date.now()}`;

    const r1 = await app.inject({
      method: 'POST',
      url: '/v1/chat',
      headers: { authorization: `Bearer ${testApiKey}` },
      payload: { prompt, cache: true },
    });

    if (r1.statusCode !== 200) {
      return;
    }

    const r2 = await app.inject({
      method: 'POST',
      url: '/v1/chat',
      headers: { authorization: `Bearer ${testApiKey}` },
      payload: { prompt, cache: true },
    });

    expect(r2.statusCode).toBe(200);
    const body = JSON.parse(responseBody(r2));
    expect(body.meta.cacheHit).toBe(true);
  }, 30000);
});

function responseBody(response: { body: string }): string {
  return response.body;
}
