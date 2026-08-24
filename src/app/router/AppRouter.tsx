import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { AppLayout } from '../../components/layout/AppLayout';
import { ProtectedRoute } from '../../modules/auth/ProtectedRoute';
import { LandingPage } from '../../pages/public/LandingPage';
import { LoginPage } from '../../pages/auth/LoginPage';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';

// Domain Feature Pages
import ProgramMonitoring from '../../pages/ProgramMonitoring';
import GADPlan from '../../pages/GADPlan';
import Accomplishments from '../../pages/Accomplishments';
import DataEncoding from '../../pages/DataEncoding';
import Reports from '../../pages/Reports';
import UserManagement from '../../pages/UserManagement';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Citizen Portal */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Authentication Portal */}
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated GAD Workspace (Protected by Supabase Auth & RBAC) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/programs" element={<ProgramMonitoring />} />
          <Route path="/gad-plan" element={<GADPlan />} />
          <Route path="/accomplishments" element={<Accomplishments />} />
          <Route path="/data-encoding" element={<DataEncoding />} />
          <Route path="/reports" element={<Reports />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'municipal_admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
