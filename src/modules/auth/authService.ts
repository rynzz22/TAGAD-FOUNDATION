import { supabase } from '../../lib/supabase/client';
import { AppRole, UserProfile } from '../../types';
import { isSupabaseConfigured } from '../../app/config/env';
import axios from 'axios';

/**
 * Authentication Service supporting both direct Supabase Auth
 * and backend Express/JWT proxy for development fallback.
 */
export const authService = {
  /**
   * Log in user
   */
  async login(email: string, password: string): Promise<{ user: UserProfile; token: string; roles: AppRole[] }> {
    // If Supabase is fully configured with production keys
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Authentication returned no user');
      }

      // Fetch user profile and roles from PostgreSQL
      const { data: profile } = await supabase
        .from('users')
        .select(`
          *,
          user_roles ( role ),
          offices ( * ),
          barangays ( * )
        `)
        .eq('id', data.user.id)
        .single();

      const userRoles = ((profile as any)?.user_roles?.map((r: any) => r.role) || ['editor']) as AppRole[];

      const userProfile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        full_name: (profile as any)?.full_name || data.user.user_metadata?.full_name || 'Authorized Official',
        office_id: (profile as any)?.office_id || null,
        barangay_id: (profile as any)?.barangay_id || null,
        is_active: (profile as any)?.is_active ?? true,
        avatar_url: (profile as any)?.avatar_url || null,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at || data.user.created_at,
        roles: userRoles,
        office: (profile as any)?.offices || null,
        barangay: (profile as any)?.barangays || null,
      };

      return {
        user: userProfile,
        token: data.session?.access_token || '',
        roles: userRoles,
      };
    }

    // Development fallback via local API
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const apiUser = response.data.user;
      const token = response.data.token;

      const roles: AppRole[] = apiUser.role === 'ADMIN' 
        ? ['admin', 'municipal_admin'] 
        : ['editor'];

      const userProfile: UserProfile = {
        id: String(apiUser.id),
        email: apiUser.email,
        full_name: apiUser.name || 'System User',
        office_id: apiUser.office || null,
        barangay_id: null,
        is_active: apiUser.isActive ?? true,
        avatar_url: null,
        created_at: apiUser.createdAt || new Date().toISOString(),
        updated_at: apiUser.updatedAt || new Date().toISOString(),
        roles,
        office: apiUser.office ? { id: '1', code: apiUser.office, name: apiUser.office, head_name: null, is_active: true, created_at: '', updated_at: '' } : null,
        barangay: null,
      };

      return {
        user: userProfile,
        token,
        roles,
      };
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Login failed');
    }
  },

  /**
   * Log out user
   */
  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('tagad_token');
    localStorage.removeItem('tagad_user');
    localStorage.removeItem('tagad_roles');
  },

  /**
   * Get current session and profile
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    const storedToken = localStorage.getItem('tagad_token');
    const storedUser = localStorage.getItem('tagad_user');
    const storedRoles = localStorage.getItem('tagad_roles');

    if (!storedToken || !storedUser) {
      return null;
    }

    try {
      // Validate token structure
      const parts = storedToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          // Token expired
          localStorage.removeItem('tagad_token');
          localStorage.removeItem('tagad_user');
          localStorage.removeItem('tagad_roles');
          return null;
        }
      }

      const parsedUser = JSON.parse(storedUser);
      const roles: AppRole[] = storedRoles ? JSON.parse(storedRoles) : (parsedUser.roles || ['editor']);

      return {
        ...parsedUser,
        roles,
      };
    } catch {
      return null;
    }
  }
};
