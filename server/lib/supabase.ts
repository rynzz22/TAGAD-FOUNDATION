import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Server-side Supabase client initialized with the Service Role Key.
 *
 * CRITICAL SECURITY ARCHITECTURE RULES:
 * 1. This client must ONLY be used on the Node.js / Express backend.
 * 2. It must NEVER be exported to, imported by, or bundled into the React frontend.
 * 3. It will primarily be used for server-side Storage management (e.g., private MOV attachments)
 *    and administrative operations.
 */
export const supabaseAdmin = (supabaseUrl && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
};
