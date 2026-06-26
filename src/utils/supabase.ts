import { createClient } from '@supabase/supabase-js';

// Sesuaikan nama variabel dengan yang ada di file .env kamu
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);