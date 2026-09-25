'use client';

import React from 'react';
import { BookOpen, ShieldCheck, Scale, Droplet, Sprout, Factory, ExternalLink } from 'lucide-react';
import { DEFAULT_EMISSION_FACTORS } from '@/lib/lca/defaultFactors';

export default function MethodologyPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Transparansi Saintifik & Dasar Standar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Metodologi Perhitungan Life Cycle Assessment (LCA) Kelapa Sawit
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Kajian Cradle-to-Gate disusun merujuk pada standar internasional ISO 14040/14044, pedoman IPCC (2006/2019 Refinement), dan metodologi sertifikasi RSPO PalmGHG v4 & ISPO.
        </p>
      </div>

      {/* 1. System Boundary & Functional Unit */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <h3>1. Batasan Sistem & Satuan Fungsional</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
            <h4 className="font-bold text-white mb-1">Batasan Sistem (System Boundary):</h4>
            <p className="text-slate-400 leading-relaxed">
              <strong>Cradle-to-Gate</strong> mencakup:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
              <li><strong>Upstream (On-Farm):</strong> Produksi dan aplikasi pupuk sintetis, emisi N₂O langsung dan tak langsung, aplikasi urea, pestisida, bahan bakar solar traktor/alat berat, dan oksidasi gambut jika ada.</li>
              <li><strong>Transportasi:</strong> Pengangkutan Tandan Buah Segar (TBS) dari perkebunan menuju PKS.</li>
              <li><strong>Core (Pabrik Kelapa Sawit):</strong> Proses ekstraksi CPO, konsumsi bahan bakar solar boiler auxiliary, dan pengolahan limbah cair POME (kolam terbuka vs penangkap metana).</li>
            </ul>
          </div>

            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-2">
              <h4 className="font-bold text-white mb-1">Satuan Fungsional (Functional Unit - ISO 14044):</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Sistem mendukung konversi matematis dinamis ke dalam 5 satuan fungsional standar:
              </p>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300 font-mono flex justify-between items-center">
                  <span>1. 1 Ton CPO Gerbang PKS (Acuan Baku)</span>
                  <span className="text-[10px] text-slate-400">RSPO / ISO 14044</span>
                </div>
                <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 font-mono flex justify-between items-center">
                  <span>2. 1 kg CPO (Produk Konsumen/Retail)</span>
                  <span className="text-[10px] text-slate-400">GHG Protocol Scope 3</span>
                </div>
                <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 font-mono flex justify-between items-center">
                  <span>3. 1 Ton TBS (Pintu Kebun Hulu)</span>
                  <span className="text-[10px] text-slate-400">ISPO Prinsip 3</span>
                </div>
                <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 font-mono flex justify-between items-center">
                  <span>4. 1 MJ Bioenergi (LHV 37 MJ/kg)</span>
                  <span className="text-[10px] text-slate-400">EU RED II Directive</span>
                </div>
                <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 font-mono flex justify-between items-center">
                  <span>5. 1 Hektar Kebun Sawit / Tahun</span>
                  <span className="text-[10px] text-slate-400">IPCC 2019 AFOLU</span>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* 2. On-Farm Equations */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
          <Sprout className="w-5 h-5" />
          <h3>2. Algoritma Perhitungan Hulu (On-Farm) - IPCC Tier 1 & 2</h3>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          {/* N2O Direct */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">a. Emisi Langsung Dinitrogen Oksida (Direct N₂O)</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">IPCC 2019 Equation 11.1</span>
            </div>
            <p className="text-slate-400">
              Terjadi akibat proses nitrifikasi dan denitrifikasi nitrogen di dalam tanah:
            </p>
            <div className="p-3 bg-slate-900 rounded-lg font-mono text-emerald-300 text-xs overflow-x-auto">
              E_N2O_direct = N_input × EF₁ × (44 / 28) × GWP_N2O
            </div>
            <p className="text-[11px] text-slate-400">
              Keterangan: N_input adalah total N dari Urea (46%), ZA (21%), dan NPK; EF₁ = 0.01 kg N₂O-N/kg N; 44/28 adalah faktor stoikiometri konversi N ke N₂O; GWP_N₂O = 265 (IPCC AR5).
            </p>
          </div>

          {/* N2O Indirect */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">b. Emisi Tak Langsung Dinitrogen Oksida (Indirect N₂O)</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">IPCC 2019 Equation 11.9 & 11.10</span>
            </div>
            <p className="text-slate-400">
              Meliputi volatilisasi amonia (NH₃) ke atmosfer dan pencucian (leaching/runoff) nitrogen ke perairan:
            </p>
            <div className="p-3 bg-slate-900 rounded-lg font-mono text-emerald-300 text-xs overflow-x-auto">
              E_N2O_indirect = [(N_input × Frac_GASF × EF₄) + (N_input × Frac_LEACH × EF₅)] × (44 / 28) × GWP_N2O
            </div>
            <p className="text-[11px] text-slate-400">
              Keterangan: Frac_GASF = 0.10, EF₄ = 0.01; Frac_LEACH = 0.30 (daerah tropis basah), EF₅ = 0.0075 kg N₂O-N/kg N leached.
            </p>
          </div>

          {/* Urea CO2 */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">c. Emisi Karbon Dioksida dari Aplikasi Urea</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">IPCC 2006 Vol. 4 Ch. 11</span>
            </div>
            <p className="text-slate-400">
              Hidrolisis urea melepaskan molekul karbon dioksida: CO(NH₂)₂ + H₂O → 2 NH₃ + CO₂:
            </p>
            <div className="p-3 bg-slate-900 rounded-lg font-mono text-emerald-300 text-xs overflow-x-auto">
              E_urea_CO2 = Dosis_Urea (kg) × 0.20 × (44 / 12) = Dosis_Urea × 0.7333 kg CO₂
            </div>
          </div>

          {/* Peat Oxidation */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">d. Oksidasi Lahan Gambut Terdrainase (Peat Soil Oxidation)</span>
              <span className="text-[10px] text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800">RSPO PalmGHG / IPCC Wetlands</span>
            </div>
            <p className="text-slate-400">
              Lahan gambut tropis yang dikeringkan mengalami dekomposisi mikroba terus menerus:
            </p>
            <div className="p-3 bg-slate-900 rounded-lg font-mono text-rose-300 text-xs overflow-x-auto">
              E_gambut = (%_Gambut / 100) × 55.0 ton CO₂ / ha / tahun
            </div>
          </div>
        </div>
      </div>

      {/* 3. POME Equations */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
          <Droplet className="w-5 h-5" />
          <h3>3. Pengolahan Limbah POME & Penangkapan Gas Metana (CH₄)</h3>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-2">
            <h4 className="font-bold text-white">Potensi Pembangkitan Gas Metana dari POME</h4>
            <p className="text-slate-400">
              Berdasarkan beban Chemical Oxygen Demand (COD) per ton TBS:
            </p>
            <div className="p-3 bg-slate-900 rounded-lg font-mono text-emerald-300 text-xs overflow-x-auto">
              COD_total (kg) = Rasio_POME (m³/t TBS) × [Konsentrasi_COD (mg/L) / 1000]
              <br />
              CH₄_potensial (kg) = COD_total × B₀ (0.25 kg CH₄ / kg COD)
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/40">
                <span className="font-bold text-rose-300 block mb-1">1. Kolam Terbuka</span>
                <p className="text-slate-400">
                  CH₄_emitted = CH₄_potensial × MCF (0.80)
                  <br />
                  GWP_CH₄ = 28 kg CO₂e/kg CH₄.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40">
                <span className="font-bold text-amber-300 block mb-1">2. Methane Flaring</span>
                <p className="text-slate-400">
                  CH₄ ditangkap (η = 90%) dan dibakar flare menjadi CO₂ biogenik (netral). Hanya 10% sisa fugitif terhitung.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
                <span className="font-bold text-emerald-300 block mb-1">3. Biogas to Power (PLTBg)</span>
                <p className="text-slate-400">
                  CH₄ menghasilkan listrik (~3.5 kWh/m³). Listrik yang diekspor mensubstitusi grid PLN (kredit -0.78 kg CO₂e/kWh).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ISO 14044 Allocation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
          <Scale className="w-5 h-5" />
          <h3>4. Aturan Alokasi Produk Bersama (ISO 14044 Co-Product Allocation)</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Pabrik Kelapa Sawit menghasilkan Crude Palm Oil (CPO) dan Palm Kernel (PK). Berdasarkan klausul ISO 14044 Bagian 4.3.4, alokasi dilakukan dengan membagi total emisi hulu dan pabrik berdasarkan proporsi energi atau fisik produk:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700">
            <span className="font-bold text-white block mb-1">Alokasi Energi (LHV)</span>
            <div className="font-mono text-emerald-400 text-[11px] mb-2">
              f_CPO = (OER × LHV_CPO) / (OER × LHV_CPO + KER × LHV_PK)
            </div>
            <p className="text-slate-400 text-[11px]">
              Standar baku RSPO PalmGHG dan RED II (LHV CPO = 37.0 MJ/kg, PK = 24.0 MJ/kg).
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700">
            <span className="font-bold text-white block mb-1">Alokasi Massa</span>
            <div className="font-mono text-amber-400 text-[11px] mb-2">
              f_CPO = OER / (OER + KER)
            </div>
            <p className="text-slate-400 text-[11px]">
              Berdasarkan bobot kering rendemen fisik CPO dan Kernel yang dihasilkan per ton TBS.
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700">
            <span className="font-bold text-white block mb-1">Alokasi Ekonomi</span>
            <div className="font-mono text-cyan-400 text-[11px] mb-2">
              f_CPO = (OER × P_CPO) / (OER × P_CPO + KER × P_PK)
            </div>
            <p className="text-slate-400 text-[11px]">
              Berdasarkan nilai moneter pendapatan pasar ($/ton) dari penjualan CPO dan Kernel.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Default Emission Factors Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-semibold text-white">
          5. Pustaka Faktor Emisi Baku yang Digunakan
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">Parameter / Faktor Emisi</th>
                <th className="py-2.5 px-3">Nilai</th>
                <th className="py-2.5 px-3">Satuan</th>
                <th className="py-2.5 px-3 rounded-r-lg">Sumber Referensi Ilmiah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2 px-3 font-semibold text-white">Global Warming Potential CH₄ (GWP₁₀₀)</td>
                <td className="py-2 px-3 font-mono text-emerald-400">{DEFAULT_EMISSION_FACTORS.gwpCH4}</td>
                <td className="py-2 px-3 text-slate-400">kg CO₂eq / kg CH₄</td>
                <td className="py-2 px-3 text-slate-400">IPCC Fifth Assessment Report (AR5)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-white">Global Warming Potential N₂O (GWP₁₀₀)</td>
                <td className="py-2 px-3 font-mono text-emerald-400">{DEFAULT_EMISSION_FACTORS.gwpN2O}</td>
                <td className="py-2 px-3 text-slate-400">kg CO₂eq / kg N₂O</td>
                <td className="py-2 px-3 text-slate-400">IPCC Fifth Assessment Report (AR5)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-white">EF Langsung N₂O Pupuk N Sintetis (EF₁)</td>
                <td className="py-2 px-3 font-mono text-emerald-400">{DEFAULT_EMISSION_FACTORS.efDirectN2O}</td>
                <td className="py-2 px-3 text-slate-400">kg N₂O-N / kg N</td>
                <td className="py-2 px-3 text-slate-400">IPCC 2019 Refinement Tier 1</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-white">Emisi CO₂ Hidrolisis Urea</td>
                <td className="py-2 px-3 font-mono text-emerald-400">{DEFAULT_EMISSION_FACTORS.efUreaCO2}</td>
                <td className="py-2 px-3 text-slate-400">kg CO₂ / kg urea</td>
                <td className="py-2 px-3 text-slate-400">IPCC 2006 Tier 1</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-white">Oksidasi Dekomposisi Gambut</td>
                <td className="py-2 px-3 font-mono text-emerald-400">{DEFAULT_EMISSION_FACTORS.efPeatOxidationTonCo2PerHa}</td>
                <td className="py-2 px-3 text-slate-400">ton CO₂ / ha / tahun</td>
                <td className="py-2 px-3 text-slate-400">RSPO PalmGHG / IPCC Wetlands</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-white">Bahan Bakar Solar Traktor & Truk (WTW)</td>
                <td className="py-2 px-3 font-mono text-emerald-400">{DEFAULT_EMISSION_FACTORS.efDieselCombustionKgCo2PerL}</td>
                <td className="py-2 px-3 text-slate-400">kg CO₂eq / Liter</td>
                <td className="py-2 px-3 text-slate-400">Well-to-Wheel (WTW) RSPO PalmGHG</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-white">Pengangkutan Truk TBS ke PKS</td>
                <td className="py-2 px-3 font-mono text-emerald-400">{DEFAULT_EMISSION_FACTORS.efTransportTruckTkmKgCo2}</td>
                <td className="py-2 px-3 text-slate-400">kg CO₂eq / ton·km</td>
                <td className="py-2 px-3 text-slate-400">Ecoinvent 3.8 / PalmGHG</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-white">Pembangkitan CH₄ Maksimum POME (B₀)</td>
                <td className="py-2 px-3 font-mono text-emerald-400">{DEFAULT_EMISSION_FACTORS.boMaxMethaneYieldKgCh4PerKgCod}</td>
                <td className="py-2 px-3 text-slate-400">kg CH₄ / kg COD</td>
                <td className="py-2 px-3 text-slate-400">IPCC Wastewater Guidelines</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-white">Kredit Substitusi Grid Listrik Nasional</td>
                <td className="py-2 px-3 font-mono text-emerald-400">{DEFAULT_EMISSION_FACTORS.efGridDisplacementKgCo2PerKwh}</td>
                <td className="py-2 px-3 text-slate-400">kg CO₂eq / kWh</td>
                <td className="py-2 px-3 text-slate-400">Faktor Emisi Jaringan PLN / RUPTL</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. ReCiPe 2016 Endpoint Damage Factors */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-semibold text-white">
          6. Faktor Kerusakan Endpoint (Damage Factors ReCiPe 2016 H)
        </h3>
        <p className="text-xs text-slate-300">
          Mengagregasikan 5 kategori dampak Midpoint menjadi 3 Area Perlindungan (Area of Protection - AoP) tingkat kerusakan mutlak:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2 px-3 rounded-l-lg">Area of Protection (AoP)</th>
                <th className="py-2 px-3">Satuan Endpoint</th>
                <th className="py-2 px-3">Dampak Midpoint Terkait</th>
                <th className="py-2 px-3 rounded-r-lg">Faktor Kerusakan (ReCiPe 2016 H)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
              <tr>
                <td className="py-2 px-3 font-semibold text-rose-300 font-sans">Human Health</td>
                <td className="py-2 px-3 text-white">DALY</td>
                <td className="py-2 px-3 text-slate-400 font-sans">Global Warming (GWP)</td>
                <td className="py-2 px-3 text-rose-400">9.28 × 10⁻⁷ DALY / kg CO₂-eq</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-rose-300 font-sans">Human Health</td>
                <td className="py-2 px-3 text-white">DALY</td>
                <td className="py-2 px-3 text-slate-400 font-sans">Acidification (AP)</td>
                <td className="py-2 px-3 text-rose-400">6.29 × 10⁻⁷ DALY / kg SO₂-eq</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-rose-300 font-sans">Human Health</td>
                <td className="py-2 px-3 text-white">DALY</td>
                <td className="py-2 px-3 text-slate-400 font-sans">Human Toxicity</td>
                <td className="py-2 px-3 text-rose-400">3.32 × 10⁻⁶ DALY / kg 1,4-DCB eq</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-emerald-300 font-sans">Ecosystem Quality</td>
                <td className="py-2 px-3 text-white">PDF·m²·yr</td>
                <td className="py-2 px-3 text-slate-400 font-sans">Global Warming (GWP)</td>
                <td className="py-2 px-3 text-emerald-400">0.204 PDF·m²·yr / kg CO₂-eq</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-emerald-300 font-sans">Ecosystem Quality</td>
                <td className="py-2 px-3 text-white">PDF·m²·yr</td>
                <td className="py-2 px-3 text-slate-400 font-sans">Land Use Occupation</td>
                <td className="py-2 px-3 text-emerald-400">0.620 PDF·m²·yr / m²·yr</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-amber-300 font-sans">Resource Scarcity</td>
                <td className="py-2 px-3 text-white">Surplus Energy (MJ)</td>
                <td className="py-2 px-3 text-slate-400 font-sans">Fossil Diesel Fuel</td>
                <td className="py-2 px-3 text-amber-400">42.0 MJ / Liter solar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
