'use client';

import React from 'react';
import { Sprout, Truck, Factory, Flame, Zap, Droplet, ArrowRight } from 'lucide-react';
import { LcaCalculationResult } from '@/lib/lca/types';

interface Props {
  result?: LcaCalculationResult;
  pomeMethod?: string;
}

export default function SystemBoundaryDiagram({ result, pomeMethod = 'OPEN_ANAEROBIC_LAGOON' }: Props) {
  const isBiogas = pomeMethod === 'BIOGAS_TO_POWER';
  const isFlare = pomeMethod === 'METHANE_CAPTURE_FLARING';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Diagram Batasan Sistem (System Boundary): Cradle-to-Gate
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Alur siklus hidup dari Perkebunan Kelapa Sawit (Cradle) hingga CPO & PK di PKS (Gate)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          <span>Satuan Fungsional:</span>
          <span className="text-emerald-400 font-mono font-bold">1 Ton CPO</span>
        </div>
      </div>

      {/* Process Flow Stages */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {/* Stage 1: Upstream / Farm */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                1. Upstream (On-Farm)
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Sprout className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-sm font-semibold text-white mb-2">Perkebunan Sawit</h4>
            <ul className="text-xs text-slate-300 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Pupuk Kimia (Urea, ZA, NPK)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Emisi N2O (Langsung & Volatilisasi)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Bahan Bakar Traktor & Mesin
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Oksidasi Gambut & Herbisida
              </li>
            </ul>
          </div>
          {result && (
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs">
              <span className="text-slate-400">Emisi Hulu:</span>
              <span className="font-mono font-bold text-amber-400">
                {result.upstreamEmissionsKgCo2} <span className="text-[10px] text-slate-400">kg CO2e</span>
              </span>
            </div>
          )}
        </div>

        {/* Stage 2: Transport */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/50 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                2. Transportasi
              </span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-sm font-semibold text-white mb-2">Pengangkutan TBS</h4>
            <ul className="text-xs text-slate-300 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Truk Angkutan TBS (8-10 Ton)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Konsumsi Solar Transport
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Jarak Tempuh Kebun ke PKS
              </li>
            </ul>
          </div>
          {result && (
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs">
              <span className="text-slate-400">Emisi Angkut:</span>
              <span className="font-mono font-bold text-amber-400">
                {result.transportEmissionsKgCo2} <span className="text-[10px] text-slate-400">kg CO2e</span>
              </span>
            </div>
          )}
        </div>

        {/* Stage 3: Mill / PKS */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-blue-500/50 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                3. Pabrik (Core)
              </span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <Factory className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-sm font-semibold text-white mb-2">Proses Pengolahan PKS</h4>
            <ul className="text-xs text-slate-300 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Sterilisasi & Ekstraksi CPO/Nut
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Boiler Biomassa (Cangkang/Serat)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Auxiliary Diesel Cold-Startup
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Alokasi Bersama (CPO & Kernel)
              </li>
            </ul>
          </div>
          {result && (
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs">
              <span className="text-slate-400">Emisi PKS:</span>
              <span className="font-mono font-bold text-blue-400">
                {result.millEmissionsKgCo2} <span className="text-[10px] text-slate-400">kg CO2e</span>
              </span>
            </div>
          )}
        </div>

        {/* Stage 4: POME & Byproducts */}
        <div className={`border rounded-xl p-4 flex flex-col justify-between transition-all group ${
          isBiogas
            ? 'bg-emerald-950/30 border-emerald-500/50 hover:border-emerald-400'
            : isFlare
            ? 'bg-amber-950/30 border-amber-500/50 hover:border-amber-400'
            : 'bg-rose-950/30 border-rose-500/50 hover:border-rose-400'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${
                isBiogas
                  ? 'text-emerald-300 bg-emerald-900/50 border-emerald-700/60'
                  : isFlare
                  ? 'text-amber-300 bg-amber-900/50 border-amber-700/60'
                  : 'text-rose-300 bg-rose-900/50 border-rose-700/60'
              }`}>
                4. Limbah POME
              </span>
              <div className={`p-2 rounded-lg ${
                isBiogas ? 'bg-emerald-500/20 text-emerald-400' : isFlare ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {isBiogas ? <Zap className="w-5 h-5" /> : isFlare ? <Flame className="w-5 h-5" /> : <Droplet className="w-5 h-5" />}
              </div>
            </div>
            <h4 className="text-sm font-semibold text-white mb-2">
              {isBiogas ? 'Biogas PLTBg (Power)' : isFlare ? 'Biogas Flaring' : 'Kolam Anaerobik'}
            </h4>
            <p className="text-xs text-slate-300">
              {isBiogas
                ? 'CH4 ditangkap & dibakar di gas engine untuk ekspor listrik hijau (Kredit Karbon).'
                : isFlare
                ? 'CH4 ditangkap geomembrane dan dibakar flare (mengeliminasi 90% emisi CH4).'
                : 'Limbah cair anaerobik terbuka menghasilkan emisi metana (CH4) tinggi ke udara.'}
            </p>
          </div>
          {result && (
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs">
              <span className="text-slate-400">Emisi POME:</span>
              <span className={`font-mono font-bold ${isBiogas ? 'text-emerald-400' : isFlare ? 'text-amber-400' : 'text-rose-400'}`}>
                {result.pomeEmissionsKgCo2} <span className="text-[10px] text-slate-400">kg CO2e</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Flow Indicator Bottom Banner */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Produk Akhir (Gate):</span>
          <span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
            Crude Palm Oil (CPO)
          </span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
            Palm Kernel (PK)
          </span>
        </div>
        {result && (
          <div className="flex items-center gap-3">
            <span>Faktor Alokasi CPO ({result.allocationMethod}):</span>
            <span className="font-mono font-bold text-white">
              {(result.cpoAllocationFactor * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
