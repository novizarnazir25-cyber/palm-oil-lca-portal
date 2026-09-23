import { PrismaClient } from '@prisma/client';
import { INITIAL_SCENARIOS } from '../src/lib/db.ts';
import { DEFAULT_EMISSION_FACTORS } from '../src/lib/lca/defaultFactors.ts';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING LCA DATABASE ---');

  // Seed Scenarios
  for (const scen of INITIAL_SCENARIOS) {
    const existing = await prisma.lcaScenario.findFirst({
      where: { name: scen.name },
    });

    if (!existing) {
      await prisma.lcaScenario.create({
        data: {
          name: scen.name,
          description: scen.description,
          isDefault: true,
          ...scen.farmInputs,
          ...scen.millInputs,
          totalGwpPerTonCpo: scen.result?.totalGwpPerTonCpo,
          totalGwpPerKgCpo: scen.result?.totalGwpPerKgCpo,
          upstreamEmissionsKgCo2: scen.result?.upstreamEmissionsKgCo2,
          transportEmissionsKgCo2: scen.result?.transportEmissionsKgCo2,
          millEmissionsKgCo2: scen.result?.millEmissionsKgCo2,
          pomeEmissionsKgCo2: scen.result?.pomeEmissionsKgCo2,
          carbonCreditsKgCo2: scen.result?.carbonCreditsKgCo2,
          palmGhgrating: scen.result?.palmGhgrating,
        },
      });
      console.log(`Created scenario: ${scen.name}`);
    }
  }

  // Seed Default Emission Factors
  const factors = [
    { code: 'GWP_CH4', name: 'Methane GWP (100-yr)', category: 'GWP', value: DEFAULT_EMISSION_FACTORS.gwpCH4, unit: 'kg CO2eq / kg CH4', source: 'IPCC AR5' },
    { code: 'GWP_N2O', name: 'Nitrous Oxide GWP (100-yr)', category: 'GWP', value: DEFAULT_EMISSION_FACTORS.gwpN2O, unit: 'kg CO2eq / kg N2O', source: 'IPCC AR5' },
    { code: 'EF_DIRECT_N2O', name: 'Direct N2O from Synthetic N', category: 'FERTILIZER', value: DEFAULT_EMISSION_FACTORS.efDirectN2O, unit: 'kg N2O-N / kg N', source: 'IPCC 2019' },
    { code: 'EF_UREA_CO2', name: 'Urea Hydrolysis CO2', category: 'FERTILIZER', value: DEFAULT_EMISSION_FACTORS.efUreaCO2, unit: 'kg CO2 / kg urea', source: 'IPCC 2006' },
    { code: 'EF_PEAT_OXIDATION', name: 'Peat Soil Oxidation', category: 'LUC', value: DEFAULT_EMISSION_FACTORS.efPeatOxidationTonCo2PerHa, unit: 'ton CO2 / ha / yr', source: 'RSPO / IPCC' },
    { code: 'EF_DIESEL', name: 'Diesel Fuel Combustion (WTW)', category: 'FUEL', value: DEFAULT_EMISSION_FACTORS.efDieselCombustionKgCo2PerL, unit: 'kg CO2eq / L', source: 'RSPO PalmGHG' },
    { code: 'BO_MAX_CH4', name: 'POME Max CH4 Potential', category: 'POME', value: DEFAULT_EMISSION_FACTORS.boMaxMethaneYieldKgCh4PerKgCod, unit: 'kg CH4 / kg COD', source: 'IPCC Wastewater' },
  ];

  for (const f of factors) {
    await prisma.emissionFactor.upsert({
      where: { code: f.code },
      update: { value: f.value },
      create: f,
    });
  }

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
