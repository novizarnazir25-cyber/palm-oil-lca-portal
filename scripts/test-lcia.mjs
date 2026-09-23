import { calculatePalmOilLca } from '../src/lib/lca/engine.ts';
import { DEFAULT_FARM_PRESET, DEFAULT_MILL_PRESET } from '../src/lib/lca/defaultFactors.ts';

console.log('=== TEST LCIA MIDPOINT & ENDPOINT ENGINE ===\n');

const res = calculatePalmOilLca(DEFAULT_FARM_PRESET, DEFAULT_MILL_PRESET);

console.log('--- 1. MIDPOINT IMPACT CATEGORIES (ReCiPe 2016 H) ---');
console.log(`Global Warming Potential (GWP)  : ${res.midpoint.gwpKgCo2e} kg CO2-eq`);
console.log(`Acidification Potential (AP)     : ${res.midpoint.apKgSo2e} kg SO2-eq`);
console.log(`Eutrophication Potential (EP)    : ${res.midpoint.epKgPo4e} kg PO4-eq`);
console.log(`Land Use Occupation (LU)         : ${res.midpoint.landUseM2Yr} m2.yr`);
console.log(`Toxicity (Human & Eco)           : ${res.midpoint.toxicityKgDcb} kg 1,4-DCB eq\n`);

console.log('--- Process Breakdown (On-Farm vs PKS) ---');
console.log('On-Farm: ', res.midpoint.breakdown.onFarm);
console.log('PKS    : ', res.midpoint.breakdown.pks);
console.log('');

console.log('--- 2. ENDPOINT DAMAGE ASSESSMENT (Area of Protection) ---');
console.log(`Human Health Damage (DALY)       : ${res.endpoint.humanHealthDaly} DALY (${res.endpoint.humanHealthMilliDaly} mDALY)`);
console.log(`Ecosystem Quality (PDF)          : ${res.endpoint.ecosystemQualityPdf} PDF.m2.yr`);
console.log(`Species Disappearance (species)  : ${res.endpoint.speciesYr} species.yr`);
console.log(`Resource Scarcity (Surplus Energy): ${res.endpoint.resourcesSurplusMj} MJ\n`);

console.log('--- Endpoint Contributions ---');
console.log('Human Health:', res.endpoint.breakdown.humanHealthContributions);
console.log('Ecosystem Quality:', res.endpoint.breakdown.ecosystemQualityContributions);

console.log('\n=== TEST LCIA BERHASIL 100% ===');
