
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "@/lib/api";
import { useEffect, useState } from "react";

export function Stats() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['landingStats'],
    queryFn: () => fetchStats(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  if (!mounted) {
    return (
      <section className="relative border-y border-slate-200 bg-white/50 backdrop-blur-sm py-16">
        <div className="container mx-auto max-w-screen-xl px-4 h-[120px] flex items-center justify-center">
          <div className="w-full animate-pulse flex justify-between px-10">
            <div className="h-10 bg-slate-200 rounded w-1/5"></div>
            <div className="h-10 bg-slate-200 rounded w-1/5"></div>
            <div className="h-10 bg-slate-200 rounded w-1/5"></div>
            <div className="h-10 bg-slate-200 rounded w-1/5"></div>
          </div>
        </div>
      </section>
    );
  }

  const stats = [
    { 
      // 1. Cost Reduction 
      value: "64.2%", 
      label: "AVERAGE COST REDUCTION" 
    },
    { 
      // 2. Cache Hit Rate 
      value: (data?.cacheHitRate !== undefined && data.cacheHitRate > 0)
        ? `${(data.cacheHitRate * 100).toFixed(1)}%` 
        : "0.0%", 
      label: "CACHE HIT RATE" 
    },
    { 
      // 3. Total Requests 
      value: data?.totalRequests !== undefined 
        ? `${data.totalRequests.toLocaleString()}` 
        : "0", 
      label: "TOTAL REQUESTS PROCESSED" 
    },
    { 
      // 4. P95 Latency 
      value: data?.latency?.p95 !== undefined 
  ? `${(data.latency.p95 / 1000).toFixed(1)}s`
  : "0ms", 
      label: "P95 GATEWAY LATENCY" 
    },
  ];

  return (
    <section className="relative border-y border-slate-200 bg-white/50 backdrop-blur-sm py-16">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center">
              <span className={`text-4xl font-extrabold text-indigo-600 sm:text-5xl tracking-tight transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {stat.value}
              </span>
              <span className="mt-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}