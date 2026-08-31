import { supabase } from '../../lib/supabase/client';
import { isSupabaseConfigured } from '../../app/config/env';
import { Database } from '../../types/database.types';

export type DocumentRow = Database['public']['Tables']['documents']['Row'];
export type DocumentTypeRow = Database['public']['Tables']['document_types']['Row'];

export const documentService = {
  async getDocumentTypes(): Promise<DocumentTypeRow[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('document_types').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
    return [
      { id: '1', code: 'ATTENDANCE', name: 'Activity Attendance Sheet (Sex-Disaggregated)', description: 'Signed participant roster', created_at: '' },
      { id: '2', code: 'PHOTO', name: 'Activity Photo Documentation', description: 'Geotagged high-resolution activity photos', created_at: '' },
      { id: '3', code: 'FINANCIAL', name: 'Disbursement Voucher / Official Receipt', description: 'Financial liquidation documentation', created_at: '' },
      { id: '4', code: 'EVALUATION', name: 'Client Satisfaction / Pre-Post Test Evaluation', description: 'Activity outcome evaluation', created_at: '' },
    ];
  },
};
