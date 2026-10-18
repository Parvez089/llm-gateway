// frontend/app/page.tsx
import { Hero } from "@/component/landing/Hero";
import { Stats } from "@/component/landing/Stats";
import { Features } from "@/component/landing/Features";
import { HowItWorks } from "@/component/landing/HowItWorks";
import { CodeShowcase } from "@/component/landing/CodeShowCase";
import { ArchitectureFlow } from "@/component/landing/ArchitectureFlow";
import { QuickStart } from "@/component/landing/QuickStart";

export default function Home() {
  return (
     <main className="relative min-h-screen overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 bg-transparent">
      <div className="relative z-10">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <ArchitectureFlow />
        <QuickStart />
      </div>
    </main>
  );
}