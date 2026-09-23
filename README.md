# Palm Oil LCA Portal (Cradle-to-Gate)

Aplikasi web interaktif untuk melakukan kajian **Life Cycle Assessment (LCA)** pada rantai pasok kelapa sawit mulai dari perkebunan (*cradle*) hingga menghasilkan *Crude Palm Oil* (CPO) di pabrik (*gate*).

Sistem dirancang oleh Senior Full-Stack Developer & Ahli LCA Agroindustri, mengadopsi standar ilmiah **ISO 14040/14044**, **IPCC 2006 / 2019 Refinement**, pedoman **RSPO PalmGHG v4**, dan **ISPO**.

---

## 1. Batasan Sistem (System Boundary: Cradle-to-Gate)

```
[ UPSTREAM / ON-FARM ]                          [ TRANSPORT ]             [ CORE / PROCESSING (PKS) ]
+--------------------------------------+         +-----------+             +-----------------------------------------+
| Perkebunan Kelapa Sawit:             |         | Angkutan  |             | Pabrik Kelapa Sawit (PKS):              |
| - Pupuk N, P, K, Dolomit (Embodied)  |         | TBS       |             | - Sterilisasi & Threshing               |
| - Emisi N2O (Direct & Indirect)      | ------> | (Truk     | ----------> | - Pressing (Ekstraksi CPO & Nut)        |
| - Aplikasi Urea (Emisi CO2)          |   TBS   |  Diesel)  |    TBS      | - Boiler Cogeneration (Serat & Cangkang)|
| - Bahan Bakar Traktor & Mesin        |         | (t.km)    |             | - Pengolahan POME:                      |
| - Pestisida / Herbisida              |         +-----------+             |   * Kolam Anaerobik Terbuka             |
| - Land Use Change (LUC) & Gambut     |                                   |   * Biogas Capture (Flaring / Listrik)  |
+--------------------------------------+                                   +-----------------------------------------+
                                                                                                |
                                                                              +-----------------+-----------------+
                                                                              |                 |                 |
                                                                        [ CPO (Gate) ]    [ PK (Gate) ]    [ Solid Biomass ]
                                                                       (Alokasi Energi/  (Alokasi Energi/  (EFB, Shell, Fiber)
                                                                            Massa)            Massa)
```

1. **Upstream (On-Farm / Perkebunan)**:
   - Emisi langsung & tak langsung $N_2O$ dari pupuk nitrogen sintetis (Urea, ZA, NPK).
   - Pelepasan langsung $CO_2$ dari hidrolisis pupuk Urea ($0.7333\ \text{kg } CO_2/\text{kg urea}$).
   - Emisi pra-pembakaran (*embodied manufacturing carbon*) dari produksi pupuk kimia & herbisida.
   - Bahan bakar solar traktor dan alat berat perkebunan.
   - Oksidasi dekomposisi lahan gambut terdrainase ($55\ \text{ton } CO_2/\text{ha/tahun}$).
   - Kredit daur ulang hara organik dari pemulsaan Tandan Kosong Sawit (TKKS / EFB).
2. **Transportasi TBS**:
   - Pengangkutan Tandan Buah Segar (TBS) dari titik kumpul (*estate collection*) ke PKS menggunakan truk diesel ($0.12\ \text{kg } CO_2eq/\text{ton}\cdot\text{km}$).
3. **Core / Processing (Pabrik Kelapa Sawit / PKS)**:
   - Rendemen CPO (OER) dan rendemen Palm Kernel (KER).
   - Bahan bakar pembantu (*auxiliary diesel*) saat pemanasan awal boiler.
   - Pemanfaatan limbah biomassa (cangkang dan serat) pada boiler kogenerasi (*biogenic carbon-neutral*).
   - Pengolahan limbah cair pabrik kelapa sawit (*Palm Oil Mill Effluent* / POME):
     - **Kolam Anaerobik Terbuka**: Pelepasan metana bebas ($MCF = 0.8$, $GWP_{CH_4} = 28$).
     - **Methane Capture & Flaring**: Pembakaran metana menjadi $CO_2$ biogenik (mereduksi 85-95% emisi metana).
     - **Biogas to Power (PLTBg)**: Pembangkit listrik tenaga biogas yang mengekspor daya ke grid PLN dan menghasilkan **kredit emisi terhindar** (*avoided emission credit*).
4. **Alokasi Produk Bersama (ISO 14044)**:
   - Alokasi Energi (*Lower Heating Value* / LHV: CPO 37.0 MJ/kg vs PK 24.0 MJ/kg - standar RSPO/RED II).
   - Alokasi Massa (rasio rendemen OER vs KER).
   - Alokasi Ekonomi (nilai pendapatan moneter pasar CPO vs PK).

---

## 2. Fitur Utama Aplikasi

- **Dashboard Interaktif**: Visualisasi alur batasan sistem *Cradle-to-Gate* dengan nilai emisi *real-time*.
- **Kalkulator LCA Multi-Tab**: Pengaturan parameter perkebunan, pabrik, dan alokasi produk secara mudah dan intuitif.
- **Analisis Hotspot & Visualisasi**: Grafik Donut (*Recharts*) kontribusi tahapan dan grafik batang sumber emisi dominan beserta rekomendasi teknis dekarbonisasi.
- **Komparasi Skenario Berdampingan**: Fitur membandingkan skenario *Baseline* (Kolam Terbuka) dengan skenario intervensi hijau (Penangkap Metana / PLTBg), lengkap dengan delta persentase reduksi.
- **Indikator Dampak Lingkungan Lengkap**: Meliputi *Global Warming Potential* (GWP100), Potensi Eutrofikasi (*Eutrophication Potential*, kg PO₄³⁻eq), Potensi Pengasaman (*Acidification Potential*, kg SO₂eq), dan peringkat performa *PalmGHG*.
- **Penyimpanan Skenario**: Skema database SQLite & Prisma ORM untuk menyimpan profil simulasi pabrik dan pustaka faktor emisi.
- **Laporan & Ekspor**: Cetak laporan ramah audit (*PDF print styling*), ekspor tabel CSV, dan ekspor data mentah JSON.
- **Modul Standalone Python FastAPI**: Disediakan engine kalkulasi Python terpisah di folder `backend-python/` lengkap dengan unit tests (PyTest).

---

## 3. Tech Stack

- **Frontend & Full-Stack**: [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/).
- **Database**: SQLite dengan [Prisma ORM](https://www.prisma.io/).
- **LCA Calculation Engine**:
  - TypeScript Engine (`src/lib/lca/engine.ts`) untuk kalkulasi instan di frontend & Next.js API.
  - Python FastAPI Service (`backend-python/lca_engine.py`) untuk microservice mandiri.

---

## 4. Panduan Menjalankan Aplikasi

### Menjalankan Frontend & Full-Stack Next.js:

1. Pastikan dependensi sudah terpasang:
   ```bash
   npm install
   ```

2. Jalankan migrasi dan seeding database SQLite:
   ```bash
   npx prisma db push
   npx tsx scripts/seed.mjs
   ```

3. Jalankan server pengembangan Next.js:
   ```bash
   npm run dev
   ```

4. Buka browser pada alamat:
   - **Dashboard**: `http://localhost:3000`
   - **Kalkulator**: `http://localhost:3000/calculator`
   - **Komparasi Skenario**: `http://localhost:3000/scenarios`
   - **Dokumentasi Metodologi**: `http://localhost:3000/methodology`

---

### Menjalankan Microservice Python FastAPI (Opsional):

1. Masuk ke direktori Python:
   ```bash
   cd backend-python
   ```

2. Install dependensi Python:
   ```bash
   pip install -r requirements.txt
   ```

3. Jalankan server FastAPI:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

4. Akses Swagger API Docs di: `http://localhost:8000/docs`

---

## 5. Ringkasan Tolok Ukur Validasi (*Benchmark Scientific RSPO*)

| Skenario Pengolahan POME | Jejak Karbon Rata-rata (kg CO₂eq / t CPO) | Peringkat PalmGHG | Reduksi vs Baseline |
| :--- | :---: | :---: | :---: |
| **Kolam Anaerobik Terbuka** | ~814 – 1,150 | Grade B - C | Baseline (0%) |
| **Methane Capture & Flaring** | ~425 – 600 | Grade A | -47.8% |
| **Biogas to Power (PLTBg)** | ~350 – 450 | Grade A+ | -54.3% |
| **Perkebunan Gambut (50% area)** | ~5,500 – 6,500 | Grade D | Emisi Ekstrem (+637%) |
