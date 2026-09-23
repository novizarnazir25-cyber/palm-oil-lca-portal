"""
FastAPI Palm Oil Life Cycle Assessment (LCA) Microservice
Cradle-to-Gate: Plantation -> Mill -> Crude Palm Oil (CPO)
Compliant with ReCiPe 2016 Midpoint & Endpoint, ISO 14040/14044, & RSPO PalmGHG v4.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import CalculationRequest, CalculationResponse, FarmInputsModel, MillInputsModel
from lca_engine import calculate_palm_lca
from lcia_engine import calculate_lcia_matrices
from sustainability_engine import calculate_circular_economy, calculate_energy_balance, calculate_sdi

app = FastAPI(
    title="Palm Oil LCIA Midpoint & Endpoint API",
    description="ISO 14040/14044 & ReCiPe 2016 compliant Cradle-to-Gate LCA calculation engine for Indonesian Agroindustry.",
    version="2.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "Palm Oil LCA, LCIA & Sustainability Engine",
        "standards": ["ISO 14040/14044", "ReCiPe 2016 (H)", "IPCC 2019 Refinement", "RSPO PalmGHG v4", "ISPO"],
        "version": "2.1.0"
    }

@app.post("/api/calculate", response_model=CalculationResponse)
def calculate_lca(payload: CalculationRequest):
    """Calculates standard Cradle-to-Gate GWP and PalmGHG carbon footprint."""
    try:
        result = calculate_palm_lca(payload.farm, payload.mill)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/lcia/calculate")
def calculate_lcia(payload: CalculationRequest):
    """
    Calculates full ReCiPe 2016 Midpoint (GWP, AP, EP, Land Use, Toxicity)
    and Endpoint (Human Health DALY, Ecosystem Quality PDF.m2.yr, Resources Surplus Energy MJ).
    """
    try:
        result = calculate_lcia_matrices(payload.farm, payload.mill)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/sustainability/calculate")
def calculate_sustainability_metrics(payload: CalculationRequest):
    """
    Calculates Circular Economy Index (CEI), Energy Return on Investment (EROI),
    Net Energy Ratio (NER), and Composite Sustainable Development Index (SDI).
    """
    try:
        lca = calculate_palm_lca(payload.farm, payload.mill)
        circular = calculate_circular_economy(payload.farm, payload.mill)
        energy = calculate_energy_balance(payload.farm, payload.mill)
        sdi = calculate_sdi(
            gwp=lca.totalGwpPerTonCpo,
            cei=circular["ceiPercentage"],
            autonomy_pct=energy["energyAutonomyPercent"],
            peat_pct=payload.farm.peatSoilPercentage,
            efb_mulch=payload.farm.efbMulchingTonsPerHa
        )
        return {
            "gwpNetPerTonCpo": lca.totalGwpPerTonCpo,
            "palmGhgrating": lca.palmGhgrating,
            "circularity": circular,
            "energy": energy,
            "sdi": sdi
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/scenarios/compare")
def compare_scenarios(scenarios: list[CalculationRequest]):
    """Calculates and compares multiple LCA scenarios side-by-side."""
    results = []
    for idx, scen in enumerate(scenarios):
        res = calculate_lcia_matrices(scen.farm, scen.mill)
        results.append({
            "scenarioIndex": idx,
            "treatmentMethod": scen.mill.treatmentMethod,
            "lcia": res
        })
    return {"comparisons": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

