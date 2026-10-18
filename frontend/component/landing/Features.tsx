import { Route, Database, ShieldAlert, RefreshCw } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Complexity-Based Routing",
      description: "Analyzes prompt complexity and automatically routes to the most cost-effective model.",
      icon: Route,
    },
    {
      title: "Redis Response Caching",
      description: "Exact-match caching eliminates redundant LLM calls, drastically reducing cost and latency.",
      icon: Database,
    },
    {
      title: "Token Bucket Rate Limiting",
      description: "Per-API-key limits ensure your application stays within provider quotas without going down.",
      icon: ShieldAlert,
    },
    {
      title: "Circuit Breaker Fallback",
      description: "Automatically falls back to alternative models if a primary provider fails or times out.",
      icon: RefreshCw,
    },
  ];

  return (
    <section id="features" className="bg-white py-24">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Engineered for Reliability
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to build resilient, production-ready AI applications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-200">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}