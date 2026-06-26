-- Hapus tabel jika sudah ada (opsional, hati-hati jika ada data)
-- DROP TABLE IF EXISTS bookings, finances, haircut_models, barbers, services;

-- Tabel Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  category TEXT
);

-- Tabel Barbers
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  photo TEXT,
  specialization TEXT,
  rating NUMERIC DEFAULT 5
);

-- Tabel Haircut Models
CREATE TABLE haircut_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  photo TEXT
);

-- Tabel Finances
CREATE TABLE finances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC NOT NULL,
  date TEXT NOT NULL,
  description TEXT
);

-- Tabel Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "customerName" TEXT NOT NULL,
  "serviceId" UUID REFERENCES services(id) ON DELETE CASCADE,
  "barberId" UUID REFERENCES barbers(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  time TEXT,
  status TEXT DEFAULT 'pending',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
