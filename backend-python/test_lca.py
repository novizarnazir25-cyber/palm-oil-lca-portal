"""
PyTest Unit Tests for Palm Oil LCA Engine
Verifies compliance with IPCC & RSPO benchmark thresholds.
"""

from models import FarmInputsModel, MillInputsModel
from lca_engine import calculate_palm_lca

def test_open_lagoon_baseline():
    farm = FarmInputsModel()
    mill = MillInputsModel(treatmentMethod="OPEN_ANAEROBIC_LAGOON")
    res = calculate_palm_lca(farm, mill)
    
    # RSPO Open Lagoon benchmark: typically 900 - 1400 kg CO2eq / t CPO
    assert 800 < res["totalGwpPerTonCpo"] < 1500
    assert res["pomeEmissionsKgCo2"] > 400
    assert res["carbonCreditsKgCo2"] >= 0

def test_methane_capture_flaring_reduction():
    farm = FarmInputsModel()
    mill_open = MillInputsModel(treatmentMethod="OPEN_ANAEROBIC_LAGOON")
    mill_flare = MillInputsModel(treatmentMethod="METHANE_CAPTURE_FLARING", methaneCaptureEfficiency=0.90)
    
    res_open = calculate_palm_lca(farm, mill_open)
    res_flare = calculate_palm_lca(farm, mill_flare)
    
    # Flaring should dramatically reduce POME emissions by ~90%
    assert res_flare["pomeEmissionsKgCo2"] < res_open["pomeEmissionsKgCo2"] * 0.20
    assert res_flare["totalGwpPerTonCpo"] < res_open["totalGwpPerTonCpo"]

def test_biogas_to_power_credits():
    farm = FarmInputsModel()
    mill_power = MillInputsModel(
        treatmentMethod="BIOGAS_TO_POWER",
        methaneCaptureEfficiency=0.90,
        biogasPowerExportPercentage=80.0
    )
    res_power = calculate_palm_lca(farm, mill_power)
    
    # Biogas to power must generate substantial negative carbon credits
    assert res_power["sources"]["biogasGridCredit"] > 100
    assert res_power["totalGwpPerTonCpo"] < 700

def test_peat_soil_sensitivity():
    farm_mineral = FarmInputsModel(peatSoilPercentage=0.0)
    farm_peat = FarmInputsModel(peatSoilPercentage=50.0)
    mill = MillInputsModel()
    
    res_mineral = calculate_palm_lca(farm_mineral, mill)
    res_peat = calculate_palm_lca(farm_peat, mill)
    
    # Drained peat oxidation should heavily increase upstream footprint
    assert res_peat["totalGwpPerTonCpo"] > res_mineral["totalGwpPerTonCpo"] + 1000
