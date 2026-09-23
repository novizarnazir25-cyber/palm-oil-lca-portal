import { NextRequest, NextResponse } from 'next/server';
import { calculatePalmOilLca } from '@/lib/lca/engine';
import { DEFAULT_EMISSION_FACTORS } from '@/lib/lca/defaultFactors';
import { FarmInputs, MillInputs, LcaEmissionFactors } from '@/lib/lca/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { farm, mill, factors } = body as {
      farm: FarmInputs;
      mill: MillInputs;
      factors?: Partial<LcaEmissionFactors>;
    };

    if (!farm || !mill) {
      return NextResponse.json(
        { error: 'Parameter farm dan mill wajib disertakan.' },
        { status: 400 }
      );
    }

    const mergedFactors: LcaEmissionFactors = {
      ...DEFAULT_EMISSION_FACTORS,
      ...(factors || {}),
    };

    const result = calculatePalmOilLca(farm, mill, mergedFactors);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error: any) {
    console.error('Error calculating LCA:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat kalkulasi LCA' },
      { status: 500 }
    );
  }
}
