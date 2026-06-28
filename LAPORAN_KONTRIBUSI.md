# Laporan Kontribusi Pengembangan Aplikasi BarberTop Barbershop

Laporan ini disusun untuk menjelaskan kontribusi teknis dalam perancangan dan implementasi fitur pada aplikasi **BarberTop Barbershop**, sebuah platform manajemen barbershop berbasis web yang dibangun menggunakan **React**, **TypeScript**, **Tailwind CSS**, **Vite**, dan **Supabase**.

Fokus kontribusi utama meliputi tiga pilar utama:
1. **Implementasi Fitur CRUD (Create, Read, Update, Delete)** untuk manajemen operasional barbershop.
2. **Penautan dan Integrasi API Supabase** sebagai *backend-as-a-service* untuk penyimpanan data real-time dan keamanan database.
3. **Konfigurasi dan Strategi Deployment** untuk memastikan aplikasi siap digunakan secara publik dengan performa tinggi.

---

## 1. Implementasi Fitur CRUD (Create, Read, Update, Delete)

Manajemen data di BarberTop Barbershop diimplementasikan menggunakan pendekatan **Centralized State Management** melalui React Context API di dalam file [`BarberContext.tsx`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/src/context/BarberContext.tsx). Hal ini memisahkan logika pengambilan data (*data fetching*) dengan rendering visual di komponen UI.

Kontribusi spesifik pada fitur CRUD meliputi:

### A. CRUD Layanan (Services)
*   **Create**: Menambahkan kategori layanan baru (seperti cukur rambut, cuci rambut, pewarnaan) tanpa perlu membuat ID secara manual di frontend. ID di-generate otomatis menggunakan format UUID oleh database Supabase.
*   **Read**: Membaca daftar layanan yang tersedia untuk ditampilkan pada menu pelanggan ([`Services.tsx`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/src/pages/Services.tsx)) maupun halaman admin ([`ManageServices.tsx`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/src/admin/ManageServices.tsx)).
*   **Update**: Memperbarui informasi layanan, termasuk nama layanan, durasi estimasi, deskripsi, kategori, serta harga layanan.
*   **Delete**: Menghapus jenis layanan yang sudah tidak ditawarkan dari database.

### B. CRUD Barber / Kapster
*   Mengelola data profil barber yang aktif di [`ManageBarbers.tsx`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/src/admin/ManageBarbers.tsx).
*   Mendukung penambahan foto barber (menggunakan URL gambar), spesialisasi keahlian, nama, serta penilaian rating awal.
*   Pembaruan data barber secara dinamis serta opsi penghapusan barber jika kapster tersebut dinonaktifkan.

### C. CRUD Pemesanan (Bookings) & Otomatisasi Finansial
*   **Booking Creation**: Pelanggan dapat membuat janji temu melalui halaman [`Booking.tsx`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/src/pages/Booking.tsx), memilih tanggal, jam, barber pilihan, dan jenis layanan.
*   **Status Management**: Admin dapat mengubah status booking dari `pending` menjadi `done` pada halaman [`ManageBookings.tsx`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/src/admin/ManageBookings.tsx).
*   **Otomatisasi Finansial (Trigger-based)**:
    Saat admin menandai booking sebagai `done` (selesai), sistem secara otomatis membuat catatan keuangan pendapatan (`income`) baru di tabel `finances` berdasarkan harga dari layanan yang dipesan. Logika ini diintegrasikan langsung dalam fungsi `updateBookingStatus` di [`BarberContext.tsx`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/src/context/BarberContext.tsx#L227-L262):
    ```typescript
    if (status === 'done') {
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        const service = services.find(s => s.id === booking.serviceId);
        if (service) {
          await supabase.from('finances').insert([{
            amount: service.price,
            type: 'income',
            description: `Pendapatan Booking: ${service.name} (${booking.customerName})`,
            created_at: new Date().toISOString()
          }]);
        }
      }
    }
    ```

### D. CRUD Laporan Keuangan (Finances) & Model Rambut (Haircut Models)
*   Mengelola pencatatan keuangan manual (pemasukan & pengeluaran operasional tambahan) di [`ManageFinances.tsx`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/src/admin/ManageFinances.tsx).
*   Mengelola katalog model potongan rambut sebagai galeri inspirasi pelanggan di [`ManageModels.tsx`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/src/admin/ManageModels.tsx).

---

## 2. Penautan dan Integrasi API Supabase

Integrasi database dilakukan secara asinkron dengan memanfaatkan library `@supabase/supabase-js`. Hal ini menggantikan penyimpanan data lokal (*mock state*) menjadi penyimpanan database berbasis cloud (PostgreSQL) yang aman dan terstruktur.

Langkah integrasi yang dikontribusikan meliputi:

### A. Inisialisasi Klien Supabase
Klien Supabase diinisialisasi dalam file [`supabase.ts`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/src/utils/supabase.ts) menggunakan *Environment Variables* untuk menjaga keamanan kredensial API Key:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
```

### B. Perancangan Skema Database (DDL SQL)
Skema database PostgreSQL dirancang secara relasional dengan memanfaatkan tipe data UUID untuk primary key dan foreign key yang saling terhubung untuk memastikan integritas data. Skema ini didokumentasikan di [`supabase_schema.sql`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/supabase_schema.sql):
*   Tabel `services` (Penyimpanan daftar layanan)
*   Tabel `barbers` (Data kapster barbershop)
*   Tabel `haircut_models` (Katalog gaya rambut)
*   Tabel `finances` (Laporan pemasukan dan pengeluaran)
*   Tabel `bookings` (Data janji temu dengan relasi `service_id` ke tabel `services` dan `barber_id` ke tabel `barbers`)

### C. Keamanan Database dengan Row Level Security (RLS)
Untuk menjaga keamanan data dari akses yang tidak sah, kebijakan RLS diimplementasikan di PostgreSQL. Kebijakan ini terdokumentasi di [`db_rls_policies.sql`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/db_rls_policies.sql):
*   **Akses Publik (Read-Only)**: Diperbolehkan bagi semua pengguna untuk melihat data layanan, barber, dan galeri model potongan rambut.
*   **Pemesanan Mandiri**: Pengguna non-login/publik diizinkan untuk melakukan `INSERT` data pemesanan (`bookings`), tetapi tidak diizinkan untuk melihat daftar seluruh booking milik orang lain.
*   **Proteksi Admin (Akses Penuh)**: Operasi `INSERT`, `UPDATE`, dan `DELETE` pada tabel layanan, barber, model rambut, serta seluruh akses ke tabel `finances` dibatasi secara ketat hanya untuk user admin yang terautentikasi melalui Supabase Auth.

---

## 3. Konfigurasi dan Strategi Deployment

Aplikasi dirancang agar dapat di-deploy secara mudah dan otomatis ke platform cloud hosting modern seperti **Netlify** atau **Vercel**. Kontribusi dalam aspek deployment mencakup:

### A. Konfigurasi Environment Variables
Selama masa pengembangan lokal, environment variables disimpan dalam file `.env` (contoh di [`.env.example`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/.env.example)). Pada platform deployment:
*   Mendaftarkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` pada panel pengaturan env variables di dasbor hosting (misal: Netlify).
*   Menambahkan log diagnostik di awal pemuatan aplikasi untuk memastikan konfigurasi env terdeteksi dengan benar dan menghindari error koneksi database.

### B. Penanganan Routing Single Page Application (SPA)
Karena BarberTop Barbershop menggunakan **React Router v7** untuk navigasi halaman di sisi klien, server hosting memerlukan konfigurasi khusus agar tidak memicu error *404 Not Found* saat halaman di-refresh di luar beranda. Hal ini diatasi dengan menyediakan file [`_redirects`](file:///c:/Users/ADILLIA/OneDrive/Documents/barbertop_barbershop%20(2)/barbertop_barbershop/public/_redirects) di dalam folder public:
```text
/*    /index.html   200
```
Instruksi ini memberi tahu server Netlify agar mengarahkan seluruh permintaan URL ke `index.html` dan membiarkan React Router memproses rute di sisi browser.

### C. Build Produksi
Proses kompilasi aplikasi untuk deployment menggunakan perintah:
```bash
npm run build
```
Perintah ini menjalankan bundler Vite untuk meminimalisasi ukuran Javascript, CSS (menggunakan Tailwind CSS v4), dan HTML ke dalam folder `/dist` yang siap disajikan secara statis dengan performa pemuatan yang cepat.

---

## Kesimpulan

Kontribusi pengembangan pada aplikasi **BarberTop Barbershop** ini telah menghasilkan sistem manajemen barbershop yang fungsional, dinamis, dan aman. Penautan database menggunakan **Supabase** berhasil mengamankan data transaksi keuangan dan pemesanan lewat mekanisme **RLS**, sementara konfigurasi build dan routing diatur dengan tepat sehingga aplikasi siap untuk dideploy dan digunakan secara stabil di lingkungan produksi.
