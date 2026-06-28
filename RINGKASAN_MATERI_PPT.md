# Ringkasan Materi Presentasi (PPT) - Aplikasi BarberTop Barbershop

Dokumen ini berisi rangkuman materi lengkap yang dirancang khusus untuk mempermudah Anda dalam menyusun slide presentasi PowerPoint (PPT). Setiap bagian di bawah ini merepresentasikan draf slide beserta poin penting, penjelasan teknis, dan deskripsi visual tampilan aplikasinya.

---

### **Slide 1: Judul Presentasi**
*   **Judul Utama:** Sistem Informasi BarberTop Barbershop
*   **Subjudul:** Platform Manajemen Pemesanan Online & Laporan Keuangan Terintegrasi Cloud Database Supabase
*   **Poin Utama:** 
    *   Solusi digitalisasi operasional barbershop modern.
    *   Mempermudah pelanggan memesan jadwal potong rambut secara mandiri.
    *   Membantu admin mengelola master data layanan, barber, serta arus kas keuangan secara real-time.
*   **Deskripsi Visual Slide:** Desain minimalis dengan kombinasi warna biru gelap (primary) dan putih bersih, menampilkan logo BarberTop.

---

### **Slide 2: Arsitektur Sistem & Teknologi Stack**
*   **Judul Slide:** Arsitektur & Teknologi Utama
*   **Poin Utama:**
    *   **Frontend (Sisi Pengguna):** React 19, TypeScript, dan Vite (untuk build aplikasi yang cepat).
    *   **Styling & Animasi:** Tailwind CSS v4 (tampilan premium responsif) dan Framer Motion (efek transisi interaktif).
    *   **Backend-as-a-Service (BaaS):** Supabase (menggunakan database cloud PostgreSQL).
    *   **Routing Aplikasi:** React Router DOM v7 untuk navigasi halaman tunggal (Single Page Application).
*   **Deskripsi Visual Slide:** Tampilkan bagan alur hubungan antara **Client (React Web App)** $\leftrightarrow$ **Supabase Client API** $\leftrightarrow$ **Database PostgreSQL Cloud**.

---

### **Slide 3: Skema Database & Relasi Tabel (Supabase)**
*   **Judul Slide:** Perancangan Database Relasional
*   **Poin Utama:** Database diatur dalam 5 tabel utama yang saling berelasi dengan UUID:
    1.  `services`: Menyimpan jenis layanan, harga, durasi pengerjaan, dan kategori.
    2.  `barbers`: Menyimpan nama kapster, foto profil, spesialisasi, dan rating.
    3.  `haircut_models`: Galeri inspirasi potongan rambut pria.
    4.  `bookings`: Mencatat nama pelanggan, tanggal, jam, serta relasi ke `services` dan `barbers`.
    5.  `finances`: Arus pemasukan dan pengeluaran keuangan barbershop.
*   **Deskripsi Visual Slide:** Tampilan tabel relasional sederhana (ERD) yang memperlihatkan foreign key dari tabel `bookings` mengarah ke tabel `services` dan `barbers`.

---

### **Slide 4: Alur Proses Pemesanan (Booking Process) & Solusi Fitur**
*   **Judul Slide:** Bagaimana Pelanggan Melakukan Booking?
*   **Bagaimana Prosesnya?**
    1.  Pelanggan mengunjungi website $\rightarrow$ mengeksplorasi layanan dan profil barber.
    2.  Pelanggan mengisi formulir janji temu (nama, layanan, barber, tanggal, jam).
    3.  Sistem menyimpan data pemesanan ke cloud database Supabase.
    4.  Sistem secara otomatis mengarahkan pelanggan ke WhatsApp admin kasir dengan pesan teks pesanan yang sudah terisi otomatis untuk konfirmasi akhir.
*   **Fitur yang Harus Diterapkan:**
    *   Formulir janji temu dinamis yang langsung terhubung ke database.
    *   *Real-time Booking Summary* (kalkulator harga otomatis di sisi layar).
    *   Integrasi *API WhatsApp Direct Message*.
*   **Mengapa Fitur Ini Diterapkan? (Rationale):**
    *   **Menghindari Tumpang Tindih Jadwal (*Double Booking*):** Sistem membatasi tanggal dan jam, serta langsung mencatat di sistem admin secara real-time.
    *   **Transparansi Biaya:** Pelanggan mengetahui persis total biaya sebelum datang ke barbershop lewat *Booking Summary*.
    *   **Konfirmasi Instan Tanpa Repot:** Melalui integrasi WhatsApp, admin langsung menerima pesan detail tanpa pelanggan perlu mengetik ulang pesanan mereka.

---

### **Slide 5: Alur Proses Keuangan & Otomatisasi (Financial Process)**
*   **Judul Slide:** Alur Arus Kas Operasional Barbershop
*   **Bagaimana Prosesnya?**
    1.  Pelanggan datang ke barbershop sesuai jadwal $\rightarrow$ dicukur $\rightarrow$ membayar di kasir.
    2.  Admin kasir mengubah status janji temu dari `pending` (tertunda) menjadi `done` (selesai) di halaman admin.
    3.  Sistem mendeteksi perubahan status tersebut dan **secara otomatis membuat entri pendapatan baru** di laporan keuangan berdasarkan harga layanan yang dipilih pelanggan.
    4.  Admin juga dapat mencatat pengeluaran operasional (seperti sewa gedung atau beli silet cukur baru) secara manual.
    5.  Pemilik bisnis dapat mengekspor seluruh rekapan transaksi bulanan.
*   **Fitur yang Harus Diterapkan:**
    *   *Automatic Financial Database Trigger* (otomatisasi pencatatan saat booking selesai).
    *   Pencatatan Transaksi Manual (Pemasukan & Pengeluaran).
    *   Ekspor Laporan (Excel/CSV & PDF).
*   **Mengapa Fitur Ini Diterapkan? (Rationale):**
    *   **Mencegah Kesalahan Pencatatan Kasir (*Human Error*):** Mengotomatiskan pencatatan omzet saat kasir mencentang pesanan selesai, meminimalisir manipulasi keuangan.
    *   **Analisis Laba Rugi Real-Time:** Menghitung saldo bersih secara otomatis (Pemasukan - Pengeluaran) sehingga status kesehatan keuangan bisnis langsung terpantau.
    *   **Kemudahan Audit Operasional:** Fitur ekspor ke Excel/CSV mempercepat pembuatan laporan pajak/toko di akhir bulan tanpa rekap manual dari kertas.

---

### **Slide 6: Alur Proses Keamanan & Pembatasan Akses (Security Process)**
*   **Judul Slide:** Bagaimana Data Sensitif Dilindungi?
*   **Bagaimana Prosesnya?**
    1.  Pengguna biasa (pelanggan) hanya diizinkan melihat informasi layanan, barber, dan katalog potongan rambut (Akses Publik *Read-Only*).
    2.  Admin kasir mengakses portal masuk khusus $\rightarrow$ melakukan autentikasi login $\rightarrow$ token keamanan JWT aktif.
    3.  Admin kasir kasir memiliki wewenang penuh untuk menambah/mengubah data dan melihat laporan keuangan.
    4.  Jika admin meninggalkan komputer kasir dalam kondisi tidak aktif, sesi login akan otomatis hangus setelah waktu tertentu.
*   **Fitur yang Harus Diterapkan:**
    *   *Row Level Security (RLS)* di database Supabase (memisah hak akses level database).
    *   *Obfuscated Route & Shortcut Keyboard* (Menyembunyikan URL login admin dan meluncurkannya lewat tombol rahasia `Ctrl+Alt+Shift+A`).
    *   *Inactivity Auto-Logout* (Logout otomatis setelah 15 menit tidak aktif).
*   **Mengapa Fitur Ini Diterapkan? (Rationale):**
    *   **Keamanan Data Finansial:** Data keuangan dan data pribadi pelanggan adalah informasi sensitif yang tidak boleh diakses oleh publik atau kompetitor.
    *   **Menghindari Serangan Siber:** Gerbang masuk login admin yang disembunyikan memperkecil risiko dicoba diretas menggunakan teknik pencari celah otomatis (*brute force*).
    *   **Penyalahgunaan Fisik Toko:** Kasir barbershop seringkali sibuk melayani konsumen langsung; fitur *Auto-Logout* melindungi sistem jika komputer kasir ditinggal menyala tanpa pengawasan.

---

### **Slide 7: Alur Konektivitas & Aksesibilitas Jaringan (Network Process)**
*   **Judul Slide:** Menangani Kendala Koneksi Internet
*   **Bagaimana Prosesnya?**
    1.  Pelanggan sedang berada di jalan atau di dalam gedung barbershop yang sinyal internetnya kurang stabil.
    2.  Pelanggan membuka website BarberTop $\rightarrow$ Widget mendeteksi jika koneksi terputus.
    3.  Alih-alih memunculkan pesan error browser (*situs tidak dapat diakses*), sistem menampilkan versi web yang sudah tersimpan di memori perangkat.
    4.  Pelanggan tetap dapat melihat daftar harga layanan dan galeri model rambut secara offline.
*   **Fitur yang Harus Diterapkan:**
    *   *Service Worker & Cache Storage API* (Teknologi PWA).
    *   *OfflineWidget* (Widget status jaringan dinamis ala Apple-Style).
*   **Mengapa Fitur Ini Diterapkan? (Rationale):**
    *   **Pengalaman Pengguna yang Mulus (*Seamless UX*):** Pengguna tidak akan frustrasi dengan layar putih kosong saat sinyal drop.
    *   **Alat Bantu di Tempat (Barber Assistant):** Pelanggan di dalam barbershop sering kehabisan kuota internet; fitur offline ini membuat mereka tetap bisa menunjukkan gambar model rambut pilihan mereka kepada kapster menggunakan website ini secara instan.

---

### **Slide 8: Halaman Utama Pelanggan (Home Page Layout)**
*   **Judul Slide:** Tampilan Beranda & Branding
*   **Poin Utama & Fitur:**
    *   **Hero Banner:** Menampilkan foto suasana barbershop dengan slogan *"LEVEL UP YOUR CONFIDENCE"* serta tombol CTA (Call-to-Action) untuk Booking langsung.
    *   **Jam Operasional:** Informasi jam buka barbershop (Senin - Minggu, 10:00 - 21:00) yang rapi.
    *   **The Masters (Tim Barber):** Menampilkan deretan barber profesional lengkap dengan rating bintang dan keahlian khususnya.
*   **Tampilan UI:** 
    *   Efek transisi foto barber: Foto default hitam-putih (grayscale) akan berubah menjadi berwarna saat kursor diarahkan (*hover effect*).

---

### **Slide 9: Menu Layanan & Inspirasi Gaya Rambut**
*   **Judul Slide:** Katalog Layanan & Model Rambut
*   **Poin Utama & Fitur:**
    *   **Layanan Kami:** Menampilkan kartu-kartu harga layanan (seperti Haircut, Coloring, Wash, dll.) lengkap dengan durasi pengerjaan.
    *   **Galeri Model Rambut:** Tempat pelanggan mencari referensi potongan rambut terpopuler sebelum memesan.
*   **Tampilan UI:**
    *   Card harga berlatar putih bersih dengan bayangan lembut (*soft shadow*).
    *   Grid galeri model rambut dengan efek *hover overlay*: Nama model rambut (misalnya "Under Cut", "Comma Hair") akan muncul dari bawah dengan gradasi hitam transparan ketika disentuh kursor.

---

### **Slide 10: Dasbor Operasional Admin (Admin Dashboard)**
*   **Judul Slide:** Monitoring Dashboard Real-Time
*   **Poin Utama & Fitur:**
    *   **Statistik Ringkasan:** Menampilkan 4 metrik performa operasional barbershop:
        1.  Total bookings (jumlah order).
        2.  Total pelanggan unik (berdasarkan keunikan nama).
        3.  Jumlah barber yang aktif bekerja.
        4.  Total estimasi pendapatan (kalkulasi otomatis).
    *   **Tabel Janji Temu Terbaru:** Menampilkan status janji temu pelanggan teraktual.
*   **Tampilan UI:**
    *   Card statistik berwarna-warni dengan ikon penanda tren.
    *   Status badge booking yang dinamis (`pending` berwarna kuning, `done` berwarna hijau).

---

### **Slide 11: Fitur Keuangan & Ekspor Laporan**
*   **Judul Slide:** Tampilan Menu Pengelolaan Keuangan
*   **Poin Utama & Fitur:**
    *   Tiga kartu data keuangan: Total Pemasukan, Total Pengeluaran, dan Saldo Bersih.
    *   Tabel transaksi terintegrasi dengan aksi Hapus Transaksi (*Delete*).
    *   Akses cepat ekspor CSV (Excel) dan cetak PDF.
*   **Tampilan UI:**
    *   Saldo bersih otomatis berwarna hijau jika bernilai positif (+) dan merah jika negatif (-).
    *   Tombol "Catat Transaksi" meluncurkan jendela pop-up modal interaktif untuk memilih kategori pengeluaran/pemasukan secara dinamis.

---

### **Slide 12: Kesimpulan & Keunggulan Sistem**
*   **Judul Slide:** Kesimpulan Pengembangan
*   **Poin Utama:**
    *   **Efisiensi Waktu:** Proses pemesanan online memotong antrean manual di tempat.
    *   **Keamanan Data:** Didukung oleh PostgreSQL dan Row Level Security (RLS) milik Supabase.
    *   **Keandalan Sistem:** Tetap dapat dibuka di area susah sinyal berkat teknologi caching offline (PWA).
    *   **Transparansi Keuangan:** Pencatatan arus kas terintegrasi langsung dengan aktivitas operasional harian.
