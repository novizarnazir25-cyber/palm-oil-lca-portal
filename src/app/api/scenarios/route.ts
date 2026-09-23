import { NextRequest, NextResponse } from 'next/server';
import { prisma, INITIAL_SCENARIOS } from '@/lib/db';
import { calculatePalmOilLca } from '@/lib/lca/engine';
import { DEFAULT_EMISSION_FACTORS } from '@/lib/lca/defaultFactors';

export async function GET() {
  try {
    let dbScenarios: any[] = [];
    try {
      dbScenarios = await prisma.lcaScenario.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      // If DB is not yet migrated, fall back smoothly to initial scenarios
      dbScenarios = [];
    }

    if (dbScenarios.length === 0) {
      return NextResponse.json({
        success: true,
        scenarios: INITIAL_SCENARIOS,
      });
    }

    const formatted = dbScenarios.map((s) => {
      const farm = {
        ffbYieldPerHa: s.ffbYieldPerHa,
        plantationAreaHa: s.plantationAreaHa,
        peatSoilPercentage: s.peatSoilPercentage,
        ureaKgPerHa: s.ureaKgPerHa,
        ammoniumSulfateKgPerHa: s.ammoniumSulfateKgPerHa,
        npkKgPerHa: s.npkKgPerHa,
        npkRatioN: s.npkRatioN,
        npkRatioP2O5: s.npkRatioP2O5,
        npkRatioK2O: s.npkRatioK2O,
        rockPhosphateKgPerHa: s.rockPhosphateKgPerHa,
        mopKclKgPerHa: s.mopKclKgPerHa,
        dolomiteKgPerHa: s.dolomiteKgPerHa,
        herbicideAiKgPerHa: s.herbicideAiKgPerHa,
        dieselTractorLitersPerHa: s.dieselTractorLitersPerHa,
        efbMulchingTonsPerHa: s.efbMulchingTonsPerHa,
        transportDistanceKm: s.transportDistanceKm,
        truckPayloadTons: s.truckPayloadTons,
        truckFuelLitersPer100Km: s.truckFuelLitersPer100Km,
      };

      const mill = {
        annualFfbProcessedTons: s.annualFfbProcessedTons,
        oer: s.oer,
        ker: s.ker,
        fiberFraction: s.fiberFraction,
        shellFraction: s.shellFraction,
        efbFraction: s.efbFraction,
        boilerDieselStartupLPerTonFfb: s.boilerDieselStartupLPerTonFfb,
        gridElectricityExportKwhPerTonFfb: s.gridElectricityExportKwhPerTonFfb,
        pomeRatioM3PerTonFfb: s.pomeRatioM3PerTonFfb,
        pomeCodMgPerL: s.pomeCodMgPerL,
        pomeBodMgPerL: s.pomeBodMgPerL,
        treatmentMethod: s.treatmentMethod as any,
        methaneCaptureEfficiency: s.methaneCaptureEfficiency,
        biogasGeneratorEfficiencyKwhPerM3Ch4: s.biogasGeneratorEfficiencyKwhPerM3Ch4,
        biogasPowerExportPercentage: s.biogasPowerExportPercentage,
        allocationMethod: s.allocationMethod as any,
        priceCpoUsdPerTon: s.priceCpoUsdPerTon,
        pricePkUsdPerTon: s.pricePkUsdPerTon,
        lhvCpoMjPerKg: s.lhvCpoMjPerKg,
        lhvPkMjPerKg: s.lhvPkMjPerKg,
      };

      const result = calculatePalmOilLca(farm, mill, DEFAULT_EMISSION_FACTORS);

      return {
        id: s.id,
        name: s.name,
        description: s.description,
        farmInputs: farm,
        millInputs: mill,
        result,
      };
    });

    return NextResponse.json({
      success: true,
      scenarios: formatted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal memuat skenario' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, farmInputs, millInputs } = body;

    const result = calculatePalmOilLca(farmInputs, millInputs, DEFAULT_EMISSION_FACTORS);

    try {
      const saved = await prisma.lcaScenario.create({
        data: {
          name: name || 'Skenario Baru',
          description: description || '',
          ...farmInputs,
          ...millInputs,
          totalGwpPerTonCpo: result.totalGwpPerTonCpo,
          totalGwpPerKgCpo: result.totalGwpPerKgCpo,
          upstreamEmissionsKgCo2: result.upstreamEmissionsKgCo2,
          transportEmissionsKgCo2: result.transportEmissionsKgCo2,
          millEmissionsKgCo2: result.millEmissionsKgCo2,
          pomeEmissionsKgCo2: result.pomeEmissionsKgCo2,
          carbonCreditsKgCo2: result.carbonCreditsKgCo2,
          palmGhgrating: result.palmGhgrating,
        },
      });

      return NextResponse.json({
        success: true,
        id: saved.id,
        result,
      });
    } catch {
      // In-memory fallback response if Prisma DB is not yet migrated
      return NextResponse.json({
        success: true,
        id: 'temp-' + Date.now(),
        name,
        description,
        farmInputs,
        millInputs,
        result,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan skenario' },
      { status: 500 }
    );
  }
}
