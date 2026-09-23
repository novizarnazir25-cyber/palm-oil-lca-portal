import { LcaEmissionFactors } from './types';

/**
 * Standard Default Emission Factors Database
 * Sources:
 * - IPCC 2006 Guidelines for National Greenhouse Gas Inventories & 2019 Refinement (Agriculture & Wastewater)
 * - RSPO PalmGHG Calculation Methodology v4
 * - ISPO (Indonesian Sustainable Palm Oil) Principles & Criteria
 * - Ecoinvent 3.8 / Agri-footprint LCA Databases
 */
export const DEFAULT_EMISSION_FACTORS: LcaEmissionFactors = {
  // Global Warming Potentials (100-year time horizon, IPCC Fifth Assessment Report AR5)
  gwpN2O: 265, // 1 kg N2O = 265 kg CO2eq (IPCC AR5)
  gwpCH4: 28,  // 1 kg biogenic CH4 = 28 kg CO2eq (IPCC AR5)

  // Direct & Indirect N2O emissions from synthetic fertilizers (IPCC Tier 1 Default)
  efDirectN2O: 0.01,         // EF1: 1% of applied synthetic N is emitted as N2O-N
  fracGasF: 0.10,            // Fraction of synthetic N that volatilizes as NH3 and NOx
  efVolatilizationN2O: 0.01, // EF4: 1% of volatilized N is converted to N2O-N
  fracLeach: 0.30,           // Fraction of synthetic N lost through leaching and runoff in humid tropics
  efLeachingN2O: 0.0075,     // EF5: 0.75% of leached N is converted to N2O-N

  // Urea Application Carbon Dioxide emissions (IPCC Tier 1)
  // Urea hydrolysis: CO(NH2)2 + H2O -> 2 NH3 + CO2
  // 0.20 kg C / kg Urea * (44 / 12) = 0.7333 kg CO2 / kg urea applied
  efUreaCO2: 0.7333,

  // Peat Soil Oxidation / Drained Organic Soils (RSPO PalmGHG / IPCC Peatland Supplement)
  // Tropical drained peatland under mature oil palm emits approx 55 t CO2 / ha / year
  efPeatOxidationTonCo2PerHa: 55.0,

  // Embodied Manufacturing of Mineral Fertilizers (Cradle-to-Farm Gate upstream footprint)
  efProdUrea: 1.85,            // kg CO2eq / kg Urea product (Haber-Bosch process)
  efProdAmmoniumSulfate: 1.15, // kg CO2eq / kg ZA product
  efProdP2O5: 1.20,            // kg CO2eq / kg P2O5 (mining & sulfuric acid processing)
  efProdK2O: 0.65,             // kg CO2eq / kg K2O (potash mining & beneficiation)
  efProdDolomite: 0.18,        // kg CO2eq / kg Dolomite (quarrying & crushing)
  efProdPesticideAi: 12.50,    // kg CO2eq / kg active ingredient (chemical synthesis)

  // Fossil Fuel Combustion (Tractors, excavators, pumps)
  // Well-to-Wheel (WTW) factor for Automotive Diesel Fuel
  efDieselCombustionKgCo2PerL: 3.15,

  // Road Transportation (Diesel freight truck for FFB transport)
  // Medium rigid truck 8-15 ton payload, typical rural road conditions
  efTransportTruckTkmKgCo2: 0.12, // kg CO2eq / ton.km

  // Palm Oil Mill Effluent (POME) Methane Generation
  // IPCC Tier 2 / RSPO PalmGHG Wastewater equations
  boMaxMethaneYieldKgCh4PerKgCod: 0.25, // Maximum CH4 producing capacity: 0.25 kg CH4 / kg COD
  mcfOpenLagoon: 0.80,                  // Methane Correction Factor for open anaerobic lagoon depth > 2m
  mcfMethaneCapture: 0.10,              // Residual fugitive escape factor in covered lagoons (90% capture)
  ch4DensityKgPerM3: 0.717,             // Density of pure CH4 gas at 25°C, 1 atm (kg/m3)

  // Avoided Emissions Credit (Displacement of Indonesian National Grid mix)
  efGridDisplacementKgCo2PerKwh: 0.78, // kg CO2eq / kWh displaced

  // Acidification & Eutrophication Characterization Factors (CML 2001 / ReCiPe)
  efAcidificationDieselPerL: 0.0082, // kg SO2eq / L diesel (combustion NOx, SOx)
  efAcidificationNPerKg: 0.052,      // kg SO2eq / kg synthetic N applied (NH3 volatilization)
  efEutrophicationNPerKg: 0.13,      // kg PO4---eq / kg N leached (marine & freshwater)
  efEutrophicationP2O5PerKg: 1.00,   // kg PO4---eq / kg P2O5 runoff
};

/**
 * Standard Default Benchmark Scenario Presets
 */
export const DEFAULT_FARM_PRESET = {
  ffbYieldPerHa: 21.0,           // ton FFB / ha / year
  plantationAreaHa: 2500,        // 2,500 ha typical mid-sized estate
  peatSoilPercentage: 0,         // Mineral soil default
  ureaKgPerHa: 220,              // ~100 kg N / ha
  ammoniumSulfateKgPerHa: 100,   // ~21 kg N / ha
  npkKgPerHa: 200,               // 15-15-15 compound
  npkRatioN: 0.15,
  npkRatioP2O5: 0.15,
  npkRatioK2O: 0.15,
  rockPhosphateKgPerHa: 150,     // RP (approx 30% P2O5)
  mopKclKgPerHa: 250,            // KCl (approx 60% K2O)
  dolomiteKgPerHa: 180,          // Dolomite
  herbicideAiKgPerHa: 2.5,       // kg a.i. / ha
  dieselTractorLitersPerHa: 45,  // liters / ha
  efbMulchingTonsPerHa: 15,      // returned to field
  transportDistanceKm: 25,       // 25 km radius
  truckPayloadTons: 8.0,
  truckFuelLitersPer100Km: 35.0,
};

export const DEFAULT_MILL_PRESET = {
  annualFfbProcessedTons: 150000,
  oer: 0.22,                     // 22% CPO extraction
  ker: 0.05,                     // 5% Palm Kernel extraction
  fiberFraction: 0.135,
  shellFraction: 0.065,
  efbFraction: 0.22,
  boilerDieselStartupLPerTonFfb: 0.2,
  gridElectricityExportKwhPerTonFfb: 0,
  pomeRatioM3PerTonFfb: 0.65,    // 0.65 m3 POME / ton FFB
  pomeCodMgPerL: 30000,          // 30,000 mg/L COD
  pomeBodMgPerL: 25000,
  treatmentMethod: 'OPEN_ANAEROBIC_LAGOON' as const,
  methaneCaptureEfficiency: 0.90,
  biogasGeneratorEfficiencyKwhPerM3Ch4: 3.5,
  biogasPowerExportPercentage: 80,
  allocationMethod: 'ENERGY' as const,
  priceCpoUsdPerTon: 920,
  pricePkUsdPerTon: 520,
  lhvCpoMjPerKg: 37.0,
  lhvPkMjPerKg: 24.0,
};
