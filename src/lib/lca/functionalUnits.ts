import { LcaCalculationResult } from './types';

export type FunctionalUnitKey = 'TON_CPO' | 'KG_CPO' | 'TON_FFB' | 'MJ_BIOENERGY' | 'HECTARE_YEAR';

export interface FunctionalUnitInfo {
  key: FunctionalUnitKey;
  label: string;
  shortLabel: string;
  unit: string;
  gwpUnit: string;
  description: string;
  standardReference: string;
  formulaDescription: string;
  badge: string;
}

export const FUNCTIONAL_UNITS: Record<FunctionalUnitKey, FunctionalUnitInfo> = {
  TON_CPO: {
    key: 'TON_CPO',
    label: '1 Ton Crude Palm Oil (CPO) pada Gerbang PKS',
    shortLabel: '1 Ton CPO',
    unit: 'ton CPO',
    gwpUnit: 'kg CO₂eq / ton CPO',
    description: 'Satuan fungsional baku industri pabrik (Mill Gate) mengacu pada standar ISO 14040/14044 dan sertifikasi RSPO PalmGHG v4.',
    standardReference: 'ISO 14044 & RSPO PalmGHG v4',
    formulaDescription: 'Basis acuan utama (Faktor skala = 1.0)',
    badge: 'Standard Industri (PKS)',
  },
  KG_CPO: {
    key: 'KG_CPO',
    label: '1 Kilogram Crude Palm Oil (CPO)',
    shortLabel: '1 kg CPO',
    unit: 'kg CPO',
    gwpUnit: 'kg CO₂eq / kg CPO',
    description: 'Basis rantai pasok hilir, industri makanan, oleokimia, formulasi produk, dan perhitungan jejak karbon konsumen (Retail/FMCG).',
    standardReference: 'GHG Protocol Product Standard & ISO 14067',
    formulaDescription: 'Nilai per Ton CPO ÷ 1.000',
    badge: 'Produk Konsumen / Retail',
  },
  TON_FFB: {
    key: 'TON_FFB',
    label: '1 Ton Tandan Buah Segar (TBS / FFB) Gerbang Kebun',
    shortLabel: '1 Ton TBS (FFB)',
    unit: 'ton TBS',
    gwpUnit: 'kg CO₂eq / ton TBS',
    description: 'Satuan fungsional perantara hulu kebun (Plantation Gate) untuk evaluasi agronomis pekebun, efisiensi panen, dan ISPO Prinsip 3.',
    standardReference: 'ISPO Prinsip 3 & Agronomic LCA',
    formulaDescription: 'Nilai per Ton CPO × (OER ÷ Faktor Alokasi CPO)',
    badge: 'Hulu Perkebunan (Kebun)',
  },
  MJ_BIOENERGY: {
    key: 'MJ_BIOENERGY',
    label: '1 Megajoule (MJ) Bioenergi CPO (EU RED II Basis)',
    shortLabel: '1 MJ Bioenergi',
    unit: 'MJ CPO',
    gwpUnit: 'g CO₂eq / MJ',
    description: 'Standar mandatori sertifikasi biofuel ekspor Uni Eropa (EU RED II/III) dan program mandatori Biodiesel (B35/B40) dengan LHV CPO = 37.0 MJ/kg.',
    standardReference: 'EU RED II Directive (2018/2001/EU)',
    formulaDescription: '(Nilai per Ton CPO × 1.000 g/kg) ÷ 37.000 MJ/ton CPO',
    badge: 'Biofuel & Energi Terbarukan',
  },
  HECTARE_YEAR: {
    key: 'HECTARE_YEAR',
    label: '1 Hektar Perkebunan Sawit per Tahun (1 Ha·tahun)',
    shortLabel: '1 Ha·tahun',
    unit: 'Ha·tahun',
    gwpUnit: 'kg CO₂eq / Ha·thn',
    description: 'Jejak karbon teritorial berbasis tutupan lahan perkebunan untuk analisis lanskap, mitigasi deforestasi, dan neraca karbon spasial.',
    standardReference: 'IPCC 2019 AFOLU & Landscape Ecology',
    formulaDescription: 'Nilai per Ton CPO × (Produktivitas TBS/Ha × Rendemen OER)',
    badge: 'Lanskap & Spasial Kebun',
  },
};

export interface ScaledImpacts {
  fu: FunctionalUnitInfo;
  multiplier: number;
  isEnergyUnit: boolean;
  netGwp: number;
  grossGwp: number;
  credits: number;
  gwpUnit: string;
  stages: {
    upstream: number;
    transport: number;
    mill: number;
    pome: number;
    credits: number;
  };
  sources: {
    directN2O: number;
    indirectN2O: number;
    ureaHydrolysisCO2: number;
    fertilizerProduction: number;
    pesticideProduction: number;
    farmFuelMachinery: number;
    peatOxidation: number;
    ffbTransport: number;
    pomeMethane: number;
    millStartupFuel: number;
    biogasGridCredit: number;
    surplusBiomassElectricityCredit: number;
    efbOrganicRecycleCredit: number;
  };
  midpoint: {
    gwp: number;
    gwpUnit: string;
    ap: number;
    apUnit: string;
    ep: number;
    epUnit: string;
    landUse: number;
    landUseUnit: string;
    toxicity: number;
    toxicityUnit: string;
    breakdown: {
      onFarm: { gwp: number; ap: number; ep: number; landUse: number; toxicity: number };
      pks: { gwp: number; ap: number; ep: number; landUse: number; toxicity: number };
    };
  };
  endpoint: {
    humanHealthDaly: number;
    humanHealthMilliDaly: number;
    ecosystemQualityPdf: number;
    speciesYr: number;
    resourcesSurplusMj: number;
  };
}

/**
 * Calculates multiplier and converts all LCIA indicators to the selected Functional Unit
 */
export function scaleResultToFunctionalUnit(
  r: LcaCalculationResult,
  fuKey: FunctionalUnitKey,
  oer: number = 0.22,
  yieldHa: number = 22.0,
  cpoAllocFactor: number = 0.785
): ScaledImpacts {
  const fu = FUNCTIONAL_UNITS[fuKey] || FUNCTIONAL_UNITS.TON_CPO;
  let multiplier = 1.0;
  let isEnergyUnit = false;
  let gwpUnit = fu.gwpUnit;

  switch (fuKey) {
    case 'KG_CPO':
      multiplier = 0.001; // 1 / 1000
      break;
    case 'TON_FFB':
      // Multiplier from per ton CPO to per ton FFB
      multiplier = (oer > 0 && cpoAllocFactor > 0) ? (oer / cpoAllocFactor) : 0.28;
      break;
    case 'MJ_BIOENERGY':
      // 1 Ton CPO = 37,000 MJ (LHV 37.0 MJ/kg)
      // 1 kg CO2e / ton CPO = (1000 g) / 37,000 MJ = 1 / 37 g CO2e / MJ
      multiplier = 1 / 37.0; // in g CO2e / MJ
      isEnergyUnit = true;
      break;
    case 'HECTARE_YEAR':
      // 1 Ha produces (yieldHa * oer) ton CPO
      multiplier = Math.max(0.1, yieldHa * oer);
      break;
    case 'TON_CPO':
    default:
      multiplier = 1.0;
      break;
  }

  // Net GWP
  const netGwp = isEnergyUnit
    ? Number((r.totalGwpPerTonCpo * multiplier).toFixed(2)) // g CO2e / MJ
    : Number((r.totalGwpPerTonCpo * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2));

  const grossGwp = Number(((r.totalGwpPerTonCpo + r.carbonCreditsKgCo2) * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2));
  const credits = Number((r.carbonCreditsKgCo2 * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2));

  // Stages
  const stages = {
    upstream: Number((r.upstreamEmissionsKgCo2 * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    transport: Number((r.transportEmissionsKgCo2 * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    mill: Number((r.millEmissionsKgCo2 * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    pome: Number((r.pomeEmissionsKgCo2 * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    credits: Number((r.carbonCreditsKgCo2 * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
  };

  // Sources
  const s = r.sources;
  const sources = {
    directN2O: Number((s.directN2O * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    indirectN2O: Number((s.indirectN2O * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    ureaHydrolysisCO2: Number((s.ureaHydrolysisCO2 * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    fertilizerProduction: Number((s.fertilizerProduction * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    pesticideProduction: Number((s.pesticideProduction * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    farmFuelMachinery: Number((s.farmFuelMachinery * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    peatOxidation: Number((s.peatOxidation * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    ffbTransport: Number((s.ffbTransport * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    pomeMethane: Number((s.pomeMethane * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    millStartupFuel: Number((s.millStartupFuel * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    biogasGridCredit: Number((s.biogasGridCredit * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    surplusBiomassElectricityCredit: Number((s.surplusBiomassElectricityCredit * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    efbOrganicRecycleCredit: Number((s.efbOrganicRecycleCredit * multiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
  };

  // Midpoint
  const m = r.midpoint;
  const midMultiplier = isEnergyUnit ? (1 / 37000) : multiplier; // standard scaling for midpoint
  const apFactor = isEnergyUnit ? (1000 / 37) : multiplier; // mg SO2e/MJ if bioenergy
  const epFactor = isEnergyUnit ? (1000 / 37) : multiplier; // mg PO4e/MJ if bioenergy

  const midpoint = {
    gwp: netGwp,
    gwpUnit: gwpUnit,
    ap: Number(((m?.apKgSo2e ?? r.acidificationPotentialKgSo2EqPerTonCpo) * apFactor).toFixed(fuKey === 'KG_CPO' ? 5 : 3)),
    apUnit: isEnergyUnit ? 'mg SO₂-eq / MJ' : `kg SO₂-eq / ${fu.unit}`,
    ep: Number(((m?.epKgPo4e ?? r.eutrophicationPotentialKgPo4EqPerTonCpo) * epFactor).toFixed(fuKey === 'KG_CPO' ? 5 : 3)),
    epUnit: isEnergyUnit ? 'mg PO₄-eq / MJ' : `kg PO₄-eq / ${fu.unit}`,
    landUse: Number(((m?.landUseM2Yr ?? 1901) * midMultiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    landUseUnit: isEnergyUnit ? 'cm²·thn / MJ' : `m²·thn / ${fu.unit}`,
    toxicity: Number(((m?.toxicityKgDcb ?? 521) * midMultiplier).toFixed(fuKey === 'KG_CPO' ? 4 : 2)),
    toxicityUnit: isEnergyUnit ? 'g 1,4-DCB / MJ' : `kg 1,4-DCB / ${fu.unit}`,
    breakdown: {
      onFarm: {
        gwp: Number(((m?.breakdown.onFarm.gwp ?? 0) * multiplier).toFixed(2)),
        ap: Number(((m?.breakdown.onFarm.ap ?? 0) * apFactor).toFixed(3)),
        ep: Number(((m?.breakdown.onFarm.ep ?? 0) * epFactor).toFixed(3)),
        landUse: Number(((m?.breakdown.onFarm.landUse ?? 0) * midMultiplier).toFixed(2)),
        toxicity: Number(((m?.breakdown.onFarm.toxicity ?? 0) * midMultiplier).toFixed(2)),
      },
      pks: {
        gwp: Number(((m?.breakdown.pks.gwp ?? 0) * multiplier).toFixed(2)),
        ap: Number(((m?.breakdown.pks.ap ?? 0) * apFactor).toFixed(3)),
        ep: Number(((m?.breakdown.pks.ep ?? 0) * epFactor).toFixed(3)),
        landUse: Number(((m?.breakdown.pks.landUse ?? 0) * midMultiplier).toFixed(2)),
        toxicity: Number(((m?.breakdown.pks.toxicity ?? 0) * midMultiplier).toFixed(2)),
      },
    },
  };

  // Endpoint
  const end = r.endpoint;
  const endpointMultiplier = isEnergyUnit ? (1 / 37000) : multiplier;
  const humanHealthDaly = (end?.humanHealthDaly ?? 0.00249) * endpointMultiplier;
  const ecosystemPdf = (end?.ecosystemQualityPdf ?? 1349) * endpointMultiplier;
  const resourcesSurplusMj = (end?.resourcesSurplusMj ?? 1564) * endpointMultiplier;

  const endpoint = {
    humanHealthDaly: Number(humanHealthDaly.toFixed(fuKey === 'KG_CPO' ? 9 : 6)),
    humanHealthMilliDaly: Number((humanHealthDaly * 1000).toFixed(fuKey === 'KG_CPO' ? 6 : 3)),
    ecosystemQualityPdf: Number(ecosystemPdf.toFixed(fuKey === 'KG_CPO' ? 5 : 2)),
    speciesYr: Number((ecosystemPdf / 7.3e7).toExponential(3)),
    resourcesSurplusMj: Number(resourcesSurplusMj.toFixed(fuKey === 'KG_CPO' ? 5 : 2)),
  };

  return {
    fu,
    multiplier,
    isEnergyUnit,
    netGwp,
    grossGwp,
    credits,
    gwpUnit,
    stages,
    sources,
    midpoint,
    endpoint,
  };
}
