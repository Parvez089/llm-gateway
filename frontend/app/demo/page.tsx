import Link from "next/link";

export default function DemoPage() {
  return (
    <main className="container mx-auto flex min-h-[60vh] max-w-screen-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Playground coming soon
      </h1>
      <p className="mt-4 text-slate-600">
        The gateway backend is under active development. The interactive
        playground will go live once routing, caching and fallback are done.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-md border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to home
        </Link>
        <Link
          href="https://github.com/Parvez089/llm-gateway"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Follow progress on GitHub
        </Link>
      </div>
    </main>
  );
}