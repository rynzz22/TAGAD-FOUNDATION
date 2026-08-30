import { AppRole, Database } from './database.types';

export type UserProfile = Database['public']['Tables']['users']['Row'] & {
  roles?: AppRole[];
  office?: Database['public']['Tables']['offices']['Row'] | null;
  barangay?: Database['public']['Tables']['barangays']['Row'] | null;
};

export interface AuthState {
  user: UserProfile | null;
  roles: AppRole[];
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  roles: AppRole[];
}
