// frontend/components/landing/Navbar.tsx
"use client";

import Link from "next/link";
import { Star, Menu, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";

const GITHUB_REPO = "Parvez089/llm-gateway";
const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

const navLinks = [
  { name: "Architecture", href: "#architecture", enabled: true },
  { name: "Features", href: "#features", enabled: true },
  { name: "Benchmarks", href: "#benchmarks", enabled: false },
  { name: "Docs", href: "#docs", enabled: true },
].filter((link) => link.enabled);

function formatStars(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
}

function useGithubStars(): number | null {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return stars;
}

function StarBadge({ stars }: { stars: number | null }) {
  if (!stars) return null;

  return (
    <span className="flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
      <Star className="h-3 w-3 fill-slate-400 text-slate-400" />
      {formatStars(stars)}
    </span>
  );
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const stars = useGithubStars();

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
        
        {/* Left: logo */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center gap-2.5">
            {/* 💡 whitespace-nowrap যোগ করা হয়েছে যাতে টেক্সট দুই লাইনে না ভাঙে */}
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              LLM Gateway
            </span>
            {/* 💡 মোবাইলে v0.1.0 ব্যাজটি লুকিয়ে রাখতে hidden sm:inline-flex ব্যবহার করা হলো */}
            <span className="hidden sm:inline-flex ml-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-500 whitespace-nowrap">
              v0.1.0
            </span>
          </Link>
        </div>

        {/* Center: desktop navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="transition-colors hover:text-slate-900 whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}

          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-slate-900 whitespace-nowrap"
          >
            <FaGithub className="h-4 w-4" />
            GitHub
            <StarBadge stars={stars} />
          </Link>
        </nav>

        {/* Right: actions */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <Link
            href="/playground"
            className="hidden h-9 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:inline-flex whitespace-nowrap"
          >
            Try the Playground
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-16 w-full border-b border-slate-200 bg-white shadow-lg md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="px-2 py-1 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <FaGithub className="h-4 w-4" />
              GitHub
              <StarBadge stars={stars} />
            </Link>

            <hr className="my-2 border-slate-100" />

            <div className="px-2">
              <Link
                href="/playground"
                onClick={closeMenu}
                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
              >
                Try the Playground
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}