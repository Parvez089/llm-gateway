import Link from 'next/link';
import { CodeShowcase } from './CodeShowCase';

export function Hero() {
  return (
    <section className="relative z-10 container mx-auto max-w-screen-xl px-4 pt-16 pb-16 md:pt-24 md:pb-24 flex flex-col items-center text-center">
      
      {/* Badge */}
      <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 mb-6 shadow-sm">
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
        SHOW, DON'T TELL
      </div>
      
      {/* Heading */}
      <h1 className="text-4xl font-bold font-display tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl leading-[1.1]">
        The proof is in the process. <br className="hidden md:block" />
        And the <span className="text-blue-600">outcome.</span>
      </h1>
      
      {/* Subheading */}
      <p className="mt-5 max-w-2xl leading-relaxed text-slate-600 sm:text-base md:text-lg">
        Every project is a collaboration between strategy, creativity, and execution. 
        Here's a selection of work that reflects how we think, create, and solve problems.
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center">
        <Link 
          href="https://github.com/Parvez089/llm-gateway" 
          target="_blank" 
          className="inline-flex h-11 items-center justify-center rounded-md bg-blue-600 px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
        >
          Get started for free
        </Link>
        <Link 
          href="/login" 
          className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
        >
          Book a demo
        </Link>
      </div>

      {/* Code Showcase */}
      <CodeShowcase />
    </section>
  );
}