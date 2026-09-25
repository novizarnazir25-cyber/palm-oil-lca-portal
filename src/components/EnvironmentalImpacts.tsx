'use client';

import React, { useState } from 'react';
import { LcaCalculationResult, FarmInputs, MillInputs } from '@/lib/lca/types';
import {
  Activity,
  CloudRain,
  ShieldCheck,
  Sparkles,
  Waves,
  MapPin,
  Skull,
  HeartPulse,
  Trees,
  Fuel,
  ChevronRight,
  Layers,
  Scale,
} from 'lucide-react';
import FunctionalUnitSelector from '@/components/FunctionalUnitSelector';
import {
  FunctionalUnitKey,
  scaleResultToFunctionalUnit,
  FUNCTIONAL_UNITS,
} from '@/lib/lca/functionalUnits';

interface Props {
  result: LcaCalculationResult;
  farm?: FarmInputs;
  mill?: MillInputs;
  activeFu?: FunctionalUnitKey;
  onFuChange?: (fu: FunctionalUnitKey) => void;
}

export default function EnvironmentalImpacts({
  result,
  farm,
  mill,
  activeFu,
  onFuChange,
}: Props) {
  const [internalFu, setInternalFu] = useState<FunctionalUnitKey>('TON_CPO');
  const [levelView, setLevelView] = useState<'midpoint' | 'endpoint'>('midpoint');

  const currentFu = activeFu ?? internalFu;
  const handleFuChange = (key: FunctionalUnitKey) => {
    if (onFuChange) onFuChange(key);
    setInternalFu(key);
  };

  const oer = mill?.oer ?? 0.22;
  const yieldHa = farm?.ffbYieldPerHa ?? 22.0;
  const cpoAlloc = result.cpoAllocationFactor ?? 0.785;

  const scaled = scaleResultToFunctionalUnit(result, currentFu, oer, yieldHa, cpoAlloc);
  const fuInfo = scaled.fu;

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'A+':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          desc: 'Sangat Rendah Emisi (Biogas to Power + Praktik Hijau)',
        };
      case 'A':
        return {
          bg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          desc: 'Rendah Emisi (Methane Capture Flaring aktif)',
        };
      case 'B':
        return {
          bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          desc: 'Rata-rata Industri Sawit Berkelanjutan',
        };
      case 'C':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          desc: 'Standar Terbuka (Kolam Terbuka Konvensional)',
        };
      case 'D':
      default:
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          desc: 'Tinggi Emisi (Oksidasi Lahan Gambut / Tanpa Mitigasi)',
        };
    }
  };

  const badgeInfo = getRatingBadge(result.palmGhgrating);
  const mid = scaled.midpoint;
  const end = scaled.endpoint;

  return (
    <div className="space-y-4">
      {/* 1. Functional Unit Interactive Selector */}
      <FunctionalUnitSelector selectedKey={currentFu} onChange={handleFuChange} />

      {/* 2. Top Banner KPI (Dynamically scaled to selected Functional Unit) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Jejak Karbon Bersih ({scaled.fu.shortLabel})
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeInfo.bg}`}>
                Grade {result.palmGhgrating}
              </span>
              <span className="text-[10px] bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded border border-slate-700">
                {fuInfo.badge}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                {scaled.netGwp.toLocaleString('id-ID')}
              </span>
              <span className="text-base sm:text-lg text-emerald-400 font-semibold font-mono">
                {scaled.gwpUnit}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{badgeInfo.desc} • {fuInfo.standardReference}</span>
            </p>
          </div>

          {/* Reference Equivalents Across Alternative Functional Units */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-t lg:border-t-0 lg:border-l border-slate-700/60 pt-4 lg:pt-0 lg:pl-6 text-xs">
            <div className={`p-2.5 rounded-xl border ${currentFu === 'TON_CPO' ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-800/60 border-slate-700/50'}`}>
              <span className="text-[10px] text-slate-400 block mb-0.5">1 Ton CPO</span>
              <span className="text-sm font-mono font-bold text-white block">
                {result.totalGwpPerTonCpo.toLocaleString('id-ID')}
              </span>
              <span className="text-[9px] text-slate-400">kg CO₂e/t CPO</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${currentFu === 'KG_CPO' ? 'bg-sky-950/40 border-sky-500/50' : 'bg-slate-800/60 border-slate-700/50'}`}>
              <span className="text-[10px] text-slate-400 block mb-0.5">1 kg CPO</span>
              <span className="text-sm font-mono font-bold text-sky-400 block">
                {result.totalGwpPerKgCpo.toFixed(3)}
              </span>
              <span className="text-[9px] text-slate-400">kg CO₂e/kg</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${currentFu === 'TON_FFB' ? 'bg-teal-950/40 border-teal-500/50' : 'bg-slate-800/60 border-slate-700/50'}`}>
              <span className="text-[10px] text-slate-400 block mb-0.5">1 Ton TBS</span>
              <span className="text-sm font-mono font-bold text-teal-400 block">
                {result.totalGwpPerTonFfb.toFixed(1)}
              </span>
              <span className="text-[9px] text-slate-400">kg CO₂e/t TBS</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${currentFu === 'MJ_BIOENERGY' ? 'bg-amber-950/40 border-amber-500/50' : 'bg-slate-800/60 border-slate-700/50'}`}>
              <span className="text-[10px] text-slate-400 block mb-0.5">1 MJ Bioenergi</span>
              <span className="text-sm font-mono font-bold text-amber-400 block">
                {(result.totalGwpPerTonCpo / 37.0).toFixed(2)}
              </span>
              <span className="text-[9px] text-slate-400">g CO₂e/MJ (RED II)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Switcher Bar: Midpoint vs Endpoint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Kerangka Penilaian Dampak (ReCiPe 2016 per {fuInfo.shortLabel}):
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setLevelView('midpoint')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              levelView === 'midpoint'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Tingkat Midpoint (5 Kategori)
          </button>
          <button
            onClick={() => setLevelView('endpoint')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              levelView === 'endpoint'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Tingkat Endpoint (Damage AoP)
          </button>
        </div>
      </div>

      {/* VIEW 1: MIDPOINT IMPACT CATEGORIES (5 Kategori) */}
      {levelView === 'midpoint' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Global Warming */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Global Warming Potential (GWP₁₀₀)</span>
              <span className="text-[10px] bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/50">
                ReCiPe 2016 H
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-white">
                {mid.gwp.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-slate-400">{mid.gwpUnit}</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>On-Farm: <strong className="text-slate-200">{mid.breakdown.onFarm.gwp}</strong></span>
              <span>PKS: <strong className="text-slate-200">{mid.breakdown.pks.gwp}</strong></span>
            </div>
          </div>

          {/* 2. Acidification */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Acidification Potential (AP)</span>
              <div className="p-1 rounded bg-indigo-500/10 text-indigo-400">
                <CloudRain className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-indigo-300">
                {mid.ap}
              </span>
              <span className="text-xs text-slate-400">{mid.apUnit}</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Volatilisasi NH₃: <strong className="text-indigo-200">{mid.breakdown.onFarm.ap}</strong></span>
              <span>PKS Solar: <strong className="text-slate-300">{mid.breakdown.pks.ap}</strong></span>
            </div>
          </div>

          {/* 3. Eutrophication */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Freshwater Eutrophication (EP)</span>
              <div className="p-1 rounded bg-teal-500/10 text-teal-400">
                <Waves className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-teal-300">
                {mid.ep}
              </span>
              <span className="text-xs text-slate-400">{mid.epUnit}</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Runoff N &amp; P: <strong className="text-teal-200">{mid.breakdown.onFarm.ep}</strong></span>
              <span>Limbah PKS: <strong className="text-slate-300">{mid.breakdown.pks.ep}</strong></span>
            </div>
          </div>

          {/* 4. Land Use */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Land Use (Okupasi Lahan)</span>
              <div className="p-1 rounded bg-amber-500/10 text-amber-400">
                <MapPin className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-amber-300">
                {mid.landUse.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-slate-400">{mid.landUseUnit}</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Luas Kebun: <strong className="text-amber-200">{mid.breakdown.onFarm.landUse}</strong></span>
              <span>PKS Area: <strong className="text-slate-300">{mid.breakdown.pks.landUse}</strong></span>
            </div>
          </div>

          {/* 5. Toxicity */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors sm:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">
                Human Toxicity &amp; Terrestrial/Freshwater Ecotoxicity
              </span>
              <div className="p-1 rounded bg-rose-500/10 text-rose-400">
                <Skull className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-rose-300">
                {mid.toxicity.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-slate-400">{mid.toxicityUnit}</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap justify-between gap-2 font-mono">
              <span>Herbisida &amp; Pupuk P: <strong className="text-rose-200">{mid.breakdown.onFarm.toxicity}</strong></span>
              <span>Gas Buang Solar PKS: <strong className="text-slate-300">{mid.breakdown.pks.toxicity}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ENDPOINT DAMAGE ASSESSMENT (Area of Protection - AoP) */}
      {levelView === 'endpoint' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* AoP 1: Human Health */}
          <div className="bg-slate-900/80 border border-rose-500/30 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  Human Health (Kesehatan)
                </h4>
              </div>
              <span className="text-[10px] bg-rose-950/60 text-rose-300 px-2 py-0.5 rounded border border-rose-800 font-mono">
                AoP 1
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-white">
                  {end.humanHealthMilliDaly}
                </span>
                <span className="text-xs text-slate-400">mDALY / {fuInfo.unit}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                ({end.humanHealthDaly} DALY)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mengukur hilangnya tahun hidup sehat akibat penyakit terkait iklim, partikulat sekunder sulfat, dan toksisitas bahan aktif kimia.
            </p>
          </div>

          {/* AoP 2: Ecosystem Quality */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trees className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Ecosystem Quality
                </h4>
              </div>
              <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                AoP 2
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-white">
                  {end.ecosystemQualityPdf.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-slate-400">PDF·m²·thn / {fuInfo.unit}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                (~{end.speciesYr} species·thn)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Fraksi kepunahan keanekaragaman hayati darat dan perairan tawar akibat okupasi lahan perkebunan monokultur dan perubahan iklim.
            </p>
          </div>

          {/* AoP 3: Resource Scarcity */}
          <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Resources Scarcity
                </h4>
              </div>
              <span className="text-[10px] bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-mono">
                AoP 3
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-white">
                  {end.resourcesSurplusMj.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-slate-400">MJ Surplus / {fuInfo.unit}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Energi fosil terkonsumsi bersih
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Biaya energi ekstraksi masa depan untuk menggantikan sumber daya fosil mentah yang dihabiskan untuk solar armada dan sintesis amonia Haber-Bosch.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
