-- ====================================================================
-- SKRIP UNTUK MENONAKTIFKAN ROW LEVEL SECURITY (RLS) DI SUPABASE
-- ====================================================================
--
-- CARA PENGGUNAAN:
-- 1. Masuk ke dashboard Supabase Anda.
-- 2. Pilih menu "SQL Editor" di bilah sisi kiri.
-- 3. Klik "New query".
-- 4. Salin seluruh isi berkas ini dan tempelkan (paste) ke editor SQL.
-- 5. Klik tombol "Run" di pojok kanan bawah editor.
--
-- CATATAN:
-- Ini akan menonaktifkan kebijakan keamanan RLS sehingga aplikasi web klien
-- (yang menggunakan mock auth local) dapat melakukan operasi INSERT, UPDATE, 
-- dan DELETE dengan sukses menggunakan anon key.

ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE barbers DISABLE ROW LEVEL SECURITY;
ALTER TABLE haircut_models DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE finances DISABLE ROW LEVEL SECURITY;

-- Verifikasi status tabel
-- Pastikan tidak ada error dan semua RLS telah dimatikan agar CRUD berjalan lancar!
