"""
Palm Oil Cradle-to-Gate LCA Calculation Engine in Python
Compliant with ISO 14040/14044, IPCC 2006/2019 Refinement, and RSPO PalmGHG v4.
"""

from typing import Dict, Any, Tuple
from models import FarmInputsModel, MillInputsModel

# Default Scientific Emission Factors (IPCC AR5, RSPO PalmGHG)
GWP_N2O = 265.0
GWP_CH4 = 28.0

EF_DIRECT_N2O = 0.01          # EF1: 1% of N input as N2O-N
FRAC_GASF = 0.10             # Volatilization fraction
EF_VOLATILIZATION_N2O = 0.01  # EF4
FRAC_LEACH = 0.30            # Leaching fraction
EF_LEACHING_N2O = 0.0075     # EF5

EF_UREA_CO2 = 0.7333         # 0.20 * 44/12
EF_PEAT_OXIDATION_TON_HA = 55.0

EF_PROD_UREA = 1.85
EF_PROD_ZA = 1.15
EF_PROD_P2O5 = 1.20
EF_PROD_K2O = 0.65
EF_PROD_DOLOMITE = 0.18
EF_PROD_PESTICIDE_AI = 12.50

EF_DIESEL_WTW = 3.15         # kg CO2eq / L
EF_TRANSPORT_TRUCK_TKM = 0.12 # kg CO2eq / ton.km

BO_MAX_CH4_COD = 0.25        # kg CH4 / kg COD
MCF_OPEN_LAGOON = 0.80
CH4_DENSITY_KG_M3 = 0.717

EF_GRID_DISPLACEMENT = 0.78  # kg CO2eq / kWh displaced

EF_ACID_DIESEL = 0.0082
EF_ACID_N = 0.052
EF_EUTRO_N = 0.13
EF_EUTRO_P2O5 = 1.00


def calculate_allocation_factors(
    method: str,
    oer: float,
    ker: float,
    lhv_cpo: float = 37.0,
    lhv_pk: float = 24.0,
    price_cpo: float = 920.0,
    price_pk: float = 520.0
) -> Tuple[float, float]:
    """Calculates ISO 14044 Co-product allocation factors."""
    if method == "ENERGY":
        e_cpo = oer * lhv_cpo
        e_pk = ker * lhv_pk
        total = e_cpo + e_pk
        return (e_cpo / total, e_pk / total) if total > 0 else (1.0, 0.0)
    elif method == "MASS":
        total = oer + ker
        return (oer / total, ker / total) if total > 0 else (1.0, 0.0)
    elif method == "ECONOMIC":
        v_cpo = oer * price_cpo
        v_pk = ker * price_pk
        total = v_cpo + v_pk
        return (v_cpo / total, v_pk / total) if total > 0 else (1.0, 0.0)
    return (1.0, 0.0)


def calculate_palm_lca(farm: FarmInputsModel, mill: MillInputsModel) -> Dict[str, Any]:
    """
    Master Cradle-to-Gate Life Cycle Assessment calculation.
    Returns structured results for 1 ton of CPO at Mill Gate.
    """
    yield_ha = max(0.1, farm.ffbYieldPerHa)
    oer = max(0.01, mill.oer)
    ker = max(0.001, mill.ker)

    # 1. UPSTREAM (PERKEBUNAN) PER HECTARE
    n_urea = farm.ureaKgPerHa * 0.46
    n_za = farm.ammoniumSulfateKgPerHa * 0.21
    n_npk = farm.npkKgPerHa * farm.npkRatioN
    total_n_syn = n_urea + n_za + n_npk

    # Direct N2O
    direct_n2o_kg = total_n_syn * EF_DIRECT_N2O * (44.0 / 28.0)
    direct_n2o_co2e = direct_n2o_kg * GWP_N2O

    # Indirect N2O
    n_volat = total_n_syn * FRAC_GASF * EF_VOLATILIZATION_N2O
    n_leach = total_n_syn * FRAC_LEACH * EF_LEACHING_N2O
    indirect_n2o_kg = (n_volat + n_leach) * (44.0 / 28.0)
    indirect_n2o_co2e = indirect_n2o_kg * GWP_N2O

    # Urea hydrolysis CO2
    urea_co2 = farm.ureaKgPerHa * EF_UREA_CO2

    # Fertilizer Production
    fert_prod = (
        farm.ureaKgPerHa * EF_PROD_UREA +
        farm.ammoniumSulfateKgPerHa * EF_PROD_ZA +
        (farm.rockPhosphateKgPerHa + farm.npkKgPerHa * farm.npkRatioP2O5) * EF_PROD_P2O5 +
        (farm.mopKclKgPerHa + farm.npkKgPerHa * farm.npkRatioK2O) * EF_PROD_K2O +
        farm.dolomiteKgPerHa * EF_PROD_DOLOMITE
    )

    # Pesticides Production
    pest_prod = farm.herbicideAiKgPerHa * EF_PROD_PESTICIDE_AI

    # Fuel in Farm
    farm_fuel = farm.dieselTractorLitersPerHa * EF_DIESEL_WTW

    # Peat Oxidation
    peat_fraction = max(0.0, min(100.0, farm.peatSoilPercentage)) / 100.0
    peat_co2 = peat_fraction * (EF_PEAT_OXIDATION_TON_HA * 1000.0)

    # EFB Mulching credit
    efb_credit_ha = farm.efbMulchingTonsPerHa * 12.0

    # Per ton FFB
    direct_n2o_ffb = direct_n2o_co2e / yield_ha
    indirect_n2o_ffb = indirect_n2o_co2e / yield_ha
    urea_co2_ffb = urea_co2 / yield_ha
    fert_prod_ffb = fert_prod / yield_ha
    pest_prod_ffb = pest_prod / yield_ha
    farm_fuel_ffb = farm_fuel / yield_ha
    peat_co2_ffb = peat_co2 / yield_ha
    efb_credit_ffb = efb_credit_ha / yield_ha

    # 2. TRANSPORT TO MILL
    transport_ffb = farm.transportDistanceKm * EF_TRANSPORT_TRUCK_TKM

    # 3. MILL PROCESSING & POME
    mill_startup_ffb = mill.boilerDieselStartupLPerTonFfb * EF_DIESEL_WTW
    cogen_credit_ffb = mill.gridElectricityExportKwhPerTonFfb * EF_GRID_DISPLACEMENT

    # POME COD
    cod_kg_ton_ffb = mill.pomeRatioM3PerTonFfb * (mill.pomeCodMgPerL / 1000.0)
    max_ch4_kg = cod_kg_ton_ffb * BO_MAX_CH4_COD

    pome_emitted_ch4_kg = 0.0
    biogas_credit_ffb = 0.0

    if mill.treatmentMethod == 'OPEN_ANAEROBIC_LAGOON':
        pome_emitted_ch4_kg = max_ch4_kg * MCF_OPEN_LAGOON
    elif mill.treatmentMethod == 'METHANE_CAPTURE_FLARING':
        pome_emitted_ch4_kg = max_ch4_kg * (1.0 - mill.methaneCaptureEfficiency) * MCF_OPEN_LAGOON
    elif mill.treatmentMethod == 'BIOGAS_TO_POWER':
        pome_emitted_ch4_kg = max_ch4_kg * (1.0 - mill.methaneCaptureEfficiency) * MCF_OPEN_LAGOON
        captured_ch4_kg = max_ch4_kg * mill.methaneCaptureEfficiency
        captured_m3 = captured_ch4_kg / CH4_DENSITY_KG_M3
        power_gen_kwh = captured_m3 * mill.biogasGeneratorEfficiencyKwhPerM3Ch4
        power_export_kwh = power_gen_kwh * (mill.biogasPowerExportPercentage / 100.0)
        biogas_credit_ffb = power_export_kwh * EF_GRID_DISPLACEMENT

    pome_co2e_ffb = pome_emitted_ch4_kg * GWP_CH4

    # 4. ALLOCATION
    f_cpo, f_pk = calculate_allocation_factors(
        mill.allocationMethod, oer, ker,
        mill.lhvCpoMjPerKg, mill.lhvPkMjPerKg,
        mill.priceCpoUsdPerTon, mill.pricePkUsdPerTon
    )

    # 5. SCALE TO 1 TON CPO
    ffb_scale = f_cpo / oer

    direct_n2o_cpo = direct_n2o_ffb * ffb_scale
    indirect_n2o_cpo = indirect_n2o_ffb * ffb_scale
    urea_co2_cpo = urea_co2_ffb * ffb_scale
    fert_prod_cpo = fert_prod_ffb * ffb_scale
    pest_prod_cpo = pest_prod_ffb * ffb_scale
    farm_fuel_cpo = farm_fuel_ffb * ffb_scale
    peat_cpo = peat_co2_ffb * ffb_scale
    transport_cpo = transport_ffb * ffb_scale
    mill_startup_cpo = mill_startup_ffb * ffb_scale
    pome_cpo = pome_co2e_ffb * ffb_scale

    biogas_credit_cpo = biogas_credit_ffb * ffb_scale
    cogen_credit_cpo = cogen_credit_ffb * ffb_scale
    efb_credit_cpo = efb_credit_ffb * ffb_scale

    upstream_cpo = (
        direct_n2o_cpo + indirect_n2o_cpo + urea_co2_cpo +
        fert_prod_cpo + pest_prod_cpo + farm_fuel_cpo + peat_cpo
    )
    credits_cpo = biogas_credit_cpo + cogen_credit_cpo + efb_credit_cpo
    gross_cpo = upstream_cpo + transport_cpo + mill_startup_cpo + pome_cpo
    net_cpo = gross_cpo - credits_cpo

    # Environmental impacts
    total_diesel = (farm.dieselTractorLitersPerHa / yield_ha) + mill.boilerDieselStartupLPerTonFfb
    acid_ton_ffb = (total_n_syn / yield_ha) * EF_ACID_N + total_diesel * EF_ACID_DIESEL
    acid_cpo = acid_ton_ffb * ffb_scale

    eutro_ton_ffb = (n_leach / yield_ha) * EF_EUTRO_N + (
        (farm.rockPhosphateKgPerHa + farm.npkKgPerHa * farm.npkRatioP2O5) * 0.05 / yield_ha
    ) * EF_EUTRO_P2O5
    eutro_cpo = eutro_ton_ffb * ffb_scale

    # Rating
    if net_cpo < 450:
        rating = "A+"
    elif net_cpo < 650:
        rating = "A"
    elif net_cpo < 950:
        rating = "B"
    elif net_cpo < 1400:
        rating = "C"
    else:
        rating = "D"

    return {
        "functionalUnit": "1 ton Crude Palm Oil (CPO) at Mill Gate",
        "totalGwpPerTonCpo": round(net_cpo, 2),
        "totalGwpPerKgCpo": round(net_cpo / 1000.0, 4),
        "totalGwpPerTonFfb": round((upstream_cpo + transport_cpo) * oer / f_cpo, 2),
        "cpoAllocationFactor": round(f_cpo, 4),
        "pkAllocationFactor": round(f_pk, 4),
        "allocationMethod": mill.allocationMethod,
        "upstreamEmissionsKgCo2": round(upstream_cpo, 2),
        "transportEmissionsKgCo2": round(transport_cpo, 2),
        "millEmissionsKgCo2": round(mill_startup_cpo, 2),
        "pomeEmissionsKgCo2": round(pome_cpo, 2),
        "carbonCreditsKgCo2": round(credits_cpo, 2),
        "sources": {
            "directN2O": round(direct_n2o_cpo, 2),
            "indirectN2O": round(indirect_n2o_cpo, 2),
            "ureaHydrolysisCO2": round(urea_co2_cpo, 2),
            "fertilizerProduction": round(fert_prod_cpo, 2),
            "pesticideProduction": round(pest_prod_cpo, 2),
            "farmFuelMachinery": round(farm_fuel_cpo, 2),
            "peatOxidation": round(peat_cpo, 2),
            "ffbTransport": round(transport_cpo, 2),
            "pomeMethane": round(pome_cpo, 2),
            "millStartupFuel": round(mill_startup_cpo, 2),
            "biogasGridCredit": round(biogas_credit_cpo, 2),
            "surplusBiomassElectricityCredit": round(cogen_credit_cpo, 2),
            "efbOrganicRecycleCredit": round(efb_credit_cpo, 2),
        },
        "stageSummary": [
            {
                "stage": "Upstream (Perkebunan)",
                "grossEmissionsKgCo2": round(upstream_cpo, 2),
                "avoidedCreditsKgCo2": round(efb_credit_cpo, 2),
                "netEmissionsKgCo2": round(upstream_cpo - efb_credit_cpo, 2),
                "percentageOfTotal": round((upstream_cpo / gross_cpo) * 100.0, 1) if gross_cpo > 0 else 0,
            },
            {
                "stage": "Transportasi TBS",
                "grossEmissionsKgCo2": round(transport_cpo, 2),
                "avoidedCreditsKgCo2": 0.0,
                "netEmissionsKgCo2": round(transport_cpo, 2),
                "percentageOfTotal": round((transport_cpo / gross_cpo) * 100.0, 1) if gross_cpo > 0 else 0,
            },
            {
                "stage": "Proses PKS (Boiler & Mill)",
                "grossEmissionsKgCo2": round(mill_startup_cpo, 2),
                "avoidedCreditsKgCo2": round(cogen_credit_cpo, 2),
                "netEmissionsKgCo2": round(mill_startup_cpo - cogen_credit_cpo, 2),
                "percentageOfTotal": round((mill_startup_cpo / gross_cpo) * 100.0, 1) if gross_cpo > 0 else 0,
            },
            {
                "stage": "Pengolahan Limbah POME",
                "grossEmissionsKgCo2": round(pome_cpo, 2),
                "avoidedCreditsKgCo2": round(biogas_credit_cpo, 2),
                "netEmissionsKgCo2": round(pome_cpo - biogas_credit_cpo, 2),
                "percentageOfTotal": round((pome_cpo / gross_cpo) * 100.0, 1) if gross_cpo > 0 else 0,
            }
        ],
        "eutrophicationPotentialKgPo4EqPerTonCpo": round(eutro_cpo, 4),
        "acidificationPotentialKgSo2EqPerTonCpo": round(acid_cpo, 4),
        "palmGhgrating": rating
    }
