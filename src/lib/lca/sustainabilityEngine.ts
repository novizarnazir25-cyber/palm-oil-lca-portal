import {
  FarmInputs,
  MillInputs,
  LcaCalculationResult,
  AdvancedSustainabilityResult,
  CircularEconomyMetrics,
  EnergyBalanceMetrics,
  SustainableDevelopmentIndex,
  StandardCompliance,
  ComplianceCriterion,
} from './types';

/**
 * Calculates Palm Oil Circular Economy Metrics (CEI)
 * Quantifies valorization of solid waste (TKKS, Fiber, Shell) and liquid waste (POME).
 */
export function calculateCircularEconomyMetrics(
  farm: FarmInputs,
  mill: MillInputs
): CircularEconomyMetrics {
  const oer = Math.max(0.01, mill.oer);
  const yieldHa = Math.max(0.1, farm.ffbYieldPerHa);
  const annualFfb = Math.max(1, mill.annualFfbProcessedTons);

  // 1. Solid Waste Streams
  // EFB (Tandan Kosong Kelapa Sawit / TKKS)
  const efbKgPerTonFfb = mill.efbFraction * 1000; // ~220 kg/t FFB
  const efbKgPerTonCpo = efbKgPerTonFfb / oer;     // ~1000 kg/t CPO
  const efbTonsAnnual = (annualFfb * efbKgPerTonFfb) / 1000;

  // EFB utilized: Mulching to plantation or composting
  // farm.efbMulchingTonsPerHa (tons/ha/yr) -> convert to kg/t FFB -> kg/t CPO
  const efbMulchedKgPerTonFfb = (farm.efbMulchingTonsPerHa * 1000) / yieldHa;
  const efbUtilizedKgPerTonCpo = Math.min(
    efbKgPerTonCpo,
    (efbMulchedKgPerTonFfb / oer) + (mill.treatmentMethod === 'BIOGAS_TO_POWER' ? efbKgPerTonCpo * 0.20 : 0)
  );
  const efbUtilizationRate = Math.min(100, Number(((efbUtilizedKgPerTonCpo / efbKgPerTonCpo) * 100).toFixed(1)));
  const efbPathways: string[] = [];
  if (farm.efbMulchingTonsPerHa > 0) efbPathways.push(`Mulsa Organik Kebun (${farm.efbMulchingTonsPerHa} Ton/Ha)`);
  if (mill.treatmentMethod === 'BIOGAS_TO_POWER') efbPathways.push('Co-composting dengan Sludge POME');
  if (efbPathways.length === 0) efbPathways.push('Penimbunan Terbuka / Open Dumping (Linear)');

  // Mesocarp Fiber (Serat)
  const fiberKgPerTonFfb = mill.fiberFraction * 1000; // ~135 kg/t FFB
  const fiberKgPerTonCpo = fiberKgPerTonFfb / oer;     // ~613 kg/t CPO
  const fiberTonsAnnual = (annualFfb * fiberKgPerTonFfb) / 1000;
  // Fiber is 100% combusted in biomass boiler for plant steam & electricity
  const fiberUtilizedKgPerTonCpo = fiberKgPerTonCpo;
  const fiberUtilizationRate = 100.0;
  const fiberPathways = ['Bahan Bakar Boiler Biomassa (Kogenerasi Uap & Turbin Listrik)'];

  // Palm Shell (Cangkang Sawit)
  const shellKgPerTonFfb = mill.shellFraction * 1000; // ~60 kg/t FFB
  const shellKgPerTonCpo = shellKgPerTonFfb / oer;     // ~272 kg/t CPO
  const shellTonsAnnual = (annualFfb * shellKgPerTonFfb) / 1000;
  // 70% used in boiler, 30% commercial biomass export
  const shellUtilizedKgPerTonCpo = shellKgPerTonCpo * 0.98; // 98% valorized
  const shellUtilizationRate = 98.0;
  const shellPathways = [
    'Bahan Bakar Boiler Suhu Tinggi (70%)',
    'Komoditas Ekspor Biofuel Padat Industri (28%)',
  ];

  const totalSolidGenerated = efbKgPerTonCpo + fiberKgPerTonCpo + shellKgPerTonCpo;
  const totalSolidUtilized = efbUtilizedKgPerTonCpo + fiberUtilizedKgPerTonCpo + shellUtilizedKgPerTonCpo;
  const solidWasteUtilizationRatePercent = Number(((totalSolidUtilized / totalSolidGenerated) * 100).toFixed(1));

  // 2. Liquid Waste (POME)
  const pomeVolumeM3PerTonCpo = mill.pomeRatioM3PerTonFfb / oer; // ~2.95 m3 / t CPO
  const codTotalKgPerTonCpo = pomeVolumeM3PerTonCpo * (mill.pomeCodMgPerL / 1000); // kg COD
  const boMax = 0.25; // kg CH4 / kg COD
  const ch4Density = 0.717; // kg/m3
  const methanePotentialM3PerTonCpo = (codTotalKgPerTonCpo * boMax) / ch4Density;

  let methaneCapturedM3PerTonCpo = 0;
  let liquidUtilizationRate = 25.0; // Baseline nutrient in pond effluent
  const liquidPathways: string[] = [];

  if (mill.treatmentMethod === 'BIOGAS_TO_POWER') {
    methaneCapturedM3PerTonCpo = methanePotentialM3PerTonCpo * mill.methaneCaptureEfficiency;
    liquidUtilizationRate = Math.min(100, 85 + (mill.biogasPowerExportPercentage * 0.12));
    liquidPathways.push(`Penangkapan Biogas (${(mill.methaneCaptureEfficiency * 100).toFixed(0)}%) untuk PLTBg`);
    liquidPathways.push(`Ekspor Listrik Grid PLN (${mill.biogasPowerExportPercentage}%)`);
    liquidPathways.push('Aplikasi Tanah Terkontrol (Land Application) Efluen Rendah COD');
  } else if (mill.treatmentMethod === 'METHANE_CAPTURE_FLARING') {
    methaneCapturedM3PerTonCpo = methanePotentialM3PerTonCpo * mill.methaneCaptureEfficiency;
    liquidUtilizationRate = 72.0;
    liquidPathways.push(`Penangkapan Biogas & Flaring Termal (${(mill.methaneCaptureEfficiency * 100).toFixed(0)}%)`);
    liquidPathways.push('Kolam Penstabilan Aerobik / Land Application');
  } else {
    methaneCapturedM3PerTonCpo = 0;
    liquidUtilizationRate = 30.0;
    liquidPathways.push('Kolam Anaerobik Terbuka (Emisi Metana Bebas ke Atmosfer)');
    liquidPathways.push('Land Application Terbatas setelah Sedimentasi');
  }

  // 3. Composite Circular Economy Index (CEI)
  // Weighting: 55% Solid Waste, 45% Liquid Waste
  const ceiPercentage = Number(
    (0.55 * solidWasteUtilizationRatePercent + 0.45 * liquidUtilizationRate).toFixed(1)
  );

  let circularityTier: 'REGENERATIVE_CIRCULAR' | 'ADVANCED_CIRCULAR' | 'TRANSITIONAL' | 'LINEAR' = 'TRANSITIONAL';
  let tierLabel = 'Sirkularitas Transisional';
  let tierDescription = 'Pabrik memanfaatkan sebagian biomassa padat namun belum optimal pada limbah cair POME.';

  if (ceiPercentage >= 90) {
    circularityTier = 'REGENERATIVE_CIRCULAR';
    tierLabel = 'Tier 1 - Regenerative Closed-Loop Circular';
    tierDescription = 'Seluruh limbah padat dan cair didaur ulang menjadi energi terbarukan dan pupuk organik terpadu.';
  } else if (ceiPercentage >= 75) {
    circularityTier = 'ADVANCED_CIRCULAR';
    tierLabel = 'Tier 2 - Advanced Circular Agroindustry';
    tierDescription = 'Efisiensi pemanfaatan limbah sangat tinggi dengan valorisasi energi biomassa dan mitigasi gas metana.';
  } else if (ceiPercentage >= 50) {
    circularityTier = 'TRANSITIONAL';
    tierLabel = 'Tier 3 - Transitional Circular System';
    tierDescription = 'Biomassa serat dan cangkang digunakan di boiler, namun pemanfaatan TKKS dan POME masih terbatas.';
  } else {
    circularityTier = 'LINEAR';
    tierLabel = 'Tier 4 - Linear Agroindustry (High Waste)';
    tierDescription = 'Beban buangan limbah tinggi tanpa penangkapan biogas dan pemulsaan organik minimal.';
  }

  return {
    solidWaste: {
      efb: {
        generatedTonsPerYear: Math.round(efbTonsAnnual),
        generatedKgPerTonFfb: Number(efbKgPerTonFfb.toFixed(1)),
        generatedKgPerTonCpo: Number(efbKgPerTonCpo.toFixed(1)),
        utilizedKgPerTonCpo: Number(efbUtilizedKgPerTonCpo.toFixed(1)),
        utilizationRatePercent: efbUtilizationRate,
        pathways: efbPathways,
      },
      fiber: {
        generatedTonsPerYear: Math.round(fiberTonsAnnual),
        generatedKgPerTonFfb: Number(fiberKgPerTonFfb.toFixed(1)),
        generatedKgPerTonCpo: Number(fiberKgPerTonCpo.toFixed(1)),
        utilizedKgPerTonCpo: Number(fiberUtilizedKgPerTonCpo.toFixed(1)),
        utilizationRatePercent: fiberUtilizationRate,
        pathways: fiberPathways,
      },
      shell: {
        generatedTonsPerYear: Math.round(shellTonsAnnual),
        generatedKgPerTonFfb: Number(shellKgPerTonFfb.toFixed(1)),
        generatedKgPerTonCpo: Number(shellKgPerTonCpo.toFixed(1)),
        utilizedKgPerTonCpo: Number(shellUtilizedKgPerTonCpo.toFixed(1)),
        utilizationRatePercent: shellUtilizationRate,
        pathways: shellPathways,
      },
      totalGeneratedKgPerTonCpo: Number(totalSolidGenerated.toFixed(1)),
      totalUtilizedKgPerTonCpo: Number(totalSolidUtilized.toFixed(1)),
      solidWasteUtilizationRatePercent,
    },
    liquidWaste: {
      pomeVolumeM3PerTonCpo: Number(pomeVolumeM3PerTonCpo.toFixed(2)),
      codTotalKgPerTonCpo: Number(codTotalKgPerTonCpo.toFixed(1)),
      methanePotentialM3PerTonCpo: Number(methanePotentialM3PerTonCpo.toFixed(1)),
      methaneCapturedM3PerTonCpo: Number(methaneCapturedM3PerTonCpo.toFixed(1)),
      liquidWasteUtilizationRatePercent: Number(liquidUtilizationRate.toFixed(1)),
      pathways: liquidPathways,
    },
    ceiPercentage,
    circularityTier,
    tierLabel,
    tierDescription,
  };
}

/**
 * Calculates Energy Balance, Energy Return on Investment (EROI), and Net Energy Ratio (NER)
 */
export function calculateEnergyBalance(
  farm: FarmInputs,
  mill: MillInputs
): EnergyBalanceMetrics {
  const oer = Math.max(0.01, mill.oer);
  const ker = Math.max(0.001, mill.ker);
  const yieldHa = Math.max(0.1, farm.ffbYieldPerHa);

  // 1. Fossil Energy Inputs (MJ / ton CPO)
  // 1.1 Embodied Energy in Synthetic Fertilizers
  const nFromUrea = farm.ureaKgPerHa * 0.46;
  const nFromZa = farm.ammoniumSulfateKgPerHa * 0.21;
  const nFromNpk = farm.npkKgPerHa * farm.npkRatioN;

  // Embodied factors: Urea ~65 MJ/kg N, ZA ~45 MJ/kg N, NPK ~35 MJ/kg
  const energyUreaHa = nFromUrea * 65.0;
  const energyZaHa = nFromZa * 45.0;
  const energyNpkHa = farm.npkKgPerHa * 35.0;
  const energyRpHa = farm.rockPhosphateKgPerHa * 15.0; // RP ~15 MJ/kg P2O5
  const energyMopHa = farm.mopKclKgPerHa * 8.5;       // MOP ~8.5 MJ/kg K2O
  const energyDolomiteHa = farm.dolomiteKgPerHa * 1.2;

  const totalFertilizerEnergyHa =
    energyUreaHa + energyZaHa + energyNpkHa + energyRpHa + energyMopHa + energyDolomiteHa;
  const fertEnergyPerTonCpo = totalFertilizerEnergyHa / (yieldHa * oer);

  // 1.2 Embodied Energy in Pesticides / Herbicides (~280 MJ / kg a.i.)
  const pesticideEnergyHa = farm.herbicideAiKgPerHa * 280.0;
  const pesticideEnergyPerTonCpo = pesticideEnergyHa / (yieldHa * oer);

  // 1.3 Diesel Fuel in Plantation Machinery (LHV Diesel + refining = 42.0 MJ/L)
  const tractorDieselEnergyHa = farm.dieselTractorLitersPerHa * 42.0;
  const tractorDieselEnergyPerTonCpo = tractorDieselEnergyHa / (yieldHa * oer);

  // 1.4 FFB Transport Logistics Trucking Diesel
  // Fuel consumed per ton FFB: (2 * distance / 100 * consumption / payload)
  const truckPayload = Math.max(1, farm.truckPayloadTons);
  const truckFuelPerTonFfb =
    ((2 * farm.transportDistanceKm) / 100 * farm.truckFuelLitersPer100Km) / truckPayload;
  const transportDieselEnergyPerTonCpo = (truckFuelPerTonFfb * 42.0) / oer;

  // 1.5 Mill Startup Auxiliary Diesel
  const millStartupDieselEnergyPerTonCpo = (mill.boilerDieselStartupLPerTonFfb * 42.0) / oer;

  const totalFossilInputMjPerTonCpo = Number(
    (
      fertEnergyPerTonCpo +
      pesticideEnergyPerTonCpo +
      tractorDieselEnergyPerTonCpo +
      transportDieselEnergyPerTonCpo +
      millStartupDieselEnergyPerTonCpo
    ).toFixed(1)
  );
  const totalFossilInputMjPerTonFfb = Number((totalFossilInputMjPerTonCpo * oer).toFixed(1));

  // 2. Renewable Energy Outputs / Generated (MJ / ton CPO)
  // 2.1 Biomass Cogeneration Boiler (Mesocarp Fiber & Shell)
  const fiberKgPerTonCpo = (mill.fiberFraction * 1000) / oer;
  const shellKgPerTonCpo = (mill.shellFraction * 1000) / oer;

  // LHV: Fiber = 11.5 MJ/kg, Shell = 17.5 MJ/kg. Boiler efficiency = 72%
  const fiberThermalMj = fiberKgPerTonCpo * 11.5;
  const shellThermalMj = shellKgPerTonCpo * 0.75 * 17.5; // 75% burned in boiler
  const biomassBoilerSteamPowerMjPerTonCpo = Number(((fiberThermalMj + shellThermalMj) * 0.72).toFixed(1));

  // 2.2 Biogas Power (Methane from POME)
  // 1 m3 CH4 = 35.8 MJ. Generator electrical eff = 35%, plus thermal = 30% (total 65%)
  let biogasElectricityMjPerTonCpo = 0;
  if (mill.treatmentMethod === 'BIOGAS_TO_POWER') {
    const pomeM3PerTonCpo = mill.pomeRatioM3PerTonFfb / oer;
    const codKgPerTonCpo = pomeM3PerTonCpo * (mill.pomeCodMgPerL / 1000);
    const methaneM3PerTonCpo = (codKgPerTonCpo * 0.25) / 0.717;
    const capturedMethaneM3 = methaneM3PerTonCpo * mill.methaneCaptureEfficiency;
    biogasElectricityMjPerTonCpo = Number((capturedMethaneM3 * 35.8 * 0.60).toFixed(1));
  }

  // 2.3 Chemical Bioenergy Carrier Potential of Products
  // CPO LHV = 37.0 MJ/kg = 37,000 MJ/ton CPO
  const cpoChemicalEnergyMjPerTonCpo = 37000.0;
  // PK LHV = 24.0 MJ/kg = 24,000 MJ/ton PK. Output PK mass = (ker / oer) * 1000 kg
  const pkChemicalEnergyMjPerTonCpo = Number(((ker / oer) * 24000.0).toFixed(1));

  const totalRenewableGeneratedMjPerTonCpo = Number(
    (biomassBoilerSteamPowerMjPerTonCpo + biogasElectricityMjPerTonCpo).toFixed(1)
  );
  const totalBioenergyProductsMjPerTonCpo = Number(
    (cpoChemicalEnergyMjPerTonCpo + pkChemicalEnergyMjPerTonCpo).toFixed(1)
  );

  // 3. EROI and Efficiency Metrics
  // EROI Process = Useful Renewable Energy Generated in Plant / Total Fossil Energy Input
  const eroiProcess = Number(
    (totalRenewableGeneratedMjPerTonCpo / Math.max(1, totalFossilInputMjPerTonCpo)).toFixed(2)
  );

  // EROI Total = Total Usable Energy (Products + Surplus Clean Energy) / Fossil Input
  const eroiTotal = Number(
    (
      (totalBioenergyProductsMjPerTonCpo + totalRenewableGeneratedMjPerTonCpo) /
      Math.max(1, totalFossilInputMjPerTonCpo)
    ).toFixed(2)
  );

  // Net Energy Ratio (NER)
  const netEnergyRatio = eroiTotal;

  // Net Energy Balance (NEB) = Total Energy Output - Total Fossil Input
  const netEnergyBalanceMjPerTonCpo = Number(
    (totalBioenergyProductsMjPerTonCpo + totalRenewableGeneratedMjPerTonCpo - totalFossilInputMjPerTonCpo).toFixed(1)
  );

  // Mill Energy Autonomy Percentage
  // Typical PKS internal electricity and steam demand: ~3,500 MJ / ton CPO
  const millInternalDemandMj = 3500.0;
  const energyAutonomyPercent = Number(
    Math.min(300, (totalRenewableGeneratedMjPerTonCpo / millInternalDemandMj) * 100).toFixed(1)
  );

  let autonomyStatus: 'FULLY_AUTONOMOUS_NET_EXPORTER' | 'SELF_SUFFICIENT' | 'GRID_DEPENDENT' = 'SELF_SUFFICIENT';
  if (energyAutonomyPercent > 120) {
    autonomyStatus = 'FULLY_AUTONOMOUS_NET_EXPORTER';
  } else if (energyAutonomyPercent >= 95) {
    autonomyStatus = 'SELF_SUFFICIENT';
  } else {
    autonomyStatus = 'GRID_DEPENDENT';
  }

  return {
    fossilInputs: {
      fertilizersEmbodiedMjPerTonCpo: Number(fertEnergyPerTonCpo.toFixed(1)),
      pesticidesEmbodiedMjPerTonCpo: Number(pesticideEnergyPerTonCpo.toFixed(1)),
      tractorDieselMjPerTonCpo: Number(tractorDieselEnergyPerTonCpo.toFixed(1)),
      transportTruckDieselMjPerTonCpo: Number(transportDieselEnergyPerTonCpo.toFixed(1)),
      millStartupDieselMjPerTonCpo: Number(millStartupDieselEnergyPerTonCpo.toFixed(1)),
      totalFossilInputMjPerTonCpo,
      totalFossilInputMjPerTonFfb,
    },
    renewableOutputs: {
      biomassBoilerSteamPowerMjPerTonCpo,
      biogasElectricityMjPerTonCpo,
      cpoChemicalEnergyMjPerTonCpo,
      pkChemicalEnergyMjPerTonCpo,
      totalRenewableGeneratedMjPerTonCpo,
      totalBioenergyProductsMjPerTonCpo,
    },
    eroiProcess,
    eroiTotal,
    netEnergyRatio,
    netEnergyBalanceMjPerTonCpo,
    energyAutonomyPercent,
    autonomyStatus,
  };
}

/**
 * Calculates Composite Sustainable Development Index (SDI, scale 0 - 100)
 * Integrates Climate/GHG, Circular Economy, Energy Transition, and Land Stewardship.
 */
export function calculateSustainableDevelopmentIndex(
  result: LcaCalculationResult,
  circular: CircularEconomyMetrics,
  energy: EnergyBalanceMetrics,
  farm: FarmInputs
): SustainableDevelopmentIndex {
  // 1. Climate / GHG Score (Weight: 30%)
  // Baseline: < 400 kg CO2e -> 100 pts; 814 kg -> 75 pts; 1200 kg -> 50 pts; > 2000 kg -> 10 pts
  const gwp = result.totalGwpPerTonCpo;
  let climateGhgScore = 0;
  if (gwp <= 400) {
    climateGhgScore = 95 + Math.min(5, Math.max(0, ((400 - gwp) / 400) * 5));
  } else if (gwp <= 850) {
    climateGhgScore = 75 + ((850 - gwp) / 450) * 20;
  } else if (gwp <= 1500) {
    climateGhgScore = 45 + ((1500 - gwp) / 650) * 30;
  } else {
    climateGhgScore = Math.max(5, 45 - ((gwp - 1500) / 1000) * 20);
  }
  climateGhgScore = Math.min(100, Math.max(0, Math.round(climateGhgScore)));

  // 2. Circular Economy Score (Weight: 25%)
  // Mapped directly from CEI (0 - 100%)
  const circularEconomyScore = Math.min(100, Math.max(0, Math.round(circular.ceiPercentage)));

  // 3. Energy Transition & Autonomy Score (Weight: 25%)
  // EROI process >= 3.0 -> 90+, Energy Autonomy > 100% -> 90+
  let energyTransitionScore = 0;
  if (energy.autonomyStatus === 'FULLY_AUTONOMOUS_NET_EXPORTER') {
    energyTransitionScore = 90 + Math.min(10, (energy.energyAutonomyPercent - 100) * 0.1);
  } else if (energy.autonomyStatus === 'SELF_SUFFICIENT') {
    energyTransitionScore = 75 + ((energy.energyAutonomyPercent - 95) / 25) * 15;
  } else {
    energyTransitionScore = Math.max(20, (energy.energyAutonomyPercent / 95) * 70);
  }
  energyTransitionScore = Math.min(100, Math.max(0, Math.round(energyTransitionScore)));

  // 4. Land Stewardship & Conservation Score (Weight: 20%)
  // Zero peat -> 100 pts; 50% peat -> 25 pts. EFB mulching bonus.
  const peat = Math.max(0, Math.min(100, farm.peatSoilPercentage));
  let landStewardshipScore = 100 - peat * 1.5;
  if (farm.efbMulchingTonsPerHa >= 20) landStewardshipScore += 8;
  landStewardshipScore = Math.min(100, Math.max(10, Math.round(landStewardshipScore)));

  // Composite SDI = 30% Climate + 25% Circularity + 25% Energy + 20% Land
  const compositeScore = Math.round(
    0.30 * climateGhgScore +
    0.25 * circularEconomyScore +
    0.25 * energyTransitionScore +
    0.20 * landStewardshipScore
  );

  let tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' = 'GOLD';
  let tierTitle = 'Gold - Highly Sustainable';

  if (compositeScore >= 85) {
    tier = 'PLATINUM';
    tierTitle = 'Platinum - Industry Benchmark Leader';
  } else if (compositeScore >= 70) {
    tier = 'GOLD';
    tierTitle = 'Gold - Full ISPO/RSPO Ready';
  } else if (compositeScore >= 55) {
    tier = 'SILVER';
    tierTitle = 'Silver - Transitional Performance';
  } else {
    tier = 'BRONZE';
    tierTitle = 'Bronze - High Sustainability Risk';
  }

  return {
    compositeScore,
    tier,
    tierTitle,
    pillars: {
      climateGhgScore,
      circularEconomyScore,
      energyTransitionScore,
      landStewardshipScore,
    },
  };
}

/**
 * Evaluates Compliance Against ISPO (Permentan 38/2020) and RSPO (P&C 2018/2023)
 */
export function evaluateStandardsCompliance(
  result: LcaCalculationResult,
  circular: CircularEconomyMetrics,
  energy: EnergyBalanceMetrics,
  farm: FarmInputs,
  mill: MillInputs
): StandardCompliance {
  const criteria: ComplianceCriterion[] = [];

  // Criterion 1: ISPO P3.1 / RSPO C7.10 - GHG Assessment & Threshold
  const gwp = result.totalGwpPerTonCpo;
  const isGhgCompliant = gwp <= 1000;
  criteria.push({
    code: 'ISPO-P3.1 / RSPO-C7.10',
    standard: 'RSPO',
    principle: 'Prinsip 7: Melestarikan Lingkungan & Mengurangi Emisi GRK',
    title: 'Inventarisasi & Pelaporan Emisi GRK Menggunakan RSPO PalmGHG / ISPO',
    requirement: 'Jejak karbon CPO harus dihitung berkala dengan metodologi diakui, dengan target emisi bersih < 1.000 kg CO₂e / ton CPO.',
    status: isGhgCompliant ? (gwp < 500 ? 'COMPLIANT' : 'COMPLIANT') : (gwp < 1600 ? 'MINOR_GAP' : 'NON_COMPLIANT'),
    measuredValue: `${gwp.toLocaleString('id-ID')} kg CO₂e/t CPO (Grade ${result.palmGhgrating})`,
    targetBenchmark: '< 1.000 kg CO₂e/t CPO (RSPO PalmGHG)',
    recommendation: isGhgCompliant
      ? 'Pertahankan pemanfaatan energi terbarukan dan optimasi pemupukan nitrogen di kebun.'
      : 'Terapkan methane capture pada kolam limbah POME dan kurangi pemakaian pupuk kimia sintetis.',
  });

  // Criterion 2: ISPO P5.2 / RSPO C7.3 - Solid Waste Management & Mulching
  const efbRate = circular.solidWaste.efb.utilizationRatePercent;
  const isEfbCompliant = efbRate >= 70;
  criteria.push({
    code: 'ISPO-P5.2 / RSPO-C7.3',
    standard: 'ISPO',
    principle: 'Prinsip 5: Penerapan Praktik Pertanian Yang Baik (GAP)',
    title: 'Pemanfaatan Tandan Kosong Sawit (TKKS) Sebagai Mulsa / Kompos Organik',
    requirement: 'TKKS wajib dimanfaatkan kembali ke tanah perkebunan sebagai pembenah tanah atau pupuk kompos, dilarang dibakar terbuka.',
    status: isEfbCompliant ? 'COMPLIANT' : (efbRate >= 40 ? 'MINOR_GAP' : 'NON_COMPLIANT'),
    measuredValue: `${efbRate}% dimanfaatkan (${farm.efbMulchingTonsPerHa} Ton/Ha mulsa)`,
    targetBenchmark: 'Minimal 70% volume TKKS dikembalikan ke kebun (GAP)',
    recommendation: isEfbCompliant
      ? 'Aplikasi mulsa TKKS telah memenuhi kaidah konservasi hara tanah organik.'
      : 'Tingkatkan armada lansir TKKS ke piringan tanaman kebun untuk menggantikan kalium pupuk kimia.',
  });

  // Criterion 3: ISPO P3.3 / RSPO C7.3 - POME Wastewater Treatment & Biogas
  const isPomeCaptured = mill.treatmentMethod !== 'OPEN_ANAEROBIC_LAGOON';
  criteria.push({
    code: 'ISPO-P3.3 / RSPO-C7.3',
    standard: 'ISPO',
    principle: 'Prinsip 3: Pengelolaan Lingkungan Hidup & Sumber Daya Air',
    title: 'Pengolahan Limbah Cair POME & Pengendalian Emisi Gas Metana',
    requirement: 'PKS diwajibkan mengendalikan emisi gas metana dari kolam limbah anaerobik serta memastikan baku mutu air limbah memenuhi PermenLHK.',
    status: isPomeCaptured ? 'COMPLIANT' : 'MINOR_GAP',
    measuredValue: mill.treatmentMethod === 'BIOGAS_TO_POWER'
      ? 'Methane Capture PLTBg (Efisiensi 90% listrik ekspor)'
      : mill.treatmentMethod === 'METHANE_CAPTURE_FLARING'
      ? 'Methane Capture & Flare (Efisiensi 90%)'
      : 'Kolam Anaerobik Terbuka (Emisi Metana Lepas Bebas)',
    targetBenchmark: 'Penutupan geomembrane biodigester (Methane Capture)',
    recommendation: isPomeCaptured
      ? 'Fasilitas penangkapan biogas berfungsi optimal dan mereduksi emisi metana drastis.'
      : 'Segera rencanakan investasi instalasi penutup kolam membran HDPE (*covered lagoon*) untuk menangkap biogas.',
  });

  // Criterion 4: ISPO P3.2 / RSPO C7.7 - Peatland Conservation & Water Table Management
  const peatPct = farm.peatSoilPercentage;
  const isPeatCompliant = peatPct === 0;
  criteria.push({
    code: 'ISPO-P3.2 / RSPO-C7.7',
    standard: 'RSPO',
    principle: 'Prinsip 7: Perlindungan Lahan Gambut & Keanekaragaman Hayati',
    title: 'Perlindungan Ekosistem Gambut (No Peat Development & Water Table BMP)',
    requirement: 'Larangan pembukaan baru di lahan gambut (RSPO 2018), serta wajib mempertahankan tinggi muka air tanah 40 cm (PP 57/2016).',
    status: isPeatCompliant ? 'COMPLIANT' : (peatPct <= 15 ? 'MINOR_GAP' : 'NON_COMPLIANT'),
    measuredValue: `${peatPct}% kebun berada di lahan gambut`,
    targetBenchmark: '0% ekspansi gambut baru; Muka air tanah stabil 40-50 cm',
    recommendation: isPeatCompliant
      ? 'Perkebunan 100% berada di tanah mineral, bebas risiko oksidasi gambut dan risiko EUDR.'
      : 'Wajib menerapkan sekat kanal (*canal blocking*) dan pemantauan piezometer air tanah 40 cm secara ketat.',
  });

  // Criterion 5: RSPO C7.2 - Fossil Fuel Replacement with Biomass Energy
  const isEnergyAutonomous = energy.energyAutonomyPercent >= 100;
  criteria.push({
    code: 'RSPO-C7.2',
    standard: 'RSPO',
    principle: 'Prinsip 7: Efisiensi Energi & Substitusi Energi Fosil',
    title: 'Kemandirian Energi Pabrik Melalui Pemanfaatan Biomassa Padat',
    requirement: 'PKS memaksimalkan penggunaan serat dan cangkang di boiler untuk mencukupi kebutuhan daya dan uap internal tanpa mengandalkan bahan bakar fosil.',
    status: isEnergyAutonomous ? 'COMPLIANT' : 'MINOR_GAP',
    measuredValue: `${energy.energyAutonomyPercent}% Kemandirian Energi (EROI Process: ${energy.eroiProcess})`,
    targetBenchmark: '>= 100% Swasembada energi proses PKS',
    recommendation: isEnergyAutonomous
      ? 'Pabrik sepenuhnya mandiri secara energi (swasembada) dan mampu mengekspor surplus listrik.'
      : 'Tingkatkan efisiensi pembakaran boiler dan isolasi pipa uap guna meniadakan ketergantungan solar.',
  });

  // Calculate Compliance Scores
  const ispoCriteria = criteria.filter((c) => c.code.includes('ISPO'));
  const rspoCriteria = criteria.filter((c) => c.code.includes('RSPO'));

  const scoreHelper = (arr: ComplianceCriterion[]) => {
    if (arr.length === 0) return 100;
    const points = arr.reduce((acc, c) => {
      if (c.status === 'COMPLIANT') return acc + 1.0;
      if (c.status === 'MINOR_GAP') return acc + 0.6;
      return acc + 0.0;
    }, 0);
    return Math.round((points / arr.length) * 100);
  };

  return {
    ispoComplianceScorePercent: scoreHelper(ispoCriteria),
    rspoComplianceScorePercent: scoreHelper(rspoCriteria),
    criteria,
  };
}

/**
 * Master calculation orchestrator for Advanced Sustainability
 */
export function calculateAdvancedSustainability(
  farm: FarmInputs,
  mill: MillInputs,
  result: LcaCalculationResult
): AdvancedSustainabilityResult {
  const circularity = calculateCircularEconomyMetrics(farm, mill);
  const energy = calculateEnergyBalance(farm, mill);
  const sdi = calculateSustainableDevelopmentIndex(result, circularity, energy, farm);
  const standards = evaluateStandardsCompliance(result, circularity, energy, farm, mill);

  return {
    circularity,
    energy,
    sdi,
    standards,
  };
}
