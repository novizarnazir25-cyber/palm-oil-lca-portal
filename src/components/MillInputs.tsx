'use client';

import React from 'react';
import { MillInputs, PomeTreatmentMethod, AllocationMethod } from '@/lib/lca/types';
import { Factory, Droplet, Flame, Zap, Scale, Layers } from 'lucide-react';

interface Props {
  inputs: MillInputs;
  onChange: (updated: MillInputs) => void;
}

export default function MillInputsForm({ inputs, onChange }: Props) {
  const handleChange = (field: keyof MillInputs, value: any) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Group 1: PKS Extraction Rates & Capacity */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Factory className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-white">Parameter Pengolahan Pabrik Kelapa Sawit (PKS)</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              TBS Diolah (Ton / Tahun)
            </label>
            <input
              type="number"
              step="10000"
              min="1000"
              value={inputs.annualFfbProcessedTons}
              onChange={(e) => handleChange('annualFfbProcessedTons', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Kapasitas tipikal PKS 30-60 ton TBS/jam</span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Rendemen Minyak / OER (%)
            </label>
            <input
              type="number"
              step="0.5"
              min="10"
              max="35"
              value={Number((inputs.oer * 100).toFixed(1))}
              onChange={(e) => handleChange('oer', parseFloat(e.target.value) / 100)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Oil Extraction Rate (standar: 20% - 24%)</span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Rendemen Inti / KER (%)
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="15"
              value={Number((inputs.ker * 100).toFixed(1))}
              onChange={(e) => handleChange('ker', parseFloat(e.target.value) / 100)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Kernel Extraction Rate (standar: 4% - 6%)</span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Auxiliary Diesel Cold-Startup (Liter / Ton TBS)
            </label>
            <input
              type="number"
              step="0.05"
              min="0"
              value={inputs.boilerDieselStartupLPerTonFfb}
              onChange={(e) => handleChange('boilerDieselStartupLPerTonFfb', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Bahan bakar solar pemanasan awal boiler</span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Ekspor Listrik Boiler Cogeneration (kWh / Ton TBS)
            </label>
            <input
              type="number"
              step="5"
              min="0"
              value={inputs.gridElectricityExportKwhPerTonFfb}
              onChange={(e) => handleChange('gridElectricityExportKwhPerTonFfb', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Kelebihan daya turbin uap biomassa</span>
          </div>
        </div>
      </div>

      {/* Group 2: POME Wastewater & Methane Management */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">Pengelolaan Limbah Cair POME & Gas Metana (CH₄)</h4>
          </div>
          <span className="text-[11px] text-rose-400 font-medium hidden sm:inline">
            Fokus Hotspot Emisi Terbesar di PKS!
          </span>
        </div>

        {/* Treatment Scenario Selection */}
        <div>
          <label className="block text-slate-300 font-medium mb-2 text-xs">
            Pilih Skenario Pengolahan POME:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Option 1: Open Lagoon */}
            <button
              type="button"
              onClick={() => handleChange('treatmentMethod', 'OPEN_ANAEROBIC_LAGOON')}
              className={`p-3 rounded-xl border text-left transition-all ${
                inputs.treatmentMethod === 'OPEN_ANAEROBIC_LAGOON'
                  ? 'bg-rose-950/30 border-rose-500 shadow-md ring-1 ring-rose-500'
                  : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Droplet className={`w-4 h-4 ${inputs.treatmentMethod === 'OPEN_ANAEROBIC_LAGOON' ? 'text-rose-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-white">Kolam Terbuka</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Konvensional. Gas CH₄ dilepaskan ke atmosfer (MCF = 0.8).
              </p>
            </button>

            {/* Option 2: Flaring */}
            <button
              type="button"
              onClick={() => handleChange('treatmentMethod', 'METHANE_CAPTURE_FLARING')}
              className={`p-3 rounded-xl border text-left transition-all ${
                inputs.treatmentMethod === 'METHANE_CAPTURE_FLARING'
                  ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-500'
                  : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Flame className={`w-4 h-4 ${inputs.treatmentMethod === 'METHANE_CAPTURE_FLARING' ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-white">Methane Flare</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Ditutup geomembrane & dibakar flare menjadi CO₂ biogenik.
              </p>
            </button>

            {/* Option 3: Biogas to Power */}
            <button
              type="button"
              onClick={() => handleChange('treatmentMethod', 'BIOGAS_TO_POWER')}
              className={`p-3 rounded-xl border text-left transition-all ${
                inputs.treatmentMethod === 'BIOGAS_TO_POWER'
                  ? 'bg-emerald-950/30 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                  : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className={`w-4 h-4 ${inputs.treatmentMethod === 'BIOGAS_TO_POWER' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-white">Biogas to Power</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                PLTBg menghasilkan listrik hijau & kredit pengurangan karbon.
              </p>
            </button>
          </div>
        </div>

        {/* POME Detail Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Rasio POME (m³ / Ton TBS)
            </label>
            <input
              type="number"
              step="0.05"
              min="0.3"
              max="1.5"
              value={inputs.pomeRatioM3PerTonFfb}
              onChange={(e) => handleChange('pomeRatioM3PerTonFfb', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Standar PKS: 0.60 - 0.75 m³/t TBS</span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Konsentrasi COD Limbah (mg / Liter)
            </label>
            <input
              type="number"
              step="2000"
              min="10000"
              max="60000"
              value={inputs.pomeCodMgPerL}
              onChange={(e) => handleChange('pomeCodMgPerL', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Chemical Oxygen Demand (tipikal: 30.000 mg/L)</span>
          </div>

          {inputs.treatmentMethod !== 'OPEN_ANAEROBIC_LAGOON' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Efisiensi Penangkap Metana (%)
              </label>
              <input
                type="number"
                step="2"
                min="50"
                max="99"
                value={Number((inputs.methaneCaptureEfficiency * 100).toFixed(0))}
                onChange={(e) => handleChange('methaneCaptureEfficiency', parseFloat(e.target.value) / 100)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400">Efisiensi geomembrane (standar: 85% - 95%)</span>
            </div>
          )}

          {inputs.treatmentMethod === 'BIOGAS_TO_POWER' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Persentase Ekspor Listrik ke Grid (%)
              </label>
              <input
                type="number"
                step="5"
                min="0"
                max="100"
                value={inputs.biogasPowerExportPercentage}
                onChange={(e) => handleChange('biogasPowerExportPercentage', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400">% daya yang dijual ke PLN / jaringan</span>
            </div>
          )}
        </div>
      </div>

      {/* Group 3: ISO 14044 Co-Product Allocation */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">Metode Alokasi Produk Bersama (ISO 14044)</h4>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Pembagian beban emisi antara CPO dan Palm Kernel
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['ENERGY', 'MASS', 'ECONOMIC'] as AllocationMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => handleChange('allocationMethod', method)}
              className={`p-3 rounded-xl border text-left transition-all ${
                inputs.allocationMethod === method
                  ? 'bg-emerald-950/30 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                  : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
              }`}
            >
              <span className="text-xs font-bold text-white block mb-1">
                {method === 'ENERGY'
                  ? 'Alokasi Energi (LHV)'
                  : method === 'MASS'
                  ? 'Alokasi Massa (Yield)'
                  : 'Alokasi Ekonomi (Harga)'}
              </span>
              <p className="text-[11px] text-slate-400 leading-snug">
                {method === 'ENERGY'
                  ? 'Standar RSPO & RED II (LHV CPO: 37 MJ/kg, PK: 24 MJ/kg).'
                  : method === 'MASS'
                  ? 'Berdasarkan berat fisik produk (OER vs KER).'
                  : 'Berdasarkan kontribusi pendapatan pasar (USD/ton).'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
