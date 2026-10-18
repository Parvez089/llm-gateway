// frontend/components/landing/ArchitectureFlow.tsx
import { Server, Shield, Database, GitBranch, Cpu } from "lucide-react";

export function ArchitectureFlow() {
  return (
    <section id="architecture" className="border-y border-slate-200 bg-slate-50 py-24">
      <div className="container mx-auto max-w-screen-xl px-4">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase mb-2">
            Architecture
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How prompts flow through the gateway
          </h2>
        </div>

        {/* Diagram Container */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-12">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 relative">
            
            {/* Mobile/Tablet Connecting Line (Top to Bottom) */}
            <div className="absolute left-1/2 top-20 bottom-20 w-px bg-slate-200 -z-10 lg:hidden"></div>

            {/* 1. Client App */}
            <div className="relative z-10 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-5 shadow-sm w-full max-w-[200px] lg:w-44 text-center">
              <Server className="mb-2 h-6 w-6 text-slate-700" />
              <h3 className="font-semibold text-slate-900 text-sm">Client / App</h3>
              <p className="text-[11px] text-slate-500 mt-1">OpenAI SDK</p>
            </div>

            {/* Mobile Arrow & Label */}
            <div className="flex lg:hidden flex-col items-center text-indigo-600 my-2">
              <span className="text-[10px] font-mono mb-1 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">/v1/chat</span>
              <svg className="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>

            {/* Desktop Arrow & Label */}
            <div className="hidden lg:flex flex-col items-center text-indigo-500">
              <span className="text-[10px] font-mono mb-1">/v1/chat</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>

            {/* 2. Gateway Core (VPC) */}
            <div className="relative z-10 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-4 md:p-6 w-full lg:w-[480px]">
              <p className="absolute -top-3 left-4 bg-white px-2 text-[9px] md:text-[10px] font-bold text-indigo-600 tracking-wider rounded">
                LLM GATEWAY CORE (VPC)
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-2">
                {/* Left Col */}
                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <Shield className="h-4 w-4 text-slate-600 mb-1" />
                    <h4 className="text-xs font-semibold text-slate-800">Auth & Rate Limit</h4>
                    <p className="text-[10px] text-slate-500">Token Bucket (Lua)</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <GitBranch className="h-4 w-4 text-slate-600 mb-1" />
                    <h4 className="text-xs font-semibold text-slate-800">Circuit Breaker</h4>
                    <p className="text-[10px] text-slate-500">Zero-Downtime Fallback</p>
                  </div>
                </div>

                {/* Right Col */}
                <div className="flex flex-col gap-3 md:gap-4 justify-center">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <Database className="h-4 w-4 text-slate-600 mb-1" />
                    <h4 className="text-xs font-semibold text-slate-800">Semantic Cache</h4>
                    <p className="text-[10px] text-slate-500">RAG: 4ms Return</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <Cpu className="h-4 w-4 text-slate-600 mb-1" />
                    <h4 className="text-xs font-semibold text-slate-800">Complexity Classifier</h4>
                    <p className="text-[10px] text-slate-500">AI-Driven Tiering</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Arrow & Labels */}
            <div className="flex lg:hidden flex-col items-center gap-2 my-2">
              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">Tier: Quality</span>
              <svg className="h-6 w-6 rotate-90 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
             <div className="flex lg:hidden flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">Tier: Fast</span>
              <svg className="h-6 w-6 rotate-90 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>

            {/* Desktop Split Arrows (SVG) */}
            <div className="hidden lg:flex flex-col gap-12 relative w-24 h-full justify-center">
              <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 0,50 Q 50,50 100,15" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 2"/>
                <path d="M 0,50 Q 50,50 100,85" fill="none" stroke="#4ade80" strokeWidth="2" strokeDasharray="4 2"/>
              </svg>
              <span className="absolute top-2 right-2 text-[9px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">Tier: Quality</span>
              <span className="absolute bottom-2 right-2 text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">Tier: Fast</span>
            </div>

            {/* 3. Providers */}
            <div className="relative z-10 flex flex-col gap-3 md:gap-4 w-full lg:w-52 mt-4 lg:mt-0">
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                <span className="text-xs font-medium text-slate-700">Claude 3.5 Sonnet</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-medium text-slate-700">OpenAI GPT-4o</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-xs font-medium text-slate-700">Gemini 2.5 Flash</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-center text-sm font-mono text-slate-500">
          One endpoint. Multiple providers. Full local control.
        </p>

      </div>
    </section>
  );
}