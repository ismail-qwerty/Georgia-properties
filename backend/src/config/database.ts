import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
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
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      headers: {
        'x-application-name': 'brookfield-properties-api',
      },
    },
  }
);

export const supabase = createClient(
  ENV.SUPABASE.URL,
  ENV.SUPABASE.ANON_KEY,
  {
    auth: {
      persistSession: false,
    },
    realtime: {
      transport: WebSocket as any,
    },
  }
);

export default supabaseAdmin;
