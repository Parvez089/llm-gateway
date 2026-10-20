import type { Metadata } from 'next';
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google'; // Poppins যোগ করা হলো
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/component/providers/QueryProvider';
import {Footer} from '@/component/Shared/Footer'
import {Navbar} from '@/component/Shared/Navbar'
import { DevWarningModal } from '@/component/ui/DevWarningModal'; 
import { GridLines } from '@/component/landing/GridLines';
import './globals.css';

// Body Text Font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Heading Display Font
const poppins = Poppins({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

// Code/Terminal Font
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LLM Gateway — Route every prompt to the right model',
  description: 'A self-hosted LLM gateway with complexity-based routing, response caching, rate limiting, and circuit-breaker fallback.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}>
      <body className="relative min-h-screen font-sans antialiased">
        <QueryProvider>
          <TooltipProvider>
             <DevWarningModal/>
             <div className="relative z-10 flex min-h-screen flex-col ">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
             </div>
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}