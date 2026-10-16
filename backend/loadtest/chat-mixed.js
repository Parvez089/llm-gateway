import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const successRate = new Rate('success_rate');
const cacheHitLatency = new Trend('cache_hit_latency');
const cacheMissLatency = new Trend('cache_miss_latency');

export const options = {
    stages: [
        { duration: '10s', target: 20 },
        { duration: '30s', target: 50 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<5000'],
        success_rate: ['rate>0.95'],
    },
};

// Load from env var — do NOT hard-code API keys
const API_KEY = __ENV.API_KEY;
const URL = __ENV.URL || 'http://localhost:3000/v1/chat';

if (!API_KEY) {
    throw new Error('API_KEY env var is required. Example: k6 run -e API_KEY=sk_live_... loadtest/chat-mixed.js');
}

const prompts = [
    'What is 2+2?',
    'Say hi',
    'What is the capital of France?',
    'Translate hello to Spanish',
    'List three colors',
];

export default function () {
    const isCached = Math.random() < 0.6;
    const prompt = isCached
        ? prompts[Math.floor(Math.random() * prompts.length)]
        : `unique prompt ${__VU}-${__ITER}-${Date.now()}`;

    const payload = JSON.stringify({ prompt, cache: true });

    const params = {
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(URL, payload, params);

    const ok = check(res, {
        'status is 200': (r) => r.status === 200,
    });

    successRate.add(ok);

    if (res.status === 200) {
        try {
            const body = JSON.parse(res.body);
            if (body.meta?.cacheHit) {
                cacheHitLatency.add(res.timings.duration);
            } else {
                cacheMissLatency.add(res.timings.duration);
            }
        } catch (e) { }
    }

    sleep(0.1);
}