// frontend/components/landing/QuickStart.tsx
"use client";

import { CheckCircle2, Copy, Check } from "lucide-react";
import { useState } from "react";

export function QuickStart() {
  const [copied, setCopied] = useState(false);

  // আপনার প্রজেক্টের রিয়েল কমান্ড
  const command = "git clone https://github.com/Parvez089/llm-gateway.git && cd llm-gateway/backend && npm install && npm run dev";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto max-w-screen-xl px-4 text-center">
        
        {/* Header */}
        <p className="text-[11px] font-bold tracking-widest text-emerald-600 uppercase mb-3">
          Quickstart
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Deploy in under 60 seconds
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
          Run the fully self-contained gateway server locally with standard Redis backing.
        </p>

        {/* Code Block */}
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-5 py-4">
            <code className="text-sm font-mono text-slate-700 overflow-x-auto whitespace-nowrap text-left">
              <span className="text-indigo-600 font-semibold">npm</span> run dev
              <span className="text-slate-400"> # or clone & install first</span>
            </code>
            <button 
              onClick={handleCopy}
              className="ml-4 flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Zero external telemetry</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Node.js & TypeScript</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Native Redis caching</span>
          </div>
        </div>

      </div>
    </section>
  );
}