/**
 * Life Cycle Assessment (LCA) Types for Palm Oil Supply Chain
 * Cradle-to-Gate: Plantation (Cradle) -> Palm Oil Mill (Gate)
 * Follows ISO 14040/14044, IPCC 2006/2019 Refinement, RSPO PalmGHG v4, and ISPO.
 */

export type PomeTreatmentMethod =
  | 'OPEN_ANAEROBIC_LAGOON'
  | 'METHANE_CAPTURE_FLARING'
  | 'BIOGAS_TO_POWER';

export type AllocationMethod = 'ENERGY' | 'MASS' | 'ECONOMIC';

export interface FarmInputs {
  /** Fresh Fruit Bunch yield in tons per hectare per year (default: 21.5) */
  ffbYieldPerHa: number;
  /** Plantation area in hectares (default: 1000) */
  plantationAreaHa: number;
  /** Percentage of planted area on drained organic/peat soil (0 - 100%) */
  peatSoilPercentage: number;
  
  // Fertilizers applied (kg product per hectare per year)
  ureaKgPerHa: number;             // 46% N
  ammoniumSulfateKgPerHa: number;  // 21% N
  npkKgPerHa: number;              // NPK Compound
  npkRatioN: number;               // N fraction in NPK (e.g. 0.15 for 15-15-15)
  npkRatioP2O5: number;            // P2O5 fraction in NPK (e.g. 0.15)
  npkRatioK2O: number;             // K2O fraction in NPK (e.g. 0.15)
  rockPhosphateKgPerHa: number;    // RP or TSP (28-32% P2O5)
  mopKclKgPerHa: number;           // Muriate of Potash / KCl (60% K2O)
  dolomiteKgPerHa: number;         // Dolomite / Agricultural Lime (CaCO3/MgCO3)
  
  // Agrochemicals & Fuel
  herbicideAiKgPerHa: number;      // Pesticides & herbicides active ingredient (kg ai/ha/yr)
  dieselTractorLitersPerHa: number;// Diesel for weeding, harvesting, transport inside estate (L/ha/yr)
  
  // Organic recycling
  efbMulchingTonsPerHa: number;    // Empty Fruit Bunches returned to soil as organic mulch
  
  // Transport to Mill
  transportDistanceKm: number;     // Distance from estate collection center to mill (km)
  truckPayloadTons: number;        // Average truck load capacity in tons (default: 8.0)
  truckFuelLitersPer100Km: number; // Diesel fuel consumption of truck (L/100km, default: 35)
}

export interface MillInputs {
  /** Annual FFB processing capacity or volume (tons FFB / year) */
  annualFfbProcessedTons: number;
  /** Crude Palm Oil Extraction Rate (fraction, e.g. 0.22 = 22%) */
  oer: number;
  /** Palm Kernel Extraction Rate (fraction, e.g. 0.05 = 5%) */
  ker: number;
  /** Fiber generation rate (fraction of FFB, default: 0.13) */
  fiberFraction: number;
  /** Shell generation rate (fraction of FFB, default: 0.06) */
  shellFraction: number;
  /** Empty Fruit Bunch rate (fraction of FFB, default: 0.22) */
  efbFraction: number;
  
  // Energy in Mill
  boilerDieselStartupLPerTonFfb: number; // Auxiliary diesel for startup (L / ton FFB)
  gridElectricityExportKwhPerTonFfb: number; // Surplus electricity from biomass cogeneration to grid (kWh/t FFB)
  
  // POME (Palm Oil Mill Effluent)
  pomeRatioM3PerTonFfb: number;    // POME generated per ton FFB (default: 0.65 m3/t FFB)
  pomeCodMgPerL: number;           // Chemical Oxygen Demand (default: 30000 mg/L or 30 kg/m3)
  pomeBodMgPerL: number;           // Biochemical Oxygen Demand (default: 25000 mg/L)
  treatmentMethod: PomeTreatmentMethod;
  methaneCaptureEfficiency: number; // 0.0 - 1.0 (e.g. 0.90 = 90% capture)
  biogasGeneratorEfficiencyKwhPerM3Ch4: number; // Electricity generated per m3 CH4 (kWh/m3, default: 3.5)
  biogasPowerExportPercentage: number; // % of generated biogas electricity sold to grid (0 - 100%)
  
  // Allocation
  allocationMethod: AllocationMethod;
  priceCpoUsdPerTon: number;       // For economic allocation
  pricePkUsdPerTon: number;        // For economic allocation
  lhvCpoMjPerKg: number;           // Lower Heating Value CPO (default: 37.0 MJ/kg)
  lhvPkMjPerKg: number;            // Lower Heating Value PK (default: 24.0 MJ/kg)
}

export interface LcaEmissionFactors {
  // GWP Values (IPCC AR5 with climate-carbon feedbacks)
  gwpN2O: number;                  // 265 kg CO2eq / kg N2O
  gwpCH4: number;                  // 28 kg CO2eq / kg CH4 (biogenic CH4)
  
  // Nitrogen Emissions Factors (IPCC Tier 1)
  efDirectN2O: number;             // EF1: 0.01 kg N2O-N / kg N input
  fracGasF: number;                // 0.10 volatilization fraction
  efVolatilizationN2O: number;     // EF4: 0.01 kg N2O-N / kg NH3-N volatilized
  fracLeach: number;               // 0.30 leaching fraction
  efLeachingN2O: number;           // EF5: 0.0075 kg N2O-N / kg N leached
  
  // Urea CO2 emissions
  efUreaCO2: number;               // 0.20 kg C / kg urea * (44/12) = 0.733 kg CO2 / kg urea
  
  // Peat Oxidation (IPCC Peatland Supplement / RSPO)
  efPeatOxidationTonCo2PerHa: number; // 55.0 ton CO2 / ha / year
  
  // Embodied Manufacturing of Agro-inputs (kg CO2eq / kg product)
  efProdUrea: number;              // 1.85 kg CO2eq / kg urea
  efProdAmmoniumSulfate: number;   // 1.15 kg CO2eq / kg ZA
  efProdP2O5: number;              // 1.20 kg CO2eq / kg P2O5
  efProdK2O: number;               // 0.65 kg CO2eq / kg K2O
  efProdDolomite: number;          // 0.18 kg CO2eq / kg dolomite
  efProdPesticideAi: number;       // 12.50 kg CO2eq / kg active ingredient
  
  // Fuel combustion & Transport
  efDieselCombustionKgCo2PerL: number; // 3.15 kg CO2eq / L (Well-to-Wheel)
  efTransportTruckTkmKgCo2: number;    // 0.12 kg CO2eq / ton.km
  
  // POME parameters
  boMaxMethaneYieldKgCh4PerKgCod: number; // 0.25 kg CH4 / kg COD
  mcfOpenLagoon: number;                  // 0.80 (IPCC methane correction factor for deep open lagoons)
  mcfMethaneCapture: number;              // 0.10 (unrecovered fugitive fraction)
  ch4DensityKgPerM3: number;              // 0.717 kg / m3 CH4 at standard conditions
  
  // Grid electricity displacement (avoided emissions)
  efGridDisplacementKgCo2PerKwh: number; // 0.78 kg CO2eq / kWh (Indonesia grid average)
  
  // Eutrophication & Acidification Factors
  efAcidificationDieselPerL: number;      // kg SO2eq / L diesel (~0.008)
  efAcidificationNPerKg: number;          // kg SO2eq / kg N (~0.05)
  efEutrophicationNPerKg: number;         // kg PO4eq / kg N (~0.13)
  efEutrophicationP2O5PerKg: number;      // kg PO4eq / kg P2O5 (~1.00)
}

export interface StageBreakdown {
  stage: string;
  grossEmissionsKgCo2: number;
  avoidedCreditsKgCo2: number;
  netEmissionsKgCo2: number;
  percentageOfTotal: number;
}

export interface DetailedSources {
  // Upstream Sources
  directN2O: number;
  indirectN2O: number;
  ureaHydrolysisCO2: number;
  fertilizerProduction: number;
  pesticideProduction: number;
  farmFuelMachinery: number;
  peatOxidation: number;
  
  // Transport Sources
  ffbTransport: number;
  
  // Mill Sources
  pomeMethane: number;
  millStartupFuel: number;
  
  // Negative Emissions / Credits
  biogasGridCredit: number;
  surplusBiomassElectricityCredit: number;
  efbOrganicRecycleCredit: number;
}

export interface LcaCalculationResult {
  // Functional Unit outputs
  functionalUnit: string;
  totalGwpPerTonCpo: number;      // kg CO2eq / ton CPO
  totalGwpPerKgCpo: number;       // kg CO2eq / kg CPO
  totalGwpPerTonFfb: number;      // kg CO2eq / ton FFB
  
  // Allocation
  cpoAllocationFactor: number;    // fraction (e.g. 0.78)
  pkAllocationFactor: number;     // fraction (e.g. 0.22)
  allocationMethod: AllocationMethod;
  
  // Stages breakdown (per ton CPO)
  upstreamEmissionsKgCo2: number;
  transportEmissionsKgCo2: number;
  millEmissionsKgCo2: number;
  pomeEmissionsKgCo2: number;
  carbonCreditsKgCo2: number;
  
  // Detailed Hotspot Breakdown (per ton CPO)
  sources: DetailedSources;
  
  // Summary Stages Array for Charts
  stageSummary: StageBreakdown[];
  
  // Additional Environmental Impact Categories (ISO 14044)
  eutrophicationPotentialKgPo4EqPerTonCpo: number;
  acidificationPotentialKgSo2EqPerTonCpo: number;
  
  // ReCiPe 2016 Midpoint & Endpoint Modules
  midpoint: MidpointImpacts;
  endpoint: EndpointImpacts;
  
  // Advanced Sustainability & Circular Economy Metrics
  sustainability?: AdvancedSustainabilityResult;

  // Metadata & Indicators
  palmGhgrating: 'A+' | 'A' | 'B' | 'C' | 'D'; // Benchmark grade vs RSPO / ISCC standard
  reductionPercentageVsOpenLagoon?: number;
}

export interface WasteStreamDetail {
  generatedTonsPerYear: number;
  generatedKgPerTonFfb: number;
  generatedKgPerTonCpo: number;
  utilizedKgPerTonCpo: number;
  utilizationRatePercent: number;
  pathways: string[];
}

export interface CircularEconomyMetrics {
  solidWaste: {
    efb: WasteStreamDetail;      // Tandan Kosong Kelapa Sawit (TKKS)
    fiber: WasteStreamDetail;    // Serat Mesokarp
    shell: WasteStreamDetail;    // Cangkang Sawit
    totalGeneratedKgPerTonCpo: number;
    totalUtilizedKgPerTonCpo: number;
    solidWasteUtilizationRatePercent: number;
  };
  liquidWaste: {
    pomeVolumeM3PerTonCpo: number;
    codTotalKgPerTonCpo: number;
    methanePotentialM3PerTonCpo: number;
    methaneCapturedM3PerTonCpo: number;
    liquidWasteUtilizationRatePercent: number;
    pathways: string[];
  };
  /** Composite Circular Economy Index (0 - 100%) */
  ceiPercentage: number;
  circularityTier: 'REGENERATIVE_CIRCULAR' | 'ADVANCED_CIRCULAR' | 'TRANSITIONAL' | 'LINEAR';
  tierLabel: string;
  tierDescription: string;
}

export interface EnergyBalanceMetrics {
  fossilInputs: {
    fertilizersEmbodiedMjPerTonCpo: number;
    pesticidesEmbodiedMjPerTonCpo: number;
    tractorDieselMjPerTonCpo: number;
    transportTruckDieselMjPerTonCpo: number;
    millStartupDieselMjPerTonCpo: number;
    totalFossilInputMjPerTonCpo: number;
    totalFossilInputMjPerTonFfb: number;
  };
  renewableOutputs: {
    biomassBoilerSteamPowerMjPerTonCpo: number;
    biogasElectricityMjPerTonCpo: number;
    cpoChemicalEnergyMjPerTonCpo: number;
    pkChemicalEnergyMjPerTonCpo: number;
    totalRenewableGeneratedMjPerTonCpo: number;
    totalBioenergyProductsMjPerTonCpo: number;
  };
  /** EROI = Process Renewable Energy Generated / Fossil Energy Input */
  eroiProcess: number;
  /** EROI Total = (Product Energy + Surplus Renewable Energy) / Fossil Energy Input */
  eroiTotal: number;
  /** Net Energy Ratio (Total Energy Output / Total Fossil Input) */
  netEnergyRatio: number;
  /** Net Energy Balance (MJ / ton CPO) = Total Energy Output - Fossil Input */
  netEnergyBalanceMjPerTonCpo: number;
  /** Mill Energy Autonomy Percentage (% renewable of mill energy demand) */
  energyAutonomyPercent: number;
  autonomyStatus: 'FULLY_AUTONOMOUS_NET_EXPORTER' | 'SELF_SUFFICIENT' | 'GRID_DEPENDENT';
}

export interface SustainableDevelopmentIndex {
  compositeScore: number; // 0 - 100
  tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE';
  tierTitle: string;
  pillars: {
    climateGhgScore: number;        // 30% weight
    circularEconomyScore: number;   // 25% weight
    energyTransitionScore: number;  // 25% weight
    landStewardshipScore: number;   // 20% weight
  };
}

export interface ComplianceCriterion {
  code: string;
  standard: 'ISPO' | 'RSPO';
  principle: string;
  title: string;
  requirement: string;
  status: 'COMPLIANT' | 'MINOR_GAP' | 'NON_COMPLIANT';
  measuredValue: string;
  targetBenchmark: string;
  recommendation: string;
}

export interface StandardCompliance {
  ispoComplianceScorePercent: number;
  rspoComplianceScorePercent: number;
  criteria: ComplianceCriterion[];
}

export interface AdvancedSustainabilityResult {
  circularity: CircularEconomyMetrics;
  energy: EnergyBalanceMetrics;
  sdi: SustainableDevelopmentIndex;
  standards: StandardCompliance;
}

export interface MidpointCategoryBreakdown {
  gwp: number;      // kg CO2-eq
  ap: number;       // kg SO2-eq
  ep: number;       // kg PO4-eq
  landUse: number;  // m2.yr
  toxicity: number; // kg 1,4-DCB eq
}

export interface MidpointImpacts {
  gwpKgCo2e: number;
  apKgSo2e: number;
  epKgPo4e: number;
  landUseM2Yr: number;
  toxicityKgDcb: number;
  breakdown: {
    onFarm: MidpointCategoryBreakdown;
    pks: MidpointCategoryBreakdown;
  };
}

export interface EndpointImpacts {
  humanHealthDaly: number;           // DALY
  humanHealthMilliDaly: number;      // mDALY
  ecosystemQualityPdf: number;       // PDF.m2.yr
  speciesYr: number;                 // species.yr
  resourcesSurplusMj: number;        // MJ Surplus Energy
  breakdown: {
    humanHealthContributions: {
      climateChangeDaly: number;
      acidificationDaly: number;
      toxicityDaly: number;
    };
    ecosystemQualityContributions: {
      climateChangePdf: number;
      landUsePdf: number;
      acidificationPdf: number;
      eutrophicationPdf: number;
      toxicityPdf: number;
    };
  };
}

export interface LcaSimulationScenario {
  id: string;
  name: string;
  description: string;
  farmInputs: FarmInputs;
  millInputs: MillInputs;
  result?: LcaCalculationResult;
}

