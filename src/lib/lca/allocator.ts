import { AllocationMethod } from './types';

export interface AllocationFactors {
  cpoFactor: number;
  pkFactor: number;
  details: {
    method: AllocationMethod;
    cpoSharePercent: number;
    pkSharePercent: number;
    basis: string;
  };
}

/**
 * Calculates Co-Product Allocation Factors according to ISO 14044
 * Splits shared upstream and mill emissions between CPO (Crude Palm Oil) and PK (Palm Kernel)
 */
export function calculateAllocationFactors(
  method: AllocationMethod,
  oer: number,
  ker: number,
  lhvCpo: number = 37.0, // MJ/kg
  lhvPk: number = 24.0,  // MJ/kg
  priceCpo: number = 900, // USD/ton
  pricePk: number = 500   // USD/ton
): AllocationFactors {
  let cpoFactor = 1.0;
  let pkFactor = 0.0;
  let basis = '';

  switch (method) {
    case 'ENERGY': {
      // Energy (Lower Heating Value) content allocation - Standard in RSPO & RED II
      const cpoEnergy = oer * lhvCpo;
      const pkEnergy = ker * lhvPk;
      const totalEnergy = cpoEnergy + pkEnergy;

      if (totalEnergy > 0) {
        cpoFactor = cpoEnergy / totalEnergy;
        pkFactor = pkEnergy / totalEnergy;
      }
      basis = `Energy Content (LHV): CPO (${lhvCpo} MJ/kg) vs PK (${lhvPk} MJ/kg)`;
      break;
    }

    case 'MASS': {
      // Mass allocation based on yield
      const totalMass = oer + ker;
      if (totalMass > 0) {
        cpoFactor = oer / totalMass;
        pkFactor = ker / totalMass;
      }
      basis = `Dry Mass Yield: CPO (${(oer * 100).toFixed(1)}%) vs PK (${(ker * 100).toFixed(1)}%)`;
      break;
    }

    case 'ECONOMIC': {
      // Economic revenue allocation
      const cpoValue = oer * priceCpo;
      const pkValue = ker * pricePk;
      const totalValue = cpoValue + pkValue;

      if (totalValue > 0) {
        cpoFactor = cpoValue / totalValue;
        pkFactor = pkValue / totalValue;
      }
      basis = `Market Value: CPO ($${priceCpo}/ton) vs PK ($${pricePk}/ton)`;
      break;
    }
  }

  return {
    cpoFactor,
    pkFactor,
    details: {
      method,
      cpoSharePercent: Number((cpoFactor * 100).toFixed(2)),
      pkSharePercent: Number((pkFactor * 100).toFixed(2)),
      basis,
    },
  };
}
