// frontend/component/playground/PlaygroundHeader.tsx
import { Share2, Settings2, History } from "lucide-react";
import Link from "next/link";

export function PlaygroundHeader() {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        
        {/* Left Side: Breadcrumb & Status */}
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-indigo-100 text-indigo-600">
              <span className="text-[10px] font-bold">G</span>
            </span>
            GATEWAY CONSOLE
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-900">Interactive Playground</span>
          
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Cluster Active
          </span>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
          <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <History className="h-4 w-4" /> 
            <span className="hidden sm:inline">History (24)</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <Settings2 className="h-4 w-4" /> 
            <span className="hidden sm:inline">Gateway Config</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <Share2 className="h-4 w-4" /> 
            <span className="hidden sm:inline">Share Trace</span>
          </button>
        </div>

      </div>
    </div>
  );
}