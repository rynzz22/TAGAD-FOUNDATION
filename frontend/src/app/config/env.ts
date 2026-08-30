/**
 * Application Environment Configuration
 * Safe browser-side and server-side config with fallbacks
 */

export const env = {
  // Supabase Configuration
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-tagad.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  
  // App metadata
  appName: 'TAGAD',
  appFullName: 'Talibon Analytics for Gender and Development',
  municipality: 'Municipality of Talibon, Bohol',
  province: 'Bohol, Philippines',
  version: '1.0.0-sprint1',
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
} as const;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
  );
};
