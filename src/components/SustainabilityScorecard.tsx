'use client';

import React, { useState } from 'react';
import { SustainableDevelopmentIndex, StandardCompliance } from '@/lib/lca/types';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Globe2,
} from 'lucide-react';

interface Props {
  sdi: SustainableDevelopmentIndex;
  standards: StandardCompliance;
}

export default function SustainabilityScorecard({ sdi, standards }: Props) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'ISPO' | 'RSPO'>('ALL');
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'PLATINUM':
        return {
          label: 'PLATINUM',
          cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          desc: 'ESG Benchmark Leader - Melampaui standar industri',
        };
      case 'GOLD':
        return {
          label: 'GOLD',
          cls: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          desc: 'Full Ready Kepatuhan Sertifikasi ISPO & RSPO',
        };
      case 'SILVER':
        return {
          label: 'SILVER',
          cls: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
          desc: 'Kinerja Transisi Menuju Standar Keberlanjutan',
        };
      default:
        return {
          label: 'BRONZE',
          cls: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
          desc: 'Risiko Tinggi - Diperlukan Rencana Aksi Korektif',
        };
    }
  };

  const badge = getTierBadge(sdi.tier);

  const filteredCriteria = standards.criteria.filter((c) => {
    if (activeTab === 'ALL') return true;
    return c.standard === activeTab || c.code.includes(activeTab);
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* SDI Header & Composite Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-900/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Sustainable Development Index (SDI)
              </h3>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{sdi.tierTitle} • {badge.desc}</p>
          </div>
        </div>

        {/* Big SDI Score */}
        <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 px-5 py-3 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Composite SDI Score
            </span>
            <span className="text-3xl font-black font-mono text-emerald-400">
              {sdi.compositeScore}
              <span className="text-base font-normal text-slate-500">/100</span>
            </span>
          </div>

          <div className="border-l border-slate-800 pl-4 space-y-1 text-[11px]">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-semibold text-emerald-400">ISPO:</span>
              <span className="font-mono font-bold">{standards.ispoComplianceScorePercent}%</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-semibold text-blue-400">RSPO:</span>
              <span className="font-mono font-bold">{standards.rspoComplianceScorePercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Breakdown */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          4 Pilar Komponen Skor Keberlanjutan:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Pillar 1 */}
          <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">1. Iklim &amp; Jejak Karbon</span>
              <span className="font-mono font-bold text-emerald-400">{sdi.pillars.climateGhgScore}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${sdi.pillars.climateGhgScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Bobot Evaluasi: 30%</span>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">2. Ekonomi Sirkular</span>
              <span className="font-mono font-bold text-teal-400">{sdi.pillars.circularEconomyScore}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{ width: `${sdi.pillars.circularEconomyScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Bobot Evaluasi: 25%</span>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">3. Transisi Energi</span>
              <span className="font-mono font-bold text-amber-400">{sdi.pillars.energyTransitionScore}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${sdi.pillars.energyTransitionScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Bobot Evaluasi: 25%</span>
          </div>

          {/* Pillar 4 */}
          <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">4. Konservasi Lahan</span>
              <span className="font-mono font-bold text-indigo-400">{sdi.pillars.landStewardshipScore}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${sdi.pillars.landStewardshipScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Bobot Evaluasi: 20%</span>
          </div>
        </div>
      </div>

      {/* ISPO / RSPO Compliance Matrix Section */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Matriks Kepatuhan Standar Industri (ISPO &amp; RSPO)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Permentan No. 38/2020 (ISPO) &amp; RSPO Principles and Criteria (P&amp;C)
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua Kriteria
            </button>
            <button
              onClick={() => setActiveTab('ISPO')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'ISPO'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ISPO ({standards.ispoComplianceScorePercent}%)
            </button>
            <button
              onClick={() => setActiveTab('RSPO')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'RSPO'
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RSPO ({standards.rspoComplianceScorePercent}%)
            </button>
          </div>
        </div>

        {/* Criteria List */}
        <div className="space-y-2 text-xs">
          {filteredCriteria.map((c) => {
            const isExpanded = expandedCode === c.code;
            return (
              <div
                key={c.code}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 transition-all hover:border-slate-700"
              >
                <div
                  className="flex items-start justify-between gap-3 cursor-pointer"
                  onClick={() => setExpandedCode(isExpanded ? null : c.code)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {c.code}
                      </span>
                      <span className="font-bold text-slate-200 text-xs">
                        {c.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{c.requirement}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        c.status === 'COMPLIANT'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : c.status === 'MINOR_GAP'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {c.status === 'COMPLIANT' && <CheckCircle2 className="w-3 h-3" />}
                      {c.status === 'MINOR_GAP' && <AlertTriangle className="w-3 h-3" />}
                      {c.status === 'NON_COMPLIANT' && <XCircle className="w-3 h-3" />}
                      <span>
                        {c.status === 'COMPLIANT'
                          ? 'Patuh (Compliant)'
                          : c.status === 'MINOR_GAP'
                          ? 'Minor Gap'
                          : 'Tidak Patuh'}
                      </span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded-lg">
                      <div>
                        <span className="text-slate-500 block">Kondisi Terukur Saat Ini:</span>
                        <span className="font-mono font-semibold text-white">{c.measuredValue}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Tolok Ukur Target Standar:</span>
                        <span className="font-mono font-semibold text-emerald-400">{c.targetBenchmark}</span>
                      </div>
                    </div>
                    <div className="bg-emerald-950/20 border border-emerald-800/30 p-2.5 rounded-lg text-emerald-200">
                      <strong>Rekomendasi Tindakan Korektif (Corrective Action):</strong>
                      <p className="mt-0.5 text-slate-300">{c.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
