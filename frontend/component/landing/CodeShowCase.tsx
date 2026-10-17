import { Terminal } from 'lucide-react';

export function CodeShowcase() {
  return (
    <div className="mt-12 w-full max-w-3xl rounded-lg border border-slate-200 bg-white shadow-md overflow-hidden text-left relative z-10">
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-2.5 border-b border-slate-100 bg-slate-50">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
        </div>
        <div className="ml-3 text-[11px] font-mono text-slate-500 flex items-center">
          <Terminal className="w-3 h-3 mr-1.5" />
          POST /v1/chat/completions
        </div>
        <div className="ml-auto text-[11px] font-mono text-emerald-600 font-medium">
          200 OK · 142ms
        </div>
      </div>
      
      {/* Terminal Body */}
      <div className="p-5 overflow-x-auto text-[13px] font-mono leading-relaxed text-slate-700 bg-white">
        <pre>
          <code>
{`curl -X POST https://llm-gateway.vercel.app/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{"role": "user", "content": "Explain quantum computing"}],
    "routing": "auto"
  }'`}
          </code>
        </pre>
      </div>
    </div>
  );
}