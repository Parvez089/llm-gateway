// frontend/components/landing/Hero.tsx
import Link from "next/link";
import { Play } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { CodeShowcase } from "./CodeShowCase";

const GITHUB_URL = "https://github.com/Parvez089/llm-gateway";

// Only list capabilities that are actually implemented.
// Remove or add items here as the backend progresses.
const capabilities = [
  "Smart model routing",
  "Redis response caching",
  "Token-bucket rate limiting",
  "Automatic fallback",
  "Cost & latency tracking",
];

export function Hero() {
  return (
    <section className="relative z-10 container mx-auto flex max-w-screen-xl flex-col items-center px-4 pb-16 pt-16 text-center md:pb-24 md:pt-24">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 shadow-sm">
        <span className="mr-2 flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        OPEN SOURCE &middot; TYPESCRIPT &middot; REDIS
      </div>

      {/* Heading */}
      <h1 className="font-display max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
        Route every prompt to the <br className="hidden md:block" />
        <span className="text-blue-600">right model.</span>
      </h1>

      {/* Subheading */}
      <p className="mt-5 max-w-2xl leading-relaxed text-slate-600 sm:text-base md:text-lg">
        An LLM gateway that scores each prompt, sends it to the cheapest model
        that can handle it, caches repeated requests, and falls back
        automatically when a provider fails.
      </p>

      {/* Capability chips */}
      <ul className="mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
        {capabilities.map((item) => (
          <li
            key={item}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm"
          >
            {item}
          </li>
        ))}
      </ul>

      {/* CTA buttons */}
      <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/demo"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
        >
          <Play className="h-4 w-4" />
          Try the Playground
        </Link>
        <Link
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
        >
          <FaGithub className="h-4 w-4" />
          View on GitHub
        </Link>
      </div>

      {/* Code showcase */}
      <CodeShowcase />
    </section>
  );
}