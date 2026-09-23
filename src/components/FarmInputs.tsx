'use client';

import React from 'react';
import { FarmInputs } from '@/lib/lca/types';
import { Sprout, Fuel, Truck, Layers, HelpCircle } from 'lucide-react';

interface Props {
  inputs: FarmInputs;
  onChange: (updated: FarmInputs) => void;
}

export default function FarmInputsForm({ inputs, onChange }: Props) {
  const handleChange = (field: keyof FarmInputs, value: number) => {
    onChange({
      ...inputs,
      [field]: isNaN(value) ? 0 : value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Group 1: General & Land */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Sprout className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-white">Parameter Produktivitas & Lahan Kebun</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Produktivitas TBS (Ton / Ha / Tahun)
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              value={inputs.ffbYieldPerHa}
              onChange={(e) => handleChange('ffbYieldPerHa', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Rata-rata industri: 18 - 25 ton/ha</span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Luas Areal Perkebunan (Hektar)
            </label>
            <input
              type="number"
              step="50"
              min="1"
              value={inputs.plantationAreaHa}
              onChange={(e) => handleChange('plantationAreaHa', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Total luasan konsesi kebun</span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
              <span>Proporsi Lahan Gambut (%)</span>
              {inputs.peatSoilPercentage > 0 && (
                <span className="text-rose-400 text-[10px] font-bold">Emisi Tinggi!</span>
              )}
            </label>
            <input
              type="number"
              step="5"
              min="0"
              max="100"
              value={inputs.peatSoilPercentage}
              onChange={(e) => handleChange('peatSoilPercentage', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">0% = Mineral murni, default RSPO: 55 t CO2/ha</span>
          </div>
        </div>
      </div>

      {/* Group 2: Fertilizers Application */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">Dosis Pupuk Kimia & Organik (Kg / Ha / Tahun)</h4>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Menghitung emisi N₂O langsung, tak langsung & CO₂ urea
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Urea (46% N)
            </label>
            <div className="relative">
              <input
                type="number"
                step="10"
                min="0"
                value={inputs.ureaKgPerHa}
                onChange={(e) => handleChange('ureaKgPerHa', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-2 text-slate-500 text-[10px]">kg/ha</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Ammonium Sulfat / ZA (21% N)
            </label>
            <div className="relative">
              <input
                type="number"
                step="10"
                min="0"
                value={inputs.ammoniumSulfateKgPerHa}
                onChange={(e) => handleChange('ammoniumSulfateKgPerHa', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-2 text-slate-500 text-[10px]">kg/ha</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Pupuk Majemuk NPK
            </label>
            <div className="relative">
              <input
                type="number"
                step="10"
                min="0"
                value={inputs.npkKgPerHa}
                onChange={(e) => handleChange('npkKgPerHa', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-2 text-slate-500 text-[10px]">kg/ha</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Rock Phosphate / TSP (P₂O₅)
            </label>
            <div className="relative">
              <input
                type="number"
                step="10"
                min="0"
                value={inputs.rockPhosphateKgPerHa}
                onChange={(e) => handleChange('rockPhosphateKgPerHa', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-2 text-slate-500 text-[10px]">kg/ha</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              MOP / KCl (60% K₂O)
            </label>
            <div className="relative">
              <input
                type="number"
                step="10"
                min="0"
                value={inputs.mopKclKgPerHa}
                onChange={(e) => handleChange('mopKclKgPerHa', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-2 text-slate-500 text-[10px]">kg/ha</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Dolomit / Kapur Pertanian
            </label>
            <div className="relative">
              <input
                type="number"
                step="10"
                min="0"
                value={inputs.dolomiteKgPerHa}
                onChange={(e) => handleChange('dolomiteKgPerHa', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-2 text-slate-500 text-[10px]">kg/ha</span>
            </div>
          </div>

          <div className="sm:col-span-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3">
            <label className="block text-emerald-300 font-medium mb-1">
              Pemulsaan Tandan Kosong Sawit / TKKS (Ton EFB / Ha / Tahun)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="5"
                min="0"
                value={inputs.efbMulchingTonsPerHa}
                onChange={(e) => handleChange('efbMulchingTonsPerHa', parseFloat(e.target.value))}
                className="w-48 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500 text-xs"
              />
              <span className="text-[11px] text-slate-400">
                Memberikan kredit daur ulang hara organik (mereduksi kebutuhan pupuk K kimia).
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Group 3: Energy, Fuel & Transportation */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Fuel className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-white">Operasional Alat Berat & Logistik Angkutan TBS</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Bahan Bakar Solar Traktor & Alat Berat (Liter/Ha/Tahun)
            </label>
            <input
              type="number"
              step="5"
              min="0"
              value={inputs.dieselTractorLitersPerHa}
              onChange={(e) => handleChange('dieselTractorLitersPerHa', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Kegiatan piringan, gawangan, angsir</span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Bahan Aktif Herbisida / Pestisida (Kg a.i. / Ha / Tahun)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={inputs.herbicideAiKgPerHa}
              onChange={(e) => handleChange('herbicideAiKgPerHa', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Glifosat, parakuat, triklopir</span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Jarak Rata-rata Kebun ke PKS (Km)
            </label>
            <input
              type="number"
              step="5"
              min="1"
              value={inputs.transportDistanceKm}
              onChange={(e) => handleChange('transportDistanceKm', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Radius angkut truk TBS ke pabrik</span>
          </div>
        </div>
      </div>
    </div>
  );
}
