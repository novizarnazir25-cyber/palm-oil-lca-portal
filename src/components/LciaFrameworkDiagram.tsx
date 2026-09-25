'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  Maximize2,
  HeartPulse,
  Trees,
  Fuel,
  CloudRain,
  Waves,
  MapPin,
  Skull,
  ExternalLink,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { MidpointImpacts, EndpointImpacts } from '@/lib/lca/types';

interface Props {
  midpoint?: MidpointImpacts;
  endpoint?: EndpointImpacts;
}

export default function LciaFrameworkDiagram({ midpoint, endpoint }: Props) {
  const [activeTab, setActiveTab] = useState<'infographic' | 'interactive'>('infographic');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const pathways = {
    gwp: {
      title: 'Global Warming (GWP₁₀₀) ➔ Human Health & Ecosystem Quality',
      midpoint: 'Global Warming Potential (kg CO₂-eq)',
      mechanism:
        'Emisi CH₄ POME, N₂O pemupukan tanah, dan CO₂ solar memicu efek rumah kaca atmosfer. Menyebabkan peningkatan suhu global, anomali iklim ekstrem, dan kekeringan.',
      toEndpoint: [
        '➔ Human Health (mDALY): Peningkatan malnutrisi, morbiditas penyakit kardiovaskular akibat gelombang panas, dan vektor malaria/demam berdarah.',
        '➔ Ecosystem Quality (PDF·m²·yr): Hilangnya tutupan vegetasi hutan tropis, pergeseran bioma, dan risiko kepunahan spesies flora/fauna endemik.',
      ],
      color: 'border-emerald-500 text-emerald-400 bg-emerald-950/40',
    },
    ap: {
      title: 'Terrestrial Acidification (AP) ➔ Human Health & Ecosystem Quality',
      midpoint: 'Acidification Potential (kg SO₂-eq)',
      mechanism:
        'Penguapan volatil gas amonia (NH₃) dari aplikasi pupuk Urea & ZA, serta emisi SO₂ dari cerobong boiler. Gas bereaksi dengan uap air membentuk asam sulfat/nitrat yang mengendap ke tanah.',
      toEndpoint: [
        '➔ Ecosystem Quality (PDF·m²·yr): Penurunan pH tanah kebun, pencucian kation basa esensial (Ca²⁺, Mg²⁺), pelepasan ion Al³⁺ toksik yang merusak akar sawit dan vegetasi hutan riparian.',
        '➔ Human Health (mDALY): Pembentukan aerosol sulfat partikulat halus (PM2.5) penyebab infeksi saluran pernapasan akut.',
      ],
      color: 'border-indigo-500 text-indigo-400 bg-indigo-950/40',
    },
    ep: {
      title: 'Freshwater Eutrophication (EP) ➔ Ecosystem Quality',
      midpoint: 'Freshwater Eutrophication (kg PO₄-eq)',
      mechanism:
        'Limpasan permukaan hara fosfor (P) pupuk NPK & TSP serta pelepasan efluen POME ke badan sungai memicu ledakan populasi alga air tawar (algal bloom).',
      toEndpoint: [
        '➔ Ecosystem Quality (PDF·m²·yr): Dekomposisi biomassa alga menghabiskan oksigen terlarut (anoksia), menyebabkan kematian massal ikan, eutrofikasi danau, dan penurunan keanekaragaman hayati akuatik perairan tawar.',
      ],
      color: 'border-teal-500 text-teal-400 bg-teal-950/40',
    },
    landuse: {
      title: 'Land Occupation (LU) ➔ Ecosystem Quality',
      midpoint: 'Agricultural Land Occupation (m²·tahun)',
      mechanism:
        'Penggunaan lahan monokultur kelapa sawit selama siklus rotasi 25 tahun menggantikan keanekaragaman struktur kanopi hutan primer/sekunder.',
      toEndpoint: [
        '➔ Ecosystem Quality (PDF·m²·yr): Faktor kerusakan dominan (87.4% terhadap total kerusakan ekosistem ReCiPe 2016). Merefleksikan fragmentasi habitat satwa liar dan hilangnya keanekaragaman flora asli.',
      ],
      color: 'border-amber-500 text-amber-400 bg-amber-950/40',
    },
    toxicity: {
      title: 'Ecotoxicity & Human Toxicity ➔ Human Health & Ecosystem Quality',
      midpoint: 'Toxicity Potential (kg 1,4-DCB eq)',
      mechanism:
        'Aplikasi herbisida bahan aktif (glifosat/parakuat), pestisida kimia, serta pengotor logam berat (Cd, As) pada batuan fosfat pupuk alam.',
      toEndpoint: [
        '➔ Human Health (mDALY): Toksisitas karsinogenik dan non-karsinogenik melalui bioakumulasi rantai pangan dan air minum pekerja kebun.',
        '➔ Ecosystem Quality (PDF·m²·yr): Gangguan kesuburan mikroba tanah dan toksisitas akut fauna tanah (cacing & serangga polinator).',
      ],
      color: 'border-rose-500 text-rose-400 bg-rose-950/40',
    },
    resources: {
      title: 'Fossil Depletion ➔ Resources Scarcity',
      midpoint: 'Fossil Resource Scarcity (kg oil-eq)',
      mechanism:
        'Ekstraksi minyak bumi diesel armada angkut TBS/traktor dan gas alam untuk sintesis gas amonia pupuk nitrogen melalui proses Haber-Bosch.',
      toEndpoint: [
        '➔ Resources Scarcity (MJ Surplus Energy): Menipisnya cadangan hidrokarbon fosil bumi mengharuskan masyarakat masa depan mengeluarkan energi berlebih (surplus energy) untuk mengekstraksi cadangan yang lebih dalam/sulit.',
      ],
      color: 'border-amber-500 text-amber-400 bg-amber-950/40',
    },
  };

  const activePathway = selectedNode ? pathways[selectedNode as keyof typeof pathways] : null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Diagram Rantai Kausalitas LCIA: Midpoint &amp; Endpoint</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                ReCiPe 2016 Hierarchist
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualisasi alur hubungan sebab-akibat dari inventori emisi lapangan hulu-PKS menuju 5 kategori Midpoint dan 3 Area Proteksi (Endpoint AoP)
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('infographic')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'infographic'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Infografis Saintifik</span>
          </button>
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'interactive'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alur Kausalitas Interaktif</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SCIENTIFIC INFOGRAPHIC IMAGE */}
      {activeTab === 'infographic' && (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group">
            <img
              src="/lcia_framework_recipe2016.jpg"
              alt="Diagram Life Cycle Impact Assessment (LCIA) ReCiPe 2016 Midpoint to Endpoint Rantai Pasok Kelapa Sawit"
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <div className="absolute bottom-3 right-3 bg-slate-900/90 text-slate-300 text-[10px] font-mono px-3 py-1 rounded-lg border border-slate-700/80 backdrop-blur-md">
              ISO 14040/14044 • ReCiPe 2016 Framework
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic text-center">
            *Gambar 1. Rantai kausalitas mekanisme dampak ReCiPe 2016: Menghubungkan aliran emisi inventori (LCI) hulu perkebunan dan pabrik PKS menuju kategori Midpoint dan kerusakan Endpoint pada Kesehatan Manusia, Kualitas Ekosistem, serta Kelangkaan Sumber Daya.
          </p>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE CAUSE-EFFECT FLOW */}
      {activeTab === 'interactive' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Column 1: Inventory (LCI) */}
            <div className="space-y-2.5">
              <div className="bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-xl text-center font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                1. Inventori Emisi Lapangan (LCI)
              </div>

              <div
                onClick={() => setSelectedNode('gwp')}
                className="cursor-pointer p-3 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-emerald-500 hover:bg-slate-800/50 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">Gas Rumah Kaca (GRK)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">CH₄, N₂O, CO₂</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Kolam anaerobik POME, nitrifikasi pupuk urea/ZA, dekomposisi gambut, dan solar traktor.
                </p>
              </div>

              <div
                onClick={() => setSelectedNode('ap')}
                className="cursor-pointer p-3 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-indigo-500 hover:bg-slate-800/50 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">Gas Pengasaman</span>
                  <span className="text-[10px] text-indigo-400 font-mono">NH₃, SO₂, NOₓ</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Volatilisasi amonia pupuk urea/ZA dan gas buang cerobong boiler pabrik.
                </p>
              </div>

              <div
                onClick={() => setSelectedNode('ep')}
                className="cursor-pointer p-3 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-teal-500 hover:bg-slate-800/50 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">Limpasan Hara Pupuk</span>
                  <span className="text-[10px] text-teal-400 font-mono">PO₄³⁻, NO₃⁻</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Pencucian nitrat ke air tanah dan erosi pupuk fosfat ke sungai sekitar kebun.
                </p>
              </div>

              <div
                onClick={() => setSelectedNode('landuse')}
                className="cursor-pointer p-3 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-amber-500 hover:bg-slate-800/50 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">Okupasi Lahan Kebun</span>
                  <span className="text-[10px] text-amber-400 font-mono">m²·thn / t TBS</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Areal tegakan monokultur sawit selama rotasi 25 tahun masa produktif.
                </p>
              </div>

              <div
                onClick={() => setSelectedNode('toxicity')}
                className="cursor-pointer p-3 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-rose-500 hover:bg-slate-800/50 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">Bahan Kimia Aktif</span>
                  <span className="text-[10px] text-rose-400 font-mono">a.i. &amp; Logam Berat</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Aplikasi herbisida gulma piringan dan pengotor kadmium/arsenik batuan fosfat.
                </p>
              </div>
            </div>

            {/* Column 2: Midpoint Impacts (5 Kategori) */}
            <div className="space-y-2.5">
              <div className="bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-xl text-center font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                2. Kategori Dampak (Midpoint)
              </div>

              <div
                onClick={() => setSelectedNode('gwp')}
                className={`cursor-pointer p-3 rounded-xl border transition-all space-y-1 ${
                  selectedNode === 'gwp'
                    ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500'
                    : 'border-slate-800 bg-slate-900/70 hover:border-emerald-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-[11px]">1. Global Warming (GWP)</span>
                  <span className="text-[10px] text-slate-400 font-mono">kg CO₂-eq</span>
                </div>
                <div className="text-base font-mono font-bold text-white">
                  {midpoint?.gwpKgCo2e.toLocaleString('id-ID') ?? '814.16'}
                </div>
                <span className="text-[9px] text-slate-400 block">Jalur: Pemanasan Global Atmosfer</span>
              </div>

              <div
                onClick={() => setSelectedNode('ap')}
                className={`cursor-pointer p-3 rounded-xl border transition-all space-y-1 ${
                  selectedNode === 'ap'
                    ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-900/70 hover:border-indigo-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400 text-[11px]">2. Acidification (AP)</span>
                  <span className="text-[10px] text-slate-400 font-mono">kg SO₂-eq</span>
                </div>
                <div className="text-base font-mono font-bold text-white">
                  {midpoint?.apKgSo2e.toFixed(3) ?? '6.660'}
                </div>
                <span className="text-[9px] text-slate-400 block">Jalur: Pengasaman Tanah &amp; Air</span>
              </div>

              <div
                onClick={() => setSelectedNode('ep')}
                className={`cursor-pointer p-3 rounded-xl border transition-all space-y-1 ${
                  selectedNode === 'ep'
                    ? 'border-teal-500 bg-teal-950/30 ring-1 ring-teal-500'
                    : 'border-slate-800 bg-slate-900/70 hover:border-teal-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-400 text-[11px]">3. Eutrophication (EP)</span>
                  <span className="text-[10px] text-slate-400 font-mono">kg PO₄-eq</span>
                </div>
                <div className="text-base font-mono font-bold text-white">
                  {midpoint?.epKgPo4e.toFixed(3) ?? '1.690'}
                </div>
                <span className="text-[9px] text-slate-400 block">Jalur: Ledakan Alga Air Tawar</span>
              </div>

              <div
                onClick={() => setSelectedNode('landuse')}
                className={`cursor-pointer p-3 rounded-xl border transition-all space-y-1 ${
                  selectedNode === 'landuse'
                    ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500'
                    : 'border-slate-800 bg-slate-900/70 hover:border-amber-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-[11px]">4. Land Occupation (LU)</span>
                  <span className="text-[10px] text-slate-400 font-mono">m²·thn</span>
                </div>
                <div className="text-base font-mono font-bold text-white">
                  {midpoint?.landUseM2Yr.toLocaleString('id-ID') ?? '1,901.41'}
                </div>
                <span className="text-[9px] text-slate-400 block">Jalur: Okupasi Lahan Terestrial</span>
              </div>

              <div
                onClick={() => setSelectedNode('toxicity')}
                className={`cursor-pointer p-3 rounded-xl border transition-all space-y-1 ${
                  selectedNode === 'toxicity'
                    ? 'border-rose-500 bg-rose-950/30 ring-1 ring-rose-500'
                    : 'border-slate-800 bg-slate-900/70 hover:border-rose-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400 text-[11px]">5. Toxicity (Human/Eco)</span>
                  <span className="text-[10px] text-slate-400 font-mono">kg 1,4-DCB eq</span>
                </div>
                <div className="text-base font-mono font-bold text-white">
                  {midpoint?.toxicityKgDcb.toLocaleString('id-ID') ?? '521.36'}
                </div>
                <span className="text-[9px] text-slate-400 block">Jalur: Toksisitas Kimia Ekosistem</span>
              </div>
            </div>

            {/* Column 3: Endpoint Damage (3 AoP) */}
            <div className="space-y-2.5">
              <div className="bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-xl text-center font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                3. Area Proteksi (Endpoint AoP)
              </div>

              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-rose-300 text-xs">Human Health (Kesehatan)</span>
                  </div>
                  <span className="text-[10px] bg-rose-900/60 text-rose-200 px-2 py-0.5 rounded font-mono">AoP 1</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-white">
                    {endpoint?.humanHealthMilliDaly ?? '2.491'}
                  </span>
                  <span className="text-xs text-rose-300 font-mono">mDALY</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Tahun usia produktif sehat yang hilang akibat penyakit iklim, toksisitas, dan partikulat sekunder.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Trees className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-emerald-300 text-xs">Ecosystem Quality</span>
                  </div>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded font-mono">AoP 2</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-white">
                    {endpoint?.ecosystemQualityPdf.toLocaleString('id-ID') ?? '1,349.46'}
                  </span>
                  <span className="text-xs text-emerald-300 font-mono">PDF·m²·thn</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Fraksi spesies keanekaragaman hayati yang berpotensi hilang (~{endpoint?.speciesYr ?? '1.85e-5'} species·yr).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-amber-300 text-xs">Resource Scarcity</span>
                  </div>
                  <span className="text-[10px] bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded font-mono">AoP 3</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-white">
                    {endpoint?.resourcesSurplusMj.toLocaleString('id-ID') ?? '1,564.64'}
                  </span>
                  <span className="text-xs text-amber-300 font-mono">MJ Surplus</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Biaya energi ekstraksi masa depan untuk menggantikan sumber daya fosil yang dihabiskan.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Inspection Detail Box */}
          {activePathway && (
            <div className={`p-4 rounded-xl border ${activePathway.color} text-xs space-y-2 transition-all`}>
              <div className="flex items-center justify-between font-bold text-white text-xs">
                <span>{activePathway.title}</span>
                <span className="text-[10px] text-slate-300 font-mono">{activePathway.midpoint}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                <strong>Mekanisme Kausalitas:</strong> {activePathway.mechanism}
              </p>
              <div className="space-y-1 pt-1 border-t border-slate-700/50 text-[11px] text-slate-200">
                {activePathway.toEndpoint.map((line, idx) => (
                  <div key={idx} className="font-medium">{line}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
