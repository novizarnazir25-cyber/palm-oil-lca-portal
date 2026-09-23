from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Literal

class FarmInputsModel(BaseModel):
    ffbYieldPerHa: float = Field(21.0, description="FFB yield (ton/ha/year)", ge=1.0)
    plantationAreaHa: float = Field(2500.0, description="Plantation area (ha)", ge=1.0)
    peatSoilPercentage: float = Field(0.0, description="Percent on peat soil (0-100%)", ge=0.0, le=100.0)
    ureaKgPerHa: float = Field(220.0, description="Urea fertilizer (kg/ha/year)", ge=0.0)
    ammoniumSulfateKgPerHa: float = Field(100.0, description="ZA fertilizer (kg/ha/year)", ge=0.0)
    npkKgPerHa: float = Field(200.0, description="NPK fertilizer (kg/ha/year)", ge=0.0)
    npkRatioN: float = Field(0.15, description="N ratio in NPK (e.g. 0.15)", ge=0.0, le=1.0)
    npkRatioP2O5: float = Field(0.15, description="P2O5 ratio in NPK", ge=0.0, le=1.0)
    npkRatioK2O: float = Field(0.15, description="K2O ratio in NPK", ge=0.0, le=1.0)
    rockPhosphateKgPerHa: float = Field(150.0, description="RP / TSP (kg/ha/year)", ge=0.0)
    mopKclKgPerHa: float = Field(250.0, description="KCl / MOP (kg/ha/year)", ge=0.0)
    dolomiteKgPerHa: float = Field(180.0, description="Dolomite / Lime (kg/ha/year)", ge=0.0)
    herbicideAiKgPerHa: float = Field(2.5, description="Pesticide/herbicide a.i. (kg/ha/year)", ge=0.0)
    dieselTractorLitersPerHa: float = Field(45.0, description="Diesel for tractor/machinery (L/ha/year)", ge=0.0)
    efbMulchingTonsPerHa: float = Field(15.0, description="EFB organic mulching to soil (t/ha/year)", ge=0.0)
    transportDistanceKm: float = Field(25.0, description="Transport distance from field to mill (km)", ge=0.0)
    truckPayloadTons: float = Field(8.0, description="Truck payload capacity (tons)", ge=1.0)
    truckFuelLitersPer100Km: float = Field(35.0, description="Truck fuel consumption (L/100km)", ge=1.0)

class MillInputsModel(BaseModel):
    annualFfbProcessedTons: float = Field(150000.0, description="Annual FFB processed (tons)", ge=100.0)
    oer: float = Field(0.22, description="Oil Extraction Rate (fraction, e.g. 0.22)", ge=0.05, le=0.40)
    ker: float = Field(0.05, description="Kernel Extraction Rate (fraction, e.g. 0.05)", ge=0.01, le=0.15)
    fiberFraction: float = Field(0.135, description="Fiber fraction of FFB", ge=0.05, le=0.25)
    shellFraction: float = Field(0.065, description="Shell fraction of FFB", ge=0.02, le=0.15)
    efbFraction: float = Field(0.22, description="EFB fraction of FFB", ge=0.10, le=0.35)
    boilerDieselStartupLPerTonFfb: float = Field(0.20, description="Mill startup auxiliary diesel (L/t FFB)", ge=0.0)
    gridElectricityExportKwhPerTonFfb: float = Field(0.0, description="Surplus cogen power exported (kWh/t FFB)", ge=0.0)
    pomeRatioM3PerTonFfb: float = Field(0.65, description="POME ratio (m3/t FFB)", ge=0.2, le=1.5)
    pomeCodMgPerL: float = Field(30000.0, description="POME COD concentration (mg/L)", ge=5000.0)
    pomeBodMgPerL: float = Field(25000.0, description="POME BOD concentration (mg/L)", ge=3000.0)
    treatmentMethod: Literal['OPEN_ANAEROBIC_LAGOON', 'METHANE_CAPTURE_FLARING', 'BIOGAS_TO_POWER'] = Field(
        'OPEN_ANAEROBIC_LAGOON', description="POME wastewater treatment scenario"
    )
    methaneCaptureEfficiency: float = Field(0.90, description="Methane capture efficiency (0-1)", ge=0.5, le=0.99)
    biogasGeneratorEfficiencyKwhPerM3Ch4: float = Field(3.5, description="kWh generated per m3 CH4", ge=1.0)
    biogasPowerExportPercentage: float = Field(80.0, description="Percent of biogas electricity sold to grid", ge=0.0, le=100.0)
    allocationMethod: Literal['ENERGY', 'MASS', 'ECONOMIC'] = Field('ENERGY', description="ISO 14044 allocation method")
    priceCpoUsdPerTon: float = Field(920.0, description="CPO price (USD/ton)", ge=100.0)
    pricePkUsdPerTon: float = Field(520.0, description="PK price (USD/ton)", ge=50.0)
    lhvCpoMjPerKg: float = Field(37.0, description="Lower Heating Value CPO (MJ/kg)", ge=20.0)
    lhvPkMjPerKg: float = Field(24.0, description="Lower Heating Value PK (MJ/kg)", ge=15.0)

class CalculationRequest(BaseModel):
    farm: FarmInputsModel
    mill: MillInputsModel

class StageBreakdownModel(BaseModel):
    stage: str
    grossEmissionsKgCo2: float
    avoidedCreditsKgCo2: float
    netEmissionsKgCo2: float
    percentageOfTotal: float

class DetailedSourcesModel(BaseModel):
    directN2O: float
    indirectN2O: float
    ureaHydrolysisCO2: float
    fertilizerProduction: float
    pesticideProduction: float
    farmFuelMachinery: float
    peatOxidation: float
    ffbTransport: float
    pomeMethane: float
    millStartupFuel: float
    biogasGridCredit: float
    surplusBiomassElectricityCredit: float
    efbOrganicRecycleCredit: float

class CalculationResponse(BaseModel):
    functionalUnit: str
    totalGwpPerTonCpo: float
    totalGwpPerKgCpo: float
    totalGwpPerTonFfb: float
    cpoAllocationFactor: float
    pkAllocationFactor: float
    allocationMethod: str
    upstreamEmissionsKgCo2: float
    transportEmissionsKgCo2: float
    millEmissionsKgCo2: float
    pomeEmissionsKgCo2: float
    carbonCreditsKgCo2: float
    sources: DetailedSourcesModel
    stageSummary: List[StageBreakdownModel]
    eutrophicationPotentialKgPo4EqPerTonCpo: float
    acidificationPotentialKgSo2EqPerTonCpo: float
    palmGhgrating: str
