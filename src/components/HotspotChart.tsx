'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { LcaCalculationResult } from '@/lib/lca/types';
import { Flame, Lightbulb, PieChart as PieIcon, BarChart2, SplitSquareVertical } from 'lucide-react';

interface Props {
  result: LcaCalculationResult;
}

const STAGE_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

export default function HotspotChart({ result }: Props) {
  const [viewMode, setViewMode] = useState<'donut' | 'bar' | 'process'>('donut');

  // 1. Prepare data for Stages Pie Chart
  const pieData = result.stageSummary
    .filter((s) => s.grossEmissionsKgCo2 > 0)
    .map((s) => ({
      name: s.stage,
      value: s.grossEmissionsKgCo2,
      percent: s.percentageOfTotal,
    }));

  // 2. Prepare data for Detailed Sources Bar Chart
  const sourceData = [
    { name: 'Pupuk N (N2O)', emisi: result.sources.directN2O + result.sources.indirectN2O, category: 'Hulu' },
    { name: 'Urea CO2', emisi: result.sources.ureaHydrolysisCO2, category: 'Hulu' },
    { name: 'Manufaktur Pupuk', emisi: result.sources.fertilizerProduction, category: 'Hulu' },
    { name: 'Solar Traktor', emisi: result.sources.farmFuelMachinery, category: 'Hulu' },
    ...(result.sources.peatOxidation > 0
      ? [{ name: 'Oksidasi Gambut', emisi: result.sources.peatOxidation, category: 'Hulu' }]
      : []),
    { name: 'Transportasi TBS', emisi: result.sources.ffbTransport, category: 'Transport' },
    { name: 'Bahan Bakar PKS', emisi: result.sources.millStartupFuel, category: 'PKS' },
    { name: 'Metana POME', emisi: result.sources.pomeMethane, category: 'POME' },
  ].sort((a, b) => b.emisi - a.emisi);

  // 3. Process Contribution: On-Farm vs PKS across all 5 Midpoint categories
  const b = result.midpoint.breakdown;
  const calcPercent = (valA: number, valB: number) => {
    const total = valA + valB;
    return total > 0 ? Number(((valA / total) * 100).toFixed(1)) : 0;
  };

  const processData = [
    {
      kategori: 'GWP (Iklim)',
      'On-Farm (Hulu)': calcPercent(b.onFarm.gwp, b.pks.gwp),
      'PKS (Pabrik)': calcPercent(b.pks.gwp, b.onFarm.gwp),
    },
    {
      kategori: 'AP (Pengasaman)',
      'On-Farm (Hulu)': calcPercent(b.onFarm.ap, b.pks.ap),
      'PKS (Pabrik)': calcPercent(b.pks.ap, b.onFarm.ap),
    },
    {
      kategori: 'EP (Eutrofikasi)',
      'On-Farm (Hulu)': calcPercent(b.onFarm.ep, b.pks.ep),
      'PKS (Pabrik)': calcPercent(b.pks.ep, b.onFarm.ep),
    },
    {
      kategori: 'Land Use (Lahan)',
      'On-Farm (Hulu)': calcPercent(b.onFarm.landUse, b.pks.landUse),
      'PKS (Pabrik)': calcPercent(b.pks.landUse, b.onFarm.landUse),
    },
    {
      kategori: 'Toksisitas',
      'On-Farm (Hulu)': calcPercent(b.onFarm.toxicity, b.pks.toxicity),
      'PKS (Pabrik)': calcPercent(b.pks.toxicity, b.onFarm.toxicity),
    },
  ];

  // Find Hotspot
  const topSource = sourceData[0];
  const topSourcePercent = ((topSource.emisi / (result.totalGwpPerTonCpo + result.carbonCreditsKgCo2)) * 100).toFixed(1);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
            Analisis Hotspot & Visualisasi Kontribusi Proses
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis kontribusi tahapan On-Farm vs PKS pada seluruh kategori dampak Midpoint
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('donut')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'donut'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Tahapan Siklus
          </button>

          <button
            onClick={() => setViewMode('bar')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'bar'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Rincian Sumber
          </button>

          <button
            onClick={() => setViewMode('process')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'process'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            On-Farm vs PKS (%)
          </button>
        </div>
      </div>

      {/* Hotspot Insight Alert Card */}
      <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3">
        <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-amber-300">Hotspot Terbesar: </span>
          <span className="text-slate-200">
            Sumber emisi dominan pada skenario ini adalah{' '}
            <strong className="text-white font-semibold underline decoration-amber-400">
              {topSource.name}
            </strong>{' '}
            sebesar <strong className="text-amber-300">{topSource.emisi.toLocaleString('id-ID')} kg CO₂eq/t CPO</strong>{' '}
            (~{topSourcePercent}% dari total emisi kotor).
          </span>
          {topSource.name.includes('POME') && (
            <div className="mt-1 text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>
                Rekomendasi Dekarbonisasi: Pasang penutup geomembrane biodigester untuk menangkap metana POME (reduksi hingga 85-90%).
              </span>
            </div>
          )}
          {topSource.name.includes('Pupuk') && (
            <div className="mt-1 text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>
                Rekomendasi Dekarbonisasi: Terapkan pemulsaan Tandan Kosong Sawit (TKKS) dan pemupukan presisi untuk menurunkan pupuk kimia N.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Charts Display */}
      <div className="h-72 w-full pt-2">
        {viewMode === 'donut' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STAGE_COLORS[index % STAGE_COLORS.length]}
                    stroke="#0f172a"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
                        <p className="font-semibold text-white">{data.name}</p>
                        <p className="text-emerald-400 font-mono font-bold mt-1">
                          {data.value.toLocaleString('id-ID')} kg CO₂e
                        </p>
                        <p className="text-slate-400">Kontribusi: {data.percent}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-xs text-slate-300 font-medium">
                    {value} ({entry.payload.percent}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : viewMode === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} unit=" kg" />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#cbd5e1"
                tick={{ fontSize: 11 }}
                width={100}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
                        <p className="font-semibold text-white">{data.name}</p>
                        <p className="text-emerald-400 font-mono font-bold mt-1">
                          {data.emisi.toLocaleString('id-ID')} kg CO₂e / ton CPO
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="emisi" fill="#10b981" radius={[0, 4, 4, 0]}>
                {sourceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name.includes('POME')
                        ? '#ef4444'
                        : entry.name.includes('Gambut')
                        ? '#e11d48'
                        : entry.name.includes('Pupuk') || entry.name.includes('Urea')
                        ? '#f59e0b'
                        : '#10b981'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          /* Process Contribution Mode: On-Farm vs PKS */
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="kategori" stroke="#cbd5e1" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-semibold text-white">{label}</p>
                        {payload.map((entry: any, i: number) => (
                          <p key={i} style={{ color: entry.color }} className="font-mono">
                            {entry.name}: {entry.value}%
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="On-Farm (Hulu)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="PKS (Pabrik)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stage Breakdown Summary Table */}
      <div className="overflow-x-auto pt-2 border-t border-slate-800">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2 px-3 rounded-l-lg">Tahapan Siklus</th>
              <th className="py-2 px-3 text-right">Emisi Kotor</th>
              <th className="py-2 px-3 text-right">Kredit Terhindar</th>
              <th className="py-2 px-3 text-right">Emisi Bersih (Net)</th>
              <th className="py-2 px-3 text-right rounded-r-lg">Porsi (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {result.stageSummary.map((stage, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30">
                <td className="py-2 px-3 font-medium text-white flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: STAGE_COLORS[idx % STAGE_COLORS.length] }}
                  ></span>
                  {stage.stage}
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-200">
                  {stage.grossEmissionsKgCo2.toLocaleString('id-ID')}
                </td>
                <td className="py-2 px-3 text-right font-mono text-cyan-400">
                  {stage.avoidedCreditsKgCo2 > 0 ? `-${stage.avoidedCreditsKgCo2.toLocaleString('id-ID')}` : '0'}
                </td>
                <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-400">
                  {stage.netEmissionsKgCo2.toLocaleString('id-ID')}
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-400">
                  {stage.percentageOfTotal}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
