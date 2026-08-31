import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/database.types';
import { env } from '../../app/config/env';

/**
 * Supabase Browser Client initialized with Database TypeScript Types
 */
export const supabase = createClient<Database>(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'tagad_auth_session',
    },
  }
);
