'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Factory,
  Sparkles,
  Layers,
  Leaf,
  GitCompare,
  TrendingDown,
  Info,
  ShieldCheck,
} from 'lucide-react';
import SystemBoundaryDiagram from '@/components/SystemBoundaryDiagram';
import EnvironmentalImpacts from '@/components/EnvironmentalImpacts';
import HotspotChart from '@/components/HotspotChart';
import ReportExporter from '@/components/ReportExporter';
import { INITIAL_SCENARIOS } from '@/lib/db';
import { LcaSimulationScenario } from '@/lib/lca/types';

export default function DashboardPage() {
  const [scenarios, setScenarios] = useState<LcaSimulationScenario[]>(INITIAL_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(INITIAL_SCENARIOS[0].id);

  // Fetch scenarios from API (with fallback)
  useEffect(() => {
    async function loadScenarios() {
      try {
        const res = await fetch('/api/scenarios');
        if (res.ok) {
          const data = await res.json();
          if (data.scenarios && data.scenarios.length > 0) {
            setScenarios(data.scenarios);
          }
        }
      } catch (err) {
        console.warn('Using local pre-calculated scenarios fallback:', err);
      }
    }
    loadScenarios();
  }, []);

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const result = activeScenario.result;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kajian LCA Standar ISO 14040/14044 & RSPO PalmGHG v4</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Kalkulator Life Cycle Assessment (LCA) Rantai Pasok Kelapa Sawit
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Evaluasi jejak karbon (*carbon footprint*), potensi eutrofikasi, dan pengasaman mulai dari perkebunan (*cradle*) hingga produk Crude Palm Oil di pabrik (*gate*). Identifikasi hotspot emisi dan simulasi skenario mitigasi penangkapan gas metana POME.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-900/30 hover:scale-[1.02]"
            >
              <Factory className="w-4 h-4" />
              <span>Buka Kalkulator Parameter</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-teal-950/50 hover:scale-[1.02] border border-teal-400/30"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Buat Laporan Akhir Kajian LCA</span>
            </Link>

            <Link
              href="/scenarios"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all hover:scale-[1.02]"
            >
              <GitCompare className="w-4 h-4 text-emerald-400" />
              <span>Bandingkan Skenario</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scenario Quick Selector Bar & Actions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 block font-medium mb-1">
            Pilih Profil Skenario Siap Pakai:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {scenarios.map((scen) => (
              <button
                key={scen.id}
                onClick={() => setSelectedScenarioId(scen.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  scen.id === selectedScenarioId
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {scen.name}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-2 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            <ReportExporter
              result={result}
              farm={activeScenario.farmInputs}
              mill={activeScenario.millInputs}
              scenarioName={activeScenario.name}
            />
          </div>
        )}
      </div>

      {/* System Boundary Interactive Flow */}
      <SystemBoundaryDiagram
        result={result}
        pomeMethod={activeScenario.millInputs.treatmentMethod}
      />

      {/* KPI & Environmental Impacts */}
      {result && <EnvironmentalImpacts result={result} />}

      {/* Hotspot Breakdown & Visualizations */}
      {result && <HotspotChart result={result} />}

      {/* Methodology & Parameter Summary Callout */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              Transparansi Metodologi & Dokumen Referensi
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Seluruh algoritma perhitungan mengacu pada rumus resmi IPCC 2006/2019 (Emisi N₂O langsung, tak langsung, dan hidrolisis urea), pedoman pengolahan limbah POME RSPO PalmGHG v4, dan aturan alokasi ISO 14044.
            </p>
          </div>
        </div>

        <Link
          href="/methodology"
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 text-emerald-300 border border-slate-700 text-xs font-semibold hover:bg-slate-700 transition-all flex items-center gap-1.5"
        >
          <span>Lihat Penjelasan Rumus & Faktor Emisi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
