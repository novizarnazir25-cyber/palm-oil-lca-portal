'use client';

import React from 'react';
import { CircularEconomyMetrics } from '@/lib/lca/types';
import {
  Recycle,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface Props {
  data: CircularEconomyMetrics;
}

export default function CircularEconomyCard({ data }: Props) {
  const { solidWaste, liquidWaste, ceiPercentage, circularityTier, tierLabel, tierDescription } = data;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'REGENERATIVE_CIRCULAR':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ADVANCED_CIRCULAR':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'TRANSITIONAL':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header & CEI Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
            <Recycle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Indeks Ekonomi Sirkular (CEI)
              </h3>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getTierColor(circularityTier)}`}>
                {tierLabel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{tierDescription}</p>
          </div>
        </div>

        {/* Big CEI Percentage Gauge */}
        <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2.5 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Circular Economy Index
            </span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {ceiPercentage}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
            <div
              className="absolute inset-0 rounded-full border-4 border-emerald-500 transition-all duration-700"
              style={{
                clipPath: `polygon(50% 50%, -50% -50%, ${ceiPercentage}% 0%, 100% 100%, 0% 100%)`,
              }}
            />
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Grid: Solid vs Liquid Waste Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Solid Waste Valorization */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Limbah Padat Biomassa (Solid Waste)
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {solidWaste.solidWasteUtilizationRatePercent}% Termanfaatkan
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* TKKS */}
            <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800/50">
              <div className="flex justify-between font-medium">
                <span className="text-slate-200">Tandan Kosong Kelapa Sawit (TKKS)</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {solidWaste.efb.utilizationRatePercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${solidWaste.efb.utilizationRatePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                <span>Dihasilkan: {solidWaste.efb.generatedKgPerTonCpo} kg/t CPO</span>
                <span>Dimanfaatkan: {solidWaste.efb.utilizedKgPerTonCpo} kg/t CPO</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 flex flex-wrap gap-1">
                {solidWaste.efb.pathways.map((p, i) => (
                  <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Fiber */}
            <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800/50">
              <div className="flex justify-between font-medium">
                <span className="text-slate-200">Serat Mesokarp (Fiber)</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {solidWaste.fiber.utilizationRatePercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${solidWaste.fiber.utilizationRatePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                <span>Dihasilkan: {solidWaste.fiber.generatedKgPerTonCpo} kg/t CPO</span>
                <span className="text-emerald-400">100% Kogenerasi Uap Boiler</span>
              </div>
            </div>

            {/* Shell */}
            <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800/50">
              <div className="flex justify-between font-medium">
                <span className="text-slate-200">Cangkang Sawit (Shell)</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {solidWaste.shell.utilizationRatePercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${solidWaste.shell.utilizationRatePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                <span>Dihasilkan: {solidWaste.shell.generatedKgPerTonCpo} kg/t CPO</span>
                <span>Boiler (70%) + Ekspor Biofuel (28%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Liquid Waste Valorization */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" />
              Limbah Cair POME (Liquid Waste)
            </span>
            <span className="text-xs font-mono font-bold text-teal-400">
              {liquidWaste.liquidWasteUtilizationRatePercent}% Efisiensi
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* POME Volume & COD */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Volume Debit POME</span>
                <span className="text-base font-bold font-mono text-white">
                  {liquidWaste.pomeVolumeM3PerTonCpo} m³
                </span>
                <span className="text-[10px] text-slate-500 block">per ton CPO</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Beban Organik COD</span>
                <span className="text-base font-bold font-mono text-white">
                  {liquidWaste.codTotalKgPerTonCpo} kg
                </span>
                <span className="text-[10px] text-slate-500 block">COD per ton CPO</span>
              </div>
            </div>

            {/* Methane Potential & Capture */}
            <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800/50">
              <div className="flex justify-between font-medium">
                <span className="text-slate-200 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Potensi Gas Metana (CH₄)
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  {liquidWaste.methanePotentialM3PerTonCpo} m³ CH₄ / t CPO
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-800">
                <span className="text-slate-400">Metana Tertangkap (Capture):</span>
                <span className="font-mono font-bold text-emerald-400">
                  {liquidWaste.methaneCapturedM3PerTonCpo > 0
                    ? `${liquidWaste.methaneCapturedM3PerTonCpo} m³ (${Math.round((liquidWaste.methaneCapturedM3PerTonCpo / liquidWaste.methanePotentialM3PerTonCpo) * 100)}%)`
                    : '0 m³ (Lepas ke Atmosfer)'}
                </span>
              </div>
            </div>

            {/* Pathways list */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Jalur Pemanfaatan &amp; Mitigasi Efluen:
              </span>
              <div className="space-y-1">
                {liquidWaste.pathways.map((path, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-[11px] text-slate-300 bg-slate-900/70 px-2.5 py-1.5 rounded-lg border border-slate-800"
                  >
                    <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{path}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
