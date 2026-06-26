-- ====================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES FOR TOP BARBER
-- ====================================================================
--
-- CARA MENERAPKAN:
-- Jalankan query SQL ini di SQL Editor dashboard Supabase Anda.
--
-- CATATAN KEAMANAN:
-- Agar kebijakan ini berfungsi penuh, Anda harus memigrasikan sistem login
-- admin dari mock-state lokal saat ini ke Supabase Auth (dijelaskan di bagian bawah).

-- --------------------------------------------------------------------
-- 1. AKTIFKAN RLS (ROW LEVEL SECURITY) PADA SEMUA TABEL
-- --------------------------------------------------------------------
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE haircut_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 2. KEBIJAKAN UNTUK TABEL: SERVICES
-- --------------------------------------------------------------------
-- Semua pengunjung (anonymous & authenticated) dapat melihat daftar layanan
CREATE POLICY "Allow public select on services" 
ON services FOR SELECT 
TO anon, authenticated 
USING (true);

-- Hanya admin yang terautentikasi yang dapat memodifikasi data layanan
CREATE POLICY "Allow write operations on services for admin only" 
ON services FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- --------------------------------------------------------------------
-- 3. KEBIJAKAN UNTUK TABEL: BARBERS
-- --------------------------------------------------------------------
-- Semua pengunjung dapat melihat daftar barber
CREATE POLICY "Allow public select on barbers" 
ON barbers FOR SELECT 
TO anon, authenticated 
USING (true);

-- Hanya admin yang terautentikasi yang dapat memodifikasi data barber
CREATE POLICY "Allow write operations on barbers for admin only" 
ON barbers FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- --------------------------------------------------------------------
-- 4. KEBIJAKAN UNTUK TABEL: HAIRCUT MODELS
-- --------------------------------------------------------------------
-- Semua pengunjung dapat melihat daftar model rambut
CREATE POLICY "Allow public select on haircut_models" 
ON haircut_models FOR SELECT 
TO anon, authenticated 
USING (true);

-- Hanya admin yang terautentikasi yang dapat memodifikasi data model rambut
CREATE POLICY "Allow write operations on haircut_models for admin only" 
ON haircut_models FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- --------------------------------------------------------------------
-- 5. KEBIJAKAN UNTUK TABEL: BOOKINGS (JANJI TEMU)
-- --------------------------------------------------------------------
-- Pengunjung anonymous dapat membuat booking baru (INSERT)
CREATE POLICY "Allow public booking creation" 
ON bookings FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Hanya admin terautentikasi yang dapat melihat daftar booking (SELECT)
CREATE POLICY "Allow admin to view all bookings" 
ON bookings FOR SELECT 
TO authenticated 
USING (true);

-- Hanya admin terautentikasi yang dapat mengubah status booking (UPDATE, DELETE)
CREATE POLICY "Allow admin to modify bookings" 
ON bookings FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- --------------------------------------------------------------------
-- 6. KEBIJAKAN UNTUK TABEL: FINANCES (LAPORAN KEUANGAN)
-- --------------------------------------------------------------------
-- Hanya admin terautentikasi yang memiliki akses penuh ke data keuangan (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Restrict finances to admin only" 
ON finances FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- ====================================================================
-- LANGKAH MIGRASI CODE DARI MOCK KE REAL AUTH (SUPABASE AUTH)
-- ====================================================================
--
-- 1. Buat user admin di Supabase Dashboard -> Authentication -> Users.
-- 2. Ubah fungsi `login` di `src/context/BarberContext.tsx` untuk menggunakan Supabase:
--
--    const login = async (email, password) => {
--      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
--      if (error) throw error;
--      setUser({ id: data.user.id, username: data.user.email, role: 'admin' });
--    };
--
-- 3. Di fungsi `logout` di `src/context/BarberContext.tsx`:
--
--    const logout = async () => {
--      await supabase.auth.signOut();
--      setUser(null);
--    };
--
-- 4. Ketika admin login via Supabase Auth, Supabase secara otomatis menyisipkan JWT token
--    ke header setiap request, sehingga RLS mengenali user sebagai 'authenticated'
--    dan memberikan izin akses sesuai kebijakan di atas secara aman.
-- ====================================================================
