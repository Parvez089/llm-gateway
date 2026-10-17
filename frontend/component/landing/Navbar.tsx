import Link from 'next/link';
import { ArrowRight, GitBranch } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center px-4">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <span className="text-lg font-bold font-display tracking-tight text-slate-900">
            LLM Gateway
          </span>
        </Link>
        
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium text-slate-600">
          <Link href="#features" className="transition-colors hover:text-slate-900">Features</Link>
          <Link href="#architecture" className="transition-colors hover:text-slate-900">How It Works</Link>
          <Link href="#benchmarks" className="transition-colors hover:text-slate-900">Benchmarks</Link>
          <Link href="#docs" className="transition-colors hover:text-slate-900">Docs</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link 
            href="https://github.com/Parvez089/llm-gateway" 
            target="_blank" 
            className="hidden sm:flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <GitBranch className="h-4 w-4" />
            <span>GitHub</span>
          </Link>
          <Link 
            href="/login" 
            className="inline-flex h-8 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md"
          >
            Live Demo <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}