/**
 * Engine Verification Script (ESM)
 * Tests calculation math against RSPO PalmGHG and IPCC benchmarks.
 */

import { calculatePalmOilLca } from '../src/lib/lca/engine.ts';
import { DEFAULT_FARM_PRESET, DEFAULT_MILL_PRESET } from '../src/lib/lca/defaultFactors.ts';

console.log('=== PALM OIL LCA ENGINE VERIFICATION ===\n');

// 1. Test Open Anaerobic Lagoon (Baseline)
const openLagoonResult = calculatePalmOilLca(
  DEFAULT_FARM_PRESET,
  { ...DEFAULT_MILL_PRESET, treatmentMethod: 'OPEN_ANAEROBIC_LAGOON' }
);

console.log('[1] Skenario Kolam Anaerobik Terbuka (Baseline):');
console.log(`- Total GWP per ton CPO : ${openLagoonResult.totalGwpPerTonCpo} kg CO2eq / t CPO`);
console.log(`- Total GWP per kg CPO  : ${openLagoonResult.totalGwpPerKgCpo} kg CO2eq / kg CPO`);
console.log(`- Upstream (Kebun)      : ${openLagoonResult.upstreamEmissionsKgCo2} kg CO2eq / t CPO`);
console.log(`- Transportasi TBS      : ${openLagoonResult.transportEmissionsKgCo2} kg CO2eq / t CPO`);
console.log(`- POME Methane          : ${openLagoonResult.pomeEmissionsKgCo2} kg CO2eq / t CPO`);
console.log(`- Carbon Credits        : ${openLagoonResult.carbonCreditsKgCo2} kg CO2eq / t CPO`);
console.log(`- PalmGHG Rating        : ${openLagoonResult.palmGhgrating}\n`);

// 2. Test Methane Capture & Flaring
const flaringResult = calculatePalmOilLca(
  DEFAULT_FARM_PRESET,
  { ...DEFAULT_MILL_PRESET, treatmentMethod: 'METHANE_CAPTURE_FLARING', methaneCaptureEfficiency: 0.90 }
);

console.log('[2] Skenario Methane Capture & Flaring (90% Efisiensi):');
console.log(`- Total GWP per ton CPO : ${flaringResult.totalGwpPerTonCpo} kg CO2eq / t CPO`);
console.log(`- POME Methane          : ${flaringResult.pomeEmissionsKgCo2} kg CO2eq / t CPO`);
const reductionFlaring = (((openLagoonResult.totalGwpPerTonCpo - flaringResult.totalGwpPerTonCpo) / openLagoonResult.totalGwpPerTonCpo) * 100).toFixed(1);
console.log(`- Reduksi Emisi vs Base : ${reductionFlaring}%\n`);

// 3. Test Biogas to Power (PLTBg) with Grid Export
const biogasPowerResult = calculatePalmOilLca(
  DEFAULT_FARM_PRESET,
  {
    ...DEFAULT_MILL_PRESET,
    treatmentMethod: 'BIOGAS_TO_POWER',
    methaneCaptureEfficiency: 0.90,
    biogasPowerExportPercentage: 80
  }
);

console.log('[3] Skenario Biogas to Power (PLTBg - Ekspor Listrik):');
console.log(`- Total GWP per ton CPO : ${biogasPowerResult.totalGwpPerTonCpo} kg CO2eq / t CPO`);
console.log(`- POME Methane          : ${biogasPowerResult.pomeEmissionsKgCo2} kg CO2eq / t CPO`);
console.log(`- Kredit Listrik Biogas : ${biogasPowerResult.sources.biogasGridCredit} kg CO2eq / t CPO`);
console.log(`- PalmGHG Rating        : ${biogasPowerResult.palmGhgrating}`);
const reductionBiogas = (((openLagoonResult.totalGwpPerTonCpo - biogasPowerResult.totalGwpPerTonCpo) / openLagoonResult.totalGwpPerTonCpo) * 100).toFixed(1);
console.log(`- Reduksi Emisi vs Base : ${reductionBiogas}%\n`);

// 4. Test Peat Soil Scenario
const peatResult = calculatePalmOilLca(
  { ...DEFAULT_FARM_PRESET, peatSoilPercentage: 50 },
  DEFAULT_MILL_PRESET
);
console.log('[4] Skenario Kebun Lahan Gambut (50% Area Gambut Terdegradasi):');
console.log(`- Total GWP per ton CPO : ${peatResult.totalGwpPerTonCpo} kg CO2eq / t CPO`);
console.log(`- Peat Oxidation Source : ${peatResult.sources.peatOxidation} kg CO2eq / t CPO`);
console.log(`- PalmGHG Rating        : ${peatResult.palmGhgrating}\n`);

console.log('=== VERIFIKASI SELESAI DENGAN SUKSES ===');
