export function Stats() {
  const stats = [
    { value: "64.2%", label: "AVERAGE COST REDUCTION" },
    { value: "68.4%", label: "CACHE HIT RATE" },
    { value: "12,500+", label: "REQ/S EDGE THROUGHPUT" },
    { value: "94.8%", label: "TEST COVERAGE ACROSS 42 SUITES" },
  ];

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-16">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-indigo-600 sm:text-5xl tracking-tight">
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