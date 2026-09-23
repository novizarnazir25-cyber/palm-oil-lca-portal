-- ====================================================================
-- SKEMA DATABASE POSTGRESQL: LIFE CYCLE IMPACT ASSESSMENT (LCIA)
-- Standar: ISO 14040/14044, ReCiPe 2016 (Hierarchist), RSPO PalmGHG v4
-- Rantai Pasok Kelapa Sawit: Cradle-to-Gate (Perkebunan -> CPO di PKS)
-- ====================================================================

-- 1. Tabel Metode LCIA
CREATE TABLE IF NOT EXISTS lcia_methods (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    perspective VARCHAR(20) DEFAULT 'Hierarchist (H)', -- Individualist (I), Hierarchist (H), Egalitarian (E)
    description TEXT
);

-- 2. Tabel Faktor Karakterisasi Midpoint
CREATE TABLE IF NOT EXISTS midpoint_characterization_factors (
    id SERIAL PRIMARY KEY,
    method_id VARCHAR(50) REFERENCES lcia_methods(id),
    impact_category VARCHAR(50) NOT NULL, -- GWP, AP, EP, LAND_USE, TOXICITY
    flow_code VARCHAR(50) NOT NULL,       -- CO2_FOSSIL, CH4_BIOGENIC, N2O, NH3, PO4, GLYPHOSATE, DIESEL
    flow_name VARCHAR(100) NOT NULL,
    compartment VARCHAR(50) NOT NULL,     -- Air, Water, Soil
    factor_value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(30) NOT NULL,            -- kg CO2-eq/kg, kg SO2-eq/kg, kg PO4-eq/kg, etc.
    source VARCHAR(100)
);

-- 3. Tabel Faktor Kerusakan Endpoint (Damage Factors)
CREATE TABLE IF NOT EXISTS endpoint_damage_factors (
    id SERIAL PRIMARY KEY,
    method_id VARCHAR(50) REFERENCES lcia_methods(id),
    area_of_protection VARCHAR(50) NOT NULL, -- HUMAN_HEALTH, ECOSYSTEM_QUALITY, RESOURCES
    midpoint_category VARCHAR(50) NOT NULL,  -- GWP, AP, EP, LAND_USE, TOXICITY
    damage_factor DOUBLE PRECISION NOT NULL,
    endpoint_unit VARCHAR(30) NOT NULL,      -- DALY / unit, PDF.m2.yr / unit, MJ / unit
    description TEXT
);

-- 4. Tabel Profil Studi Kasus Perkebunan & PKS (Case Studies)
CREATE TABLE IF NOT EXISTS lca_case_studies (
    id VARCHAR(50) PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    mill_name VARCHAR(150) NOT NULL,
    scenario_type VARCHAR(50) NOT NULL,      -- CONVENTIONAL, REGENERATIVE_PRACTICES, BIOGAS_TO_POWER
    
    -- Parameter Hulu (Perkebunan)
    ffb_yield_ton_ha DOUBLE PRECISION NOT NULL,
    estate_area_ha DOUBLE PRECISION NOT NULL,
    peat_soil_percent DOUBLE PRECISION DEFAULT 0.0,
    urea_kg_ha DOUBLE PRECISION NOT NULL,
    za_kg_ha DOUBLE PRECISION DEFAULT 0.0,
    npk_kg_ha DOUBLE PRECISION NOT NULL,
    tsp_rp_kg_ha DOUBLE PRECISION NOT NULL,
    mop_kcl_kg_ha DOUBLE PRECISION NOT NULL,
    dolomite_kg_ha DOUBLE PRECISION NOT NULL,
    herbicide_ai_kg_ha DOUBLE PRECISION NOT NULL,
    tractor_diesel_l_ha DOUBLE PRECISION NOT NULL,
    transport_dist_km DOUBLE PRECISION NOT NULL,
    
    -- Parameter Pabrik (PKS)
    annual_ffb_tons DOUBLE PRECISION NOT NULL,
    oer_percent DOUBLE PRECISION NOT NULL,
    ker_percent DOUBLE PRECISION NOT NULL,
    pome_ratio_m3_ton DOUBLE PRECISION NOT NULL,
    pome_cod_mg_l DOUBLE PRECISION NOT NULL,
    pome_treatment VARCHAR(50) NOT NULL,     -- OPEN_LAGOON, METHANE_CAPTURE_FLARE, BIOGAS_TO_POWER
    biogas_capture_eff DOUBLE PRECISION DEFAULT 0.90,
    grid_export_percent DOUBLE PRECISION DEFAULT 0.0,
    allocation_method VARCHAR(20) DEFAULT 'ENERGY', -- ENERGY, MASS, ECONOMIC
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Hasil Perhitungan LCIA (Midpoint & Endpoint)
CREATE TABLE IF NOT EXISTS lcia_calculation_results (
    id SERIAL PRIMARY KEY,
    case_study_id VARCHAR(50) REFERENCES lca_case_studies(id) ON DELETE CASCADE,
    functional_unit VARCHAR(50) DEFAULT '1 ton CPO at Mill Gate',
    
    -- Skor Midpoint
    gwp_kg_co2e DOUBLE PRECISION NOT NULL,
    ap_kg_so2e DOUBLE PRECISION NOT NULL,
    ep_kg_po4e DOUBLE PRECISION NOT NULL,
    land_use_m2yr DOUBLE PRECISION NOT NULL,
    toxicity_kg_dcb DOUBLE PRECISION NOT NULL,
    
    -- Skor Endpoint (Area of Protection)
    human_health_daly DOUBLE PRECISION NOT NULL,
    ecosystem_quality_pdf DOUBLE PRECISION NOT NULL,
    resources_surplus_mj DOUBLE PRECISION NOT NULL,
    
    -- Alokasi & Rating
    cpo_allocation_factor DOUBLE PRECISION NOT NULL,
    palm_ghg_rating VARCHAR(5) NOT NULL,
    
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- SEED DATA: FAKTOR KARAKTERISASI MIDPOINT & ENDPOINT (ReCiPe 2016 H)
-- ====================================================================

INSERT INTO lcia_methods (id, name, version, perspective, description)
VALUES ('RECIPE_2016_H', 'ReCiPe 2016 Midpoint & Endpoint', 'v1.1', 'Hierarchist (H)', 'Metode LCIA global konsensus internasional berbasis waktu 100 tahun')
ON CONFLICT (id) DO NOTHING;

-- Faktor Midpoint
INSERT INTO midpoint_characterization_factors (method_id, impact_category, flow_code, flow_name, compartment, factor_value, unit, source) VALUES
('RECIPE_2016_H', 'GWP', 'CO2_FOSSIL', 'Karbon Dioksida Fosil', 'Air', 1.0, 'kg CO2-eq/kg', 'IPCC AR5'),
('RECIPE_2016_H', 'GWP', 'CH4_BIOGENIC', 'Metana Biogenik POME', 'Air', 28.0, 'kg CO2-eq/kg', 'IPCC AR5'),
('RECIPE_2016_H', 'GWP', 'N2O', 'Dinitrogen Oksida Pupuk N', 'Air', 265.0, 'kg CO2-eq/kg', 'IPCC AR5'),
('RECIPE_2016_H', 'AP', 'SO2', 'Sulfur Dioksida Solar', 'Air', 1.0, 'kg SO2-eq/kg', 'ReCiPe 2016'),
('RECIPE_2016_H', 'AP', 'NOX', 'Nitrogen Oksida Pembakaran', 'Air', 0.70, 'kg SO2-eq/kg', 'ReCiPe 2016'),
('RECIPE_2016_H', 'AP', 'NH3', 'Amonia Volatilisasi Pupuk', 'Air', 1.88, 'kg SO2-eq/kg', 'ReCiPe 2016'),
('RECIPE_2016_H', 'EP', 'P_RUNOFF', 'Fosfat Limpasan Perairan', 'Water', 3.06, 'kg PO4-eq/kg P', 'ReCiPe 2016'),
('RECIPE_2016_H', 'EP', 'N_LEACH', 'Nitrat Pelindian Tanah', 'Water', 0.42, 'kg PO4-eq/kg N', 'ReCiPe 2016'),
('RECIPE_2016_H', 'LAND_USE', 'OIL_PALM_OCCUPATION', 'Okupasi Lahan Kebun Sawit', 'Soil', 1.0, 'm2.yr/m2.yr', 'ReCiPe 2016'),
('RECIPE_2016_H', 'TOXICITY', 'GLYPHOSATE', 'Herbisida Glifosat', 'Soil', 45.2, 'kg 1,4-DCB eq/kg', 'USEtox / ReCiPe'),
('RECIPE_2016_H', 'TOXICITY', 'CADMIUM_TSP', 'Kadmium Logam Berat Batuan P', 'Soil', 120.0, 'kg 1,4-DCB eq/kg P2O5', 'USEtox / ReCiPe'),
('RECIPE_2016_H', 'TOXICITY', 'DIESEL_PARTICULATE', 'Partikulat & Hidrokarbon Solar', 'Air', 0.85, 'kg 1,4-DCB eq/L', 'ReCiPe 2016')
ON CONFLICT DO NOTHING;

-- Faktor Kerusakan Endpoint (Damage Factors ReCiPe 2016 H)
INSERT INTO endpoint_damage_factors (method_id, area_of_protection, midpoint_category, damage_factor, endpoint_unit, description) VALUES
('RECIPE_2016_H', 'HUMAN_HEALTH', 'GWP', 0.000000928, 'DALY / kg CO2-eq', 'Kerusakan kesehatan manusia akibat malnutrisi & penyakit iklim'),
('RECIPE_2016_H', 'HUMAN_HEALTH', 'AP', 0.000000629, 'DALY / kg SO2-eq', 'Gangguan pernapasan akibat partikulat sekunder sulfat'),
('RECIPE_2016_H', 'HUMAN_HEALTH', 'TOXICITY', 0.00000332, 'DALY / kg 1,4-DCB eq', 'Potensi toksisitas karsinogenik & non-karsinogenik'),
('RECIPE_2016_H', 'ECOSYSTEM_QUALITY', 'GWP', 0.204, 'PDF.m2.yr / kg CO2-eq', 'Hilangnya keanekaragaman hayati akibat pemanasan global'),
('RECIPE_2016_H', 'ECOSYSTEM_QUALITY', 'AP', 0.0156, 'PDF.m2.yr / kg SO2-eq', 'Kerusakan ekosistem terestrial akibat keasaman tanah'),
('RECIPE_2016_H', 'ECOSYSTEM_QUALITY', 'EP', 0.0064, 'PDF.m2.yr / kg PO4-eq', 'Anoksia perairan tawar & laut akibat ledakan alga'),
('RECIPE_2016_H', 'ECOSYSTEM_QUALITY', 'LAND_USE', 0.620, 'PDF.m2.yr / m2.yr', 'Degradasi habitat terestrial akibat perkebunan monokultur'),
('RECIPE_2016_H', 'ECOSYSTEM_QUALITY', 'TOXICITY', 0.0084, 'PDF.m2.yr / kg 1,4-DCB eq', 'Ekotoksisitas pada organisme tanah dan air'),
('RECIPE_2016_H', 'RESOURCES', 'FOSSIL_DEPLETION', 42.0, 'MJ Surplus Energy / L solar', 'Kelangkaan bahan bakar fosil minyak bumi')
ON CONFLICT DO NOTHING;
