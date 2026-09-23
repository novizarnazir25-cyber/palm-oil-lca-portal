'use client';

import React from 'react';
import { EnergyBalanceMetrics } from '@/lib/lca/types';
import {
  Zap,
  Fuel,
  Gauge,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
  Flame,
  BatteryCharging,
} from 'lucide-react';

interface Props {
  data: EnergyBalanceMetrics;
}

export default function EnergyBalanceCard({ data }: Props) {
  const {
    fossilInputs,
    renewableOutputs,
    eroiProcess,
    eroiTotal,
    netEnergyRatio,
    netEnergyBalanceMjPerTonCpo,
    energyAutonomyPercent,
    autonomyStatus,
  } = data;

  const getAutonomyBadge = (status: string) => {
    switch (status) {
      case 'FULLY_AUTONOMOUS_NET_EXPORTER':
        return {
          label: 'Swasembada Penuh (Net Exporter)',
          cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'SELF_SUFFICIENT':
        return {
          label: 'Mandiri Energi (Self-Sufficient)',
          cls: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
        };
      default:
        return {
          label: 'Ketergantungan Fosil / Grid',
          cls: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
    }
  };

  const badge = getAutonomyBadge(autonomyStatus);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header & EROI KPI Highlights */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-amber-900/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Neraca Energi &amp; EROI (Energy Return on Investment)
              </h3>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluasi efisiensi energi tak terbarukan (fosil) vs energi terbarukan mandiri biomassa &amp; biogas
            </p>
          </div>
        </div>

        {/* EROI Scorecards */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/70 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              EROI Total (Bioenergi)
            </span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {eroiTotal} : 1
            </span>
            <span className="text-[10px] text-slate-500 block">Output / Input Fosil</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Kemandirian Pabrik
            </span>
            <span className="text-xl font-black font-mono text-amber-400">
              {energyAutonomyPercent}%
            </span>
            <span className="text-[10px] text-slate-500 block">Kebutuhan Uap &amp; Listrik</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid: Input Fosil vs Output Terbarukan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Fossil Inputs Breakdown */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-rose-400" />
              Input Energi Tak Terbarukan (Fosil)
            </span>
            <span className="text-xs font-mono font-bold text-rose-400">
              {fossilInputs.totalFossilInputMjPerTonCpo.toLocaleString('id-ID')} MJ / t CPO
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
              <span>Pupuk Kimia Sintetis (Embodied N, P, K)</span>
              <span className="font-mono font-semibold text-slate-200">
                {fossilInputs.fertilizersEmbodiedMjPerTonCpo.toLocaleString('id-ID')} MJ
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
              <span>Pestisida &amp; Herbisida Bahan Aktif</span>
              <span className="font-mono font-semibold text-slate-200">
                {fossilInputs.pesticidesEmbodiedMjPerTonCpo} MJ
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
              <span>Bahan Bakar Solar Traktor Kebun</span>
              <span className="font-mono font-semibold text-slate-200">
                {fossilInputs.tractorDieselMjPerTonCpo} MJ
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
              <span>Logistik Transportasi Truk TBS</span>
              <span className="font-mono font-semibold text-slate-200">
                {fossilInputs.transportTruckDieselMjPerTonCpo} MJ
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
              <span>Solar Auxiliary Start-up Boiler PKS</span>
              <span className="font-mono font-semibold text-slate-200">
                {fossilInputs.millStartupDieselMjPerTonCpo} MJ
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 pt-1">
            *Setara konsumsi {fossilInputs.totalFossilInputMjPerTonFfb} MJ energi fosil per ton TBS yang dipanen.
          </p>
        </div>

        {/* Renewable Energy Outputs Breakdown */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              Energi Terbarukan Dihasilkan (Renewable)
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {renewableOutputs.totalRenewableGeneratedMjPerTonCpo.toLocaleString('id-ID')} MJ / t CPO
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
              <span>Kogenerasi Uap &amp; Listrik Boiler (Serat + Cangkang)</span>
              <span className="font-mono font-bold text-emerald-300">
                {renewableOutputs.biomassBoilerSteamPowerMjPerTonCpo.toLocaleString('id-ID')} MJ
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
              <span>Pembangkit Listrik Tenaga Biogas POME (PLTBg)</span>
              <span className="font-mono font-bold text-teal-300">
                {renewableOutputs.biogasElectricityMjPerTonCpo > 0
                  ? `${renewableOutputs.biogasElectricityMjPerTonCpo.toLocaleString('id-ID')} MJ`
                  : '0 MJ (Tanpa Pembangkit)'}
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
              <span>Potensi Energi Kimia CPO (Biofuel Feedstock)</span>
              <span className="font-mono font-semibold text-slate-300">
                {renewableOutputs.cpoChemicalEnergyMjPerTonCpo.toLocaleString('id-ID')} MJ
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
              <span>Potensi Energi Kimia Palm Kernel (PK)</span>
              <span className="font-mono font-semibold text-slate-300">
                {renewableOutputs.pkChemicalEnergyMjPerTonCpo.toLocaleString('id-ID')} MJ
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 flex justify-between items-center font-bold text-xs">
              <span className="text-emerald-300">Net Energy Balance (Surplus Bersih)</span>
              <span className="text-emerald-400 font-mono">
                +{netEnergyBalanceMjPerTonCpo.toLocaleString('id-ID')} MJ / t CPO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark comparison note */}
      <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <span>
            <strong>Benchmark EROI Bioenergi Global:</strong> Minyak Sawit (EROI {eroiTotal}:1) unggul jauh dibandingkan Bioetanol Jagung AS (1.3:1) dan Biodiesel Kedelai (2.5:1).
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 font-bold hidden sm:inline">
          NER = {netEnergyRatio}
        </span>
      </div>
    </div>
  );
}
