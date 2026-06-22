import { createClient } from '@supabase/supabase-js';
import { ENV } from './environment.js';

export const supabaseAdmin = createClient(
  ENV.SUPABASE.URL,
  ENV.SUPABASE.SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  }
);

export const supabase = createClient(
  ENV.SUPABASE.URL,
  ENV.SUPABASE.ANON_KEY
);

export default supabaseAdmin;
