import { supabase } from '../../lib/supabase/client';
import { isSupabaseConfigured } from '../../app/config/env';
import { Database, Json } from '../../types/database.types';

export type AuditLogEntry = Database['public']['Tables']['audit_logs']['Insert'];

export const auditService = {
  /**
   * Record a mutation in the immutable audit trail
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      if (isSupabaseConfigured()) {
        await (supabase.from('audit_logs') as any).insert([
          {
            ...entry,
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        // Safe development console logger for transparency
        console.info(`[AUDIT LOG] ${entry.action} on ${entry.entity_table} (${entry.entity_id || 'N/A'}) by user ${entry.user_id || 'system'}`);
      }
    } catch (err) {
      console.warn('Failed to record audit log:', err);
    }
  },

  /**
   * Query recent audit logs (Admin / Auditor role only)
   */
  async getRecentLogs(limit = 50) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    }

    return [];
  },
};
