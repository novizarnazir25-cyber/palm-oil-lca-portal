'use client';

import React, { useState, useEffect } from 'react';
import { GitCompare, Sparkles, ShieldCheck } from 'lucide-react';
import ScenarioCompare from '@/components/ScenarioCompare';
import { INITIAL_SCENARIOS } from '@/lib/db';
import { LcaSimulationScenario } from '@/lib/lca/types';

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<LcaSimulationScenario[]>(INITIAL_SCENARIOS);
  const [baseId, setBaseId] = useState<string>(INITIAL_SCENARIOS[0].id);
  const [compareId, setCompareId] = useState<string>(INITIAL_SCENARIOS[2].id);

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
        console.warn('Using initial scenarios:', err);
      }
    }
    loadScenarios();
  }, []);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Analisis Sensitivitas & Mitigasi Dekarbonisasi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Komparasi Skenario Rantai Pasok CPO
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Bandingkan performa jejak karbon antara pabrik konvensional (kolam terbuka) vs pabrik dengan penangkapan metana (flaring / PLTBg), serta dampak pembukaan lahan gambut vs mineral.
        </p>
      </div>

      {/* Scenario Compare Component */}
      <ScenarioCompare
        scenarios={scenarios}
        selectedBaseId={baseId}
        selectedCompareId={compareId}
        onSelectBase={setBaseId}
        onSelectCompare={setCompareId}
      />
    </div>
  );
}
