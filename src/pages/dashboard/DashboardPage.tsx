import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';
import { formatRole } from '../../lib/utils/cn';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export const DashboardPage: React.FC = () => {
  const { user, roles, isSuperAdmin, isAdmin } = useAuth();

  const coreModules = [
    {
      title: 'GAD Programs & Projects',
      description: 'Manage LGU Gender and Development programs, sector targets, and activity matrices.',
      path: '/programs',
      badge: 'Core GAD',
    },
    {
      title: 'Annual GAD Plan & Budget Matrix',
      description: 'Prepare and track mandatory 5% LGU GAD annual budget allocations and statutory plans.',
      path: '/gad-plan',
      badge: 'Statutory',
    },
    {
      title: 'Accomplishment Reports',
      description: 'Log actual physical targets, financial expenditures, and variances for PCW submission.',
      path: '/accomplishments',
      badge: 'Compliance',
    },
    {
      title: 'Beneficiaries Database',
      description: 'Sex-disaggregated demographic registry of constituents across Talibon’s 25 barangays.',
      path: '/data-encoding',
      badge: 'Disaggregated Data',
    },
    {
      title: 'PCW Reports Generator',
      description: 'Export statutory PDF and Excel GAD accomplishment and plan matrices.',
      path: '/reports',
      badge: 'Reporting',
    },
  ];

  const sprintChecklist = [
    { label: 'Modular Project Architecture (src/modules/*)', status: true },
    { label: 'Supabase & PostgreSQL Schema Initialized', status: true },
    { label: 'Role-Based Access Control Foundation (5 Roles)', status: true },
    { label: 'Row-Level Security Policies Defined', status: true },
    { label: 'TypeScript Database Types Synchronized', status: true },
    { label: 'Secure Session Persistence & Protected Routing', status: true },
    { label: 'Audit Trail Structure Prepared', status: true },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome & Identity Surface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Talibon GFPS Workspace
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Sprint 1 Foundation Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome, {user?.full_name || 'Official'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Assigned Office: <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.office?.name || user?.office_id || 'Municipal Planning & Development Office'}</span>
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {roles.map((role) => (
                <Badge key={role} variant="secondary" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200">
                  {formatRole(role)}
                </Badge>
              ))}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Authenticated Session Verified
            </span>
          </div>
        </div>
      </div>

      {/* Sprint 1 System Readiness Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Sprint 1 Core Readiness Verification
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Technical foundation, database entities, authentication, and security rules.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200">
            All Systems Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {sprintChecklist.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </span>
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Core Domain Modules Navigation Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            GAD Domain Modules
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a module to review its initial data structure and workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreModules.map((module) => (
            <Link
              key={module.title}
              to={module.path}
              className="group p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {module.badge}
                  </span>
                  <span className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">
                    →
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {module.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {module.description}
                </p>
              </div>
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/users"
              className="group p-5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-500 transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    Admin
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 text-sm">
                    →
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  User & Role Management
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Provision accounts for MPDC, MSWDO, MHO, MAO, and Barangay Focal units.
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
