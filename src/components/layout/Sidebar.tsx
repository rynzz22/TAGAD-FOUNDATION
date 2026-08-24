import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';
import { formatRole } from '../../lib/utils/cn';

export const Sidebar: React.FC = () => {
  const { user, roles, isSuperAdmin, isAdmin } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'GAD Programs', path: '/programs', icon: '📋' },
    { name: 'GAD Plans Matrix', path: '/gad-plan', icon: '📑' },
    { name: 'Accomplishments', path: '/accomplishments', icon: '✅' },
    { name: 'Beneficiaries DB', path: '/data-encoding', icon: '👥' },
    { name: 'PCW Reports', path: '/reports', icon: '📈' },
  ];

  const adminItems = [
    { name: 'User Management', path: '/users', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-4rem)] sticky top-16 shrink-0">
      {/* User Scope / Organization Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
            {user?.full_name?.substring(0, 2).toUpperCase() || 'TG'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {user?.full_name || 'System User'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user?.office?.name || user?.office_id || 'Municipality of Talibon'}
            </span>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          {roles.map((role) => (
            <span
              key={role}
              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap"
            >
              {formatRole(role)}
            </span>
          ))}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            GAD Modules
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <span className="text-sm shrink-0">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Administration Section */}
        {isAdmin && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Administration
            </div>
            <nav className="space-y-1">
              {adminItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <span className="text-sm shrink-0">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Footer / System Meta */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span>TAGAD Core v1.0</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Sprint 1
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
