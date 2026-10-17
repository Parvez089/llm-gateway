import { ArrowRight, Server, Shield, Zap, Database } from "lucide-react";

export function HowItWorks() {
  const steps = [
    { icon: Server, title: "Client Request", desc: "API call hits the gateway." },
    { icon: Shield, title: "Auth & Limit", desc: "Validates API key & rate limit." },
    { icon: Database, title: "Cache Check", desc: "Checks Redis for cached response." },
    { icon: Zap, title: "Smart Route", desc: "Routes to best LLM based on cost." },
  ];

  return (
    <section id="architecture" className="bg-slate-50 py-24">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A seamless request lifecycle designed for maximum efficiency.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="flex flex-col items-center text-center max-w-[200px]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200 text-indigo-600 mb-4 z-10">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block h-6 w-6 text-slate-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}