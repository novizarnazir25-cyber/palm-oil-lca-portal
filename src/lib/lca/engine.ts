import {
  FarmInputs,
  MillInputs,
  LcaEmissionFactors,
  LcaCalculationResult,
  DetailedSources,
  StageBreakdown,
} from './types';
import { DEFAULT_EMISSION_FACTORS } from './defaultFactors';
import { calculateAllocationFactors } from './allocator';
import { calculateAdvancedSustainability } from './sustainabilityEngine';

/**
 * Calculates Life Cycle Greenhouse Gas Emissions and Environmental Impacts
 * for Cradle-to-Gate Palm Oil Supply Chain (Plantation to CPO Gate).
 * 
 * Complies with:
 * - ISO 14040/14044 LCA Standard
 * - IPCC 2006 / 2019 Refinement Guidelines
 * - RSPO PalmGHG v4 & ISPO
 */
export function calculatePalmOilLca(
  farm: FarmInputs,
  mill: MillInputs,
  factors: LcaEmissionFactors = DEFAULT_EMISSION_FACTORS
): LcaCalculationResult {
  // Ensure valid non-zero parameters
  const yieldHa = Math.max(0.1, farm.ffbYieldPerHa);
  const oer = Math.max(0.01, mill.oer);
  const ker = Math.max(0.001, mill.ker);

  // -------------------------------------------------------------
  // 1. UPSTREAM (PERKEBUNAN / ON-FARM EMISSIONS) PER HECTARE
  // -------------------------------------------------------------
  
  // 1.1 Synthetic Nitrogen Inputs (kg N / ha / year)
  const nFromUrea = farm.ureaKgPerHa * 0.46; // Urea is 46% N
  const nFromZa = farm.ammoniumSulfateKgPerHa * 0.21; // ZA is 21% N
  const nFromNpk = farm.npkKgPerHa * farm.npkRatioN; // NPK N fraction
  const totalSyntheticN = nFromUrea + nFromZa + nFromNpk;

  // Direct N2O Emissions (IPCC Tier 1)
  // E_N2O_dir = N_input * EF1 * (44/28) * GWP_N2O
  const directN2oKgPerHa = totalSyntheticN * factors.efDirectN2O * (44 / 28);
  const directN2oCo2eKgPerHa = directN2oKgPerHa * factors.gwpN2O;

  // Indirect N2O Emissions: Volatilization & Atmospheric Deposition
  const nVolatilized = totalSyntheticN * factors.fracGasF * factors.efVolatilizationN2O;
  // Indirect N2O Emissions: Leaching and Runoff
  const nLeached = totalSyntheticN * factors.fracLeach * factors.efLeachingN2O;
  const indirectN2oKgPerHa = (nVolatilized + nLeached) * (44 / 28);
  const indirectN2oCo2eKgPerHa = indirectN2oKgPerHa * factors.gwpN2O;

  // Urea Application Direct CO2 Emissions (IPCC Tier 1)
  // Hydrolysis of urea releases carbon: CO(NH2)2 + H2O -> 2 NH3 + CO2
  const ureaDirectCo2KgPerHa = farm.ureaKgPerHa * factors.efUreaCO2;

  // Upstream Embodied Footprint of Fertilizers (Manufacturing & Logistics)
  const fertMfgUrea = farm.ureaKgPerHa * factors.efProdUrea;
  const fertMfgZa = farm.ammoniumSulfateKgPerHa * factors.efProdAmmoniumSulfate;
  const fertMfgP = (farm.rockPhosphateKgPerHa + farm.npkKgPerHa * farm.npkRatioP2O5) * factors.efProdP2O5;
  const fertMfgK = (farm.mopKclKgPerHa + farm.npkKgPerHa * farm.npkRatioK2O) * factors.efProdK2O;
  const fertMfgDolomite = farm.dolomiteKgPerHa * factors.efProdDolomite;
  const totalFertilizerProductionCo2eKgPerHa =
    fertMfgUrea + fertMfgZa + fertMfgP + fertMfgK + fertMfgDolomite;

  // Agrochemicals (Pesticides / Herbicides) Manufacturing Footprint
  const pesticideProductionCo2eKgPerHa = farm.herbicideAiKgPerHa * factors.efProdPesticideAi;

  // Agricultural Machinery & Internal Estate Tractor Diesel Fuel
  const farmFuelCo2eKgPerHa = farm.dieselTractorLitersPerHa * factors.efDieselCombustionKgCo2PerL;

  // Peat Soil Oxidation (Drained Tropical Peatland Decomposition)
  const peatFraction = Math.max(0, Math.min(100, farm.peatSoilPercentage)) / 100;
  // 55 t CO2/ha/year * 1000 kg/t
  const peatOxidationCo2eKgPerHa = peatFraction * (factors.efPeatOxidationTonCo2PerHa * 1000);

  // EFB Mulching Organic Credit (Nutrient cycling & organic carbon)
  // Returns K and nutrients, sequestering/avoiding approx 12 kg CO2eq / ton EFB
  const efbCreditKgCo2PerHa = farm.efbMulchingTonsPerHa * 12.0;

  // Total Upstream Emissions per ton of FFB (kg CO2eq / ton FFB)
  const directN2oPerTonFfb = directN2oCo2eKgPerHa / yieldHa;
  const indirectN2oPerTonFfb = indirectN2oCo2eKgPerHa / yieldHa;
  const ureaCo2PerTonFfb = ureaDirectCo2KgPerHa / yieldHa;
  const fertMfgPerTonFfb = totalFertilizerProductionCo2eKgPerHa / yieldHa;
  const pesticideMfgPerTonFfb = pesticideProductionCo2eKgPerHa / yieldHa;
  const farmFuelPerTonFfb = farmFuelCo2eKgPerHa / yieldHa;
  const peatOxidationPerTonFfb = peatOxidationCo2eKgPerHa / yieldHa;
  const efbCreditPerTonFfb = efbCreditKgCo2PerHa / yieldHa;

  const totalFarmGrossPerTonFfb =
    directN2oPerTonFfb +
    indirectN2oPerTonFfb +
    ureaCo2PerTonFfb +
    fertMfgPerTonFfb +
    pesticideMfgPerTonFfb +
    farmFuelPerTonFfb +
    peatOxidationPerTonFfb;

  // -------------------------------------------------------------
  // 2. FFB TRANSPORTATION TO MILL (PKS) PER TON FFB
  // -------------------------------------------------------------
  // Distance km * 2 (round trip empty return) / payload, or standard t.km factor
  // Default t.km approach:
  const transportPerTonFfb = farm.transportDistanceKm * factors.efTransportTruckTkmKgCo2;

  // -------------------------------------------------------------
  // 3. PALM OIL MILL (CORE / PROCESSING) EMISSIONS PER TON FFB
  // -------------------------------------------------------------
  
  // 3.1 Mill Boiler Auxiliary Diesel (Startup & Backup)
  const millStartupDieselPerTonFfb =
    mill.boilerDieselStartupLPerTonFfb * factors.efDieselCombustionKgCo2PerL;

  // 3.2 Surplus Biomass Cogeneration Electricity Export Credit
  const biomassCogenCreditPerTonFfb =
    mill.gridElectricityExportKwhPerTonFfb * factors.efGridDisplacementKgCo2PerKwh;

  // 3.3 Palm Oil Mill Effluent (POME) Methane Generation (IPCC Tier 2)
  // Total COD = POME volume (m3/t FFB) * COD (kg COD/m3)
  const codPerM3Pome = mill.pomeCodMgPerL / 1000; // e.g. 30,000 mg/L = 30 kg/m3
  const totalCodKgPerTonFfb = mill.pomeRatioM3PerTonFfb * codPerM3Pome;
  
  // Theoretical Maximum CH4 Potential
  const maxCh4KgPerTonFfb = totalCodKgPerTonFfb * factors.boMaxMethaneYieldKgCh4PerKgCod;

  let pomeMethaneEmittedKgPerTonFfb = 0;
  let biogasElectricityCreditPerTonFfb = 0;

  if (mill.treatmentMethod === 'OPEN_ANAEROBIC_LAGOON') {
    // Open Lagoon: MCF = 0.80. All generated methane escapes to atmosphere
    pomeMethaneEmittedKgPerTonFfb = maxCh4KgPerTonFfb * factors.mcfOpenLagoon;
  } else if (mill.treatmentMethod === 'METHANE_CAPTURE_FLARING') {
    // Methane Capture with Gas Flaring
    const captureEff = Math.max(0.5, Math.min(0.99, mill.methaneCaptureEfficiency));
    // Fugitive uncaptured escapes with open MCF
    pomeMethaneEmittedKgPerTonFfb = maxCh4KgPerTonFfb * (1 - captureEff) * factors.mcfOpenLagoon;
    // Captured CH4 is flared to biogenic CO2 (neutral GWP)
  } else if (mill.treatmentMethod === 'BIOGAS_TO_POWER') {
    // Methane Capture with Biogas Power Plant (PLTBg)
    const captureEff = Math.max(0.5, Math.min(0.99, mill.methaneCaptureEfficiency));
    // Fugitive uncaptured escapes
    pomeMethaneEmittedKgPerTonFfb = maxCh4KgPerTonFfb * (1 - captureEff) * factors.mcfOpenLagoon;
    
    // Captured CH4 utilized in gas engine generator
    const capturedCh4Kg = maxCh4KgPerTonFfb * captureEff;
    const capturedCh4VolumeM3 = capturedCh4Kg / factors.ch4DensityKgPerM3;
    const powerGeneratedKwh =
      capturedCh4VolumeM3 * mill.biogasGeneratorEfficiencyKwhPerM3Ch4;
    const powerExportedKwh =
      powerGeneratedKwh * (Math.max(0, Math.min(100, mill.biogasPowerExportPercentage)) / 100);
    
    // Avoided emission credit for displacing fossil grid electricity
    biogasElectricityCreditPerTonFfb = powerExportedKwh * factors.efGridDisplacementKgCo2PerKwh;
  }

  const pomeGwpPerTonFfb = pomeMethaneEmittedKgPerTonFfb * factors.gwpCH4;

  // -------------------------------------------------------------
  // 4. ISO 14044 CO-PRODUCT ALLOCATION (CPO vs PALM KERNEL)
  // -------------------------------------------------------------
  const allocation = calculateAllocationFactors(
    mill.allocationMethod,
    oer,
    ker,
    mill.lhvCpoMjPerKg,
    mill.lhvPkMjPerKg,
    mill.priceCpoUsdPerTon,
    mill.pricePkUsdPerTon
  );
  const fCpo = allocation.cpoFactor;
  const fPk = allocation.pkFactor;

  // FFB needed to produce 1 ton of CPO = 1 / OER
  const ffbMultiplier = 1 / oer;

  // -------------------------------------------------------------
  // 5. SCALE EMISSIONS TO 1 TON CPO FUNCTIONAL UNIT
  // -------------------------------------------------------------
  // Formula: Emission_per_ton_CPO = (Emission_per_ton_FFB * Allocation_Factor_CPO) / OER
  const scale = (valPerTonFfb: number) => valPerTonFfb * fCpo * ffbMultiplier;

  const directN2oCpo = scale(directN2oPerTonFfb);
  const indirectN2oCpo = scale(indirectN2oPerTonFfb);
  const ureaCo2Cpo = scale(ureaCo2PerTonFfb);
  const fertMfgCpo = scale(fertMfgPerTonFfb);
  const pesticideMfgCpo = scale(pesticideMfgPerTonFfb);
  const farmFuelCpo = scale(farmFuelPerTonFfb);
  const peatOxidationCpo = scale(peatOxidationPerTonFfb);

  const transportCpo = scale(transportPerTonFfb);

  const millStartupFuelCpo = scale(millStartupDieselPerTonFfb);
  const pomeMethaneCpo = scale(pomeGwpPerTonFfb);

  // Carbon Credits (Negative emissions)
  const biogasGridCreditCpo = scale(biogasElectricityCreditPerTonFfb);
  const biomassGridCreditCpo = scale(biomassCogenCreditPerTonFfb);
  const efbMulchCreditCpo = scale(efbCreditPerTonFfb);

  const totalCreditsCpo = biogasGridCreditCpo + biomassGridCreditCpo + efbMulchCreditCpo;

  const upstreamCpo =
    directN2oCpo +
    indirectN2oCpo +
    ureaCo2Cpo +
    fertMfgCpo +
    pesticideMfgCpo +
    farmFuelCpo +
    peatOxidationCpo;

  const transportTotalCpo = transportCpo;
  const millProcessCpo = millStartupFuelCpo;
  const pomeTotalCpo = pomeMethaneCpo;

  const grossTotalCpo = upstreamCpo + transportTotalCpo + millProcessCpo + pomeTotalCpo;
  const netTotalCpo = grossTotalCpo - totalCreditsCpo;

  // -------------------------------------------------------------
  // 6. DETAILED HOTSPOT BREAKDOWN & SUMMARY STAGES
  // -------------------------------------------------------------
  const sources: DetailedSources = {
    directN2O: Number(directN2oCpo.toFixed(2)),
    indirectN2O: Number(indirectN2oCpo.toFixed(2)),
    ureaHydrolysisCO2: Number(ureaCo2Cpo.toFixed(2)),
    fertilizerProduction: Number(fertMfgCpo.toFixed(2)),
    pesticideProduction: Number(pesticideMfgCpo.toFixed(2)),
    farmFuelMachinery: Number(farmFuelCpo.toFixed(2)),
    peatOxidation: Number(peatOxidationCpo.toFixed(2)),
    ffbTransport: Number(transportCpo.toFixed(2)),
    pomeMethane: Number(pomeMethaneCpo.toFixed(2)),
    millStartupFuel: Number(millStartupFuelCpo.toFixed(2)),
    biogasGridCredit: Number(biogasGridCreditCpo.toFixed(2)),
    surplusBiomassElectricityCredit: Number(biomassGridCreditCpo.toFixed(2)),
    efbOrganicRecycleCredit: Number(efbMulchCreditCpo.toFixed(2)),
  };

  const stageSummary: StageBreakdown[] = [
    {
      stage: 'Upstream (Perkebunan)',
      grossEmissionsKgCo2: Number(upstreamCpo.toFixed(2)),
      avoidedCreditsKgCo2: Number(efbMulchCreditCpo.toFixed(2)),
      netEmissionsKgCo2: Number((upstreamCpo - efbMulchCreditCpo).toFixed(2)),
      percentageOfTotal: grossTotalCpo > 0 ? Number(((upstreamCpo / grossTotalCpo) * 100).toFixed(1)) : 0,
    },
    {
      stage: 'Transportasi TBS',
      grossEmissionsKgCo2: Number(transportTotalCpo.toFixed(2)),
      avoidedCreditsKgCo2: 0,
      netEmissionsKgCo2: Number(transportTotalCpo.toFixed(2)),
      percentageOfTotal: grossTotalCpo > 0 ? Number(((transportTotalCpo / grossTotalCpo) * 100).toFixed(1)) : 0,
    },
    {
      stage: 'Proses PKS (Boiler & Mill)',
      grossEmissionsKgCo2: Number(millProcessCpo.toFixed(2)),
      avoidedCreditsKgCo2: Number(biomassGridCreditCpo.toFixed(2)),
      netEmissionsKgCo2: Number((millProcessCpo - biomassGridCreditCpo).toFixed(2)),
      percentageOfTotal: grossTotalCpo > 0 ? Number(((millProcessCpo / grossTotalCpo) * 100).toFixed(1)) : 0,
    },
    {
      stage: 'Pengolahan Limbah POME',
      grossEmissionsKgCo2: Number(pomeTotalCpo.toFixed(2)),
      avoidedCreditsKgCo2: Number(biogasGridCreditCpo.toFixed(2)),
      netEmissionsKgCo2: Number((pomeTotalCpo - biogasGridCreditCpo).toFixed(2)),
      percentageOfTotal: grossTotalCpo > 0 ? Number(((pomeTotalCpo / grossTotalCpo) * 100).toFixed(1)) : 0,
    },
  ];

  // -------------------------------------------------------------
  // 7. COMPREHENSIVE LCIA MIDPOINT (ReCiPe 2016 H / CML)
  // -------------------------------------------------------------
  const totalDieselLitersPerTonFfb =
    farm.dieselTractorLitersPerHa / yieldHa +
    mill.boilerDieselStartupLPerTonFfb +
    (farm.transportDistanceKm * 0.038);

  // 7.1 Acidification Potential (AP)
  const nh3VolatilizedKgPerHa = totalSyntheticN * factors.fracGasF * (17.0 / 14.0);
  const apOnFarm = scale(nh3VolatilizedKgPerHa / yieldHa) * 1.88; // 1.88 kg SO2-eq / kg NH3
  const apPks = scale(totalDieselLitersPerTonFfb * factors.efAcidificationDieselPerL);
  const apTotal = apOnFarm + apPks;

  // 7.2 Eutrophication Potential (EP)
  const pAppliedKgPerHa = (farm.rockPhosphateKgPerHa + farm.npkKgPerHa * farm.npkRatioP2O5) * 0.436;
  const pRunoffKgPerHa = pAppliedKgPerHa * 0.035; // 3.5% runoff in humid tropical climate
  const epOnFarm = scale((pRunoffKgPerHa / yieldHa) * 3.06 + (nLeached / yieldHa) * 0.42);
  const epPks = epOnFarm * 0.05; // Minor residual POME discharge
  const epTotal = epOnFarm + epPks;

  // 7.3 Land Use (LU - m2.yr per ton CPO)
  const landOccupationM2YrOnFarm = scale(10000.0 / yieldHa);
  const landOccupationM2YrPks = 15.0; // PKS built footprint (~15 m2.yr/t CPO)
  const landUseTotal = landOccupationM2YrOnFarm + landOccupationM2YrPks;

  // 7.4 Toxicity (Human & Ecotoxicity - kg 1,4-DCB eq)
  const herbicideToxOnFarm = scale((farm.herbicideAiKgPerHa / yieldHa) * 45.2);
  const phosphateHeavyMetalToxOnFarm = scale(
    ((farm.rockPhosphateKgPerHa + farm.npkKgPerHa * farm.npkRatioP2O5) / yieldHa) * 0.12 * 120.0
  );
  const toxOnFarm = herbicideToxOnFarm + phosphateHeavyMetalToxOnFarm;
  const toxPks = scale(totalDieselLitersPerTonFfb * 0.85);
  const toxTotal = toxOnFarm + toxPks;

  const midpoint = {
    gwpKgCo2e: Number(netTotalCpo.toFixed(2)),
    apKgSo2e: Number(apTotal.toFixed(4)),
    epKgPo4e: Number(epTotal.toFixed(4)),
    landUseM2Yr: Number(landUseTotal.toFixed(2)),
    toxicityKgDcb: Number(toxTotal.toFixed(2)),
    breakdown: {
      onFarm: {
        gwp: Number(upstreamCpo.toFixed(2)),
        ap: Number(apOnFarm.toFixed(4)),
        ep: Number(epOnFarm.toFixed(4)),
        landUse: Number(landOccupationM2YrOnFarm.toFixed(2)),
        toxicity: Number(toxOnFarm.toFixed(2)),
      },
      pks: {
        gwp: Number((transportTotalCpo + millProcessCpo + pomeTotalCpo - totalCreditsCpo).toFixed(2)),
        ap: Number(apPks.toFixed(4)),
        ep: Number(epPks.toFixed(4)),
        landUse: Number(landOccupationM2YrPks.toFixed(2)),
        toxicity: Number(toxPks.toFixed(2)),
      },
    },
  };

  // -------------------------------------------------------------
  // 8. LCIA ENDPOINT DAMAGE ASSESSMENT (Area of Protection - AoP)
  // -------------------------------------------------------------
  // 8.1 Human Health (DALY - Disability Adjusted Life Years)
  const hhClimateDaly = netTotalCpo * 9.28e-7;
  const hhAcidDaly = apTotal * 6.29e-7;
  const hhToxDaly = toxTotal * 3.32e-6;
  const hhTotalDaly = hhClimateDaly + hhAcidDaly + hhToxDaly;

  // 8.2 Ecosystem Quality (PDF.m2.yr - Potentially Disappeared Fraction)
  const eqClimatePdf = netTotalCpo * 0.204;
  const eqLandUsePdf = landUseTotal * 0.620;
  const eqAcidPdf = apTotal * 0.0156;
  const eqEutroPdf = epTotal * 0.0064;
  const eqToxPdf = toxTotal * 0.0084;
  const eqTotalPdf = eqClimatePdf + eqLandUsePdf + eqAcidPdf + eqEutroPdf + eqToxPdf;

  // 8.3 Resources (Surplus Energy MJ)
  const dieselSurplusMj = scale(totalDieselLitersPerTonFfb * 42.0);
  const ureaSurplusMj = scale((farm.ureaKgPerHa / yieldHa) * 24.5);
  const creditBiogasMj = scale((biogasElectricityCreditPerTonFfb / factors.efGridDisplacementKgCo2PerKwh) * 10.5);
  const resourcesSurplusMj = dieselSurplusMj + ureaSurplusMj - creditBiogasMj;

  const endpoint = {
    humanHealthDaly: Number(hhTotalDaly.toFixed(6)),
    humanHealthMilliDaly: Number((hhTotalDaly * 1000).toFixed(3)),
    ecosystemQualityPdf: Number(eqTotalPdf.toFixed(2)),
    speciesYr: Number((eqTotalPdf / 7.3e7).toExponential(3)),
    resourcesSurplusMj: Number(resourcesSurplusMj.toFixed(2)),
    breakdown: {
      humanHealthContributions: {
        climateChangeDaly: Number(hhClimateDaly.toFixed(6)),
        acidificationDaly: Number(hhAcidDaly.toFixed(6)),
        toxicityDaly: Number(hhToxDaly.toFixed(6)),
      },
      ecosystemQualityContributions: {
        climateChangePdf: Number(eqClimatePdf.toFixed(2)),
        landUsePdf: Number(eqLandUsePdf.toFixed(2)),
        acidificationPdf: Number(eqAcidPdf.toFixed(2)),
        eutrophicationPdf: Number(eqEutroPdf.toFixed(2)),
        toxicityPdf: Number(eqToxPdf.toFixed(2)),
      },
    },
  };

  // -------------------------------------------------------------
  // 9. BENCHMARK RATING VS RSPO / ISCC
  // -------------------------------------------------------------
  let palmGhgrating: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
  if (netTotalCpo < 450) {
    palmGhgrating = 'A+';
  } else if (netTotalCpo < 650) {
    palmGhgrating = 'A';
  } else if (netTotalCpo < 950) {
    palmGhgrating = 'B';
  } else if (netTotalCpo < 1400) {
    palmGhgrating = 'C';
  } else {
    palmGhgrating = 'D';
  }

  // Intermediate metric: GWP per ton FFB at plantation gate
  const totalGwpPerTonFfb = (totalFarmGrossPerTonFfb - efbCreditPerTonFfb) + transportPerTonFfb;

  const baseResult: LcaCalculationResult = {
    functionalUnit: '1 ton Crude Palm Oil (CPO) at Mill Gate',
    totalGwpPerTonCpo: Number(netTotalCpo.toFixed(2)),
    totalGwpPerKgCpo: Number((netTotalCpo / 1000).toFixed(4)),
    totalGwpPerTonFfb: Number(totalGwpPerTonFfb.toFixed(2)),
    cpoAllocationFactor: Number(fCpo.toFixed(4)),
    pkAllocationFactor: Number(fPk.toFixed(4)),
    allocationMethod: mill.allocationMethod,
    upstreamEmissionsKgCo2: Number(upstreamCpo.toFixed(2)),
    transportEmissionsKgCo2: Number(transportTotalCpo.toFixed(2)),
    millEmissionsKgCo2: Number(millProcessCpo.toFixed(2)),
    pomeEmissionsKgCo2: Number(pomeTotalCpo.toFixed(2)),
    carbonCreditsKgCo2: Number(totalCreditsCpo.toFixed(2)),
    sources,
    stageSummary,
    eutrophicationPotentialKgPo4EqPerTonCpo: Number(epTotal.toFixed(4)),
    acidificationPotentialKgSo2EqPerTonCpo: Number(apTotal.toFixed(4)),
    midpoint,
    endpoint,
    palmGhgrating,
  };

  // Calculate advanced sustainability indicators (Circular Economy, Energy/EROI, SDI, ISPO/RSPO)
  baseResult.sustainability = calculateAdvancedSustainability(farm, mill, baseResult);

  return baseResult;
}
