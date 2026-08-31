import { supabase } from '../../lib/supabase/client';
import { isSupabaseConfigured } from '../../app/config/env';
import { Database } from '../../types/database.types';

export type GADProgram = Database['public']['Tables']['gad_programs']['Row'];
export type GADProgramInsert = Database['public']['Tables']['gad_programs']['Insert'];

export const programService = {
  async getPrograms(fiscalYear?: number): Promise<GADProgram[]> {
    if (isSupabaseConfigured()) {
      let query = supabase.from('gad_programs').select('*').order('created_at', { ascending: false });
      if (fiscalYear) {
        query = query.eq('fiscal_year', fiscalYear);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
    return [];
  },

  async createProgram(program: GADProgramInsert): Promise<GADProgram | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await (supabase.from('gad_programs') as any).insert([program]).select().single();
      if (error) throw error;
      return data;
    }
    return null;
  },
};
