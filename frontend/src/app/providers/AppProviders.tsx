import React, { ReactNode } from 'react';
import { AuthProvider } from '../../modules/auth/AuthContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
