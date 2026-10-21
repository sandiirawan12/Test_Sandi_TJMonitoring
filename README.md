# Sistem Monitoring Armada Transjakarta
**Frontend Technical Test - Transjakarta**

Aplikasi frontend untuk memantau data armada bus secara real-time menggunakan REST API [MBTA API v3](https://api-v3.mbta.com/docs/swagger/index.html). Dibuat menggunakan **React**, **TypeScript**, dan **Tailwind CSS**.

---

## Cara Menjalankan Aplikasi

Pastikan di komputer Anda sudah terpasang Node.js (minimal versi 18) dan npm.

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Mode Development
```bash
npm run dev
```
Buka browser di `http://localhost:5173/`.

### 3. Build Produksi (Opsional)
```bash
npm run build
npm run preview
```

---

## Struktur Folder

Folder sengaja dibuat sederhana dan langsung pada fungsinya agar mudah dibaca dan dikelola:

```
src/
├── components/          # Komponen UI aplikasi
│   ├── Navbar.tsx             # Header atas (logo, jam live, tombol refresh)
│   ├── StatsOverview.tsx      # Ringkasan angka (total bus, sedang jalan, berhenti)
│   ├── FilterBar.tsx          # Bar filter rute & trip dengan chip aktif
│   ├── MultiSelectDropdown.tsx # Dropdown multi-select dengan infinite scroll & search
│   ├── VehicleCard.tsx        # Card bus (label, status, koordinat, update terakhir)
│   ├── VehicleModal.tsx       # Popup modal detail bus + peta interaktif
│   ├── VehicleMap.tsx         # Komponen peta Leaflet dengan marker bus
│   ├── Pagination.tsx         # Kontrol halaman, rentang data, & pilihan jumlah data
│   ├── LoadingSkeleton.tsx    # Tampilan loading skeleton saat ambil data
│   ├── ErrorMessage.tsx       # Tampilan pesan error dan tombol coba lagi
│   └── StatusBadge.tsx        # Badge status (Sedang Jalan, Berhenti, Mendekati Halte)
├── hooks/               # Custom hooks untuk logika state & data fetching
│   ├── useVehicles.ts         # Mengelola data bus, pagination, dan filter aktif
│   ├── useRoutes.ts           # Mengelola data rute dan infinite scroll
│   └── useTrips.ts            # Mengelola data trip berdasarkan rute yang dipilih
├── services/            # Komunikasi ke API
│   └── api.ts                 # Fetch ke endpoint /vehicles, /routes, /trips & normalisasi relasi
├── types/               # Definisi tipe TypeScript
│   └── mbta.ts                # Tipe data untuk resource API dan model data bus
├── utils/               # Fungsi bantuan & konstanta
│   ├── constants.ts           # URL API dan setting default pagination
│   └── formatters.ts          # Format tanggal lokal (WIB), waktu relatif, kecepatan, & koordinat
├── App.tsx              # Halaman utama aplikasi
└── main.tsx             # Entry point React
```

---

## Fitur yang Dikerjakan

Sesuai dengan spesifikasi tes teknis yang diminta:

1. **Ambil Data Kendaraan via REST API**:
   - Data diambil dari endpoint `/vehicles` MBTA API v3 (`https://api-v3.mbta.com`).
   - Menggunakan parameter `sort=-updated_at` agar seluruh armada terurut secara kronologis global: **halaman awal berisi armada yang paling baru di-update**, lalu halaman berikutnya menyusul, hingga halaman terakhir berisi data yang paling lama.
   - Menggunakan parameter `include=route,trip,stop` agar info rute, trip tujuan, dan halte langsung didapatkan dalam satu request tanpa request berulang.
   - Dilengkapi penanganan error yang jelas dan loading state (skeleton shimmer).

2. **Tampilan Grid Card Kendaraan & Pagination**:
   - Menampilkan data bus dalam bentuk Card:
     - Nomor / Label bus
     - Status saat ini (`IN_TRANSIT_TO` / Sedang Jalan, `STOPPED_AT` / Berhenti, `INCOMING_AT` / Mendekati Halte)
     - Latitude & Longitude (bisa disalin dengan satu klik)
     - Waktu update terakhir (format relatif seperti "Baru saja", "25 dtk lalu", "2 mnt lalu" dan format lengkap tanggal/jam WIB)
   - Pagination fungsional:
     - Informasi rentang data yang ditampilkan (contoh: *Menampilkan 1 - 5 dari 760 data*)
     - Pilihan jumlah data per halaman (5, 10, 25, 50 per halaman)
     - Info jumlah halaman yang tersedia
     - Tombol navigasi halaman (halaman pertama, sebelumnya, tombol nomor dengan titik-titik, berikutnya, halaman terakhir)

3. **Filter Kendaraan berdasarkan Rute dan Trip**:
   - Filter dropdown multi-select untuk Rute dan Trip.
   - **Trip Filter Dependency**: Dropdown Trip otomatis nonaktif (*disabled*) jika belum ada Rute yang dipilih, dengan pesan panduan *"Pilih rute terlebih dahulu..."*.
   - **Fitur Pencarian Komprehensif**: Kotak pencarian instan di dalam dropdown yang mencari berdasarkan ID, Nama Rute/Headsign, Sub-label keterangan, hingga Badge kode trayek dengan **highlight teks kuning** untuk kecocokan kata kunci.
   - Rute dan trip bisa dipilih lebih dari satu secara bersamaan (multi-select).
   - Filter aktif ditampilkan dalam bentuk chip yang bisa dihapus satu per satu atau di-reset sekaligus.

4. **Popup Detail Kendaraan & Peta (Bonus)**:
   - Popup modal yang muncul ketika card bus diklik:
     - Label bus dan ID kendaraan
     - Status saat ini
     - Koordinat Latitude & Longitude + link ke Google Maps
     - **Peta Interaktif (Leaflet)**: Menampilkan posisi bus di atas peta OpenStreetMap dengan custom marker dan rotasi arah kompas (bearing)
     - Waktu update terakhir
     - Data Rute lengkap (nama rute, kode trayek, warna resmi rute, tipe layanan)
     - Data Trip lengkap (tujuan akhir / headsign, arah perjalanan, akses kursi roda)
     - Data tambahan: kecepatan bus (km/jam), perkiraan kapasitas penumpang, dan halte tujuan/terakhir.
