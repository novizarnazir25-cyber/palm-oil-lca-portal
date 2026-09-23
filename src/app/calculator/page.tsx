'use client';

import React, { useState } from 'react';
import {
  Factory,
  Sprout,
  Droplet,
  Scale,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import FarmInputsForm from '@/components/FarmInputs';
import MillInputsForm from '@/components/MillInputs';
import EnvironmentalImpacts from '@/components/EnvironmentalImpacts';
import HotspotChart from '@/components/HotspotChart';
import SystemBoundaryDiagram from '@/components/SystemBoundaryDiagram';
import ReportExporter from '@/components/ReportExporter';
import { DEFAULT_FARM_PRESET, DEFAULT_MILL_PRESET, DEFAULT_EMISSION_FACTORS } from '@/lib/lca/defaultFactors';
import { calculatePalmOilLca } from '@/lib/lca/engine';
import { FarmInputs, MillInputs, LcaCalculationResult } from '@/lib/lca/types';

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<'farm' | 'mill' | 'allocation'>('farm');
  const [farmInputs, setFarmInputs] = useState<FarmInputs>({ ...DEFAULT_FARM_PRESET });
  const [millInputs, setMillInputs] = useState<MillInputs>({ ...DEFAULT_MILL_PRESET });
  const [scenarioName, setScenarioName] = useState<string>('Simulasi Kebun & PKS Saya');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Live calculation
  const result: LcaCalculationResult = calculatePalmOilLca(
    farmInputs,
    millInputs,
    DEFAULT_EMISSION_FACTORS
  );

  const handleReset = () => {
    setFarmInputs({ ...DEFAULT_FARM_PRESET });
    setMillInputs({ ...DEFAULT_MILL_PRESET });
    setScenarioName('Simulasi Kebun & PKS Saya');
    setSaveSuccess(false);
  };

  const handleSaveScenario = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: scenarioName,
          description: `Kajian LCA kustom dengan metode POME: ${millInputs.treatmentMethod} dan OER ${(millInputs.oer * 100).toFixed(1)}%`,
          farmInputs,
          millInputs,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error saving scenario:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Factory className="w-8 h-8 text-emerald-400" />
            Kalkulator Interaktif LCA Kelapa Sawit
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sesuaikan parameter operasional perkebunan dan pabrik untuk menghitung jejak karbon CPO secara real-time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
            title="Reset ke parameter default industri"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <ReportExporter
            result={result}
            farm={farmInputs}
            mill={millInputs}
            scenarioName={scenarioName}
          />
        </div>
      </div>

      {/* Scenario Name & Quick Save Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-auto flex-1 max-w-md">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Nama Profil / Skenario Simulasi:
          </label>
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 font-mono"
            placeholder="Misal: PKS Sei Mangkei - PLTBg 2026"
          />
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Tersimpan di Database!
            </span>
          )}
          <button
            onClick={handleSaveScenario}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Skenario'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('farm')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'farm'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-x border-slate-800 border-t-emerald-500 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>1. Upstream / Kebun & Pupuk</span>
        </button>

        <button
          onClick={() => setActiveTab('mill')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'mill'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-x border-slate-800 border-t-emerald-500 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>2. PKS & Pengolahan POME</span>
        </button>

        <button
          onClick={() => setActiveTab('allocation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'allocation'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-x border-slate-800 border-t-emerald-500 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>3. Alokasi Produk Bersama</span>
        </button>
      </div>

      {/* Active Tab Form Content */}
      <div className="pt-2">
        {activeTab === 'farm' && (
          <FarmInputsForm inputs={farmInputs} onChange={setFarmInputs} />
        )}

        {activeTab === 'mill' && (
          <MillInputsForm inputs={millInputs} onChange={setMillInputs} />
        )}

        {activeTab === 'allocation' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Scale className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Prinsip Alokasi ISO 14044 (CPO vs Palm Kernel)
                </h4>
                <p className="text-xs text-slate-400">
                  Mengatur bagaimana beban emisi bersama hulu dan PKS dialokasikan ke produk utama CPO dan produk samping Palm Kernel (PK).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nilai Kalor Rendah CPO (LHV - MJ/kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={millInputs.lhvCpoMjPerKg}
                  onChange={(e) =>
                    setMillInputs({ ...millInputs, lhvCpoMjPerKg: parseFloat(e.target.value) })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400">Default RSPO: 37.0 MJ/kg</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nilai Kalor Rendah Kernel (LHV - MJ/kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={millInputs.lhvPkMjPerKg}
                  onChange={(e) =>
                    setMillInputs({ ...millInputs, lhvPkMjPerKg: parseFloat(e.target.value) })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400">Default RSPO: 24.0 MJ/kg</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Harga Pasar CPO ($ / Ton)
                </label>
                <input
                  type="number"
                  step="20"
                  value={millInputs.priceCpoUsdPerTon}
                  onChange={(e) =>
                    setMillInputs({ ...millInputs, priceCpoUsdPerTon: parseFloat(e.target.value) })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400">Untuk alokasi ekonomi</span>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 text-xs space-y-2">
              <span className="font-semibold text-emerald-400 block">
                Hasil Pembagian Alokasi Saat Ini ({result.allocationMethod}):
              </span>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-400 block text-[11px]">Beban Alokasi CPO:</span>
                  <span className="text-lg font-mono font-bold text-white">
                    {(result.cpoAllocationFactor * 100).toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Beban Alokasi Palm Kernel:</span>
                  <span className="text-lg font-mono font-bold text-amber-400">
                    {(result.pkAllocationFactor * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Visual Lifecycle Boundary */}
      <SystemBoundaryDiagram
        result={result}
        pomeMethod={millInputs.treatmentMethod}
      />

      {/* Live Calculated Impacts */}
      <EnvironmentalImpacts result={result} />

      {/* Live Hotspot Chart */}
      <HotspotChart result={result} />
    </div>
  );
}
