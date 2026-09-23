import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Palm Oil LCA Portal | Kajian Jejak Karbon Kelapa Sawit Cradle-to-Gate',
  description:
    'Aplikasi web interaktif Life Cycle Assessment (LCA) rantai pasok kelapa sawit mulai dari perkebunan (cradle) hingga Crude Palm Oil di pabrik (gate) berstandar ISO 14040/14044, IPCC, dan RSPO PalmGHG.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white`}>
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <footer className="border-t border-slate-800/80 bg-slate-950/80 text-xs text-slate-500 py-6 mt-12 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Palm Oil LCA Portal</span>
              <span>•</span>
              <span>Standar Ilmiah: ISO 14040/14044, IPCC 2019 Refinement, RSPO PalmGHG v4, ISPO</span>
            </div>
            <div>
              &copy; {new Date().getFullYear()} Life Cycle Assessment Agroindustri Kelapa Sawit Indonesia
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
