'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Recycle,
  Zap,
  Award,
  ArrowLeft,
  Sliders,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { INITIAL_SCENARIOS } from '@/lib/db';
import { calculatePalmOilLca } from '@/lib/lca/engine';
import CircularEconomyCard from '@/components/CircularEconomyCard';
import EnergyBalanceCard from '@/components/EnergyBalanceCard';
import SustainabilityScorecard from '@/components/SustainabilityScorecard';
import { PomeTreatmentMethod } from '@/lib/lca/types';

export default function SustainabilityDashboardPage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(INITIAL_SCENARIOS[0].id);

  // Current active scenario preset
  const baseScenario = INITIAL_SCENARIOS.find((s) => s.id === selectedScenarioId) || INITIAL_SCENARIOS[0];

  // Interactive local overrides for what-if sensitivity analysis
  const [efbMulching, setEfbMulching] = useState<number>(baseScenario.farmInputs.efbMulchingTonsPerHa);
  const [treatmentMethod, setTreatmentMethod] = useState<PomeTreatmentMethod>(baseScenario.millInputs.treatmentMethod);
  const [methaneCaptureEff, setMethaneCaptureEff] = useState<number>(baseScenario.millInputs.methaneCaptureEfficiency * 100);
  const [powerExportPct, setPowerExportPct] = useState<number>(baseScenario.millInputs.biogasPowerExportPercentage);

  // Handle scenario switch
  const handleScenarioChange = (scenId: string) => {
    setSelectedScenarioId(scenId);
    const scen = INITIAL_SCENARIOS.find((s) => s.id === scenId) || INITIAL_SCENARIOS[0];
    setEfbMulching(scen.farmInputs.efbMulchingTonsPerHa);
    setTreatmentMethod(scen.millInputs.treatmentMethod);
    setMethaneCaptureEff(scen.millInputs.methaneCaptureEfficiency * 100);
    setPowerExportPct(scen.millInputs.biogasPowerExportPercentage);
  };

  // Dynamic simulation run
  const activeFarm = {
    ...baseScenario.farmInputs,
    efbMulchingTonsPerHa: efbMulching,
  };
  const activeMill = {
    ...baseScenario.millInputs,
    treatmentMethod,
    methaneCaptureEfficiency: methaneCaptureEff / 100,
    biogasPowerExportPercentage: powerExportPct,
  };

  const lcaResult = calculatePalmOilLca(activeFarm, activeMill);
  const s = lcaResult.sustainability;

  if (!s) {
    return <div className="p-8 text-center text-slate-400">Memuat metrik keberlanjutan...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Top Banner Navigation & Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Kembali ke Dashboard Utama"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">
                Dashboard Nilai Tambah &amp; Metrik Keberlanjutan Sawit
              </h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                Sirkularitas • EROI • ISPO/RSPO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Integrasi analisis ekonomi sirkular (CEI), neraca energi EROI, dan skoring komposit Sustainable Development Index (SDI)
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Pilih Skenario:</span>
          <select
            value={selectedScenarioId}
            onChange={(e) => handleScenarioChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm"
          >
            {INITIAL_SCENARIOS.map((scen) => (
              <option key={scen.id} value={scen.id}>
                {scen.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Overview Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: CEI */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Recycle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Circular Economy Index
            </span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {s.circularity.ceiPercentage}%
            </span>
            <span className="text-[10px] text-slate-500 block truncate">
              {s.circularity.tierLabel}
            </span>
          </div>
        </div>

        {/* Card 2: EROI */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              EROI Bioenergi Total
            </span>
            <span className="text-2xl font-black font-mono text-amber-400">
              {s.energy.eroiTotal} : 1
            </span>
            <span className="text-[10px] text-slate-500 block">
              Output / Input Energi Fosil
            </span>
          </div>
        </div>

        {/* Card 3: Mill Energy Autonomy */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Swasembada Listrik/Uap
            </span>
            <span className="text-2xl font-black font-mono text-teal-400">
              {s.energy.energyAutonomyPercent}%
            </span>
            <span className="text-[10px] text-slate-500 block truncate">
              {s.energy.autonomyStatus === 'FULLY_AUTONOMOUS_NET_EXPORTER' ? 'Surplus Ekspor Grid' : 'Mandiri Energi'}
            </span>
          </div>
        </div>

        {/* Card 4: Composite SDI Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Sustainable Index (SDI)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-indigo-300">
                {s.sdi.compositeScore}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                ({s.sdi.tier})
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              ISPO: {s.standards.ispoComplianceScorePercent}% • RSPO: {s.standards.rspoComplianceScorePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Sensitivity Playground Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 text-xs shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <span className="font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Simulasi Interaktif &amp; Optimasi Parameter Sirkularitas Pabrik:
          </span>
          <button
            onClick={() => handleScenarioChange(selectedScenarioId)}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Preset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mulsa TKKS Slider */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div className="flex justify-between">
              <label className="text-slate-400 font-medium">Aplikasi Mulsa TKKS:</label>
              <span className="font-mono font-bold text-emerald-400">{efbMulching} Ton/Ha</span>
            </div>
            <input
              type="range"
              min={0}
              max={35}
              step={5}
              value={efbMulching}
              onChange={(e) => setEfbMulching(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Mengurangi kebutuhan pupuk K kimia</span>
          </div>

          {/* Treatment Method */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <label className="text-slate-400 font-medium block">Pengolahan POME:</label>
            <select
              value={treatmentMethod}
              onChange={(e) => setTreatmentMethod(e.target.value as PomeTreatmentMethod)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-semibold text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="OPEN_ANAEROBIC_LAGOON">Kolam Terbuka</option>
              <option value="METHANE_CAPTURE_FLARING">Methane Flare</option>
              <option value="BIOGAS_TO_POWER">Biogas to Power (PLTBg)</option>
            </select>
            <span className="text-[10px] text-slate-500 block">Metode mitigasi gas metana limbah cair</span>
          </div>

          {/* Methane Capture Efficiency */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div className="flex justify-between">
              <label className="text-slate-400 font-medium">Efisiensi Tangkap Biogas:</label>
              <span className="font-mono font-bold text-teal-400">{methaneCaptureEff}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={98}
              step={2}
              disabled={treatmentMethod === 'OPEN_ANAEROBIC_LAGOON'}
              value={methaneCaptureEff}
              onChange={(e) => setMethaneCaptureEff(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer disabled:opacity-30"
            />
            <span className="text-[10px] text-slate-500 block">Kualitas penutup membran HDPE</span>
          </div>

          {/* Biogas Power Export Pct */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div className="flex justify-between">
              <label className="text-slate-400 font-medium">Ekspor Listrik ke Grid:</label>
              <span className="font-mono font-bold text-amber-400">{powerExportPct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              disabled={treatmentMethod !== 'BIOGAS_TO_POWER'}
              value={powerExportPct}
              onChange={(e) => setPowerExportPct(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer disabled:opacity-30"
            />
            <span className="text-[10px] text-slate-500 block">Persentase daya PLTBg yang dijual ke PLN</span>
          </div>
        </div>
      </div>

      {/* 3 Core Advanced Cards */}
      <div className="space-y-6">
        {/* Module 1: Circular Economy */}
        <CircularEconomyCard data={s.circularity} />

        {/* Module 2: Energy Balance & EROI */}
        <EnergyBalanceCard data={s.energy} />

        {/* Module 3: SDI & Standards Compliance */}
        <SustainabilityScorecard sdi={s.sdi} standards={s.standards} />
      </div>
    </div>
  );
}
