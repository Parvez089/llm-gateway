// backend/src/routes/playground.route.ts
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { redis } from "../lib/redis.js";
import { logger } from "../lib/logger.js";
import { GoogleGenAI } from "@google/genai";

const playgroundSchema = z.object({
    prompt: z.string().min(1).max(1000),
    routing: z.enum(['auto', 'cheap', 'quality']).default('auto'),
    temperature: z.number().min(0).max(2).default(0.3),
    maxTokens: z.number().min(1).max(1000).default(500),
    cache: z.boolean().default(true),
});

export const playgroundRoute: FastifyPluginAsync = async (fastify) => {
    fastify.post(
        '/v1/playground',
        {
            schema: {
                body: playgroundSchema,
            },
        },
        async(req, reply) => {
            try{
                const body = req.body as z.infer<typeof playgroundSchema>;

                // ========================================================
                // limit rate testing (currently off)
                // ========================================================
                /*
                const clientIp = req.ip; 
                const rateLimitKey = `playground_fl:${clientIp}`; 
                const currentCount = await redis.incr(rateLimitKey);
                if(currentCount === 1){ await redis.expire(rateLimitKey, 3600); }
                if(currentCount > 5){
                    return reply.code(429).send({
                        error: {
                            code: 'PLAYGROUND_RATE_LIMIT',
                            message: 'You have reached the daily demo limit (5 requests/hour). Please try again later',
                            requestId: req.id,
                        }
                    });
                }
                */
                // ========================================================

                const apiKey = process.env.GEMINI_API_KEY;
                if (!apiKey) {
                    throw new Error("GEMINI_API_KEY is not configured.");
                }
                const ai = new GoogleGenAI({ apiKey });

                //model selection base on route
              
                let modelName = 'gemini-3.5-flash'; 
                if (body.routing === 'quality') {
                    modelName = 'gemini-3.5-pro'; 
                } else if (body.routing === 'cheap') {
                    modelName = 'gemini-3.5-flash-lite';
                }

                const startTime = Date.now();

                // 3. Original api call
                const result = await ai.models.generateContent({
                    model: modelName,
                    contents: `You are a highly detailed and helpful AI assistant. Please provide comprehensive, well-structured, and detailed answers to the user's prompt. Use formatting where appropriate.\n\nUser Prompt: ${body.prompt}`,
                    config: {
                        temperature: body.temperature,
                        maxOutputTokens: Math.max(body.maxTokens, 2048), 
                    }
                });

                const latencyMs = Date.now() - startTime;
                const outputText = result.text || "No response generated.";
                const finishReason = result.candidates?.[0]?.finishReason;
                console.log(`[Playground] Model: ${modelName} | Finish Reason: ${finishReason} | Output Length: ${outputText.length}`);

                const response = {
                    id: `req_${Date.now().toString(36)}`,
                    output: outputText,
                    meta: {
                        model: modelName,
                        tier: body.routing === 'auto' ? 'cheap' : body.routing,
                        routingScore: body.prompt.length > 50 ? 65 : 25,
                        cacheHit: false, 
                        fallbackUsed: false,
                        latencyMs: latencyMs,
                        tokens: {
                            input: Math.ceil(body.prompt.length / 4), 
                            output: Math.ceil(outputText.length / 4)
                        },
                        costUsd: 0.000042, 
                    }
                };
                
                return reply.code(200).send(response);

            } catch(error: any){
                logger.error(
                    {err: error, requestId: req.id}, 'Playground request failed'
                );
                return reply.code(500).send({
                    error: {
                        code: 'INTERNAL_SERVER_ERROR',
                        message: error.message || 'Failed to process playground request.',
                        requestId: req.id,
                    },
                });
            }
        }
    )
}