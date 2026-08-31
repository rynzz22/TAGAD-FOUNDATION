import { supabase } from '../../lib/supabase/client';
import { isSupabaseConfigured } from '../../app/config/env';
import { Database } from '../../types/database.types';

export type BudgetRow = Database['public']['Tables']['budgets']['Row'];
export type BudgetAllocationRow = Database['public']['Tables']['budget_allocations']['Row'];

export const budgetService = {
  async getBudgetForYear(year: number): Promise<BudgetRow | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('fiscal_year', year)
        .single();
      if (error) return null;
      return data;
    }
    return null;
  },

  async getAllocations(budgetId: string): Promise<BudgetAllocationRow[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('budget_allocations')
        .select('*')
        .eq('budget_id', budgetId);
      if (error) throw error;
      return data || [];
    }
    return [];
  },
};
