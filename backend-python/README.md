# Palm Oil LCA Microservice (Python FastAPI)

Modul independen (*microservice*) kalkulasi Life Cycle Assessment (LCA) rantai pasok kelapa sawit Cradle-to-Gate berbasis **Python FastAPI** dan **Pydantic**, mengadopsi standar **ISO 14040/14044**, **IPCC 2006/2019 Refinement**, dan **RSPO PalmGHG v4**.

## Cara Menjalankan

1. Masuk ke direktori:
   ```bash
   cd backend-python
   ```

2. Buat virtual environment & install dependensi:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate

   pip install -r requirements.txt
   ```

3. Jalankan server FastAPI:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

4. Buka dokumentasi Swagger interaktif di:
   - `http://localhost:8000/docs`

5. Menjalankan Unit Tests:
   ```bash
   pytest test_lca.py
   ```
