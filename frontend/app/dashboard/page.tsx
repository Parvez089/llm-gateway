// frontend/app/dashboard/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchStats } from "@/lib/api";

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["stats", "24h"],
    queryFn: () => fetchStats("24h"),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center px-4 text-center text-red-500">
        Failed to load stats. Check that the backend is running.
      </div>
    );
  }

  const totalRequests = data?.totalRequests ?? 0;
  const cacheHitRate = data?.cacheHitRate ?? 0;
  const totalCost = data?.totalCost ?? 0;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          label="Total Requests (24h)"
          value={totalRequests.toLocaleString()}
        />
        <StatCard
          label="Cache Hit Rate"
          // Assumes the backend returns a percentage (0-100).
          // If it returns a fraction (0-1), use (cacheHitRate * 100) instead.
          value={`${cacheHitRate.toFixed(1)}%`}
        />
        <StatCard label="Total Cost" value={`$${totalCost.toFixed(4)}`} />
      </div>
    </div>
  );
}