import { NextResponse } from 'next/server';
import { DEFAULT_EMISSION_FACTORS } from '@/lib/lca/defaultFactors';

export async function GET() {
  return NextResponse.json({
    success: true,
    standards: {
      lca: 'ISO 14040/14044',
      agriculture: 'IPCC 2006 & 2019 Refinement Tier 1/2',
      certification: 'RSPO PalmGHG v4 & ISPO',
      gwpReference: 'IPCC AR5 100-year GWP',
    },
    factors: DEFAULT_EMISSION_FACTORS,
  });
}
