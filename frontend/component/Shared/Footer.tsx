/** @format */

// frontend/components/landing/Footer.tsx
import Link from "next/link";

const GITHUB_URL = "https://github.com/Parvez089/llm-gateway";

// A fixed year avoids calling `new Date()` during prerendering, which fails
// under Next.js Cache Components ("unstable value new Date()").
// Update this once a year, or use a range like "2026-2027".
const COPYRIGHT_YEAR = 2026;

type FooterLink = { name: string; href: string; external?: boolean };

// Only link to things that actually exist.
// Anchors start with "/" so they also work from other pages such as /demo.
// Add Benchmarks / Changelog / etc. here once those pages are real.
const footerLinks: Record<"product" | "resources" | "community", FooterLink[]> =
  {
    product: [
      { name: "Smart Routing", href: "/#features" },
      { name: "Response Caching", href: "/#features" },
      { name: "Rate Limiting", href: "/#features" },
      { name: "Automatic Fallback", href: "/#features" },
    ],
    resources: [
      { name: "Documentation", href: `${GITHUB_URL}#readme`, external: true },
      { name: "Architecture", href: "/#architecture" },
      { name: "Playground", href: "/demo" },
    ],
    community: [
      { name: "GitHub Repo", href: GITHUB_URL, external: true },
      { name: "Report an Issue", href: `${GITHUB_URL}/issues`, external: true },
      {
        name: "License (MIT)",
        href: `${GITHUB_URL}/blob/main/LICENSE`,
        external: true,
      },
    ],
  };

const columns = [
  { title: "Product", links: footerLinks.product },
  { title: "Resources", links: footerLinks.resources },
  { title: "Community", links: footerLinks.community },
];

export function Footer() {
  return (
    <footer className='border-t border-slate-200 bg-white pt-16'>
      <div className='container mx-auto max-w-screen-xl px-4'>
        {/* Top section */}
        <div className='mb-16 grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8'>
          {/* Brand */}
          <div className='flex flex-col items-start gap-4 lg:col-span-1'>
            <Link href='/' className='flex items-center gap-2'>
              <div className='flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-slate-50 text-slate-700'>
                <span className='text-sm font-bold leading-none'>L</span>
              </div>
              <span className='text-lg font-bold tracking-tight text-slate-900'>
                LLM Gateway
              </span>
              <span className='rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500'>
                v0.1.0
              </span>
            </Link>

            <p className='max-w-xs text-sm leading-relaxed text-slate-500'>
              An open-source LLM gateway built with TypeScript, Redis and
              MongoDB: model routing, response caching, rate limiting and
              automatic fallback.
            </p>
          </div>

          {/* Link columns */}
          <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3'>
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className='mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400'>
                  {column.title}
                </h3>
                <ul className='space-y-3'>
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        {...(link.external && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                        className='text-sm text-slate-500 transition-colors hover:text-slate-900'>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className='flex flex-col items-center justify-between gap-4 border-t border-slate-200 py-6 md:flex-row'>
          <p className='text-xs text-slate-400'>
            &copy; {COPYRIGHT_YEAR} LLM Gateway. Released under the MIT License.
          </p>
          <p className='text-xs text-slate-500'>
            Built by{" "}
            <Link
              href='https://github.com/Parvez089'
              target='_blank'
              rel='noopener noreferrer'
              className='font-medium text-slate-700 transition-colors hover:text-slate-900'>
              Mosharof Hossen Parvez
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
