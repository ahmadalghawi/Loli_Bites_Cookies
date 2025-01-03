import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: {
      // This ensures the session is stored in cookies
      getItem: (key) => {
        if (typeof window === 'undefined') return null;
        return document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${key}=`))
          ?.split('=')[1];
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return;
        document.cookie = `${key}=${value}; path=/; max-age=2592000`; // 30 days
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return;
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
      },
    },
  },
});