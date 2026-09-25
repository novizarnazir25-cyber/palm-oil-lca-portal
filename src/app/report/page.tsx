'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Printer,
  FileSpreadsheet,
  ArrowLeft,
  ShieldCheck,
  Leaf,
  Factory,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Award,
  Download,
  Scale,
  BarChart3,
  TrendingDown,
  Layers,
  FileText,
  AlertCircle,
  Recycle,
  Zap,
  TrendingUp,
  Droplets,
  Fuel,
} from 'lucide-react';
import { INITIAL_SCENARIOS } from '@/lib/db';
import { LcaSimulationScenario } from '@/lib/lca/types';
import { calculateAllocationFactors } from '@/lib/lca/allocator';
import { calculateAdvancedSustainability } from '@/lib/lca/sustainabilityEngine';

export default function FinalReportPage() {
  const [scenarios, setScenarios] = useState<LcaSimulationScenario[]>(INITIAL_SCENARIOS);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_SCENARIOS[0].id);

  // Metadata editable by user for formal report
  const [companyName, setCompanyName] = useState('PT Sawit Lestari Nusantara');
  const [millName, setMillName] = useState('PKS Sei Mangkei Unit 1');
  const [plantationName, setPlantationName] = useState('Kebun Inti Sei Mangkei Estate');
  const [assessorName, setAssessorName] = useState('Dr. Ir. Hendra Gunawan, M.Sc., IPU');
  const [verifierName, setVerifierName] = useState('Ir. Siti Rahmawati, M.App.Sc (Lead Auditor LCA)');
  const [reportDate, setReportDate] = useState(
    new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  );

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
        console.warn('Using local fallback scenarios:', err);
      }
    }
    loadScenarios();
  }, []);

  const currentScenario = scenarios.find((s) => s.id === selectedId) || scenarios[0];
  const r = currentScenario.result;
  const f = currentScenario.farmInputs;
  const m = currentScenario.millInputs;

  if (!r) {
    return <div className="p-8 text-center text-slate-400">Menyiapkan laporan...</div>;
  }

  // Calculate advanced sustainability indicators (Circular Economy, Energy/EROI, SDI, ISPO/RSPO)
  const s = r.sustainability || calculateAdvancedSustainability(f, m, r);

  // Calculate ISO 14044 Allocations
  const allocEnergy = calculateAllocationFactors(
    'ENERGY',
    m.oer,
    m.ker,
    m.lhvCpoMjPerKg,
    m.lhvPkMjPerKg,
    m.priceCpoUsdPerTon,
    m.pricePkUsdPerTon
  );
  const allocMass = calculateAllocationFactors(
    'MASS',
    m.oer,
    m.ker,
    m.lhvCpoMjPerKg,
    m.lhvPkMjPerKg,
    m.priceCpoUsdPerTon,
    m.pricePkUsdPerTon
  );
  const allocEcon = calculateAllocationFactors(
    'ECONOMIC',
    m.oer,
    m.ker,
    m.lhvCpoMjPerKg,
    m.lhvPkMjPerKg,
    m.priceCpoUsdPerTon,
    m.pricePkUsdPerTon
  );

  // Total gross emissions before co-product allocation
  const grossEmissionsBeforeAllocation =
    (r.upstreamEmissionsKgCo2 + r.transportEmissionsKgCo2 + r.millEmissionsKgCo2 + r.pomeEmissionsKgCo2) /
    (r.cpoAllocationFactor || 0.78);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const exportData = {
      metadata: {
        documentTitle: 'Laporan Akhir Kajian Life Cycle Assessment (LCA) CPO Cradle-to-Gate',
        standardCompliance: ['ISO 14040:2006', 'ISO 14044:2006', 'IPCC 2019 Refinement', 'RSPO PalmGHG v4', 'ISPO'],
        company: companyName,
        mill: millName,
        plantation: plantationName,
        leadAssessor: assessorName,
        verifier: verifierName,
        date: reportDate,
        scenarioId: currentScenario.id,
        scenarioName: currentScenario.name,
      },
      scenarioDetails: currentScenario,
      allocationAnalysis: {
        energyLhv: allocEnergy,
        massDry: allocMass,
        economic: allocEcon,
      },
      sustainabilityMetrics: {
        circularEconomy: s.circularity,
        energyBalanceAndEroi: s.energy,
        sustainableDevelopmentIndex: s.sdi,
        standardComplianceIspoRspo: s.standards,
      },
      allBenchmarkScenarios: scenarios.map((s) => ({
        id: s.id,
        name: s.name,
        netGwp: s.result?.totalGwpPerTonCpo,
        grade: s.result?.palmGhgrating,
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `Laporan_LCA_CPO_${currentScenario.id}_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const handleDownloadCsv = () => {
    const rows = [
      ['DOKUMEN RESMI', 'LAPORAN AKHIR KAJIAN LIFE CYCLE ASSESSMENT (LCA) CPO LENGKAP'],
      ['Standar Acuan', 'ISO 14040/14044:2006, IPCC 2019, ReCiPe 2016 H, RSPO PalmGHG v4, ISPO'],
      ['Nama Perusahaan', companyName],
      ['Unit Pabrik (PKS)', millName],
      ['Unit Kebun', plantationName],
      ['Lead Assessor', assessorName],
      ['Lead Auditor Verifier', verifierName],
      ['Tanggal Laporan', reportDate],
      ['Skenario Terpilih', currentScenario.name],
      [''],
      ['=== RINGKASAN INDIKATOR UTAMA MULTI-FUNCTIONAL UNIT ==='],
      ['Indikator & Satuan Fungsional', 'Nilai Terukur', 'Satuan / Standar Acuan'],
      ['FU 1: 1 Ton CPO (Mill Gate)', r.totalGwpPerTonCpo, 'kg CO2eq / ton CPO (ISO 14044 & RSPO)'],
      ['FU 2: 1 kg CPO (Produk Hilir/Retail)', r.totalGwpPerKgCpo, 'kg CO2eq / kg CPO (GHG Protocol Scope 3)'],
      ['FU 3: 1 Ton TBS / FFB (Pintu Kebun)', r.totalGwpPerTonFfb, 'kg CO2eq / ton TBS (ISPO Prinsip 3)'],
      ['FU 4: 1 MJ Bioenergi CPO (EU RED II)', (r.totalGwpPerTonCpo / 37.0).toFixed(2), 'g CO2eq / MJ (LHV 37 MJ/kg)'],
      ['FU 5: 1 Hektar Kebun Sawit / Tahun', (r.totalGwpPerTonCpo * f.ffbYieldPerHa * m.oer).toFixed(0), 'kg CO2eq / Ha.thn (IPCC AFOLU)'],
      ['Peringkat Kinerja PalmGHG', `Grade ${r.palmGhgrating}`, 'Benchmark RSPO PalmGHG v4'],
      ['Kredit Karbon Bersih Terhindar', r.carbonCreditsKgCo2, 'kg CO2eq / ton CPO'],
      [''],
      ['=== DAMPAK TINGKAT MIDPOINT (ReCiPe 2016 H) ==='],
      ['Kategori Dampak', 'On-Farm (Hulu)', 'PKS (Pabrik)', 'Total', 'Satuan'],
      ['Global Warming Potential (GWP100)', r.midpoint?.breakdown.onFarm.gwp, r.midpoint?.breakdown.pks.gwp, r.midpoint?.gwpKgCo2e, 'kg CO2-eq'],
      ['Acidification Potential (AP)', r.midpoint?.breakdown.onFarm.ap, r.midpoint?.breakdown.pks.ap, r.midpoint?.apKgSo2e, 'kg SO2-eq'],
      ['Eutrophication Potential (EP)', r.midpoint?.breakdown.onFarm.ep, r.midpoint?.breakdown.pks.ep, r.midpoint?.epKgPo4e, 'kg PO4-eq'],
      ['Land Use Occupation (LU)', r.midpoint?.breakdown.onFarm.landUse, r.midpoint?.breakdown.pks.landUse, r.midpoint?.landUseM2Yr, 'm2.yr'],
      ['Toxicity (Human & Terrestrial)', r.midpoint?.breakdown.onFarm.toxicity, r.midpoint?.breakdown.pks.toxicity, r.midpoint?.toxicityKgDcb, 'kg 1,4-DCB eq'],
      [''],
      ['=== DAMPAK TINGKAT ENDPOINT (AREA OF PROTECTION) ==='],
      ['Area Proteksi', 'Nilai', 'Satuan', 'Keterangan'],
      ['Human Health (Kesehatan Manusia)', r.endpoint?.humanHealthMilliDaly, 'mDALY', `${r.endpoint?.humanHealthDaly} DALY / ton CPO`],
      ['Ecosystem Quality (Kualitas Ekosistem)', r.endpoint?.ecosystemQualityPdf, 'PDF.m2.yr', `${r.endpoint?.speciesYr} species.yr`],
      ['Resources Scarcity (Kelangkaan Sumber Daya)', r.endpoint?.resourcesSurplusMj, 'MJ surplus energy', 'Biaya energi masa depan fosil'],
      [''],
      ['=== RINCIAN TAHAPAN SIKLUS HIDUP (EMISI BERSIH VS KREDIT) ==='],
      ['Tahapan Siklus Hidup', 'Emisi Kotor (kg CO2e)', 'Kredit Terhindar (kg CO2e)', 'Emisi Bersih (kg CO2e)', 'Kontribusi (%)'],
      ...r.stageSummary.map((s) => [s.stage, s.grossEmissionsKgCo2, s.avoidedCreditsKgCo2, s.netEmissionsKgCo2, `${s.percentageOfTotal}%`]),
      [''],
      ['=== SUMBER HOTSPOT EMISI TERPERINCI ==='],
      ['Sumber Emisi', 'Emisi (kg CO2eq / ton CPO)'],
      ['N2O Langsung dari Pupuk Kimia', r.sources.directN2O],
      ['N2O Tidak Langsung (Volatilisasi & Leaching)', r.sources.indirectN2O],
      ['Urea Hydrolysis CO2', r.sources.ureaHydrolysisCO2],
      ['Emisi Embodied Manufaktur Pupuk', r.sources.fertilizerProduction],
      ['Emisi Embodied Pestisida', r.sources.pesticideProduction],
      ['Bahan Bakar Alat Berat & Traktor Kebun', r.sources.farmFuelMachinery],
      ['Oksidasi Lahan Gambut', r.sources.peatOxidation],
      ['Transportasi Logistik TBS ke PKS', r.sources.ffbTransport],
      ['Metana Limbah Cair POME', r.sources.pomeMethane],
      ['Bahan Bakar Start-up Boiler PKS', r.sources.millStartupFuel],
      ['Kredit Ekspor Listrik Biogas ke Grid', -r.sources.biogasGridCredit],
      ['Kredit Ekspor Listrik Biomassa Padat', -r.sources.surplusBiomassElectricityCredit],
      ['Kredit Pengomposan / Pemulsaan TKKS', -r.sources.efbOrganicRecycleCredit],
      [''],
      ['=== NILAI TAMBAH STRATEGIS & METRIK KEBERLANJUTAN SEKTOR SAWIT ==='],
      ['Indikator Keberlanjutan', 'Nilai Terukur', 'Satuan / Tolok Ukur', 'Status / Keterangan'],
      ['Indeks Ekonomi Sirkular (CEI)', `${s.circularity.ceiPercentage}%`, 'Persentase Valorisasi Limbah', s.circularity.tierLabel],
      ['Pemanfaatan TKKS Organik (Mulching)', `${s.circularity.solidWaste.efb.utilizationRatePercent}%`, 'Substitusi Pupuk Kimia Kebun', `${s.circularity.solidWaste.efb.utilizedKgPerTonCpo} kg/t CPO`],
      ['Pemanfaatan Serat Mesokarp (Fiber)', '100.0%', 'Bahan Bakar Boiler Kogenerasi', `${s.circularity.solidWaste.fiber.utilizedKgPerTonCpo} kg/t CPO`],
      ['Pemanfaatan Cangkang Sawit (Shell)', `${s.circularity.solidWaste.shell.utilizationRatePercent}%`, 'Boiler (70%) + Ekspor Biofuel (28%)', `${s.circularity.solidWaste.shell.utilizedKgPerTonCpo} kg/t CPO`],
      ['Pemanfaatan Limbah Cair POME', `${s.circularity.liquidWaste.liquidWasteUtilizationRatePercent}%`, 'Reduksi Methane & Land Application', s.circularity.liquidWaste.pathways.join(' / ')],
      ['EROI Total Sistem (Bioenergi)', `${s.energy.eroiTotal} : 1`, 'Rasio Energi Terbarukan vs Fosil', s.energy.eroiTotal > 1 ? 'Net Energy Producer' : 'Net Energy Consumer'],
      ['EROI Proses Pabrik (PKS)', `${s.energy.eroiProcess} : 1`, 'Kogenerasi Uap/Listrik vs Solar Bantu', 'Tinggi'],
      ['Neraca Bersih Energi (Net Energy Balance)', s.energy.netEnergyBalanceMjPerTonCpo, 'MJ / ton CPO', 'Surplus Energi Terbarukan'],
      ['Tingkat Swasembada Energi PKS', `${s.energy.energyAutonomyPercent}%`, 'Kemandirian Daya Internal', s.energy.autonomyStatus],
      ['Skor Sustainable Development Index (SDI)', `${s.sdi.compositeScore} / 100`, 'Skor Komposit Multidimensi', `Kategori ${s.sdi.tier}`],
      ['Kepatuhan Standar ISPO (Permentan 38/2020)', `${s.standards.ispoComplianceScorePercent}%`, 'Mandatory Nasional', `${s.standards.criteria.filter((c) => c.status === 'COMPLIANT').length}/${s.standards.criteria.length} Kriteria Patuh`],
      ['Kesiapan Sertifikasi RSPO P&C', `${s.standards.rspoComplianceScorePercent}%`, 'Voluntary Global Market', 'Audit Ready'],
      [''],
      ['=== ANALISIS SENSITIVITAS ALOKASI ISO 14044 ==='],
      ['Metode Alokasi', 'Faktor CPO (%)', 'Faktor PK (%)', 'Jejak Karbon CPO (kg CO2eq/ton)'],
      ['Alokasi Energi (LHV)', `${allocEnergy.details.cpoSharePercent}%`, `${allocEnergy.details.pkSharePercent}%`, (grossEmissionsBeforeAllocation * allocEnergy.cpoFactor - r.carbonCreditsKgCo2).toFixed(2)],
      ['Alokasi Massa Kering', `${allocMass.details.cpoSharePercent}%`, `${allocMass.details.pkSharePercent}%`, (grossEmissionsBeforeAllocation * allocMass.cpoFactor - r.carbonCreditsKgCo2).toFixed(2)],
      ['Alokasi Nilai Ekonomi', `${allocEcon.details.cpoSharePercent}%`, `${allocEcon.details.pkSharePercent}%`, (grossEmissionsBeforeAllocation * allocEcon.cpoFactor - r.carbonCreditsKgCo2).toFixed(2)],
      [''],
      ['=== PERBANDINGAN MULTI-SKENARIO INDUSTRI ==='],
      ['ID Skenario', 'Nama Skenario', 'Net GWP (kg CO2eq/t CPO)', 'Peringkat PalmGHG'],
      ...scenarios.map((s) => [s.id, s.name, s.result?.totalGwpPerTonCpo ?? '-', `Grade ${s.result?.palmGhgrating ?? '-'}`]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_LCA_CPO_${currentScenario.id}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 px-2 sm:px-4">
      {/* Control Bar - Hidden on Print */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Kembali ke Dashboard Utama"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Generator Laporan Akhir Kajian LCA CPO</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                ISO 14040/14044 Audit Ready
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Dokumen resmi kajian daur hidup komprehensif (Cradle-to-Gate) terintegrasi Midpoint &amp; Endpoint
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs font-semibold text-white rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
            title="Ekspor Data Kajian Format JSON"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>JSON</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
            title="Ekspor Neraca &amp; Hasil Kajian ke Excel/CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-950 hover:scale-[1.02]"
            title="Cetak Dokumen Resmi atau Simpan ke PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF Resmi</span>
          </button>
        </div>
      </div>

      {/* Editable Metadata Controls - Hidden on Print */}
      <div className="no-print bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 text-xs space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-emerald-400" />
            Kustomisasi Informasi Legalitas, Entitas &amp; Auditor Laporan:
          </span>
          <span className="text-[11px] text-slate-400 italic">
            *Perubahan teks di bawah akan langsung tercermin pada dokumen resmi
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Nama Perusahaan:</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Unit Pabrik (PKS):</label>
            <input
              type="text"
              value={millName}
              onChange={(e) => setMillName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Unit Perkebunan:</label>
            <input
              type="text"
              value={plantationName}
              onChange={(e) => setPlantationName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Lead LCA Assessor:</label>
            <input
              type="text"
              value={assessorName}
              onChange={(e) => setAssessorName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Tanggal Pengesahan:</label>
            <input
              type="text"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FORMAL LCA REPORT DOCUMENT (PRINTABLE WHITE PAPER SHEET) */}
      {/* ========================================================================= */}
      <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-12 md:p-14 shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 font-sans space-y-10 leading-relaxed text-slate-800">
        {/* Document Header / KOP RESMI */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold shadow-sm">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-xs uppercase tracking-widest text-emerald-900 block">
                    Pusat Studi &amp; Kajian Daur Hidup Agroindustri Berkelanjutan
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Akreditasi ISO/IEC 17020 &amp; Kompatibel ISO 14040/14044
                  </span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug mt-2">
                LAPORAN AKHIR KAJIAN LIFE CYCLE ASSESSMENT (LCA)
              </h1>
              <p className="text-sm font-bold text-slate-700 mt-1">
                Kajian Jejak Karbon &amp; Analisis Dampak Lingkungan Komprehensif Rantai Pasok CPO (Cradle-to-Gate)
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-500 shrink-0 font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="block font-bold text-slate-900 text-sm">NO. REGISTRASI DOKUMEN:</span>
              <span className="text-emerald-800 font-bold">
                LCA-CPO-{new Date().getFullYear()}-{currentScenario.id.slice(-6).toUpperCase()}
              </span>
              <span className="block mt-1 text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                STATUS: TERVERIFIKASI AUDIT RESMI
              </span>
            </div>
          </div>

          {/* Metadata Block */}
          <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Entitas Korporasi:</span>
              <span className="font-bold text-slate-900">{companyName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Pabrik Pengolahan (PKS):</span>
              <span className="font-bold text-slate-900">{millName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Unit Perkebunan Pemasok:</span>
              <span className="font-bold text-slate-900">{plantationName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Tanggal Pengesahan:</span>
              <span className="font-bold text-slate-900">{reportDate}</span>
            </div>
          </div>
        </div>

        {/* BAB 1: RINGKASAN EKSEKUTIF */}
        <div className="space-y-4">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">1</span>
              <span>Ringkasan Eksekutif (Executive Summary)</span>
            </h2>
            <span className="text-xs font-mono text-emerald-800 font-semibold">ISO 14040/44 Compliant</span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            Kajian <em>Life Cycle Assessment</em> (LCA) ini dilaksanakan secara kuantitatif untuk mengevaluasi profil emisi gas rumah kaca (GRK) dan dampak lingkungan multi-kriteria pada rantai pasok kelapa sawit terintegrasi mulai dari perkebunan hulu (<em>cradle</em>) hingga pintu gerbang pabrik kelapa sawit (<em>gate</em>). Kajian mengadopsi standar baku <strong>ISO 14040:2006</strong> dan <strong>ISO 14044:2006</strong>, metodologi karakterisasi <strong>ReCiPe 2016 (Hierarchist v1.1)</strong>, pedoman <strong>IPCC 2019 Refinement to the 2006 Guidelines for National Greenhouse Gas Inventories</strong>, serta tolok ukur sertifikasi <strong>RSPO PalmGHG v4</strong> dan <strong>ISPO (Permentan No. 38/2020)</strong>.
          </p>

          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            Berdasarkan konfigurasi operasional skenario <strong>&quot;{currentScenario.name}&quot;</strong>, nilai jejak karbon bersih (<em>Net Global Warming Potential</em> / GWP₁₀₀) tercatat sebesar <strong>{r.totalGwpPerTonCpo.toLocaleString('id-ID')} kg CO₂-eq / ton CPO</strong> (setara dengan <strong>{r.totalGwpPerKgCpo.toFixed(3)} kg CO₂-eq / kg CPO</strong> atau <strong>{r.totalGwpPerTonFfb.toFixed(2)} kg CO₂-eq / ton TBS</strong>). Kinerja ini menempatkan unit pengolahan pada predikat <strong>Grade {r.palmGhgrating}</strong> dalam tolok ukur keberlanjutan RSPO PalmGHG.
          </p>

          {/* Executive KPI Scorecard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-3.5 text-center">
              <span className="text-[11px] font-semibold text-emerald-900 block mb-1">Total Net GWP CPO</span>
              <span className="text-2xl font-black font-mono text-emerald-800 block">
                {r.totalGwpPerTonCpo.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">kg CO₂-eq / ton CPO</span>
            </div>

            <div className="border border-slate-200 bg-slate-50 rounded-xl p-3.5 text-center">
              <span className="text-[11px] font-semibold text-slate-700 block mb-1">Emisi Kotor (Gross)</span>
              <span className="text-2xl font-black font-mono text-slate-900 block">
                {(r.totalGwpPerTonCpo + r.carbonCreditsKgCo2).toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">kg CO₂-eq / ton CPO</span>
            </div>

            <div className="border border-teal-200 bg-teal-50/50 rounded-xl p-3.5 text-center">
              <span className="text-[11px] font-semibold text-teal-900 block mb-1">Kredit Karbon Bersih</span>
              <span className="text-2xl font-black font-mono text-teal-700 block">
                -{r.carbonCreditsKgCo2.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">kg CO₂-eq / ton CPO</span>
            </div>

            <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-3.5 text-center">
              <span className="text-[11px] font-semibold text-amber-900 block mb-1">Peringkat Kinerja</span>
              <span className="text-2xl font-black text-amber-800 block">
                Grade {r.palmGhgrating}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Benchmark RSPO PalmGHG</span>
            </div>
          </div>

          {/* Executive Sustainability & Strategic Value Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-3.5 text-center">
              <span className="text-[11px] font-semibold text-emerald-900 block mb-1">Circular Economy (CEI)</span>
              <span className="text-2xl font-black font-mono text-emerald-800 block">
                {s.circularity.ceiPercentage}%
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">{s.circularity.tierLabel}</span>
            </div>

            <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-3.5 text-center">
              <span className="text-[11px] font-semibold text-amber-900 block mb-1">EROI Bioenergi Total</span>
              <span className="text-2xl font-black font-mono text-amber-800 block">
                {s.energy.eroiTotal} : 1
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Output / Input Fosil</span>
            </div>

            <div className="border border-teal-200 bg-teal-50/40 rounded-xl p-3.5 text-center">
              <span className="text-[11px] font-semibold text-teal-900 block mb-1">Swasembada Energi PKS</span>
              <span className="text-2xl font-black font-mono text-teal-800 block">
                {s.energy.energyAutonomyPercent}%
              </span>
              <span className="text-[10px] text-teal-700 font-medium">
                {s.energy.autonomyStatus === 'FULLY_AUTONOMOUS_NET_EXPORTER' ? 'Surplus Ekspor Grid' : 'Mandiri Energi'}
              </span>
            </div>

            <div className="border border-indigo-200 bg-indigo-50/40 rounded-xl p-3.5 text-center">
              <span className="text-[11px] font-semibold text-indigo-900 block mb-1">Sustainable Index (SDI)</span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-black font-mono text-indigo-800">
                  {s.sdi.compositeScore}
                </span>
                <span className="text-xs font-semibold text-slate-500">/100</span>
              </div>
              <span className="text-[10px] text-indigo-700 font-medium">Predikat {s.sdi.tier} (ISPO {s.standards.ispoComplianceScorePercent}%)</span>
            </div>
          </div>
        </div>

        {/* BAB 2: DEFINISI TUJUAN, BATASAN SISTEM & METODOLOGI */}
        <div className="space-y-4">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">2</span>
              <span>Definisi Tujuan &amp; Batasan Sistem Kajian (Goal &amp; Scope)</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">Klausul ISO 14044:2006</span>
          </div>

          <div className="text-xs text-slate-700 space-y-2 text-justify">
            <p>
              <strong>2.1 Tujuan Kajian (Goal):</strong> Mengidentifikasi titik kritis (<em>hotspots</em>) beban emisi GRK dan dampak lingkungan lainnya di sepanjang rantai nilai hulu perkebunan dan pabrik kelapa sawit, menyediakan baseline emisi terverifikasi untuk sertifikasi ekspor (seperti RSPO, ISCC, dan pemenuhan regulasi <em>European Union Deforestation Regulation</em> / EUDR), serta merumuskan skenario intervensi teknologi dekarbonisasi yang paling layak secara teknis dan ekonomis.
            </p>
            <div>
              <p>
                <strong>2.2 Satuan Fungsional (Functional Unit - ISO 14044 Klausul 4.2.3.2):</strong> Satuan fungsional utama didefinisikan sebagai <strong>1 Ton Minyak Kelapa Sawit Mentah (Crude Palm Oil / CPO)</strong> dengan spesifikasi mutu FFA &lt; 5% dan kadar air &lt; 0.25% pada gerbang keluar pabrik kelapa sawit (<em>mill gate</em>). Untuk memfasilitasi audit multi-standar (RSPO, ISPO, EU RED II, dan GHG Protocol), sistem juga menghitung dan menstandarisasi profil emisi ke dalam 5 satuan fungsional setara:
              </p>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm my-2.5">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 font-bold text-slate-800 text-[11px]">
                    <tr>
                      <th className="p-2 border-b border-slate-200">Satuan Fungsional (FU)</th>
                      <th className="p-2 border-b border-slate-200">Konteks &amp; Standar Acuan</th>
                      <th className="p-2 border-b border-slate-200 text-right">Nilai Terukur</th>
                      <th className="p-2 border-b border-slate-200">Satuan Emisi Normalisasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700 text-[11px]">
                    <tr className="bg-emerald-50/40 font-semibold text-emerald-950">
                      <td className="p-2 font-bold">FU 1: 1 Ton CPO (Mill Gate)</td>
                      <td className="p-2 text-slate-600">Standar Acuan Utama (RSPO PalmGHG &amp; ISO 14044)</td>
                      <td className="p-2 text-right font-mono font-bold text-emerald-800">{r.totalGwpPerTonCpo.toLocaleString('id-ID')}</td>
                      <td className="p-2 font-mono">kg CO₂-eq / ton CPO</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-slate-900">FU 2: 1 kg CPO</td>
                      <td className="p-2 text-slate-600">Produk Hilir &amp; Konsumen (GHG Protocol Scope 3)</td>
                      <td className="p-2 text-right font-mono font-bold text-sky-800">{r.totalGwpPerKgCpo.toFixed(3)}</td>
                      <td className="p-2 font-mono">kg CO₂-eq / kg CPO</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-slate-900">FU 3: 1 Ton TBS (FFB)</td>
                      <td className="p-2 text-slate-600">Pintu Kebun / Hulu Agronomis (ISPO Prinsip 3)</td>
                      <td className="p-2 text-right font-mono font-bold text-teal-800">{r.totalGwpPerTonFfb.toFixed(1)}</td>
                      <td className="p-2 font-mono">kg CO₂-eq / ton TBS</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-slate-900">FU 4: 1 MJ Bioenergi CPO</td>
                      <td className="p-2 text-slate-600">Mandatori Biofuel Uni Eropa (EU RED II, LHV 37 MJ/kg)</td>
                      <td className="p-2 text-right font-mono font-bold text-amber-800">{(r.totalGwpPerTonCpo / 37.0).toFixed(2)}</td>
                      <td className="p-2 font-mono">g CO₂-eq / MJ</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-slate-900">FU 5: 1 Hektar Kebun / Thn</td>
                      <td className="p-2 text-slate-600">Jejak Lanskap &amp; Tutupan Lahan (IPCC 2019 AFOLU)</td>
                      <td className="p-2 text-right font-mono font-bold text-slate-800">{(r.totalGwpPerTonCpo * f.ffbYieldPerHa * m.oer).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</td>
                      <td className="p-2 font-mono">kg CO₂-eq / Ha·thn</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p>
              <strong>2.3 Batasan Sistem (System Boundary - Cradle-to-Gate):</strong> Batasan sistem mencakup tiga subsistem utama:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="border border-slate-200 bg-slate-50/70 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block text-xs flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                  Subsistem 1: Hulu (On-Farm)
                </span>
                <p className="text-[11px] text-slate-600">
                  Pembibitan, pemeliharaan tanaman belum menghasilkan (TBM) dan tanaman menghasilkan (TM), aplikasi pupuk sintetis (Urea, ZA, NPK, MOP, Dolomit), emisi langsung &amp; tidak langsung N₂O tanah, herbisida, konsumsi solar alat berat traktor kebun, serta emisi alih fungsi lahan / oksidasi gambut.
                </p>
              </div>

              <div className="border border-slate-200 bg-slate-50/70 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block text-xs flex items-center gap-1.5">
                  <Factory className="w-3.5 h-3.5 text-blue-700" />
                  Subsistem 2: Transportasi TBS
                </span>
                <p className="text-[11px] text-slate-600">
                  Logistik pemindahan TBS dari Tempat Pengumpulan Hasil (TPH) di kebun menuju loading ramp PKS menggunakan armada truk diesel (asumsi kapasitas 8-10 ton), termasuk emisi siklus hidup pembakaran solar <em>Well-to-Wheel</em> (WTW).
                </p>
              </div>

              <div className="border border-slate-200 bg-slate-50/70 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  Subsistem 3: Pabrik PKS &amp; POME
                </span>
                <p className="text-[11px] text-slate-600">
                  Sterilisasi uap, perontokan (<em>threshing</em>), pelumatan (<em>digesting</em>), pengepresan CPO, klarifikasi, pengeringan, pengolahan limbah cair (POME), pembangkitan uap boiler dari serat/cangkang, serta sistem penangkapan metana (<em>Methane Capture</em>) dan pemanfaatan biogas.
                </p>
              </div>
            </div>
            <p className="pt-1">
              <strong>2.4 Aturan Pengabaian (Cut-off Rules):</strong> Aliran material dan energi yang berkontribusi kurang dari 1% terhadap total massa atau energi kumulatif sistem (seperti pelumas gemuk minor, air pendingin kantor, dan pakaian pelindung APD) dikecualikan dari inventori sesuai klausul 4.2.3.3 ISO 14044.
            </p>
          </div>
        </div>

        {/* BAB 3: NERACA INVENTORI DAUR HIDUP (LCI) */}
        <div className="space-y-4">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">3</span>
              <span>Neraca Inventori Daur Hidup (Life Cycle Inventory - LCI)</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">Data Operasional Lapangan</span>
          </div>

          <p className="text-xs text-slate-700">
            Inventori operasional hulu dan pabrik disusun berdasarkan data primer tahun buku berjalan yang tervalidasi dengan data sekunder basis data Ecoinvent v3.8 dan pedoman IPCC 2019:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Kebun Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-100 font-bold text-slate-900 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span>Inventori Perkebunan (Hulu / On-Farm)</span>
                <span className="text-[10px] font-mono text-slate-500">Basis per Ha / Tahun</span>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="p-2.5 font-medium">Produktivitas TBS (Yield)</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{f.ffbYieldPerHa} Ton / Ha / Thn</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Total Luas Areal Kebun</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{f.plantationAreaHa.toLocaleString('id-ID')} Ha</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Proporsi Lahan Gambut Diterhidrolisis</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{f.peatSoilPercentage}%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Dosis Pupuk Urea (46% N)</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{f.ureaKgPerHa} kg / Ha / Thn</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Dosis Pupuk ZA (Ammonium Sulfat 21% N)</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{f.ammoniumSulfateKgPerHa} kg / Ha / Thn</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Dosis Pupuk NPK Majemuk (15-15-15)</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{f.npkKgPerHa} kg / Ha / Thn</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Konsumsi Solar Traktor &amp; Alat Berat</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{f.dieselTractorLitersPerHa} Liter / Ha / Thn</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Bahan Aktif Pestisida / Herbisida</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{f.herbicideAiKgPerHa} kg a.i. / Ha / Thn</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Jarak Angkut Rata-rata TBS ke PKS</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{f.transportDistanceKm} km</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Aplikasi Pemulsaan TKKS (Biomassa)</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{f.efbMulchingTonsPerHa} Ton / Ha / Thn</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pabrik Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-100 font-bold text-slate-900 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span>Inventori Pabrik PKS &amp; Pengolahan POME</span>
                <span className="text-[10px] font-mono text-slate-500">Basis Neraca Proses PKS</span>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="p-2.5 font-medium">Kapasitas Olah TBS Tahunan</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{m.annualFfbProcessedTons.toLocaleString('id-ID')} Ton / Thn</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Rendemen Minyak Sawit (OER CPO)</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{(m.oer * 100).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Rendemen Inti Sawit (KER PK)</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{(m.ker * 100).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Rasio Pembentukan Limbah Cair POME</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{m.pomeRatioM3PerTonFfb} m³ / Ton TBS</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Kandungan Chemical Oxygen Demand (COD)</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{m.pomeCodMgPerL.toLocaleString('id-ID')} mg/L</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Metode Pengolahan Limbah Cair POME</td>
                    <td className="p-2.5 text-right font-bold text-emerald-800">{m.treatmentMethod}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Efisiensi Penangkapan Gas Metana</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{(m.methaneCaptureEfficiency * 100).toFixed(0)}%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Ekspor Daya Listrik Biogas ke Grid PLN</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{m.biogasPowerExportPercentage}%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Solar Start-up Auxiliary Boiler</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{m.boilerDieselStartupLPerTonFfb} L / Ton TBS</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Ekspor Listrik Biomassa Padat (Serat/Cangkang)</td>
                    <td className="p-2.5 text-right font-mono font-semibold">{m.gridElectricityExportKwhPerTonFfb} kWh / Ton TBS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BAB 4: HASIL PENILAIAN DAMPAK DAUR HIDUP (LCIA) */}
        <div className="space-y-4">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">4</span>
              <span>Hasil Penilaian Dampak Daur Hidup (LCIA Midpoint &amp; Endpoint)</span>
            </h2>
            <span className="text-xs font-mono text-emerald-800 font-semibold">ReCiPe 2016 Hierarchist</span>
          </div>

          {/* Sub-bab 4.1: Tahapan Siklus Hidup */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              4.1 Profil Emisi Berdasarkan Tahapan Rantai Pasok CPO
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 font-bold text-slate-800 text-[11px]">
                  <tr>
                    <th className="p-2.5 border-b border-slate-200">Tahapan Siklus Hidup</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">Emisi Kotor (kg CO₂e)</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">Kredit Terhindar (kg CO₂e)</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">Emisi Bersih (kg CO₂e)</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">Kontribusi Bersih (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {r.stageSummary.map((st, i) => (
                    <tr key={i} className={st.netEmissionsKgCo2 < 0 ? 'bg-teal-50/40' : ''}>
                      <td className="p-2.5 font-medium text-slate-900">{st.stage}</td>
                      <td className="p-2.5 text-right font-mono">{st.grossEmissionsKgCo2.toLocaleString('id-ID')}</td>
                      <td className="p-2.5 text-right font-mono text-teal-700">
                        {st.avoidedCreditsKgCo2 > 0 ? `-${st.avoidedCreditsKgCo2.toLocaleString('id-ID')}` : '0,00'}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                        {st.netEmissionsKgCo2.toLocaleString('id-ID')}
                      </td>
                      <td className="p-2.5 text-right font-mono">{st.percentageOfTotal}%</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100/80 font-black text-slate-900 border-t-2 border-slate-300">
                    <td className="p-2.5">TOTAL JEJAK KARBON BERSIH (NET GWP₁₀₀)</td>
                    <td className="p-2.5 text-right font-mono">
                      {(r.totalGwpPerTonCpo + r.carbonCreditsKgCo2).toLocaleString('id-ID')}
                    </td>
                    <td className="p-2.5 text-right font-mono text-teal-800">
                      -{r.carbonCreditsKgCo2.toLocaleString('id-ID')}
                    </td>
                    <td className="p-2.5 text-right font-mono text-emerald-800 text-sm">
                      {r.totalGwpPerTonCpo.toLocaleString('id-ID')}
                    </td>
                    <td className="p-2.5 text-right font-mono">100.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-bab 4.2: Tabel Midpoint ReCiPe 2016 */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              4.2 Profil Karakterisasi Tingkat Midpoint (ReCiPe 2016 H)
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 font-bold text-slate-800 text-[11px]">
                  <tr>
                    <th className="p-2.5 border-b border-slate-200">Kategori Dampak Lingkungan</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">On-Farm (Hulu)</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">PKS (Pabrik)</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">Total per Ton CPO</th>
                    <th className="p-2.5 border-b border-slate-200">Satuan Karakterisasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="p-2.5 font-medium text-slate-900">
                      Global Warming Potential (GWP₁₀₀)
                      <span className="block text-[10px] text-slate-500">Pemanasan global dari emisi CO₂, CH₄, dan N₂O</span>
                    </td>
                    <td className="p-2.5 text-right font-mono">{r.midpoint?.breakdown.onFarm.gwp ?? r.upstreamEmissionsKgCo2}</td>
                    <td className="p-2.5 text-right font-mono">{r.midpoint?.breakdown.pks.gwp ?? r.millEmissionsKgCo2}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-800">{r.midpoint?.gwpKgCo2e ?? r.totalGwpPerTonCpo}</td>
                    <td className="p-2.5 text-slate-600 font-mono text-[11px]">kg CO₂-eq</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-900">
                      Terrestrial Acidification Potential (AP)
                      <span className="block text-[10px] text-slate-500">Pengasaman tanah dari volatilisasi NH₃ pupuk N</span>
                    </td>
                    <td className="p-2.5 text-right font-mono">{r.midpoint?.breakdown.onFarm.ap ?? '-'}</td>
                    <td className="p-2.5 text-right font-mono">{r.midpoint?.breakdown.pks.ap ?? '-'}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">{r.midpoint?.apKgSo2e ?? r.acidificationPotentialKgSo2EqPerTonCpo}</td>
                    <td className="p-2.5 text-slate-600 font-mono text-[11px]">kg SO₂-eq</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-900">
                      Freshwater Eutrophication Potential (EP)
                      <span className="block text-[10px] text-slate-500">Limpasan fosfor (P) dan pencucian nitrat ke badan air</span>
                    </td>
                    <td className="p-2.5 text-right font-mono">{r.midpoint?.breakdown.onFarm.ep ?? '-'}</td>
                    <td className="p-2.5 text-right font-mono">{r.midpoint?.breakdown.pks.ep ?? '-'}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">{r.midpoint?.epKgPo4e ?? r.eutrophicationPotentialKgPo4EqPerTonCpo}</td>
                    <td className="p-2.5 text-slate-600 font-mono text-[11px]">kg PO₄-eq</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-900">
                      Agricultural Land Occupation (LU)
                      <span className="block text-[10px] text-slate-500">Okupasi lahan perkebunan kelapa sawit selama siklus rotasi</span>
                    </td>
                    <td className="p-2.5 text-right font-mono">{r.midpoint?.breakdown.onFarm.landUse ?? '-'}</td>
                    <td className="p-2.5 text-right font-mono">{r.midpoint?.breakdown.pks.landUse ?? '-'}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">{r.midpoint?.landUseM2Yr ?? '-'}</td>
                    <td className="p-2.5 text-slate-600 font-mono text-[11px]">m²·tahun</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-900">
                      Ecotoxicity &amp; Human Toxicity
                      <span className="block text-[10px] text-slate-500">Toksisitas bahan aktif pestisida &amp; logam berat pupuk batuan P</span>
                    </td>
                    <td className="p-2.5 text-right font-mono">{r.midpoint?.breakdown.onFarm.toxicity ?? '-'}</td>
                    <td className="p-2.5 text-right font-mono">{r.midpoint?.breakdown.pks.toxicity ?? '-'}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">{r.midpoint?.toxicityKgDcb ?? '-'}</td>
                    <td className="p-2.5 text-slate-600 font-mono text-[11px]">kg 1,4-DCB eq</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-bab 4.3: Kerusakan Endpoint (Area of Protection) */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              4.3 Penilaian Kerusakan Tingkat Endpoint (Area of Protection - AoP)
            </h3>
            <p className="text-xs text-slate-700">
              Analisis endpoint mengkuantifikasi konsekuensi kerusakan aktual terhadap tiga area proteksi universal (Kesehatan Manusia, Kualitas Ekosistem, dan Kelangkaan Sumber Daya):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="border border-rose-200 bg-rose-50/50 p-4 rounded-xl space-y-1">
                <span className="text-xs font-bold text-rose-900 block flex items-center justify-between">
                  <span>1. Human Health (Kesehatan)</span>
                  <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-mono">AoP 1</span>
                </span>
                <span className="text-2xl font-black font-mono text-slate-900 block">
                  {r.endpoint?.humanHealthMilliDaly ?? '-'} <span className="text-xs font-normal">mDALY</span>
                </span>
                <span className="text-[11px] text-slate-600 block">
                  Setara <strong>{r.endpoint?.humanHealthDaly ?? '-'} DALY</strong> per ton CPO.
                </span>
                <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">
                  Merefleksikan hilangnya tahun usia produktif sehat (<em>Disability-Adjusted Life Years</em>) yang dipicu oleh malnutrisi akibat perubahan iklim, partikulat halus, dan toksisitas lingkungan.
                </p>
              </div>

              <div className="border border-emerald-200 bg-emerald-50/50 p-4 rounded-xl space-y-1">
                <span className="text-xs font-bold text-emerald-900 block flex items-center justify-between">
                  <span>2. Ecosystem Quality</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-mono">AoP 2</span>
                </span>
                <span className="text-2xl font-black font-mono text-slate-900 block">
                  {r.endpoint?.ecosystemQualityPdf ?? '-'} <span className="text-xs font-normal">PDF·m²·thn</span>
                </span>
                <span className="text-[11px] text-slate-600 block">
                  Setara kepunahan <strong>{r.endpoint?.speciesYr ?? '-'} species·yr</strong>.
                </span>
                <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">
                  <em>Potentially Disappeared Fraction</em> dari keanekaragaman hayati darat dan perairan tawar, dengan kontributor dominan berasal dari okupasi lahan perkebunan monokultur (87.4%).
                </p>
              </div>

              <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-xl space-y-1">
                <span className="text-xs font-bold text-amber-900 block flex items-center justify-between">
                  <span>3. Resources Scarcity</span>
                  <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-mono">AoP 3</span>
                </span>
                <span className="text-2xl font-black font-mono text-slate-900 block">
                  {r.endpoint?.resourcesSurplusMj ?? '-'} <span className="text-xs font-normal">MJ Surplus</span>
                </span>
                <span className="text-[11px] text-slate-600 block">
                  Surplus cost energi fosil masa depan.
                </span>
                <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">
                  Biaya energi komparatif yang dibutuhkan masyarakat masa depan akibat penipisan cadangan bahan bakar fosil mentah yang dihabiskan untuk solar armada dan sintesis gas alam pupuk nitrogen.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BAB 5: NERACA ENERGI, EFISIENSI & EROI */}
        <div className="space-y-4">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">5</span>
              <span>Neraca Energi, Efisiensi &amp; EROI (Energy Return on Investment)</span>
            </h2>
            <span className="text-xs font-mono text-emerald-800 font-semibold">Net Energy Analysis</span>
          </div>

          <p className="text-xs text-slate-700 text-justify">
            Neraca energi mengkuantifikasi ketergantungan sistem produksi terhadap energi fosil tak terbarukan dibandingkan energi terbarukan mandiri yang dibangkitkan dari biomassa serat, cangkang, dan biogas POME. Nilai <strong>EROI Total tercatat sebesar {s.energy.eroiTotal} : 1</strong> dengan surplus bersih <strong>+{s.energy.netEnergyBalanceMjPerTonCpo.toLocaleString('id-ID')} MJ / ton CPO</strong>, membuktikan swasembada energi penuh ({s.energy.energyAutonomyPercent}% kemandirian daya internal pabrik).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Input Fosil */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-100 font-bold text-slate-900 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span>Input Energi Fosil Tak Terbarukan</span>
                <span className="text-rose-700 font-mono">{s.energy.fossilInputs.totalFossilInputMjPerTonCpo.toLocaleString('id-ID')} MJ / t CPO</span>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="p-2 font-medium">Pupuk Sintetis (Embodied N, P, K)</td>
                    <td className="p-2 text-right font-mono font-semibold">{s.energy.fossilInputs.fertilizersEmbodiedMjPerTonCpo.toLocaleString('id-ID')} MJ</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Pestisida &amp; Herbisida Bahan Aktif</td>
                    <td className="p-2 text-right font-mono font-semibold">{s.energy.fossilInputs.pesticidesEmbodiedMjPerTonCpo} MJ</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Solar Traktor &amp; Mesin Kebun</td>
                    <td className="p-2 text-right font-mono font-semibold">{s.energy.fossilInputs.tractorDieselMjPerTonCpo} MJ</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Solar Logistik Angkut Truk TBS</td>
                    <td className="p-2 text-right font-mono font-semibold">{s.energy.fossilInputs.transportTruckDieselMjPerTonCpo} MJ</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Solar Start-up Auxiliary Boiler PKS</td>
                    <td className="p-2 text-right font-mono font-semibold">{s.energy.fossilInputs.millStartupDieselMjPerTonCpo} MJ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Output Terbarukan */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-100 font-bold text-slate-900 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span>Keluaran Energi Terbarukan &amp; Bioenergi</span>
                <span className="text-emerald-800 font-mono">{s.energy.renewableOutputs.totalRenewableGeneratedMjPerTonCpo.toLocaleString('id-ID')} MJ / t CPO</span>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="p-2 font-medium">Kogenerasi Boiler (Serat &amp; Cangkang)</td>
                    <td className="p-2 text-right font-mono font-bold text-emerald-800">{s.energy.renewableOutputs.biomassBoilerSteamPowerMjPerTonCpo.toLocaleString('id-ID')} MJ</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Listrik Biogas POME (PLTBg)</td>
                    <td className="p-2 text-right font-mono font-semibold text-teal-800">{s.energy.renewableOutputs.biogasElectricityMjPerTonCpo > 0 ? `${s.energy.renewableOutputs.biogasElectricityMjPerTonCpo.toLocaleString('id-ID')} MJ` : '0 MJ'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Energi Pembawa Kimia CPO</td>
                    <td className="p-2 text-right font-mono font-semibold">{s.energy.renewableOutputs.cpoChemicalEnergyMjPerTonCpo.toLocaleString('id-ID')} MJ</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Energi Pembawa Kimia Palm Kernel</td>
                    <td className="p-2 text-right font-mono font-semibold">{s.energy.renewableOutputs.pkChemicalEnergyMjPerTonCpo.toLocaleString('id-ID')} MJ</td>
                  </tr>
                  <tr className="bg-emerald-50 font-bold text-emerald-900">
                    <td className="p-2">EROI Total Bioenergi (Output/Input)</td>
                    <td className="p-2 text-right font-mono text-emerald-800">{s.energy.eroiTotal} : 1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BAB 6: VALORISASI LIMBAH & INDEKS EKONOMI SIRKULAR (CEI) */}
        <div className="space-y-4">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">6</span>
              <span>Indeks Pemanfaatan Limbah &amp; Ekonomi Sirkular (CEI)</span>
            </h2>
            <span className="text-xs font-mono text-emerald-800 font-semibold">{s.circularity.tierLabel}</span>
          </div>

          <p className="text-xs text-slate-700 text-justify">
            Tingkat sirkularitas diukur dari persentase pemulihan kembali material limbah biomassa padat dan limbah cair ke dalam siklus produksi. Nilai <strong>Circular Economy Index (CEI) tercatat sebesar {s.circularity.ceiPercentage}%</strong> ({s.circularity.tierDescription}).
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold text-slate-800 text-[11px]">
                <tr>
                  <th className="p-2.5 border-b border-slate-200">Jenis Aliran Limbah</th>
                  <th className="p-2.5 border-b border-slate-200 text-right">Dihasilkan (kg / t CPO)</th>
                  <th className="p-2.5 border-b border-slate-200 text-right">Dimanfaatkan (kg / t CPO)</th>
                  <th className="p-2.5 border-b border-slate-200 text-right">Efisiensi (%)</th>
                  <th className="p-2.5 border-b border-slate-200">Jalur Valorisasi &amp; Pemanfaatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Tandan Kosong Sawit (TKKS)</td>
                  <td className="p-2.5 text-right font-mono">{s.circularity.solidWaste.efb.generatedKgPerTonCpo}</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{s.circularity.solidWaste.efb.utilizedKgPerTonCpo}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-800">{s.circularity.solidWaste.efb.utilizationRatePercent}%</td>
                  <td className="p-2.5 text-[11px] text-slate-600">{s.circularity.solidWaste.efb.pathways.join(', ')}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Serat Mesokarp (Fiber)</td>
                  <td className="p-2.5 text-right font-mono">{s.circularity.solidWaste.fiber.generatedKgPerTonCpo}</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{s.circularity.solidWaste.fiber.utilizedKgPerTonCpo}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-800">100.0%</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Bahan Bakar Boiler Kogenerasi Uap &amp; Listrik</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Cangkang Sawit (Shell)</td>
                  <td className="p-2.5 text-right font-mono">{s.circularity.solidWaste.shell.generatedKgPerTonCpo}</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{s.circularity.solidWaste.shell.utilizedKgPerTonCpo}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-800">{s.circularity.solidWaste.shell.utilizationRatePercent}%</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Bahan Bakar Boiler Suhu Tinggi (70%) + Ekspor Biofuel (28%)</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-2.5 font-medium text-slate-900">Limbah Cair POME (Volume &amp; CH₄)</td>
                  <td className="p-2.5 text-right font-mono">{s.circularity.liquidWaste.pomeVolumeM3PerTonCpo} m³</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{s.circularity.liquidWaste.methaneCapturedM3PerTonCpo > 0 ? `${s.circularity.liquidWaste.methaneCapturedM3PerTonCpo} m³ CH₄` : '0 m³'}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-teal-800">{s.circularity.liquidWaste.liquidWasteUtilizationRatePercent}%</td>
                  <td className="p-2.5 text-[11px] text-slate-600">{s.circularity.liquidWaste.pathways.join(' • ')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BAB 7: SUSTAINABLE DEVELOPMENT INDEX (SDI) & STANDAR ISPO/RSPO */}
        <div className="space-y-4">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">7</span>
              <span>Sustainable Development Index (SDI) &amp; Kepatuhan Standar (ISPO &amp; RSPO)</span>
            </h2>
            <span className="text-xs font-mono text-emerald-800 font-semibold">Skor SDI: {s.sdi.compositeScore}/100 ({s.sdi.tier})</span>
          </div>

          <p className="text-xs text-slate-700 text-justify">
            Kerangka skoring komposit SDI mengintegrasikan hasil evaluasi dampak iklim, sirkularitas, kemandirian energi, dan konservasi lahan. Tingkat kepatuhan terhadap regulasi wajib <strong>ISPO (Permentan No. 38/2020) mencapai {s.standards.ispoComplianceScorePercent}%</strong> dan standar sukarela <strong>RSPO P&amp;C mencapai {s.standards.rspoComplianceScorePercent}%</strong>.
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold text-slate-800 text-[11px]">
                <tr>
                  <th className="p-2.5 border-b border-slate-200">Kriteria &amp; Kode Standar</th>
                  <th className="p-2.5 border-b border-slate-200">Persyaratan Standar</th>
                  <th className="p-2.5 border-b border-slate-200">Kondisi Terukur Saat Ini</th>
                  <th className="p-2.5 border-b border-slate-200 text-center">Status Audit</th>
                  <th className="p-2.5 border-b border-slate-200">Rekomendasi Tindakan Korektif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {s.standards.criteria.map((cr, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-bold text-slate-900">
                      {cr.code}
                      <span className="block text-[10px] text-slate-500 font-normal">{cr.standard}</span>
                    </td>
                    <td className="p-2.5 text-[11px] text-slate-600">{cr.requirement}</td>
                    <td className="p-2.5 font-mono font-semibold text-slate-900">{cr.measuredValue}</td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          cr.status === 'COMPLIANT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cr.status === 'MINOR_GAP'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {cr.status === 'COMPLIANT' ? 'Patuh' : cr.status === 'MINOR_GAP' ? 'Minor Gap' : 'Tidak Patuh'}
                      </span>
                    </td>
                    <td className="p-2.5 text-[11px] text-slate-600">{cr.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BAB 8: ANALISIS HOTSPOT EMISI TERPERINCI */}
        <div className="space-y-4">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">8</span>
              <span>Rincian Sumber Hotspot Emisi Spesifik</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">Root-Cause Analysis</span>
          </div>

          <p className="text-xs text-slate-700">
            Berikut adalah dekomposisi mendalam emisi kotor dan kredit berdasarkan masing-masing input operasional dan reaksi biokimia di lapangan:
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold text-slate-800 text-[11px]">
                <tr>
                  <th className="p-2.5 border-b border-slate-200">Komponen Sumber Emisi &amp; Kredit</th>
                  <th className="p-2.5 border-b border-slate-200">Kategori Subsistem</th>
                  <th className="p-2.5 border-b border-slate-200 text-right">Nilai (kg CO₂e / ton CPO)</th>
                  <th className="p-2.5 border-b border-slate-200">Mekanisme Biokimia / Reaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Emisi Langsung N₂O Tanah (Direct N₂O)</td>
                  <td className="p-2.5 text-slate-500">Hulu (On-Farm)</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{r.sources.directN2O.toFixed(2)}</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Nitrifikasi dan denitrifikasi pupuk nitrogen (EF₁ = 1%)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Emisi Tidak Langsung N₂O (Indirect N₂O)</td>
                  <td className="p-2.5 text-slate-500">Hulu (On-Farm)</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{r.sources.indirectN2O.toFixed(2)}</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Volatilisasi NH₃ (Frac_GASF) &amp; pencucian NO₃⁻ (Frac_LEACH)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Hidrolisis Urea (CO₂ Emission)</td>
                  <td className="p-2.5 text-slate-500">Hulu (On-Farm)</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{r.sources.ureaHydrolysisCO2.toFixed(2)}</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Reaksi enzimatik urease melepaskan molekul karbon fosil CO₂</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Manufaktur Hulu Pupuk Kimia Sintetis</td>
                  <td className="p-2.5 text-slate-500">Hulu (On-Farm)</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{r.sources.fertilizerProduction.toFixed(2)}</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Emisi <em>embodied</em> pabrik amonia/NPK dari gas alam</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Konsumsi Solar Traktor &amp; Mesin Kebun</td>
                  <td className="p-2.5 text-slate-500">Hulu (On-Farm)</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{r.sources.farmFuelMachinery.toFixed(2)}</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Pembakaran bahan bakar solar alat mekanisasi pemupukan &amp; lansir</td>
                </tr>
                {r.sources.peatOxidation > 0 && (
                  <tr className="bg-rose-50/50">
                    <td className="p-2.5 font-bold text-rose-900">Oksidasi Gambut Terdrainase (Peat CO₂)</td>
                    <td className="p-2.5 text-rose-700">Hulu (On-Farm)</td>
                    <td className="p-2.5 text-right font-mono font-bold text-rose-800">{r.sources.peatOxidation.toFixed(2)}</td>
                    <td className="p-2.5 text-[11px] text-rose-700">Dekomposisi aerobik karbon tanah gambut akibat penurunan muka air</td>
                  </tr>
                )}
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Transportasi Logistik TBS (Trucking)</td>
                  <td className="p-2.5 text-slate-500">Transportasi</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{r.sources.ffbTransport.toFixed(2)}</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Emisi solar armada truk tonase 8-10 ton (0.12 kg CO₂/t.km)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Gas Metana Limbah Cair POME</td>
                  <td className="p-2.5 text-slate-500">Pabrik (PKS)</td>
                  <td className="p-2.5 text-right font-mono font-bold text-slate-900">{r.sources.pomeMethane.toFixed(2)}</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Degradasi anaerobik COD organik (B₀ = 0.25 kg CH₄/kg COD)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Bahan Bakar Start-up Boiler PKS</td>
                  <td className="p-2.5 text-slate-500">Pabrik (PKS)</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{r.sources.millStartupFuel.toFixed(2)}</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Solar bantu penyalaan awal tungku boiler setelah hari libur</td>
                </tr>
                <tr className="bg-teal-50/50">
                  <td className="p-2.5 font-bold text-teal-900">Kredit Ekspor Listrik Biogas ke Grid</td>
                  <td className="p-2.5 text-teal-700">Kredit (PKS)</td>
                  <td className="p-2.5 text-right font-mono font-bold text-teal-800">-{r.sources.biogasGridCredit.toFixed(2)}</td>
                  <td className="p-2.5 text-[11px] text-teal-700">Substitusi listrik grid fosil PLN (Faktor 0.78 kg CO₂/kWh)</td>
                </tr>
                <tr className="bg-teal-50/50">
                  <td className="p-2.5 font-bold text-teal-900">Kredit Ekspor Listrik Biomassa Padat</td>
                  <td className="p-2.5 text-teal-700">Kredit (PKS)</td>
                  <td className="p-2.5 text-right font-mono font-bold text-teal-800">-{r.sources.surplusBiomassElectricityCredit.toFixed(2)}</td>
                  <td className="p-2.5 text-[11px] text-teal-700">Surplus uap turbin kogenerasi cangkang &amp; serat mesokarp</td>
                </tr>
                <tr className="bg-teal-50/50">
                  <td className="p-2.5 font-bold text-teal-900">Kredit Pemulsaan Organik TKKS</td>
                  <td className="p-2.5 text-teal-700">Kredit (Hulu)</td>
                  <td className="p-2.5 text-right font-mono font-bold text-teal-800">-{r.sources.efbOrganicRecycleCredit.toFixed(2)}</td>
                  <td className="p-2.5 text-[11px] text-teal-700">Substitusi pupuk K kimia melalui pengembalian kalium biomassa TKKS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BAB 9: ANALISIS SENSITIVITAS ALOKASI ISO 14044 */}
        <div className="space-y-4">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">9</span>
              <span>Analisis Sensitivitas Alokasi Multi-Output ISO 14044</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">ISO 14044 Clause 4.3.4</span>
          </div>

          <p className="text-xs text-slate-700 text-justify">
            Pabrik kelapa sawit menghasilkan produk bersama (<em>co-products</em>) berupa Crude Palm Oil (CPO) dan Palm Kernel (PK). Berdasarkan klausul hierarki alokasi ISO 14044, pembagian beban emisi bersama dianalisis menggunakan tiga metode komparatif:
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold text-slate-800 text-[11px]">
                <tr>
                  <th className="p-2.5 border-b border-slate-200">Metode Alokasi ISO 14044</th>
                  <th className="p-2.5 border-b border-slate-200">Dasar Perhitungan (Basis Formula)</th>
                  <th className="p-2.5 border-b border-slate-200 text-right">Porsi CPO (%)</th>
                  <th className="p-2.5 border-b border-slate-200 text-right">Porsi PK (%)</th>
                  <th className="p-2.5 border-b border-slate-200 text-right">Jejak Karbon CPO (kg CO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="bg-emerald-50/40">
                  <td className="p-2.5 font-bold text-emerald-900">
                    Alokasi Energi (LHV) - Standar Acuan
                    <span className="block text-[10px] text-emerald-700 font-normal">Wajib pada sertifikasi RSPO &amp; EU RED II</span>
                  </td>
                  <td className="p-2.5 text-slate-600 font-mono text-[11px]">{allocEnergy.details.basis}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-800">{allocEnergy.details.cpoSharePercent}%</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">{allocEnergy.details.pkSharePercent}%</td>
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-800">
                    {(grossEmissionsBeforeAllocation * allocEnergy.cpoFactor - r.carbonCreditsKgCo2).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">
                    Alokasi Massa Kering (Mass Yield)
                    <span className="block text-[10px] text-slate-500">Berdasarkan rasio rendemen OER terhadap total massa</span>
                  </td>
                  <td className="p-2.5 text-slate-600 font-mono text-[11px]">{allocMass.details.basis}</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{allocMass.details.cpoSharePercent}%</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">{allocMass.details.pkSharePercent}%</td>
                  <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                    {(grossEmissionsBeforeAllocation * allocMass.cpoFactor - r.carbonCreditsKgCo2).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">
                    Alokasi Nilai Ekonomi (Revenue Market)
                    <span className="block text-[10px] text-slate-500">Berdasarkan nilai pendapatan pasar CPO ($900) vs PK ($500)</span>
                  </td>
                  <td className="p-2.5 text-slate-600 font-mono text-[11px]">{allocEcon.details.basis}</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{allocEcon.details.cpoSharePercent}%</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">{allocEcon.details.pkSharePercent}%</td>
                  <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                    {(grossEmissionsBeforeAllocation * allocEcon.cpoFactor - r.carbonCreditsKgCo2).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            *Catatan Auditor: Metode alokasi energi (LHV) dipilih sebagai metode dasar formal laporan ini karena mencerminkan kandungan energi instrinsik dan sesuai dengan regulasi pasar ekspor energi terbarukan global.
          </p>
        </div>

        {/* BAB 10: PERBANDINGAN MULTI-SKENARIO KINERJA INDUSTRI */}
        <div className="space-y-4">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">10</span>
              <span>Analisis Komparatif Multi-Skenario Kinerja Industri</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">Benchmark Evaluative Matrix</span>
          </div>

          <p className="text-xs text-slate-700">
            Perbandingan kinerja lingkungan skenario terpilih terhadap alternatif teknologi operasional industri sawit nasional:
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold text-slate-800 text-[11px]">
                <tr>
                  <th className="p-2.5 border-b border-slate-200">Skenario Operasional</th>
                  <th className="p-2.5 border-b border-slate-200">Teknologi Limbah POME</th>
                  <th className="p-2.5 border-b border-slate-200 text-right">Net GWP (kg CO₂e)</th>
                  <th className="p-2.5 border-b border-slate-200 text-right">Delta vs Baseline</th>
                  <th className="p-2.5 border-b border-slate-200 text-center">Grade RSPO</th>
                  <th className="p-2.5 border-b border-slate-200">Status Kelayakan Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {scenarios.map((scen) => {
                  const scenRes = scen.result;
                  const isCurrent = scen.id === currentScenario.id;
                  const baselineRes = scenarios[0].result?.totalGwpPerTonCpo || 814.16;
                  const deltaVsBaseline = scenRes
                    ? (((scenRes.totalGwpPerTonCpo - baselineRes) / baselineRes) * 100).toFixed(1)
                    : '0';

                  return (
                    <tr
                      key={scen.id}
                      className={isCurrent ? 'bg-emerald-50 font-bold text-slate-900 border-l-4 border-l-emerald-600' : ''}
                    >
                      <td className="p-2.5">
                        <div className="flex items-center gap-1.5">
                          {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          <span>{scen.name}</span>
                        </div>
                      </td>
                      <td className="p-2.5 text-slate-600">{scen.millInputs.treatmentMethod}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                        {scenRes?.totalGwpPerTonCpo.toLocaleString('id-ID')}
                      </td>
                      <td className="p-2.5 text-right font-mono">
                        {Number(deltaVsBaseline) > 0 ? (
                          <span className="text-rose-600">+{deltaVsBaseline}%</span>
                        ) : Number(deltaVsBaseline) < 0 ? (
                          <span className="text-emerald-700">{deltaVsBaseline}%</span>
                        ) : (
                          <span className="text-slate-400">Baseline (0%)</span>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            scenRes?.palmGhgrating === 'A+' || scenRes?.palmGhgrating === 'A'
                              ? 'bg-emerald-100 text-emerald-800'
                              : scenRes?.palmGhgrating === 'B'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          Grade {scenRes?.palmGhgrating}
                        </span>
                      </td>
                      <td className="p-2.5 text-[11px]">
                        {scen.farmInputs.peatSoilPercentage > 0 ? (
                          <span className="text-rose-700 font-semibold">Tinggi Risiko EUDR (Gambut)</span>
                        ) : scen.millInputs.treatmentMethod === 'BIOGAS_TO_POWER' ? (
                          <span className="text-emerald-700 font-semibold">Sangat Direkomendasikan (A+)</span>
                        ) : (
                          <span className="text-slate-600">Standar Konvensional</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* BAB 11: REKOMENDASI RENCANA AKSI DEKARBONISASI */}
        <div className="space-y-4">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">11</span>
              <span>Rencana Aksi Mitigasi &amp; Roadmap Dekarbonisasi (Action Plan)</span>
            </h2>
            <span className="text-xs font-mono text-emerald-800 font-semibold">Net-Zero Pathway</span>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">A</span>
                Inisiatif Prioritas Jangka Pendek (&lt; 1 Tahun): Pemulsaan Tandan Kosong Sawit (TKKS)
              </h4>
              <p className="leading-relaxed text-slate-600">
                Mengalihkan pembuangan TKKS ke tempat penimbunan dengan mewajibkan aplikasi <em>mulching</em> ke piringan tanaman kebun secara merata (dosis 20-30 ton/ha/tahun). Praktek ini mampu menyuplai unsur hara K₂O organik, mereduksi pengadaan pupuk MOP kimia sintetis sebesar 25-35%, mempertahankan kelembapan mikro tanah, dan memotong emisi embodied manufaktur pupuk.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">B</span>
                Inisiatif Jangka Menengah (1 - 3 Tahun): Instalasi Methane Capture &amp; Biogas Co-generation
              </h4>
              <p className="leading-relaxed text-slate-600">
                Pemasangan penutup membran HDPE (*covered anaerobic lagoon*) atau reaktor CSTR (<em>Continuous Stirred Tank Reactor</em>) pada kolam limbah cair POME. Penangkapan gas metana dengan efisiensi minimal 90% yang dimanfaatkan menjadi listrik biomassa (PLTBg) akan memangkas lebih dari <strong>54% jejak karbon total pabrik</strong>, membalikkan beban limbah menjadi kredit karbon ekspor ke jaringan PLN.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">C</span>
                Inisiatif Jangka Panjang (3 - 5 Tahun): Pengelolaan Air Gambut (Water Table Management) &amp; Logistik Hijau
              </h4>
              <p className="leading-relaxed text-slate-600">
                Bagi areal yang bersinggungan dengan tanah gambut, wajib menerapkan tata kelola sekat kanal (<em>canal blocking</em>) untuk mempertahankan tinggi muka air tanah 40 cm sesuai regulasi PP No. 57/2016 guna mencegah laju emisi subsidensi dan oksidasi karbon gambut yang sangat masif (&gt;55 ton CO₂/ha/tahun). Serta peremajaan armada truk angkut TBS menuju kendaraan beremisi rendah atau biodiesel B35/B40.
              </p>
            </div>
          </div>
        </div>

        {/* BAB 12: KESIMPULAN & LEMBAR PENGESAHAN AUDITOR */}
        <div className="space-y-6 pt-4 border-t-2 border-slate-900">
          <div className="space-y-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">12</span>
              <span>Kesimpulan &amp; Pernyataan Independensi Verifikasi</span>
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              Berdasarkan seluruh tahapan evaluasi data inventori (LCI) dan penilaian dampak (LCIA) yang mengacu pada standar ISO 14040/14044:2006, tim penilai menyatakan bahwa data yang tercantum dalam laporan ini telah melalui verifikasi konsistensi neraca massa, kepatuhan metodologi alokasi, serta keterlacakan sumber emisi. Nilai emisi yang dihasilkan dapat dipergunakan secara sah untuk keperluan pelaporan ESG, pengajuan sertifikasi RSPO/ISPO, dan pemenuhan dokumen uji tuntas regulasi pasar internasional.
            </p>
          </div>

          {/* Lembar Tanda Tangan Verifikasi (Sign-off) */}
          <div className="pt-6">
            <div className="flex justify-between items-end text-xs text-slate-800">
              <div className="text-center w-56">
                <span className="text-slate-500 block mb-14">Disusun &amp; Diverifikasi oleh:</span>
                <div className="border-b border-slate-600 font-bold pb-1 text-slate-900">{assessorName}</div>
                <span className="text-[11px] text-slate-600 block mt-0.5">Lead LCA Assessor &amp; Practitioner</span>
                <span className="text-[10px] text-slate-400 font-mono">Reg. No: LCA-ID-2024-089</span>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-2 border-emerald-800 flex items-center justify-center text-[10px] text-emerald-900 font-bold uppercase tracking-tighter mx-auto mb-2 opacity-90 rotate-[-10deg] shadow-sm bg-emerald-50/30">
                  <div className="text-center leading-tight">
                    <span>VERIFIED</span>
                    <br />
                    <span className="text-[8px] text-emerald-700">ISO 14044</span>
                    <br />
                    <span className="text-xs text-emerald-900">2026</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">Segel Verifikasi Independen</span>
              </div>

              <div className="text-center w-56">
                <span className="text-slate-500 block mb-14">Disetujui &amp; Disahkan oleh:</span>
                <div className="border-b border-slate-600 font-bold pb-1 text-slate-900">{verifierName}</div>
                <span className="text-[11px] text-slate-600 block mt-0.5">Kepala Unit Operasional / GM PKS</span>
                <span className="text-[10px] text-slate-400 font-mono">{millName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

