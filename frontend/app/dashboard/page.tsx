// frontend/app/dashboard/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['stats'],
    queryFn: () => fetchStats('24h'),
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
      <div className="flex h-screen items-center justify-center text-red-500">
        ফেচ করতে সমস্যা হয়েছে। ব্যাকএন্ড চালু আছে কিনা চেক করুন।
      </div>
    );
  }

  // আপনার ব্যাকএন্ড থেকে আসা ডেটা এখানে দেখতে পাবেন
  console.log(data);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* ডেটা দেখানোর জন্য কিছু টেস্ট কার্ড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-sm text-slate-500">Total Requests</p>
          <p className="text-3xl font-bold text-slate-900">{data?.totalRequests || 0}</p>
        </div>
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-sm text-slate-500">Cache Hit Rate</p>
          <p className="text-3xl font-bold text-slate-900">{data?.cacheHitRate || 0}%</p>
        </div>
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-sm text-slate-500">Total Cost</p>
          <p className="text-3xl font-bold text-slate-900">${data?.totalCostUsd || 0}</p>
        </div>
      </div>
    </div>
  );
}