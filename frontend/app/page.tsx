import { Navbar } from "@/component/landing/Navbar";
import { Hero } from "@/component/landing/Hero";





export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <Hero />
     
   
    </main>
  );
}