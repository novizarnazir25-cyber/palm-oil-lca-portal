import { PrismaClient } from '@prisma/client';
import { DEFAULT_FARM_PRESET, DEFAULT_MILL_PRESET, DEFAULT_EMISSION_FACTORS } from './lca/defaultFactors';
import { calculatePalmOilLca } from './lca/engine';
import { LcaSimulationScenario } from './lca/types';

// Global Prisma instance for development hot reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Built-in benchmark presets for immediate simulation
 */
export const INITIAL_SCENARIOS: LcaSimulationScenario[] = [
  {
    id: 'scen-baseline-open-lagoon',
    name: 'PKS Konvensional (Kolam Anaerobik Terbuka)',
    description: 'PKS standar tanpa penangkapan biogas. Limbah cair POME diolah dalam kolam anaerobik terbuka. Kebun di tanah mineral.',
    farmInputs: { ...DEFAULT_FARM_PRESET },
    millInputs: {
      ...DEFAULT_MILL_PRESET,
      treatmentMethod: 'OPEN_ANAEROBIC_LAGOON',
    },
  },
  {
    id: 'scen-methane-flare',
    name: 'PKS Modern (Methane Capture & Flaring)',
    description: 'PKS yang dilengkapi biodigester penutup geomembrane. Gas metana ditangkap dan dibakar (flare) menjadi CO2 biogenik.',
    farmInputs: { ...DEFAULT_FARM_PRESET },
    millInputs: {
      ...DEFAULT_MILL_PRESET,
      treatmentMethod: 'METHANE_CAPTURE_FLARING',
      methaneCaptureEfficiency: 0.90,
    },
  },
  {
    id: 'scen-biogas-power',
    name: 'PKS Berkelanjutan (Biogas to Power / PLTBg)',
    description: 'PKS hijau dengan penangkapan metana untuk pembangkit listrik tenaga biogas (PLTBg). 80% listrik diekspor ke jaringan PLN.',
    farmInputs: {
      ...DEFAULT_FARM_PRESET,
      efbMulchingTonsPerHa: 25, // Pemulsaan TKKS intensif
      ureaKgPerHa: 160,         // Pengurangan pupuk N kimia karena substitusi TKKS
    },
    millInputs: {
      ...DEFAULT_MILL_PRESET,
      treatmentMethod: 'BIOGAS_TO_POWER',
      methaneCaptureEfficiency: 0.90,
      biogasPowerExportPercentage: 80,
      gridElectricityExportKwhPerTonFfb: 10,
    },
  },
  {
    id: 'scen-peatland-estate',
    name: 'Perkebunan Gambut (Drained Peatland)',
    description: 'Perkebunan dengan 40% area berada di lahan gambut terdegradasi. Memperlihatkan kontribusi emisi dekomposisi gambut.',
    farmInputs: {
      ...DEFAULT_FARM_PRESET,
      peatSoilPercentage: 40,
    },
    millInputs: {
      ...DEFAULT_MILL_PRESET,
      treatmentMethod: 'OPEN_ANAEROBIC_LAGOON',
    },
  },
];

// Pre-calculate results for initial scenarios
INITIAL_SCENARIOS.forEach((scen) => {
  scen.result = calculatePalmOilLca(scen.farmInputs, scen.millInputs, DEFAULT_EMISSION_FACTORS);
});
