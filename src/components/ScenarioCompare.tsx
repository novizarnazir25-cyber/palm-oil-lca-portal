'use client';

import React from 'react';
import { LcaSimulationScenario } from '@/lib/lca/types';
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  GitCompare,
  TrendingDown,
  Zap,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Props {
  scenarios: LcaSimulationScenario[];
  selectedBaseId: string;
  selectedCompareId: string;
  onSelectBase: (id: string) => void;
  onSelectCompare: (id: string) => void;
}

export default function ScenarioCompare({
  scenarios,
  selectedBaseId,
  selectedCompareId,
  onSelectBase,
  onSelectCompare,
}: Props) {
  const baseScenario = scenarios.find((s) => s.id === selectedBaseId) || scenarios[0];
  const compScenario =
    scenarios.find((s) => s.id === selectedCompareId) || scenarios[1] || scenarios[0];

  const baseResult = baseScenario.result;
  const compResult = compScenario.result;

  if (!baseResult || !compResult) {
    return <div className="text-slate-400 text-xs">Menghitung skenario komparasi...</div>;
  }

  // Calculate Deltas
  const gwpDelta = compResult.totalGwpPerTonCpo - baseResult.totalGwpPerTonCpo;
  const gwpDeltaPercent = ((gwpDelta / baseResult.totalGwpPerTonCpo) * 100).toFixed(1);
  const pomeDelta = compResult.pomeEmissionsKgCo2 - baseResult.pomeEmissionsKgCo2;
  const pomeDeltaPercent = baseResult.pomeEmissionsKgCo2 > 0
    ? ((pomeDelta / baseResult.pomeEmissionsKgCo2) * 100).toFixed(1)
    : '0';

  // Chart data for comparison
  const comparisonChartData = [
    {
      kategori: 'Upstream (Kebun)',
      [baseScenario.name]: baseResult.upstreamEmissionsKgCo2,
      [compScenario.name]: compResult.upstreamEmissionsKgCo2,
    },
    {
      kategori: 'Transportasi',
      [baseScenario.name]: baseResult.transportEmissionsKgCo2,
      [compScenario.name]: compResult.transportEmissionsKgCo2,
    },
    {
      kategori: 'PKS (Mill)',
      [baseScenario.name]: baseResult.millEmissionsKgCo2,
      [compScenario.name]: compResult.millEmissionsKgCo2,
    },
    {
      kategori: 'Limbah POME',
      [baseScenario.name]: baseResult.pomeEmissionsKgCo2,
      [compScenario.name]: compResult.pomeEmissionsKgCo2,
    },
    {
      kategori: 'Total Bersih (Net)',
      [baseScenario.name]: baseResult.totalGwpPerTonCpo,
      [compScenario.name]: compResult.totalGwpPerTonCpo,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Scenario Selectors */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <GitCompare className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-semibold text-white">
              Pilih Skenario Komparasi Berdampingan
            </h3>
            <p className="text-xs text-slate-400">
              Bandingkan dampak penerapan teknologi mitigasi (seperti biogas capture vs kolam terbuka)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Base Scenario Selector */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5">
            <label className="block text-slate-300 font-semibold mb-2 flex items-center justify-between">
              <span>Skenario Acuan (Baseline):</span>
              <span className="text-[10px] text-amber-400 font-normal">Pembanding Dasar</span>
            </label>
            <select
              value={selectedBaseId}
              onChange={(e) => onSelectBase(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500 text-xs"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-2">{baseScenario.description}</p>
          </div>

          {/* Compare Scenario Selector */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5">
            <label className="block text-slate-300 font-semibold mb-2 flex items-center justify-between">
              <span>Skenario Mitigasi (Komparasi):</span>
              <span className="text-[10px] text-emerald-400 font-normal">Opsi Intervensi</span>
            </label>
            <select
              value={selectedCompareId}
              onChange={(e) => onSelectCompare(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500 text-xs"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-2">{compScenario.description}</p>
          </div>
        </div>
      </div>

      {/* Delta KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total GWP Delta */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Perubahan Jejak Karbon Total (GWP)</span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono ${
                gwpDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {gwpDelta <= 0 ? `${gwpDeltaPercent}%` : `+${gwpDeltaPercent}%`}
            </span>
            <span className="text-xs text-slate-300">
              ({gwpDelta > 0 ? '+' : ''}
              {gwpDelta.toLocaleString('id-ID')} kg CO₂e)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            {gwpDelta <= 0 ? (
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>
              {gwpDelta <= 0 ? 'Penurunan jejak karbon signifikan!' : 'Peningkatan emisi'}
            </span>
          </p>
        </div>

        {/* POME Delta */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Reduksi Emisi Metana POME</span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono ${
                pomeDelta <= 0 ? 'text-teal-400' : 'text-rose-400'
              }`}
            >
              {pomeDelta <= 0 ? `${pomeDeltaPercent}%` : `+${pomeDeltaPercent}%`}
            </span>
            <span className="text-xs text-slate-300">
              ({pomeDelta > 0 ? '+' : ''}
              {pomeDelta.toLocaleString('id-ID')} kg CO₂e)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {pomeDelta < 0 ? 'Mereduksi fugitive methane POME' : 'Emisi metana terbuka'}
          </p>
        </div>

        {/* Carbon Credits */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Kredit Karbon Terhindar</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              -{compResult.carbonCreditsKgCo2.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">kg CO₂e/t CPO</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dari substitusi energi fosil & biomassa</span>
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <h4 className="text-sm font-semibold text-white">
          Grafik Perbandingan Emisi per Kategori (kg CO₂eq / ton CPO)
        </h4>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="kategori" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} unit=" kg" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-semibold text-white">{label}</p>
                        {payload.map((entry: any, i: number) => (
                          <p key={i} style={{ color: entry.color }} className="font-mono">
                            {entry.name}: {Number(entry.value).toLocaleString('id-ID')} kg CO₂e
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey={baseScenario.name} fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey={compScenario.name} fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comprehensive Metric Comparison Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-4 rounded-l-lg">Parameter / Indikator Lingkungan</th>
              <th className="py-2.5 px-4 text-right">Baseline ({baseScenario.name})</th>
              <th className="py-2.5 px-4 text-right">Mitigasi ({compScenario.name})</th>
              <th className="py-2.5 px-4 text-right rounded-r-lg">Selisih (Delta)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            <tr>
              <td className="py-2.5 px-4 font-semibold text-white">Jejak Karbon Bersih (Net GWP)</td>
              <td className="py-2.5 px-4 text-right font-mono text-amber-300 font-bold">
                {baseResult.totalGwpPerTonCpo.toLocaleString('id-ID')} kg CO₂e
              </td>
              <td className="py-2.5 px-4 text-right font-mono text-emerald-400 font-bold">
                {compResult.totalGwpPerTonCpo.toLocaleString('id-ID')} kg CO₂e
              </td>
              <td className="py-2.5 px-4 text-right font-mono font-bold">
                <span className={gwpDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {gwpDelta <= 0 ? '' : '+'}
                  {gwpDelta.toLocaleString('id-ID')} kg ({gwpDeltaPercent}%)
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4">GWP per 1 kg CPO</td>
              <td className="py-2.5 px-4 text-right font-mono">{baseResult.totalGwpPerKgCpo.toFixed(3)} kg</td>
              <td className="py-2.5 px-4 text-right font-mono">{compResult.totalGwpPerKgCpo.toFixed(3)} kg</td>
              <td className="py-2.5 px-4 text-right font-mono text-emerald-400">
                {(compResult.totalGwpPerKgCpo - baseResult.totalGwpPerKgCpo).toFixed(3)} kg
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4">Emisi Hulu Perkebunan</td>
              <td className="py-2.5 px-4 text-right font-mono">{baseResult.upstreamEmissionsKgCo2.toLocaleString('id-ID')}</td>
              <td className="py-2.5 px-4 text-right font-mono">{compResult.upstreamEmissionsKgCo2.toLocaleString('id-ID')}</td>
              <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                {(compResult.upstreamEmissionsKgCo2 - baseResult.upstreamEmissionsKgCo2).toLocaleString('id-ID')}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4">Emisi Pengolahan POME</td>
              <td className="py-2.5 px-4 text-right font-mono text-rose-400">{baseResult.pomeEmissionsKgCo2.toLocaleString('id-ID')}</td>
              <td className="py-2.5 px-4 text-right font-mono text-emerald-400">{compResult.pomeEmissionsKgCo2.toLocaleString('id-ID')}</td>
              <td className="py-2.5 px-4 text-right font-mono text-emerald-400 font-semibold">
                {pomeDelta.toLocaleString('id-ID')} ({pomeDeltaPercent}%)
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4">Kredit Emisi Terhindar</td>
              <td className="py-2.5 px-4 text-right font-mono text-cyan-400">-{baseResult.carbonCreditsKgCo2.toFixed(1)}</td>
              <td className="py-2.5 px-4 text-right font-mono text-cyan-400">-{compResult.carbonCreditsKgCo2.toFixed(1)}</td>
              <td className="py-2.5 px-4 text-right font-mono text-cyan-400 font-semibold">
                -{(compResult.carbonCreditsKgCo2 - baseResult.carbonCreditsKgCo2).toFixed(1)}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4">Potensi Pengasaman / AP (kg SO₂eq)</td>
              <td className="py-2.5 px-4 text-right font-mono">{baseResult.midpoint?.apKgSo2e ?? baseResult.acidificationPotentialKgSo2EqPerTonCpo}</td>
              <td className="py-2.5 px-4 text-right font-mono">{compResult.midpoint?.apKgSo2e ?? compResult.acidificationPotentialKgSo2EqPerTonCpo}</td>
              <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                {((compResult.midpoint?.apKgSo2e ?? 0) - (baseResult.midpoint?.apKgSo2e ?? 0)).toFixed(4)}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4">Potensi Eutrofikasi / EP (kg PO₄³⁻eq)</td>
              <td className="py-2.5 px-4 text-right font-mono">{baseResult.midpoint?.epKgPo4e ?? baseResult.eutrophicationPotentialKgPo4EqPerTonCpo}</td>
              <td className="py-2.5 px-4 text-right font-mono">{compResult.midpoint?.epKgPo4e ?? compResult.eutrophicationPotentialKgPo4EqPerTonCpo}</td>
              <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                {((compResult.midpoint?.epKgPo4e ?? 0) - (baseResult.midpoint?.epKgPo4e ?? 0)).toFixed(4)}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4">Okupasi Lahan / Land Use (m²·yr)</td>
              <td className="py-2.5 px-4 text-right font-mono">{baseResult.midpoint?.landUseM2Yr ?? '-'}</td>
              <td className="py-2.5 px-4 text-right font-mono">{compResult.midpoint?.landUseM2Yr ?? '-'}</td>
              <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                {((compResult.midpoint?.landUseM2Yr ?? 0) - (baseResult.midpoint?.landUseM2Yr ?? 0)).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4">Toksisitas / Toxicity (kg 1,4-DCB eq)</td>
              <td className="py-2.5 px-4 text-right font-mono">{baseResult.midpoint?.toxicityKgDcb ?? '-'}</td>
              <td className="py-2.5 px-4 text-right font-mono">{compResult.midpoint?.toxicityKgDcb ?? '-'}</td>
              <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                {((compResult.midpoint?.toxicityKgDcb ?? 0) - (baseResult.midpoint?.toxicityKgDcb ?? 0)).toFixed(2)}
              </td>
            </tr>
            {/* Endpoint Damage Rows */}
            <tr className="bg-slate-800/40 font-semibold text-rose-300">
              <td className="py-2.5 px-4">Endpoint: Human Health (mDALY / t CPO)</td>
              <td className="py-2.5 px-4 text-right font-mono">{baseResult.endpoint?.humanHealthMilliDaly ?? '-'}</td>
              <td className="py-2.5 px-4 text-right font-mono text-emerald-400">{compResult.endpoint?.humanHealthMilliDaly ?? '-'}</td>
              <td className="py-2.5 px-4 text-right font-mono">
                {((compResult.endpoint?.humanHealthMilliDaly ?? 0) - (baseResult.endpoint?.humanHealthMilliDaly ?? 0)).toFixed(3)} mDALY
              </td>
            </tr>
            <tr className="bg-slate-800/40 font-semibold text-emerald-300">
              <td className="py-2.5 px-4">Endpoint: Ecosystem Quality (PDF·m²·yr)</td>
              <td className="py-2.5 px-4 text-right font-mono">{baseResult.endpoint?.ecosystemQualityPdf ?? '-'}</td>
              <td className="py-2.5 px-4 text-right font-mono text-emerald-400">{compResult.endpoint?.ecosystemQualityPdf ?? '-'}</td>
              <td className="py-2.5 px-4 text-right font-mono">
                {((compResult.endpoint?.ecosystemQualityPdf ?? 0) - (baseResult.endpoint?.ecosystemQualityPdf ?? 0)).toFixed(1)} PDF
              </td>
            </tr>
            <tr className="bg-slate-800/40 font-semibold text-amber-300">
              <td className="py-2.5 px-4">Endpoint: Resource Scarcity (Surplus Energy MJ)</td>
              <td className="py-2.5 px-4 text-right font-mono">{baseResult.endpoint?.resourcesSurplusMj ?? '-'}</td>
              <td className="py-2.5 px-4 text-right font-mono text-emerald-400">{compResult.endpoint?.resourcesSurplusMj ?? '-'}</td>
              <td className="py-2.5 px-4 text-right font-mono">
                {((compResult.endpoint?.resourcesSurplusMj ?? 0) - (baseResult.endpoint?.resourcesSurplusMj ?? 0)).toFixed(1)} MJ
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-semibold text-white">PalmGHG Benchmark Rating</td>
              <td className="py-2.5 px-4 text-right font-bold text-amber-400">Grade {baseResult.palmGhgrating}</td>
              <td className="py-2.5 px-4 text-right font-bold text-emerald-400">Grade {compResult.palmGhgrating}</td>
              <td className="py-2.5 px-4 text-right font-semibold text-emerald-400">
                {compResult.palmGhgrating === baseResult.palmGhgrating ? 'Sama' : 'Meningkat!'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
