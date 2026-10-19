// frontend/components/landing/Footer.tsx
import Link from "next/link";
import {  ShieldCheck, Star } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear(); // ডাইনামিক বছর (যেমন: ২০২৫ বা ২০২৬)

  const footerLinks = {
    product: [
      { name: "Smart Routing", href: "#features" },
      { name: "Semantic Cache", href: "#" },
      { name: "Rate Limiting", href: "#" },
      { name: "Circuit Breakers", href: "#" },
      { name: "Observability", href: "#" },
      { name: "Benchmarks", href: "#benchmarks" },
      { name: "Changelog", href: "#", isNew: true },
    ],
    resources: [
      { name: "Documentation", href: "#docs" },
      { name: "API Reference", href: "#docs" },
      { name: "Architecture Spec", href: "#architecture" },
      { name: "Self-Hosting Guide", href: "#" },
      { name: "Docker & Helm", href: "#" },
      { name: "Integrations", href: "#" },
      { name: "SDKs (Python/TS)", href: "#" },
    ],
    community: [
      { name: "GitHub Repo", href: "https://github.com/Parvez089/llm-gateway", isGithub: true },
      { name: "Discord Community", href: "#" },
      { name: "X / Twitter", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contributing", href: "#" },
      { name: "Security Policy", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-slate-200 bg-white pt-16">
      <div className="container mx-auto max-w-screen-xl px-4">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8 mb-16">
          
          {/* Brand & Status */}
          <div className="flex flex-col items-start gap-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-slate-50 text-slate-700">
                <span className="font-bold text-sm leading-none">L</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">LLM Gateway</span>
              <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                V0.1.0
              </span>
            </Link>
            
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              Autonomous LLM routing, distributed semantic caching, and real-time inference telemetry. 100% self-hosted & open source under MIT.
            </p>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-emerald-700">All Systems Operational</span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            
            {/* Product Column */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                      {link.name}
                      {link.isNew && (
                        <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 border border-indigo-100">New</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Column */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Community</h3>
              <ul className="space-y-3">
                {footerLinks.community.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} target={link.isGithub ? "_blank" : "_self"} className="text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5">
                      {link.name}
                    
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-200 py-6 gap-4">
          <p className="text-xs text-slate-400">
            © {currentYear} LLM Gateway. Built with MIT License for autonomous scale.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              No prompt data or telemetry leaves your VPC · Air-gapped ready
            </span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
              <Link href="/status" className="hover:text-slate-900 transition-colors">Status</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}