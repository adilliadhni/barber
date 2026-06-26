import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log diagnostik untuk membantu mendebug environment variable di Netlify
console.log('Supabase Config Check:', {
  hasUrl: !!supabaseUrl,
  urlStart: supabaseUrl ? supabaseUrl.substring(0, 15) + '...' : 'MISSING',
  hasKey: !!supabaseAnonKey
});

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');