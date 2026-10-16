import { string } from "zod";


export function normalizePrompt(prompt: string): string{
    return prompt.trim().toLowerCase().replace(/\s+/g, " ");
}
import crypto from 'node:crypto';
import type { ChatRequest } from '../../types/api.js';

export function buildCacheKey(input: {
    prompt: string;
    system?: string;
    model: string;
    temperature: number;
    maxTokens?: number;
}): string{
    const parts = [
        normalizePrompt(input.prompt),
        input.model,
        String(input.temperature),
        String(input.maxTokens ?? 'default'),
    ];

    const joined = parts.join('|');
    const hash = crypto.createHash('sha256').update(joined).digest('hex');

    return `cache: ${hash}`
}