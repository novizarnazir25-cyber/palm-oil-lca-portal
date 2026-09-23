'use client';

import React from 'react';
import Link from 'next/link';
import { LcaCalculationResult, FarmInputs, MillInputs } from '@/lib/lca/types';
import { Download, FileSpreadsheet, FileText, Printer } from 'lucide-react';

interface Props {
  result: LcaCalculationResult;
  farm: FarmInputs;
  mill: MillInputs;
  scenarioName?: string;
}

export default function ReportExporter({ result, farm, mill, scenarioName = 'Kajian LCA CPO' }: Props) {
  const downloadCsv = () => {
    const rows = [
      ['Kategori', 'Parameter / Indikator', 'Nilai', 'Satuan'],
      ['Umum', 'Nama Kajian', scenarioName, ''],
      ['Umum', 'Satuan Fungsional', result.functionalUnit, ''],
      ['Umum', 'Metode Alokasi ISO 14044', result.allocationMethod, ''],
      ['Umum', 'Faktor Alokasi CPO', (result.cpoAllocationFactor * 100).toFixed(2), '%'],
      ['Umum', 'Faktor Alokasi Palm Kernel', (result.pkAllocationFactor * 100).toFixed(2), '%'],
      ['Hasil', 'Total GWP CPO (Net)', result.totalGwpPerTonCpo, 'kg CO2eq / ton CPO'],
      ['Hasil', 'Total GWP CPO per kg', result.totalGwpPerKgCpo, 'kg CO2eq / kg CPO'],
      ['Hasil', 'Total GWP TBS', result.totalGwpPerTonFfb, 'kg CO2eq / ton TBS'],
      ['Hasil', 'Emisi Hulu (Perkebunan)', result.upstreamEmissionsKgCo2, 'kg CO2eq / ton CPO'],
      ['Hasil', 'Emisi Transportasi TBS', result.transportEmissionsKgCo2, 'kg CO2eq / ton CPO'],
      ['Hasil', 'Emisi Proses Pabrik PKS', result.millEmissionsKgCo2, 'kg CO2eq / ton CPO'],
      ['Hasil', 'Emisi Limbah Cair POME', result.pomeEmissionsKgCo2, 'kg CO2eq / ton CPO'],
      ['Hasil', 'Kredit Karbon Terhindar', result.carbonCreditsKgCo2, 'kg CO2eq / ton CPO'],
      ['Hasil', 'Potensi Eutrofikasi', result.eutrophicationPotentialKgPo4EqPerTonCpo, 'kg PO4eq / ton CPO'],
      ['Hasil', 'Potensi Pengasaman', result.acidificationPotentialKgSo2EqPerTonCpo, 'kg SO2eq / ton CPO'],
      ['Hasil', 'Peringkat PalmGHG', result.palmGhgrating, 'Grade'],
      ['Sumber Detail', 'Emisi Langsung N2O Pupuk', result.sources.directN2O, 'kg CO2eq / ton CPO'],
      ['Sumber Detail', 'Emisi Tak Langsung N2O Pupuk', result.sources.indirectN2O, 'kg CO2eq / ton CPO'],
      ['Sumber Detail', 'Emisi CO2 Hidrolisis Urea', result.sources.ureaHydrolysisCO2, 'kg CO2eq / ton CPO'],
      ['Sumber Detail', 'Manufaktur Pupuk Kimia', result.sources.fertilizerProduction, 'kg CO2eq / ton CPO'],
      ['Sumber Detail', 'Bahan Bakar Mesin Kebun', result.sources.farmFuelMachinery, 'kg CO2eq / ton CPO'],
      ['Sumber Detail', 'Oksidasi Lahan Gambut', result.sources.peatOxidation, 'kg CO2eq / ton CPO'],
      ['Sumber Detail', 'Transportasi Truk TBS', result.sources.ffbTransport, 'kg CO2eq / ton CPO'],
      ['Sumber Detail', 'Metana Limbah Cair POME', result.sources.pomeMethane, 'kg CO2eq / ton CPO'],
      ['Sumber Detail', 'Kredit Listrik Biogas ke Grid', result.sources.biogasGridCredit, 'kg CO2eq / ton CPO'],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.map((val) => `"${val}"`).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LCA_PalmOil_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJson = () => {
    const data = {
      scenarioName,
      timestamp: new Date().toISOString(),
      standards: ['ISO 14040/14044', 'IPCC 2019 Refinement', 'RSPO PalmGHG v4', 'ISPO'],
      farmInputs: farm,
      millInputs: mill,
      calculationResult: result,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `LCA_PalmOil_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/report"
        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-500 hover:to-emerald-500 transition-all shadow-md shadow-emerald-950/40 hover:scale-[1.02] border border-teal-400/30"
        title="Buka Dokumen Resmi Laporan Akhir Kajian LCA"
      >
        <Printer className="w-3.5 h-3.5 text-white" />
        <span>Buat Laporan Akhir</span>
      </Link>

      <button
        onClick={downloadCsv}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
        title="Download ringkasan data tabel CSV"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
        Ekspor CSV
      </button>

      <button
        onClick={downloadJson}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
        title="Download data mentah JSON"
      >
        <FileText className="w-3.5 h-3.5 text-cyan-400" />
        JSON
      </button>
    </div>
  );
}
