'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Factory, BarChart3, GitCompare, BookOpen, ShieldCheck, Recycle, HelpCircle } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: BarChart3 },
    { href: '/calculator', label: 'Kalkulator LCA', icon: Factory },
    { href: '/sustainability', label: 'Sirkularitas & EROI', icon: Recycle },
    { href: '/scenarios', label: 'Komparasi Skenario', icon: GitCompare },
    { href: '/report', label: 'Laporan Akhir', icon: ShieldCheck },
    { href: '/methodology', label: 'Metodologi', icon: BookOpen },
    { href: '/guide', label: 'Panduan', icon: HelpCircle },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Palm-LCA Portal
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Cradle-to-Gate
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Kajian Jejak Karbon & Dampak Lingkungan Kelapa Sawit
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Certification Badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO 14044 • IPCC AR5 • RSPO</span>
          </div>
        </div>
      </div>
    </header>
  );
}
