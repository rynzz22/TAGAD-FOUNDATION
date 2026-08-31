import { supabase } from '../../lib/supabase/client';
import { isSupabaseConfigured } from '../../app/config/env';
import { Database } from '../../types/database.types';

export type UserRow = Database['public']['Tables']['users']['Row'];
export type OfficeRow = Database['public']['Tables']['offices']['Row'];
export type BarangayRow = Database['public']['Tables']['barangays']['Row'];

export const userService = {
  async getOffices(): Promise<OfficeRow[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('offices').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
    return [
      { id: '1', code: 'MPDC', name: 'Municipal Planning & Development Office', head_name: 'Engr. Focal Person', is_active: true, created_at: '', updated_at: '' },
      { id: '2', code: 'MSWDO', name: 'Municipal Social Welfare & Development Office', head_name: 'Social Worker Officer', is_active: true, created_at: '', updated_at: '' },
      { id: '3', code: 'MHO', name: 'Municipal Health Office', head_name: 'Municipal Health Officer', is_active: true, created_at: '', updated_at: '' },
      { id: '4', code: 'MAO', name: 'Municipal Agriculture Office', head_name: 'Municipal Agriculturist', is_active: true, created_at: '', updated_at: '' },
      { id: '5', code: 'MO', name: 'Mayor’s Office - GAD Secretariat', head_name: 'GAD Focal Coordinator', is_active: true, created_at: '', updated_at: '' },
    ];
  },

  async getBarangays(): Promise<BarangayRow[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('barangays').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
    const talibonBarangays = [
      'Bagacay', 'Balintawak', 'Burgos', 'Busalian', 'Calituban', 'Cataban', 'Guindacpan',
      'Magsaysay', 'Mahanay', 'Nocnocan', 'Poblacion', 'Rizal', 'San Agustin', 'San Carlos',
      'San Francisco', 'San Isidro', 'San Jose', 'San Pedro', 'San Roque', 'Santo Niño',
      'Sikatuna', 'Suba', 'Tanghaligi', 'Tilmobo', 'Zamora'
    ];
    return talibonBarangays.map((name, idx) => ({
      id: String(idx + 1),
      name,
      code: `TLB-${name.toUpperCase().substring(0, 3)}`,
      captain_name: `Brgy. Captain (${name})`,
      gad_focal_person: `GAD Focal (${name})`,
      contact_number: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  },
};
