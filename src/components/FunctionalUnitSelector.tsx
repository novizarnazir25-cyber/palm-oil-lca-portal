'use client';

import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  Info,
  ChevronDown,
  Layers,
  Fuel,
  Package,
  Leaf,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import {
  FUNCTIONAL_UNITS,
  FunctionalUnitKey,
  FunctionalUnitInfo,
} from '@/lib/lca/functionalUnits';

interface Props {
  selectedKey: FunctionalUnitKey;
  onChange: (key: FunctionalUnitKey) => void;
  showExplanation?: boolean;
}

export default function FunctionalUnitSelector({
  selectedKey,
  onChange,
  showExplanation = true,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const activeFU = FUNCTIONAL_UNITS[selectedKey] || FUNCTIONAL_UNITS.TON_CPO;

  const unitIcons: Record<FunctionalUnitKey, React.ReactNode> = {
    TON_CPO: <Scale className="w-4 h-4 text-emerald-400" />,
    KG_CPO: <Package className="w-4 h-4 text-sky-400" />,
    TON_FFB: <Leaf className="w-4 h-4 text-teal-400" />,
    MJ_BIOENERGY: <Fuel className="w-4 h-4 text-amber-400" />,
    HECTARE_YEAR: <MapPin className="w-4 h-4 text-indigo-400" />,
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Satuan Fungsional (Functional Unit - ISO 14040/14044)
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                Multi-FU Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Pilih basis satuan normalisasi dampak lingkungan sesuai standar audit &amp; kebutuhan pelaporan:
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(!showModal)}
          className="self-start sm:self-auto text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showModal ? 'Tutup Rincian Rumus' : 'Panduan 5 Satuan Fungsional'}</span>
        </button>
      </div>

      {/* Button Group Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
        {(Object.keys(FUNCTIONAL_UNITS) as FunctionalUnitKey[]).map((key) => {
          const item = FUNCTIONAL_UNITS[key];
          const isSelected = selectedKey === key;

          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-800 to-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-500/40'
                  : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 text-slate-300 hover:border-slate-600'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  {unitIcons[key]}
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {item.shortLabel}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400/90 font-mono block">
                  {item.gwpUnit}
                </span>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-700/40">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                  {item.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Selection Context Box */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="space-y-0.5">
          <span className="text-slate-400 block text-[11px]">
            Satuan Fungsional Aktif: <strong className="text-white">{activeFU.label}</strong>
          </span>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {activeFU.description}
          </p>
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <span className="text-[10px] bg-slate-900 text-slate-300 px-2.5 py-1 rounded-md font-mono border border-slate-700 block sm:inline-block">
            {activeFU.standardReference}
          </span>
        </div>
      </div>

      {/* Expandable Explanation of All 5 FUs */}
      {showModal && (
        <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Perbandingan Metodologis 5 Satuan Fungsional (Klausul 4.2.3.2 ISO 14044):
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            {(Object.keys(FUNCTIONAL_UNITS) as FunctionalUnitKey[]).map((key) => {
              const item = FUNCTIONAL_UNITS[key];
              const isSelected = selectedKey === key;
              return (
                <div
                  key={key}
                  className={`p-3 rounded-lg border ${
                    isSelected
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white flex items-center gap-1">
                      {unitIcons[key]} {item.label}
                    </span>
                    <span className="font-mono text-emerald-400 text-[10px]">{item.gwpUnit}</span>
                  </div>
                  <p className="text-slate-300">{item.description}</p>
                  <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Rumus: {item.formulaDescription}</span>
                    <span className="text-emerald-400">{item.standardReference}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
