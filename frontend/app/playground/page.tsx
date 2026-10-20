// app/playground/page.tsx
"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query"; 
import { PlaygroundHeader } from "@/component/playground/PlaygroundHeader";
import { PromptEditor } from "@/component/playground/PromptEditor";
import { ResponseOutput } from "@/component/playground/ResponseOutput";
import { PipelineParams } from "@/component/playground/PipelineParams";
import { TraceDetails } from "@/component/playground/TraceDetails";
import { toast } from "sonner";

export type PlaygroundConfig = {
  routing: "auto" | "cheap" | "quality";
  maxTokens: number;
  temperature: number;
  cache: boolean;
};

export type PlaygroundResponse = {
  id: string;
  output: string;
  meta: {
    model: string;
    tier: string;
    routingScore: number;
    cacheHit: boolean;
    fallbackUsed: boolean;
    latencyMs: number;
    tokens: { input: number; output: number };
    costUsd: number;
  };
};

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState("");
  
  const [config, setConfig] = useState<PlaygroundConfig>({
    routing: "auto",
    maxTokens: 500,
    temperature: 0.3,
    cache: true,
  });
  
  const [response, setResponse] = useState<PlaygroundResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const queryClient = useQueryClient(); 

  const handleRunPrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Prompt cannot be empty.");
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/v1/playground`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          routing: config.routing,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          cache: config.cache,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Failed to fetch response.");
      }

      const data: PlaygroundResponse = await res.json();
      setResponse(data);
      toast.success("Response generated successfully!");
      

      queryClient.invalidateQueries({ queryKey: ['landingStats'] });
      
    } catch (error: any) {
      toast.error(error.message || "An error occurred. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* <PlaygroundHeader /> */}
      
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 flex flex-col gap-6">
            <PromptEditor prompt={prompt} setPrompt={setPrompt} />
            <ResponseOutput data={response} isLoading={isLoading} />
            <PipelineParams 
              config={config} 
              setConfig={setConfig} 
              onSubmit={handleRunPrompt} 
              isLoading={isLoading} 
            />
          </div>

          <div className="lg:col-span-4">
            <TraceDetails data={response} isLoading={isLoading} />
          </div>
          
        </div>
      </main>
    </div>
  );
}