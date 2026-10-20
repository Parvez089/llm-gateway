// components/playground/PipelineParams.tsx
import { Play, CornerDownLeft, Loader2 } from "lucide-react";
import { PlaygroundConfig } from "@/app/playground/page";

type Props = {
  config: PlaygroundConfig;
  setConfig: (config: PlaygroundConfig) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export function PipelineParams({ config, setConfig, onSubmit, isLoading }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">GATEWAY PIPELINE PARAMETERS</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Routing Strategy */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5 block">Routing</label>
          <select 
            value={config.routing}
            onChange={(e) => setConfig({...config, routing: e.target.value as any})}
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-300"
          >
            <option value="auto">Auto (Dynamic)</option>
            <option value="cheap">Cheap Only</option>
            <option value="quality">Quality Only</option>
          </select>
        </div>

        {/* Max Tokens */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5 block">Max Tokens</label>
          <input 
            type="number" 
            value={config.maxTokens} 
            onChange={(e) => setConfig({...config, maxTokens: Number(e.target.value)})}
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-300" 
          />
        </div>

        {/* Cache Toggle */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5 block">Cache</label>
          <select 
            value={config.cache ? "on" : "off"}
            onChange={(e) => setConfig({...config, cache: e.target.value === "on"})}
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-300"
          >
            <option value="on">Enabled</option>
            <option value="off">Disabled</option>
          </select>
        </div>
        
        {/* Temperature */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5 flex justify-between">
            <span>Temperature</span>
            <span className="text-indigo-600">{config.temperature}</span>
          </label>
          <input 
            type="range" min="0" max="1" step="0.1" 
            value={config.temperature} 
            onChange={(e) => setConfig({...config, temperature: Number(e.target.value)})}
            className="w-full accent-indigo-600" 
          />
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-slate-100">
        <button 
          onClick={onSubmit}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
          ) : (
            <><Play className="h-4 w-4" /> Run Prompt <span className="ml-2 hidden sm:flex items-center gap-1 text-indigo-200"><CornerDownLeft className="h-3 w-3"/> Enter</span></>
          )}
        </button>
      </div>
    </div>
  );
}