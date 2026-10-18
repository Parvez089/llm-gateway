// frontend/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ব্যাকএন্ডের StatsResponse টাইপের সাথে হুবহু মিলিয়ে তৈরি করা হয়েছে
export type StatsResponse = {
  range: string;
  since: string;
  totalRequests: number;
  totalCost: number;
  successRate: number;
  modelUsage: Record<string, number>;
  tierUsage: { cheap: number; quality: number };
  latency: { p50: number; p95: number; avg: number };
  statusBreakdown: Record<string, number>;
  
  // ল্যান্ডিং পেজের নতুন ফিল্ডগুলো
  costSavingsPercentage?: number;
  cacheHitRate?: number;
  throughput?: number;
  testCoverage?: number;
};

export async function fetchStats(range: string = '24h'): Promise<StatsResponse> {
  const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'your-admin-key'; 

  try {
    const res = await fetch(`${API_BASE_URL}/v1/stats?range=${range}`, {
      headers: {
        'Authorization': `Bearer ${adminKey}`,
        'Content-Type': 'application/json',
      },
      // Next.js ক্যাশে ইস্যু এড়াতে
      cache: 'no-store' 
    });

    if (!res.ok) {
      // এরর ট্র্যাকিংয়ের জন্য
      const errorBody = await res.text();
      console.error(`API Error ${res.status}:`, errorBody);
      throw new Error(`Failed to fetch stats: ${res.status}`);
    }
    
    const data = await res.json();
    
    // ডেভেলপার কনসোলে দেখার জন্য (যাতে বুঝতে পারেন ডেটা ঠিকমতো আসছে কিনা)
    console.log("Backend Data Received:", data); 
    
    return data;
  } catch (error) {
    console.error("Error in fetchStats:", error);
    throw error;
  }
}