import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';
import { formatRole } from '../../lib/utils/cn';

export const TopBar: React.FC = () => {
  const { user, roles, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Programs', path: '/programs' },
    { label: 'GAD Plan', path: '/gad-plan' },
    { label: 'Beneficiaries', path: '/data-encoding' },
    { label: 'Reports', path: '/reports' },
  ];

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30 px-6">
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Title */}
        <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
          <img
            src="/talibon-seal.png"
            alt="Municipality of Talibon Official Seal"
            className="w-9 h-9 object-contain shrink-0"
          />
          <div className="text-left">
            <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base block leading-none">
              TAGAD
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 leading-none">
              Municipality of Talibon
            </span>
          </div>
        </Link>

        {/* Zone 2: Nav Links (4-6 links, single-line) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions / Profile & Logout */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                  {user.full_name}
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[140px]">
                  {formatRole(roles[0] || 'User')}
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="py-1.5 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="py-1.5 px-3.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
