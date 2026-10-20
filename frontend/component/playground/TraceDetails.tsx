// components/playground/TraceDetails.tsx
import { Activity, Database, Server, Zap, ShieldCheck, Loader2 } from "lucide-react";
import { PlaygroundResponse } from "@/app/playground/page";

type Props = {
  data: PlaygroundResponse | null;
  isLoading: boolean;
};

export function TraceDetails({ data, isLoading }: Props) {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Metadata Card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-500" /> Response Metadata
          </h3>
          {data && <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">200 OK</span>}
        </div>
        
        <div className="p-4 space-y-4 text-xs">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            </div>
          ) : data ? (
            <>
              <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100 text-indigo-900">
                <p className="font-semibold flex items-center gap-1.5 mb-1"><Zap className="h-3 w-3"/> Routed to {data.meta.tier} Tier</p>
                <p className="text-indigo-700/80">Routing Score: {data.meta.routingScore}/100. Fallback Used: {data.meta.fallbackUsed ? "Yes" : "No"}</p>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Model</span>
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{data.meta.model}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Latency</span>
                <span className="font-mono text-slate-700">{data.meta.latencyMs}ms</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Cache</span>
                <span className={`font-mono px-2 py-0.5 rounded ${data.meta.cacheHit ? 'text-green-600 bg-green-50' : 'text-slate-600 bg-slate-100'}`}>
                  {data.meta.cacheHit ? "HIT" : "MISS"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Cost</span>
                <span className="font-mono text-slate-700">${data.meta.costUsd.toFixed(6)}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-400">
              No metadata available.
            </div>
          )}
        </div>
      </div>

      {/* Trace Waterfall */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Trace Waterfall</h4>
        
        {data ? (
          <div className="space-y-3 font-mono text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><Database className="h-3 w-3 text-blue-500"/> Total</span>
              <span className="text-slate-700">{data.meta.latencyMs}ms</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-full"></div>
            </div>
          </div>
        ) : (
           <div className="text-center py-4 text-slate-400 text-xs">Run a prompt to see trace.</div>
        )}
      </div>

    </div>
  );
}