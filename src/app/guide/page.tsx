'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  HelpCircle,
  Factory,
  Leaf,
  Recycle,
  GitCompare,
  ShieldCheck,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Zap,
  Droplets,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'modules' | 'examples' | 'dictionary' | 'faq'>('quickstart');

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 px-2 sm:px-4">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Buku Panduan Pengguna &amp; Studi Kasus Operasional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Panduan Lengkap Penggunaan Palm-LCA Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manual terpadu pengoperasian aplikasi Life Cycle Assessment (LCA) kelapa sawit Cradle-to-Gate, simulasi interaktif, interpretasi dampak ReCiPe 2016, hingga penerbitan laporan resmi audit ISO 14040/14044.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/calculator"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950"
          >
            <span>Mulai Simulasi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 gap-1 sm:gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('quickstart')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'quickstart'
              ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>1. Alur Kerja Singkat (Quickstart)</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'modules'
              ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Panduan Modul Fitur</span>
        </button>

        <button
          onClick={() => setActiveTab('examples')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'examples'
              ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>3. Contoh Kasus Nyata (Studi Kasus)</span>
        </button>

        <button
          onClick={() => setActiveTab('dictionary')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'dictionary'
              ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>4. Kamus Parameter &amp; Satuan</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'faq'
              ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>5. FAQ &amp; Standar Audit</span>
        </button>
      </div>

      {/* TAB 1: QUICKSTART WORKFLOW */}
      {activeTab === 'quickstart' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Standar Operasional Prosedur (SOP) Kajian LCA 6 Langkah</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Untuk menghasilkan kajian LCA yang valid dan dapat dipertanggungjawabkan saat audit sertifikasi (RSPO PalmGHG, ISPO, ISCC, maupun uji tuntas EUDR), ikuti alur kerja 6 langkah sistematis berikut:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {/* Step 1 */}
              <div className="border border-slate-700/70 bg-slate-800/50 rounded-xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs flex items-center justify-center font-bold">1</span>
                  <span className="text-[10px] text-slate-400 font-mono">Data Lapangan</span>
                </div>
                <h3 className="font-bold text-sm text-white">Inventori Data (LCI)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kumpulkan data riil tahun buku: tonase TBS, pemakaian pupuk (Urea, ZA, NPK), solar traktor &amp; armada truk, kapasitas olah PKS, OER/KER, dan metode kolam POME.
                </p>
                <div className="text-[11px] text-emerald-400 font-medium pt-1">
                  Output: Buku Neraca Massa &amp; Energi
                </div>
              </div>

              {/* Step 2 */}
              <div className="border border-slate-700/70 bg-slate-800/50 rounded-xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs flex items-center justify-center font-bold">2</span>
                  <span className="text-[10px] text-slate-400 font-mono">Simulasi Real-Time</span>
                </div>
                <h3 className="font-bold text-sm text-white">Input ke Kalkulator LCA</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Buka menu <strong>Kalkulator LCA</strong> (<code className="text-emerald-400">/calculator</code>). Masukkan data kebun hulu dan pabrik PKS. Parameter akan dikalkulasi seketika tanpa perlu reload.
                </p>
                <div className="text-[11px] text-emerald-400 font-medium pt-1">
                  Fitur: Validasi input &amp; nilai default tipikal
                </div>
              </div>

              {/* Step 3 */}
              <div className="border border-slate-700/70 bg-slate-800/50 rounded-xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs flex items-center justify-center font-bold">3</span>
                  <span className="text-[10px] text-slate-400 font-mono">LCIA ReCiPe 2016</span>
                </div>
                <h3 className="font-bold text-sm text-white">Analisis Dampak Lingkungan</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cek <strong>Dashboard Utama</strong> (<code className="text-emerald-400">/</code>). Pelajari jejak karbon (Net GWP), breakdown On-farm vs Pabrik, Midpoint 5 kategori, dan Endpoint 3 AoP (Kesehatan, Ekosistem, Sumber Daya).
                </p>
                <div className="text-[11px] text-emerald-400 font-medium pt-1">
                  Fitur: Hotspot Chart &amp; Grade RSPO
                </div>
              </div>

              {/* Step 4 */}
              <div className="border border-slate-700/70 bg-slate-800/50 rounded-xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs flex items-center justify-center font-bold">4</span>
                  <span className="text-[10px] text-slate-400 font-mono">Sirkularitas &amp; EROI</span>
                </div>
                <h3 className="font-bold text-sm text-white">Ukur Nilai Tambah &amp; Standar</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Buka menu <strong>Sirkularitas &amp; EROI</strong> (<code className="text-emerald-400">/sustainability</code>). Evaluasi skor CEI pemanfaatan TKKS/POME, rasio bioenergi EROI, indeks SDI (0-100), dan kepatuhan ISPO/RSPO.
                </p>
                <div className="text-[11px] text-emerald-400 font-medium pt-1">
                  Fitur: Interactive Sensitivity Sliders
                </div>
              </div>

              {/* Step 5 */}
              <div className="border border-slate-700/70 bg-slate-800/50 rounded-xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs flex items-center justify-center font-bold">5</span>
                  <span className="text-[10px] text-slate-400 font-mono">Benchmarking</span>
                </div>
                <h3 className="font-bold text-sm text-white">Simulasi Skenario Dekarbonisasi</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Buka <strong>Komparasi Skenario</strong> (<code className="text-emerald-400">/scenarios</code>). Bandingkan skenario eksisting terhadap alternatif intervensi teknologi (misal: penambahan Methane Capture PLTBg).
                </p>
                <div className="text-[11px] text-emerald-400 font-medium pt-1">
                  Fitur: Matriks perbandingan multi-skenario
                </div>
              </div>

              {/* Step 6 */}
              <div className="border border-slate-700/70 bg-slate-800/50 rounded-xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs flex items-center justify-center font-bold">6</span>
                  <span className="text-[10px] text-slate-400 font-mono">Formal Publishing</span>
                </div>
                <h3 className="font-bold text-sm text-white">Terbitkan Laporan Akhir Resmi</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Buka <strong>Laporan Akhir</strong> (<code className="text-emerald-400">/report</code>). Masukkan nama perusahaan dan auditor, lalu cetak ke PDF atau ekspor ke file CSV/JSON untuk lampiran audit sertifikasi.
                </p>
                <div className="text-[11px] text-emerald-400 font-medium pt-1">
                  Fitur: 12 Bab ISO 14044 &amp; Segel Verifikasi
                </div>
              </div>
            </div>
          </div>

          {/* System Boundary Reminder Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Memahami Batasan Sistem Kajian (Cradle-to-Gate Boundary)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              Kajian LCA ini berfokus pada tahapan produksi hulu hingga gerbang pabrik (*Cradle-to-Gate*). Seluruh beban emisi dan kredit karbon dikaitkan dengan satuan fungsional utama <strong>1 Ton Crude Palm Oil (CPO)</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50 space-y-1">
                <span className="font-bold text-emerald-400 block">1. Hulu (On-Farm / Kebun)</span>
                <p className="text-[11px] text-slate-400">
                  Mencakup pembibitan, pemupukan kimia, emisi N₂O langsung dan tidak langsung, herbisida, konsumsi solar traktor kebun, serta emisi dekomposisi gambut.
                </p>
              </div>
              <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50 space-y-1">
                <span className="font-bold text-blue-400 block">2. Logistik Transportasi TBS</span>
                <p className="text-[11px] text-slate-400">
                  Pengangkutan Tandan Buah Segar (TBS) dari Tempat Pengumpulan Hasil (TPH) ke loading ramp PKS dengan armada truk diesel (asumsi kapasitas muat 8-10 ton).
                </p>
              </div>
              <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50 space-y-1">
                <span className="font-bold text-teal-400 block">3. Inti Pabrik PKS &amp; POME</span>
                <p className="text-[11px] text-slate-400">
                  Sterilisasi uap, pengepresan CPO, pengeringan, pengolahan limbah cair (POME), kogenerasi uap boiler biomassa, serta pemanfaatan biogas PLTBg.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODULES GUIDE */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Module 1 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="text-base font-bold text-white">
                  Dashboard Utama (<Link href="/" className="text-emerald-400 hover:underline">/ </Link>)
                </h3>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
                Executive Monitoring
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dashboard utama memberikan ikhtisar menyeluruh terhadap kinerja lingkungan rantai pasok CPO. Komponen utama pada halaman ini meliputi:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-2">
              <li><strong>KPI Banner Atas:</strong> Jejak karbon bersih (Net GWP), emisi per kg CPO, emisi per ton TBS, dan peringkat RSPO (Grade A+ hingga D).</li>
              <li><strong>Grafik Tahapan Siklus Hidup:</strong> Visualisasi kontribusi emisi kotor vs kredit emisi terhindar (biogas grid &amp; mulching TKKS).</li>
              <li><strong>Hotspot Emisi Terperinci:</strong> Mengidentifikasi sumber penyumbang emisi terbesar (misal: metana POME atau emisi N₂O pupuk).</li>
              <li><strong>Bilah ReCiPe 2016 Midpoint &amp; Endpoint:</strong> Tombol tab interaktif untuk beralih antara 5 dampak tingkat masalah lingkungan (Midpoint) dan 3 dampak kerusakan aktual (Endpoint AoP).</li>
            </ul>
          </div>

          {/* Module 2 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-white">
                  Kalkulator Parameter LCA (<Link href="/calculator" className="text-emerald-400 hover:underline">/calculator</Link>)
                </h3>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
                Simulation Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Merupakan pusat input data operasional dinamis. Anda dapat mengubah parameter di bawah ini secara langsung:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-1">
                <span className="font-bold text-emerald-400 block">Input Perkebunan (On-Farm):</span>
                <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px]">
                  <li>Produktivitas TBS (Ton/Ha/Tahun)</li>
                  <li>Luas Areal &amp; Persentase Lahan Gambut (%)</li>
                  <li>Dosis Pupuk Kimia: Urea (46% N), ZA (21% N), NPK (15-15-15)</li>
                  <li>Konsumsi Bahan Bakar Solar Traktor &amp; Dosis Herbisida</li>
                  <li>Jarak Tempuh Transportasi TBS ke Pabrik (km)</li>
                  <li>Dosis Pemulsaan Tandan Kosong Sawit / Mulching TKKS</li>
                </ul>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-1">
                <span className="font-bold text-teal-400 block">Input Pabrik Kelapa Sawit (PKS):</span>
                <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px]">
                  <li>Kapasitas Olah Tahunan &amp; Rendemen Minyak (OER &amp; KER)</li>
                  <li>Volume Limbah Cair POME (m³/ton TBS) &amp; Kandungan COD (mg/L)</li>
                  <li>Metode Olah POME: Kolam Terbuka vs Biogas Flare vs Biogas to Power (PLTBg)</li>
                  <li>Efisiensi Penangkapan Metana &amp; Porsi Ekspor Daya ke Jaringan PLN (%)</li>
                  <li>Konsumsi Solar Start-up Boiler &amp; Ekspor Listrik Biomassa Padat</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Module 3 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-white">
                  Sirkularitas, EROI &amp; Standar ISPO/RSPO (<Link href="/sustainability" className="text-emerald-400 hover:underline">/sustainability</Link>)
                </h3>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
                Value-Addition
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mengevaluasi nilai tambah strategis di luar sekadar jejak emisi GRK konvensional:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-2">
              <li><strong>Circular Economy Index (CEI):</strong> Mengukur persentase sirkularitas limbah padat (TKKS mulching, serat boiler, cangkang ekspor) dan limbah cair POME. Dilengkapi klasifikasi Tier (Regenerative, Advanced, Transitional, Linear).</li>
              <li><strong>Neraca Energi &amp; EROI (Energy Return on Investment):</strong> Membandingkan input fosil (pupuk, solar) vs bioenergi terbarukan yang dihasilkan (boiler kogenerasi, listrik biogas PLTBg, CPO/PK). Menghitung kemandirian energi PKS (Swasembada Daya %).</li>
              <li><strong>Sustainable Development Index (SDI):</strong> Indeks komposit multidimensi (0–100) dari 4 pilar: Iklim (30%), Sirkularitas (25%), Energi (25%), dan Lahan (20%).</li>
              <li><strong>Matriks Kepatuhan Standar ISPO &amp; RSPO:</strong> Tabel audit per kriteria operasional, lengkap dengan gap analysis dan aksi korektif.</li>
            </ul>
          </div>

          {/* Module 4 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h3 className="text-base font-bold text-white">
                  Komparasi Skenario Industri (<Link href="/scenarios" className="text-emerald-400 hover:underline">/scenarios</Link>)
                </h3>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
                Decision Support
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Membandingkan berbagai profil pabrik dan strategi dekarbonisasi secara berdampingan. Anda dapat membandingkan:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-2">
              <li>Skenario Standar (Baseline Kolam Terbuka)</li>
              <li>Skenario PKS Hijau (Methane Capture PLTBg + Mulching TKKS)</li>
              <li>Skenario Kebun Gambut (Dampak Drainase Lahan Gambut terhadap Jejak Karbon)</li>
              <li>Skenario Biogas Flaring Sederhana</li>
            </ul>
          </div>

          {/* Module 5 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <h3 className="text-base font-bold text-white">
                  Laporan Akhir Kajian Resmi (<Link href="/report" className="text-emerald-400 hover:underline">/report</Link>)
                </h3>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
                Audit Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Menghasilkan dokumen resmi cetak 12 Bab berstandar ISO 14040/14044 yang memuat data legalitas perusahaan, inventori LCI, hasil karakterisasi LCIA Midpoint &amp; Endpoint, analisis sirkularitas CEI, neraca EROI, sensitivitas alokasi multi-output (Energi LHV vs Massa vs Ekonomi), matriks ISPO/RSPO, roadmap dekarbonisasi, serta lembar pengesahan auditor.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800 font-mono">
                <Printer className="w-3.5 h-3.5" /> Cetak / Save PDF
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800 font-mono">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Ekspor Excel / CSV
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CASE EXAMPLES */}
      {activeTab === 'examples' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Factory className="w-5 h-5 text-emerald-400" />
              <span>Studi Kasus 1: PKS Konvensional Tanpa Penangkapan Biogas (Baseline Industri)</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kondisi tipikal pabrik kelapa sawit konvensional di Indonesia yang mengoperasikan kolam anaerobik terbuka untuk limbah cair POME tanpa fasilitas penangkap metana:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                <span className="font-bold text-amber-400 block">Parameter Input Lapangan:</span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li>• Produktivitas TBS: <strong>22 Ton / Ha / Tahun</strong></li>
                  <li>• Proporsi Lahan Gambut: <strong>0% (100% Tanah Mineral)</strong></li>
                  <li>• Pupuk Kimia: Urea 250 kg/ha, ZA 100 kg/ha, NPK 300 kg/ha</li>
                  <li>• Konsumsi Solar Traktor: 45 Liter / Ha / Tahun</li>
                  <li>• Jarak Angkut TBS: 25 km (Truk Diesel 8-10 ton)</li>
                  <li>• Rendemen CPO (OER): <strong>22.0%</strong> | Rendemen Inti (KER): <strong>5.0%</strong></li>
                  <li>• Metode Olah POME: <strong className="text-rose-400">OPEN_LAGOON (Kolam Terbuka)</strong></li>
                  <li>• Penangkapan Metana: <strong>0% (Efisiensi 0)</strong></li>
                  <li>• Aplikasi Pemulsaan TKKS: <strong>0 Ton/Ha (Dibuang ke TPA)</strong></li>
                </ul>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                <span className="font-bold text-emerald-400 block">Hasil Simulasi &amp; Penilaian Kinerja:</span>
                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>Net GWP (Jejak Karbon Bersih):</span>
                    <span className="font-mono font-bold text-rose-400">814.16 kg CO₂e / ton CPO</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>Peringkat RSPO PalmGHG:</span>
                    <span className="font-bold text-amber-400">Grade B (Transisional)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>Hotspot Emisi Terbesar:</span>
                    <span className="text-rose-300 font-medium">Metana POME (50.7% kontribusi)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>Circular Economy Index (CEI):</span>
                    <span className="font-mono font-bold text-amber-400">68.3% (Tier 3 - Transitional)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>EROI Bioenergi Total:</span>
                    <span className="font-mono font-bold text-emerald-400">9.77 : 1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skor Komposit SDI:</span>
                    <span className="font-mono font-bold text-amber-400">72 / 100 (Gold)</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 italic">
                  *Rekomendasi Auditor: Segera pasang penutup biogas (covered lagoon) untuk mencegah pelepasan metana bebas dan menaikkan grade ke A+.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Studi Kasus 2: PKS Hijau Terintegrasi (Methane Capture PLTBg &amp; Mulching TKKS)</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kondisi pabrik sawit ramah lingkungan yang telah menerapkan prinsip ekonomi sirkular penuh dan valorisasi bioenergi:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                <span className="font-bold text-teal-400 block">Parameter Intervensi Teknologi:</span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li>• Produktivitas TBS: <strong>24 Ton / Ha / Tahun</strong></li>
                  <li>• Pemulsaan TKKS (Mulching): <strong className="text-emerald-400">20 Ton / Ha / Tahun</strong></li>
                  <li>• Reduksi Dosis Pupuk Kimia: Urea hemat 15%, NPK hemat 20%</li>
                  <li>• Metode Olah POME: <strong className="text-emerald-400">BIOGAS_TO_POWER (PLTBg)</strong></li>
                  <li>• Efisiensi Penangkapan Metana: <strong>90%</strong></li>
                  <li>• Ekspor Listrik Biogas ke Grid PLN: <strong>75%</strong></li>
                  <li>• Ekspor Listrik Biomassa Serat/Cangkang: <strong>12 kWh / ton TBS</strong></li>
                </ul>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                <span className="font-bold text-emerald-400 block">Hasil Simulasi &amp; Dampak Mitigasi:</span>
                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>Net GWP (Jejak Karbon Bersih):</span>
                    <span className="font-mono font-bold text-emerald-400">372.50 kg CO₂e / ton CPO</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>Reduksi Emisi vs Baseline:</span>
                    <span className="font-bold text-emerald-400">-54.2% Reduksi Drastis</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>Peringkat RSPO PalmGHG:</span>
                    <span className="font-bold text-emerald-400">Grade A+ (Leader Keberlanjutan)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>Circular Economy Index (CEI):</span>
                    <span className="font-mono font-bold text-emerald-400">95.2% (Tier 1 - Regenerative)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>Kemandirian Listrik PKS:</span>
                    <span className="font-mono font-bold text-emerald-400">224.9% (Surplus Ekspor Grid)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skor Komposit SDI:</span>
                    <span className="font-mono font-bold text-emerald-400">92 / 100 (Platinum)</span>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-400 pt-1">
                  *Status Audit: Memenuhi seluruh persyaratan EU RED II, lolos verifikasi sertifikasi RSPO PalmGHG dan audit ISPO Prinsip 3 &amp; 5 tanpa catatan temuan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Studi Kasus 3: Perkebunan dengan Sebagian Lahan Gambut (Analisis Risiko EUDR)</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kondisi kebun sawit yang memiliki areal tanah gambut terhidrolisis/terdrainase:
            </p>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-rose-400 font-bold block mb-1">Karakteristik Areal:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Proporsi Lahan Gambut: <strong>15% dari total luas kebun</strong>. Faktor emisi oksidasi tanah gambut tropis terdrainase: <strong>55 Ton CO₂ / Ha gambut / Tahun</strong> (pedoman IPCC 2014 Peatland Supplement / IPCC 2019 Refinement).
                  </p>
                </div>
                <div>
                  <span className="text-rose-400 font-bold block mb-1">Dampak terhadap Jejak Karbon:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Emisi oksidasi gambut menyumbang tambahan <strong>+1,875 kg CO₂e / ton CPO</strong>. Total Net GWP melonjak hingga <strong>&gt;2,600 kg CO₂e / ton CPO</strong>, menjatuhkan peringkat ke <strong>Grade D (Kritis)</strong> dan berisiko tinggi gagal memenuhi regulasi bebas deforestasi EUDR serta kriteria ISPO.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PARAMETER DICTIONARY */}
      {activeTab === 'dictionary' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Kamus Parameter Operasional, Nilai Default &amp; Satuan Internasional</span>
          </h2>
          <p className="text-xs text-slate-300">
            Daftar parameter yang digunakan dalam kalkulasi model matematika rantai pasok kelapa sawit:
          </p>

          <div className="border border-slate-800 rounded-xl overflow-hidden shadow-sm text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-800/80 font-bold text-slate-200 text-[11px]">
                <tr>
                  <th className="p-3 border-b border-slate-700">Nama Parameter</th>
                  <th className="p-3 border-b border-slate-700">Simbol / Kode</th>
                  <th className="p-3 border-b border-slate-700">Satuan</th>
                  <th className="p-3 border-b border-slate-700">Nilai Tipikal Industri</th>
                  <th className="p-3 border-b border-slate-700">Keterangan Metodologis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
                <tr>
                  <td className="p-3 font-semibold text-white">Produktivitas TBS (Yield)</td>
                  <td className="p-3 font-mono text-emerald-400">ffbYieldPerHa</td>
                  <td className="p-3 font-mono">Ton / Ha / Thn</td>
                  <td className="p-3 font-bold text-white">20 – 26</td>
                  <td className="p-3 text-slate-400">Rata-rata nasional kebun TM dewasa</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Rendemen Minyak Sawit</td>
                  <td className="p-3 font-mono text-emerald-400">oer</td>
                  <td className="p-3 font-mono">% (Desimal)</td>
                  <td className="p-3 font-bold text-white">20.0% – 24.0%</td>
                  <td className="p-3 text-slate-400">Oil Extraction Rate ke gerbang PKS</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Rendemen Inti Sawit</td>
                  <td className="p-3 font-mono text-emerald-400">ker</td>
                  <td className="p-3 font-mono">% (Desimal)</td>
                  <td className="p-3 font-bold text-white">4.5% – 6.0%</td>
                  <td className="p-3 text-slate-400">Kernel Extraction Rate produk bersama (co-product)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Rasio Produksi Limbah POME</td>
                  <td className="p-3 font-mono text-emerald-400">pomeRatio</td>
                  <td className="p-3 font-mono">m³ / Ton TBS</td>
                  <td className="p-3 font-bold text-white">0.60 – 0.70</td>
                  <td className="p-3 text-slate-400">Setara 2.7 – 3.2 m³ POME per ton CPO</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Beban Organik COD POME</td>
                  <td className="p-3 font-mono text-emerald-400">pomeCod</td>
                  <td className="p-3 font-mono">mg / L</td>
                  <td className="p-3 font-bold text-white">45,000 – 60,000</td>
                  <td className="p-3 text-slate-400">Potensi metana anaerobik B₀ = 0.25 kg CH₄/kg COD</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Dosis Urea (46% Nitrogen)</td>
                  <td className="p-3 font-mono text-emerald-400">ureaKgPerHa</td>
                  <td className="p-3 font-mono">kg / Ha / Thn</td>
                  <td className="p-3 font-bold text-white">200 – 300</td>
                  <td className="p-3 text-slate-400">Memicu emisi N₂O langsung dan hidrolisis CO₂</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Dosis ZA (21% Nitrogen)</td>
                  <td className="p-3 font-mono text-emerald-400">zaKgPerHa</td>
                  <td className="p-3 font-mono">kg / Ha / Thn</td>
                  <td className="p-3 font-bold text-white">100 – 150</td>
                  <td className="p-3 text-slate-400">Ammonium sulfat penyumbang pengasaman tanah (AP)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Dosis NPK Majemuk (15-15-15)</td>
                  <td className="p-3 font-mono text-emerald-400">npkKgPerHa</td>
                  <td className="p-3 font-mono">kg / Ha / Thn</td>
                  <td className="p-3 font-bold text-white">250 – 400</td>
                  <td className="p-3 text-slate-400">Penyuplai N, fosfat (EP air tawar), dan kalium</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Pemulsaan Organik TKKS</td>
                  <td className="p-3 font-mono text-emerald-400">efbMulch</td>
                  <td className="p-3 font-mono">Ton / Ha / Thn</td>
                  <td className="p-3 font-bold text-white">15 – 30</td>
                  <td className="p-3 text-slate-400">Memberikan kredit emisi pengganti pupuk K sintetis</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Faktor Emisi Grid Listrik PLN</td>
                  <td className="p-3 font-mono text-emerald-400">gridFactor</td>
                  <td className="p-3 font-mono">kg CO₂e / kWh</td>
                  <td className="p-3 font-bold text-white">0.78 – 0.85</td>
                  <td className="p-3 text-slate-400">Faktor emisi marjinal grid fosil Indonesia (PLN)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: FAQ & AUDIT */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <span>Pertanyaan yang Sering Diajukan (FAQ) Terkait Audit &amp; Kepatuhan</span>
            </h2>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
                <h3 className="font-bold text-emerald-400 text-sm">
                  1. Apakah hasil perhitungan portal ini diakui dalam sertifikasi RSPO dan ISPO?
                </h3>
                <p className="text-slate-400 leading-relaxed text-justify">
                  <strong>Ya.</strong> Seluruh formula matematika mengadopsi metodologi baku <strong>RSPO PalmGHG Calculator v4</strong>, pedoman inventori gas rumah kaca <strong>IPCC 2019 Refinement</strong>, dan peraturan menteri pertanian mengenai <strong>ISPO (Permentan No. 38/2020)</strong>. Format Laporan Akhir pada portal ini disusun khusus agar siap diserahkan kepada lembaga sertifikasi terakreditasi ISO/IEC 17020 / 17065.
                </p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
                <h3 className="font-bold text-emerald-400 text-sm">
                  2. Bagaimana metode pembagian beban emisi antara CPO dan Palm Kernel (PK)?
                </h3>
                <p className="text-slate-400 leading-relaxed text-justify">
                  Sesuai klausul 4.3.4 standar baku <strong>ISO 14044:2006</strong>, sistem mengadopsi <strong>Alokasi Kandungan Energi (Lower Heating Value / LHV)</strong> sebagai acuan dasar (CPO ~78.5% dan PK ~21.5%). Namun, pada Bab 9 Laporan Akhir, portal ini juga menyediakan uji sensitivitas perbandingan menggunakan <strong>Alokasi Massa Kering</strong> dan <strong>Alokasi Nilai Pendapatan Ekonomi Pasar</strong> untuk memenuhi kebutuhan berbagai macam pembeli internasional (misalnya pasar biofuel Uni Eropa RED II vs pasar oleokimia Amerika).
                </p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
                <h3 className="font-bold text-emerald-400 text-sm">
                  3. Apa perbedaan dampak Midpoint dan Endpoint pada modul ReCiPe 2016?
                </h3>
                <p className="text-slate-400 leading-relaxed text-justify">
                  <strong>Midpoint</strong> mengukur besaran masalah lingkungan di titik tengah rantai sebab-akibat (misal: berapa kg CO₂e gas rumah kaca penyebab perubahan iklim, atau berapa kg SO₂e penyebab pengasaman tanah). Sedangkan <strong>Endpoint</strong> mengukur kerusakan akhir (*damage*) pada tiga Area Proteksi Universal (AoP):
                  <br />• <em>Human Health:</em> Hilangnya tahun hidup sehat (satuan DALY atau mDALY).
                  <br />• <em>Ecosystem Quality:</em> Hilangnya spesies keanekaragaman hayati (satuan PDF·m²·tahun atau species·tahun).
                  <br />• <em>Resources Scarcity:</em> Biaya surplus energi fosil yang harus ditanggung generasi mendatang (satuan MJ surplus).
                </p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
                <h3 className="font-bold text-emerald-400 text-sm">
                  4. Bagaimana cara mengekspor laporan resmi ke bentuk PDF atau Excel?
                </h3>
                <p className="text-slate-400 leading-relaxed text-justify">
                  Buka menu <strong>Laporan Akhir</strong> (<Link href="/report" className="text-emerald-400 hover:underline">/report</Link>). Di bilah kontrol atas:
                  <br />• Klik tombol hijau <strong>&quot;Cetak / PDF Resmi&quot;</strong>, lalu pilih opsi <em>&quot;Save as PDF&quot;</em> pada dialog cetak browser Anda. Format cetak telah dioptimalkan secara otomatis tanpa elemen bilah tombol yang mengganggu.
                  <br />• Klik tombol <strong>&quot;CSV&quot;</strong> untuk mengunduh seluruh neraca massa, Midpoint, Endpoint, sirkularitas, dan EROI dalam format spreadsheet yang kompatibel dengan Microsoft Excel.
                  <br />• Klik tombol <strong>&quot;JSON&quot;</strong> untuk kebutuhan integrasi API dan arsip data digital.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
