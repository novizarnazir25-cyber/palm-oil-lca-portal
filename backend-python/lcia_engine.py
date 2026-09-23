"""
Life Cycle Impact Assessment (LCIA) Matrix & Mathematical Calculation Engine
Methodology: ReCiPe 2016 (Hierarchist Perspective), IPCC 2019, RSPO PalmGHG v4.
System Boundary: Cradle-to-Gate (On-Farm Plantation to CPO Gate)
Supports:
1. Midpoint Characterization: GWP, AP, EP, Land Use, Toxicity (Human & Eco)
2. Endpoint Damage Assessment (AoP): Human Health (DALY), Ecosystem Quality (PDF.m2.yr), Resources (Surplus Energy MJ)
"""

from typing import Dict, Any, Tuple
import math
from models import FarmInputsModel, MillInputsModel

# ====================================================================
# 1. RECiPe 2016 (H) CHARACTERIZATION FACTORS (MIDPOINT)
# ====================================================================
CF_GWP_CO2 = 1.0
CF_GWP_CH4 = 28.0      # IPCC AR5 100-yr biogenic
CF_GWP_N2O = 265.0     # IPCC AR5 100-yr

CF_AP_SO2 = 1.0
CF_AP_NOX = 0.70
CF_AP_NH3 = 1.88       # Volatilized ammonia from synthetic N & urea

CF_EP_P = 3.06         # Freshwater eutrophication: 1 kg P = 3.06 kg PO4-eq
CF_EP_N = 0.42         # Marine eutrophication: 1 kg N = 0.42 kg PO4-eq

CF_LU_OCCUPATION = 1.0 # m2.yr per m2.yr occupied

CF_TOX_GLYPHOSATE = 45.2   # kg 1,4-DCB eq / kg active ingredient
CF_TOX_P_METAL = 120.0     # kg 1,4-DCB eq / kg P2O5 (heavy metal trace in rock phosphate)
CF_TOX_DIESEL = 0.85       # kg 1,4-DCB eq / L diesel fuel

# ====================================================================
# 2. RECiPe 2016 (H) DAMAGE FACTORS (ENDPOINT / Area of Protection)
# ====================================================================
# Human Health (DALY / Midpoint Unit)
DF_HH_GWP = 9.28e-7       # DALY / kg CO2-eq
DF_HH_AP = 6.29e-7        # DALY / kg SO2-eq
DF_HH_TOX = 3.32e-6       # DALY / kg 1,4-DCB eq

# Ecosystem Quality (PDF.m2.yr / Midpoint Unit)
DF_EQ_GWP = 0.204         # PDF.m2.yr / kg CO2-eq
DF_EQ_AP = 0.0156         # PDF.m2.yr / kg SO2-eq
DF_EQ_EP = 0.0064         # PDF.m2.yr / kg PO4-eq
DF_EQ_LU = 0.620          # PDF.m2.yr / m2.yr
DF_EQ_TOX = 0.0084        # PDF.m2.yr / kg 1,4-DCB eq

# Resources (Surplus Energy MJ / unit)
SURPLUS_ENERGY_DIESEL_MJ_PER_L = 42.0     # MJ / L
SURPLUS_ENERGY_UREA_MJ_PER_KG = 24.5      # Haber-Bosch natural gas energy
SURPLUS_ENERGY_GRID_MJ_PER_KWH = 10.5     # Avoided fossil grid energy


def calculate_lcia_matrices(farm: FarmInputsModel, mill: MillInputsModel) -> Dict[str, Any]:
    """
    Executes full Midpoint & Endpoint LCIA matrix calculations.
    Returns categorized impact indicators for 1 ton of CPO at Mill Gate.
    """
    yield_ha = max(0.1, farm.ffbYieldPerHa)
    oer = max(0.01, mill.oer)
    ker = max(0.001, mill.ker)

    # 1. ISO 14044 Co-product Allocation Factor (Energy LHV Default)
    if mill.allocationMethod == "MASS":
        f_cpo = oer / (oer + ker)
    elif mill.allocationMethod == "ECONOMIC":
        val_cpo = oer * mill.priceCpoUsdPerTon
        val_pk = ker * mill.pricePkUsdPerTon
        f_cpo = val_cpo / (val_cpo + val_pk)
    else:  # ENERGY
        e_cpo = oer * mill.lhvCpoMjPerKg
        e_pk = ker * mill.lhvPkMjPerKg
        f_cpo = e_cpo / (e_cpo + e_pk)
    
    # Scale from 1 ton FFB to 1 ton CPO: Multiplier = f_cpo / oer
    cpo_scale = f_cpo / oer

    # =================================================================
    # 2. INVENTORY FLOWS (ON-FARM / UPSTREAM PER TON FFB)
    # =================================================================
    # Synthetic N input (kg N / ha)
    n_urea = farm.ureaKgPerHa * 0.46
    n_za = farm.ammoniumSulfateKgPerHa * 0.21
    n_npk = farm.npkKgPerHa * farm.npkRatioN
    total_n_syn_ha = n_urea + n_za + n_npk

    # Atmospheric Nitrogen Emissions (N2O and NH3 volatilization)
    direct_n2o_kg_ha = total_n_syn_ha * 0.01 * (44.0 / 28.0)
    nh3_volatilized_kg_ha = total_n_syn_ha * 0.10 * (17.0 / 14.0)
    n_leached_kg_ha = total_n_syn_ha * 0.30
    indirect_n2o_kg_ha = (total_n_syn_ha * 0.10 * 0.01 + total_n_syn_ha * 0.30 * 0.0075) * (44.0 / 28.0)
    total_n2o_kg_ha = direct_n2o_kg_ha + indirect_n2o_kg_ha

    # Urea hydrolysis CO2
    urea_co2_kg_ha = farm.ureaKgPerHa * 0.7333

    # Peat soil oxidation CO2
    peat_co2_kg_ha = (farm.peatSoilPercentage / 100.0) * (55.0 * 1000.0)

    # Fertilizer manufacturing embodied CO2
    fert_mfg_co2_ha = (
        farm.ureaKgPerHa * 1.85 +
        farm.ammoniumSulfateKgPerHa * 1.15 +
        (farm.rockPhosphateKgPerHa + farm.npkKgPerHa * farm.npkRatioP2O5) * 1.20 +
        (farm.mopKclKgPerHa + farm.npkKgPerHa * farm.npkRatioK2O) * 0.65 +
        farm.dolomiteKgPerHa * 0.18
    )

    # Phosphorus runoff to surface water (Freshwater Eutrophication)
    p_applied_ha = (farm.rockPhosphateKgPerHa + farm.npkKgPerHa * farm.npkRatioP2O5) * 0.436
    p_runoff_kg_ha = p_applied_ha * 0.035  # ~3.5% P runoff rate in humid tropical soils

    # Pesticide active ingredients (Toxicity)
    herbicide_ai_kg_ha = farm.herbicideAiKgPerHa

    # Tractor diesel combustion
    farm_diesel_l_ha = farm.dieselTractorLitersPerHa

    # EFB mulching credit
    efb_credit_co2_ha = farm.efbMulchingTonsPerHa * 12.0

    # Convert On-Farm per hectare to per ton FFB:
    n2o_onfarm_ffb = total_n2o_kg_ha / yield_ha
    co2_onfarm_ffb = (urea_co2_kg_ha + peat_co2_kg_ha + fert_mfg_co2_ha + farm_diesel_l_ha * 3.15 - efb_credit_co2_ha) / yield_ha
    nh3_onfarm_ffb = nh3_volatilized_kg_ha / yield_ha
    n_leach_ffb = n_leached_kg_ha / yield_ha
    p_runoff_ffb = p_runoff_kg_ha / yield_ha
    herbicide_ffb = herbicide_ai_kg_ha / yield_ha
    p2o5_fert_ffb = (farm.rockPhosphateKgPerHa + farm.npkKgPerHa * farm.npkRatioP2O5) / yield_ha
    farm_diesel_ffb = farm_diesel_l_ha / yield_ha

    # Land occupation (m2.yr per ton FFB) = 10,000 m2 / yield_ha
    land_occupation_m2yr_ffb = 10000.0 / yield_ha

    # =================================================================
    # 3. INVENTORY FLOWS (TRANSPORT & PKS / MILL PER TON FFB)
    # =================================================================
    transport_co2_ffb = farm.transportDistanceKm * 0.12
    mill_diesel_l_ffb = mill.boilerDieselStartupLPerTonFfb
    mill_diesel_co2_ffb = mill_diesel_l_ffb * 3.15

    # POME Methane & Biogas
    cod_kg_ffb = mill.pomeRatioM3PerTonFfb * (mill.pomeCodMgPerL / 1000.0)
    max_ch4_kg_ffb = cod_kg_ffb * 0.25

    pome_ch4_emitted_ffb = 0.0
    biogas_power_kwh_export_ffb = 0.0

    if mill.treatmentMethod == "OPEN_ANAEROBIC_LAGOON":
        pome_ch4_emitted_ffb = max_ch4_kg_ffb * 0.80
    elif mill.treatmentMethod == "METHANE_CAPTURE_FLARING":
        pome_ch4_emitted_ffb = max_ch4_kg_ffb * (1.0 - mill.methaneCaptureEfficiency) * 0.80
    elif mill.treatmentMethod == "BIOGAS_TO_POWER":
        pome_ch4_emitted_ffb = max_ch4_kg_ffb * (1.0 - mill.methaneCaptureEfficiency) * 0.80
        captured_ch4_kg = max_ch4_kg_ffb * mill.methaneCaptureEfficiency
        captured_m3 = captured_ch4_kg / 0.717
        power_gen_kwh = captured_m3 * mill.biogasGeneratorEfficiencyKwhPerM3Ch4
        biogas_power_kwh_export_ffb = power_gen_kwh * (mill.biogasPowerExportPercentage / 100.0)

    avoided_grid_co2_ffb = (biogas_power_kwh_export_ffb + mill.gridElectricityExportKwhPerTonFfb) * 0.78

    # =================================================================
    # 4. VECTOR & MATRIX MULTIPLICATION FOR MIDPOINT CHARACTERIZATION
    # =================================================================
    # Elementary Inventory Vector per ton CPO:
    e_co2_onfarm = co2_onfarm_ffb * cpo_scale
    e_co2_pks = (transport_co2_ffb + mill_diesel_co2_ffb - avoided_grid_co2_ffb) * cpo_scale
    e_ch4_pks = pome_ch4_emitted_ffb * cpo_scale
    e_n2o_onfarm = n2o_onfarm_ffb * cpo_scale
    
    e_nh3_onfarm = nh3_onfarm_ffb * cpo_scale
    e_diesel_fuel_total = (farm_diesel_ffb + mill_diesel_l_ffb + (farm.transportDistanceKm * 0.038)) * cpo_scale
    
    e_n_leach = n_leach_ffb * cpo_scale
    e_p_runoff = p_runoff_ffb * cpo_scale
    
    e_land_occupation = land_occupation_m2yr_ffb * cpo_scale
    e_herbicide = herbicide_ffb * cpo_scale
    e_p2o5 = p2o5_fert_ffb * cpo_scale

    # --- MIDPOINT 1: Global Warming Potential (GWP) ---
    gwp_onfarm = (e_co2_onfarm * CF_GWP_CO2) + (e_n2o_onfarm * CF_GWP_N2O)
    gwp_pks = (e_co2_pks * CF_GWP_CO2) + (e_ch4_pks * CF_GWP_CH4)
    gwp_total = gwp_onfarm + gwp_pks

    # --- MIDPOINT 2: Acidification Potential (AP) ---
    ap_onfarm = e_nh3_onfarm * CF_AP_NH3
    ap_pks = (e_diesel_fuel_total * 0.0082) * CF_AP_SO2
    ap_total = ap_onfarm + ap_pks

    # --- MIDPOINT 3: Eutrophication Potential (EP) ---
    ep_onfarm = (e_p_runoff * CF_EP_P) + (e_n_leach * CF_EP_N)
    ep_pks = ep_onfarm * 0.05  # Residual minor POME discharge contribution
    ep_total = ep_onfarm + ep_pks

    # --- MIDPOINT 4: Land Use (LU) ---
    lu_onfarm = e_land_occupation * CF_LU_OCCUPATION
    lu_pks = 15.0  # Mill built footprint (~15 m2.yr/t CPO)
    lu_total = lu_onfarm + lu_pks

    # --- MIDPOINT 5: Human & Ecotoxicity ---
    tox_onfarm = (e_herbicide * CF_TOX_GLYPHOSATE) + (e_p2o5 * CF_TOX_P_METAL)
    tox_pks = e_diesel_fuel_total * CF_TOX_DIESEL
    tox_total = tox_onfarm + tox_pks

    # =================================================================
    # 5. ENDPOINT DAMAGE MATRIX AGGREGATION (Area of Protection)
    # =================================================================
    # Human Health (DALY)
    hh_daly = (
        (gwp_total * DF_HH_GWP) +
        (ap_total * DF_HH_AP) +
        (tox_total * DF_HH_TOX)
    )

    # Ecosystem Quality (PDF.m2.yr)
    eq_pdf = (
        (gwp_total * DF_EQ_GWP) +
        (ap_total * DF_EQ_AP) +
        (ep_total * DF_EQ_EP) +
        (lu_total * DF_EQ_LU) +
        (tox_total * DF_EQ_TOX)
    )

    # Resources (Surplus Energy MJ)
    res_surplus_mj = (
        (e_diesel_fuel_total * SURPLUS_ENERGY_DIESEL_MJ_PER_L) +
        ((farm.ureaKgPerHa / yield_ha) * cpo_scale * SURPLUS_ENERGY_UREA_MJ_PER_KG) -
        ((biogas_power_kwh_export_ffb * cpo_scale) * SURPLUS_ENERGY_GRID_MJ_PER_KWH)
    )

    # RSPO PalmGHG Benchmark Rating
    if gwp_total < 450:
        rating = "A+"
    elif gwp_total < 650:
        rating = "A"
    elif gwp_total < 950:
        rating = "B"
    elif gwp_total < 1400:
        rating = "C"
    else:
        rating = "D"

    return {
        "functionalUnit": "1 ton Crude Palm Oil (CPO) at Mill Gate",
        "allocationMethod": mill.allocationMethod,
        "cpoAllocationFactor": round(f_cpo, 4),
        "palmGhgrating": rating,
        
        # Midpoint Results
        "midpoint": {
            "gwp_kg_co2e": round(gwp_total, 2),
            "ap_kg_so2e": round(ap_total, 4),
            "ep_kg_po4e": round(ep_total, 4),
            "land_use_m2yr": round(lu_total, 2),
            "toxicity_kg_dcb": round(tox_total, 2),
            "breakdown": {
                "onFarm": {
                    "gwp": round(gwp_onfarm, 2),
                    "ap": round(ap_onfarm, 4),
                    "ep": round(ep_onfarm, 4),
                    "landUse": round(lu_onfarm, 2),
                    "toxicity": round(tox_onfarm, 2),
                },
                "pks": {
                    "gwp": round(gwp_pks, 2),
                    "ap": round(ap_pks, 4),
                    "ep": round(ep_pks, 4),
                    "landUse": round(lu_pks, 2),
                    "toxicity": round(tox_pks, 2),
                }
            }
        },
        
        # Endpoint Results (Area of Protection)
        "endpoint": {
            "human_health_daly": round(hh_daly, 6),
            "human_health_milli_daly": round(hh_daly * 1000.0, 3), # mDALY
            "ecosystem_quality_pdf": round(eq_pdf, 2),            # PDF.m2.yr
            "species_yr": round(eq_pdf / 7.3e7, 10),              # species.yr
            "resources_surplus_mj": round(res_surplus_mj, 2),     # MJ Surplus Energy
            "breakdown": {
                "humanHealthContributions": {
                    "climateChangeDaly": round(gwp_total * DF_HH_GWP, 6),
                    "acidificationDaly": round(ap_total * DF_HH_AP, 6),
                    "toxicityDaly": round(tox_total * DF_HH_TOX, 6),
                },
                "ecosystemQualityContributions": {
                    "climateChangePdf": round(gwp_total * DF_EQ_GWP, 2),
                    "landUsePdf": round(lu_total * DF_EQ_LU, 2),
                    "acidificationPdf": round(ap_total * DF_EQ_AP, 2),
                    "eutrophicationPdf": round(ep_total * DF_EQ_EP, 2),
                    "toxicityPdf": round(tox_total * DF_EQ_TOX, 2),
                }
            }
        }
    }
