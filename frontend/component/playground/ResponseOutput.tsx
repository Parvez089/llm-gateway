// components/playground/ResponseOutput.tsx
import { Copy, CheckCircle2, Loader2 } from "lucide-react";
import { PlaygroundResponse } from "@/app/playground/page";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; 

type Props = {
  data: PlaygroundResponse | null;
  isLoading: boolean;
};

export function ResponseOutput({ data, isLoading }: Props) {
  
  const handleCopy = () => {
    if (data?.output) {
      navigator.clipboard.writeText(data.output);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-[300px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">Response Output</span>
          {data && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
              <CheckCircle2 className="h-3 w-3" /> COMPLETED ({data.meta.latencyMs}ms)
            </span>
          )}
        </div>
        {data && (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <button onClick={handleCopy} className="flex items-center gap-1 hover:text-slate-900 transition-colors">
              <Copy className="h-3.5 w-3.5"/> Copy
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 overflow-x-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm">Routing prompt to optimal model...</p>
          </div>
        ) : data ? (
          <>
            <div className="flex items-center gap-2 mb-4 text-xs font-mono text-slate-500">
              <span>{data.meta.model}</span>
              <span>•</span>
              <span>{data.meta.cacheHit ? "cache hit" : "new generation"}</span>
            </div>
            
            {/* Markdown rander */}
            <div className="text-sm text-slate-600 leading-relaxed prose prose-sm max-w-none prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-code:text-indigo-600 prose-table:border-collapse prose-th:border prose-th:border-slate-300 prose-th:bg-slate-100 prose-th:p-2 prose-td:border prose-td:border-slate-300 prose-td:p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.output}
              </ReactMarkdown>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs font-mono text-slate-400 border-t border-slate-100 pt-4">
              <span>⚡ Latency: {data.meta.latencyMs}ms</span>
              <span>•</span>
              <span>Tokens: {data.meta.tokens.input} in / {data.meta.tokens.output} out</span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-slate-400">
            Run a prompt to see the response here.
          </div>
        )}
      </div>
    </div>
  );
}