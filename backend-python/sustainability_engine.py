"""
Palm Oil Sustainability & Circular Economy Engine (Python Microservice)
Quantifies:
1. Circular Economy Index (CEI) & Biomass Valorization
2. Energy Return on Investment (EROI) & Net Energy Ratio (NER)
3. Sustainable Development Index (SDI, scale 0-100)
4. ISPO (Permentan 38/2020) and RSPO (P&C 2018/2023) Compliance Matrix
"""

import math
from typing import Dict, Any, List

def calculate_circular_economy(farm: Any, mill: Any) -> Dict[str, Any]:
    oer = max(0.01, mill.oer)
    yield_ha = max(0.1, farm.ffbYieldPerHa)
    annual_ffb = max(1.0, mill.annualFfbProcessedTons)

    # 1. Solid Waste Streams
    efb_kg_per_ffb = mill.efbFraction * 1000.0   # ~220 kg / t FFB
    efb_kg_per_cpo = efb_kg_per_ffb / oer         # ~1000 kg / t CPO
    efb_tons_annual = (annual_ffb * efb_kg_per_ffb) / 1000.0

    efb_mulched_per_ffb = (farm.efbMulchingTonsPerHa * 1000.0) / yield_ha
    efb_utilized_cpo = min(
        efb_kg_per_cpo,
        (efb_mulched_per_ffb / oer) + (efb_kg_per_cpo * 0.20 if mill.treatmentMethod == 'BIOGAS_TO_POWER' else 0.0)
    )
    efb_rate = round(min(100.0, (efb_utilized_cpo / efb_kg_per_cpo) * 100.0), 1)

    # Fiber (100% used in boiler)
    fiber_kg_per_ffb = mill.fiberFraction * 1000.0 # ~135 kg / t FFB
    fiber_kg_per_cpo = fiber_kg_per_ffb / oer
    fiber_tons_annual = (annual_ffb * fiber_kg_per_ffb) / 1000.0
    fiber_rate = 100.0

    # Shell (cangkang: 70% boiler, 28% export biofuel)
    shell_kg_per_ffb = mill.shellFraction * 1000.0 # ~65 kg / t FFB
    shell_kg_per_cpo = shell_kg_per_ffb / oer
    shell_tons_annual = (annual_ffb * shell_kg_per_ffb) / 1000.0
    shell_utilized_cpo = shell_kg_per_cpo * 0.98
    shell_rate = 98.0

    total_solid_gen = efb_kg_per_cpo + fiber_kg_per_cpo + shell_kg_per_cpo
    total_solid_util = efb_utilized_cpo + fiber_kg_per_cpo + shell_utilized_cpo
    solid_waste_rate = round((total_solid_util / total_solid_gen) * 100.0, 1)

    # 2. Liquid Waste (POME)
    pome_m3_cpo = mill.pomeRatioM3PerTonFfb / oer
    cod_kg_cpo = pome_m3_cpo * (mill.pomeCodMgPerL / 1000.0)
    methane_m3_cpo = (cod_kg_cpo * 0.25) / 0.717

    if mill.treatmentMethod == 'BIOGAS_TO_POWER':
        captured_m3 = methane_m3_cpo * mill.methaneCaptureEfficiency
        liquid_rate = min(100.0, round(85.0 + (mill.biogasPowerExportPercentage * 0.12), 1))
        pome_pathways = [
            f"Penangkapan Biogas ({int(mill.methaneCaptureEfficiency*100)}%) PLTBg",
            f"Ekspor Listrik Grid ({mill.biogasPowerExportPercentage}%)",
            "Aplikasi Lahan / Land Application Terkontrol"
        ]
    elif mill.treatmentMethod == 'METHANE_CAPTURE_FLARING':
        captured_m3 = methane_m3_cpo * mill.methaneCaptureEfficiency
        liquid_rate = 72.0
        pome_pathways = [
            f"Methane Capture & Flaring Termal ({int(mill.methaneCaptureEfficiency*100)}%)",
            "Kolam Penstabilan Aerobik Efluen"
        ]
    else:
        captured_m3 = 0.0
        liquid_rate = 30.0
        pome_pathways = [
            "Kolam Anaerobik Terbuka (Emisi Metana Bebas)",
            "Land Application Terbatas"
        ]

    # Composite CEI: 55% Solid, 45% Liquid
    cei = round(0.55 * solid_waste_rate + 0.45 * liquid_rate, 1)

    if cei >= 90:
        tier = "REGENERATIVE_CIRCULAR"
        tier_label = "Tier 1 - Regenerative Closed-Loop Circular"
        tier_desc = "Seluruh limbah padat dan cair didaur ulang menjadi energi terbarukan dan pupuk organik terpadu."
    elif cei >= 75:
        tier = "ADVANCED_CIRCULAR"
        tier_label = "Tier 2 - Advanced Circular Agroindustry"
        tier_desc = "Efisiensi pemanfaatan limbah sangat tinggi dengan valorisasi biomassa boiler dan mitigasi metana."
    elif cei >= 50:
        tier = "TRANSITIONAL"
        tier_label = "Tier 3 - Transitional Circular System"
        tier_desc = "Biomassa serat dan cangkang digunakan di boiler, namun pemanfaatan TKKS dan POME masih belum optimal."
    else:
        tier = "LINEAR"
        tier_label = "Tier 4 - Linear Agroindustry (High Waste)"
        tier_desc = "Beban buangan limbah tinggi tanpa penangkapan biogas dan pemulsaan organik minim."

    return {
        "solidWaste": {
            "efb": {
                "generatedTonsPerYear": round(efb_tons_annual),
                "generatedKgPerTonCpo": round(efb_kg_per_cpo, 1),
                "utilizedKgPerTonCpo": round(efb_utilized_cpo, 1),
                "utilizationRatePercent": efb_rate,
            },
            "fiber": {
                "generatedTonsPerYear": round(fiber_tons_annual),
                "generatedKgPerTonCpo": round(fiber_kg_per_cpo, 1),
                "utilizedKgPerTonCpo": round(fiber_kg_per_cpo, 1),
                "utilizationRatePercent": fiber_rate,
            },
            "shell": {
                "generatedTonsPerYear": round(shell_tons_annual),
                "generatedKgPerTonCpo": round(shell_kg_per_cpo, 1),
                "utilizedKgPerTonCpo": round(shell_utilized_cpo, 1),
                "utilizationRatePercent": shell_rate,
            },
            "totalGeneratedKgPerTonCpo": round(total_solid_gen, 1),
            "totalUtilizedKgPerTonCpo": round(total_solid_util, 1),
            "solidWasteUtilizationRatePercent": solid_waste_rate,
        },
        "liquidWaste": {
            "pomeVolumeM3PerTonCpo": round(pome_m3_cpo, 2),
            "codTotalKgPerTonCpo": round(cod_kg_cpo, 1),
            "methanePotentialM3PerTonCpo": round(methane_m3_cpo, 1),
            "methaneCapturedM3PerTonCpo": round(captured_m3, 1),
            "liquidWasteUtilizationRatePercent": liquid_rate,
            "pathways": pome_pathways,
        },
        "ceiPercentage": cei,
        "circularityTier": tier,
        "tierLabel": tier_label,
        "tierDescription": tier_desc,
    }

def calculate_energy_balance(farm: Any, mill: Any) -> Dict[str, Any]:
    oer = max(0.01, mill.oer)
    ker = max(0.001, mill.ker)
    yield_ha = max(0.1, farm.ffbYieldPerHa)

    # 1. Fossil Inputs (MJ / ton CPO)
    n_urea = farm.ureaKgPerHa * 0.46
    n_za = farm.ammoniumSulfateKgPerHa * 0.21
    energy_fert = (n_urea * 65.0) + (n_za * 45.0) + (farm.npkKgPerHa * 35.0) + \
                  (farm.rockPhosphateKgPerHa * 15.0) + (farm.mopKclKgPerHa * 8.5) + (farm.dolomiteKgPerHa * 1.2)
    fert_mj_cpo = energy_fert / (yield_ha * oer)

    pesticide_mj_cpo = (farm.herbicideAiKgPerHa * 280.0) / (yield_ha * oer)
    tractor_mj_cpo = (farm.dieselTractorLitersPerHa * 42.0) / (yield_ha * oer)

    truck_payload = max(1.0, farm.truckPayloadTons)
    truck_fuel_ffb = ((2.0 * farm.transportDistanceKm) / 100.0 * farm.truckFuelLitersPer100Km) / truck_payload
    transport_mj_cpo = (truck_fuel_ffb * 42.0) / oer

    startup_mj_cpo = (mill.boilerDieselStartupLPerTonFfb * 42.0) / oer

    total_fossil_cpo = round(fert_mj_cpo + pesticide_mj_cpo + tractor_mj_cpo + transport_mj_cpo + startup_mj_cpo, 1)
    total_fossil_ffb = round(total_fossil_cpo * oer, 1)

    # 2. Renewable Generation (MJ / ton CPO)
    fiber_kg_cpo = (mill.fiberFraction * 1000.0) / oer
    shell_kg_cpo = (mill.shellFraction * 1000.0) / oer

    # Boiler steam & power (LHV fiber: 11.5, shell: 17.5; efficiency 72%)
    boiler_thermal = (fiber_kg_cpo * 11.5) + (shell_kg_cpo * 0.75 * 17.5)
    boiler_mj_cpo = round(boiler_thermal * 0.72, 1)

    biogas_mj_cpo = 0.0
    if mill.treatmentMethod == 'BIOGAS_TO_POWER':
        pome_m3 = mill.pomeRatioM3PerTonFfb / oer
        cod_kg = pome_m3 * (mill.pomeCodMgPerL / 1000.0)
        ch4_m3 = (cod_kg * 0.25) / 0.717
        captured = ch4_m3 * mill.methaneCaptureEfficiency
        biogas_mj_cpo = round(captured * 35.8 * 0.60, 1)

    cpo_bioenergy_mj = 37000.0
    pk_bioenergy_mj = round((ker / oer) * 24000.0, 1)

    total_renew_gen = round(boiler_mj_cpo + biogas_mj_cpo, 1)
    total_products_mj = round(cpo_bioenergy_mj + pk_bioenergy_mj, 1)

    # EROI & NER
    eroi_process = round(total_renew_gen / max(1.0, total_fossil_cpo), 2)
    eroi_total = round((total_products_mj + total_renew_gen) / max(1.0, total_fossil_cpo), 2)
    net_energy_bal = round(total_products_mj + total_renew_gen - total_fossil_cpo, 1)

    mill_internal_demand = 3500.0
    autonomy_pct = round(min(300.0, (total_renew_gen / mill_internal_demand) * 100.0), 1)

    if autonomy_pct > 120.0:
        autonomy_status = "FULLY_AUTONOMOUS_NET_EXPORTER"
    elif autonomy_pct >= 95.0:
        autonomy_status = "SELF_SUFFICIENT"
    else:
        autonomy_status = "GRID_DEPENDENT"

    return {
        "fossilInputs": {
            "fertilizersEmbodiedMjPerTonCpo": round(fert_mj_cpo, 1),
            "pesticidesEmbodiedMjPerTonCpo": round(pesticide_mj_cpo, 1),
            "tractorDieselMjPerTonCpo": round(tractor_mj_cpo, 1),
            "transportTruckDieselMjPerTonCpo": round(transport_mj_cpo, 1),
            "millStartupDieselMjPerTonCpo": round(startup_mj_cpo, 1),
            "totalFossilInputMjPerTonCpo": total_fossil_cpo,
            "totalFossilInputMjPerTonFfb": total_fossil_ffb,
        },
        "renewableOutputs": {
            "biomassBoilerSteamPowerMjPerTonCpo": boiler_mj_cpo,
            "biogasElectricityMjPerTonCpo": biogas_mj_cpo,
            "cpoChemicalEnergyMjPerTonCpo": cpo_bioenergy_mj,
            "pkChemicalEnergyMjPerTonCpo": pk_bioenergy_mj,
            "totalRenewableGeneratedMjPerTonCpo": total_renew_gen,
            "totalBioenergyProductsMjPerTonCpo": total_products_mj,
        },
        "eroiProcess": eroi_process,
        "eroiTotal": eroi_total,
        "netEnergyRatio": eroi_total,
        "netEnergyBalanceMjPerTonCpo": net_energy_bal,
        "energyAutonomyPercent": autonomy_pct,
        "autonomyStatus": autonomy_status,
    }

def calculate_sdi(gwp: float, cei: float, autonomy_pct: float, peat_pct: float, efb_mulch: float) -> Dict[str, Any]:
    # 1. Climate / GHG Score (30%)
    if gwp <= 400:
        s_ghg = 95 + min(5.0, max(0.0, ((400.0 - gwp) / 400.0) * 5.0))
    elif gwp <= 850:
        s_ghg = 75 + ((850.0 - gwp) / 450.0) * 20.0
    elif gwp <= 1500:
        s_ghg = 45 + ((1500.0 - gwp) / 650.0) * 30.0
    else:
        s_ghg = max(5.0, 45.0 - ((gwp - 1500.0) / 1000.0) * 20.0)
    s_ghg = min(100, max(0, round(s_ghg)))

    # 2. Circularity Score (25%)
    s_circ = min(100, max(0, round(cei)))

    # 3. Energy Score (25%)
    if autonomy_pct > 120:
        s_ene = 90 + min(10.0, (autonomy_pct - 100.0) * 0.1)
    elif autonomy_pct >= 95:
        s_ene = 75 + ((autonomy_pct - 95.0) / 25.0) * 15.0
    else:
        s_ene = max(20.0, (autonomy_pct / 95.0) * 70.0)
    s_ene = min(100, max(0, round(s_ene)))

    # 4. Land Stewardship Score (20%)
    s_land = 100.0 - (peat_pct * 1.5)
    if efb_mulch >= 20.0:
        s_land += 8.0
    s_land = min(100, max(10, round(s_land)))

    composite = round(0.30 * s_ghg + 0.25 * s_circ + 0.25 * s_ene + 0.20 * s_land)

    if composite >= 85:
        tier = "PLATINUM"
        tier_title = "Platinum - Industry Benchmark Leader"
    elif composite >= 70:
        tier = "GOLD"
        tier_title = "Gold - Full ISPO/RSPO Ready"
    elif composite >= 55:
        tier = "SILVER"
        tier_title = "Silver - Transitional Performance"
    else:
        tier = "BRONZE"
        tier_title = "Bronze - High Sustainability Risk"

    return {
        "compositeScore": composite,
        "tier": tier,
        "tierTitle": tier_title,
        "pillars": {
            "climateGhgScore": s_ghg,
            "circularEconomyScore": s_circ,
            "energyTransitionScore": s_ene,
            "landStewardshipScore": s_land,
        }
    }
