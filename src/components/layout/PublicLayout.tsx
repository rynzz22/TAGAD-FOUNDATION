import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, BarChart3, Users, Briefcase, Award, FileText, MessageSquare, ShieldCheck } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Overview', to: '/', icon: BarChart3 },
    { label: 'Demographics', to: '/demographics', icon: Users },
    { label: 'Programs', to: '/public-programs', icon: Briefcase },
    { label: 'Accomplishments', to: '/public-accomplishments', icon: Award },
    { label: 'Approved Plans', to: '/public-plans', icon: FileText },
    { label: 'Feedback', to: '/feedback', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar strictly adhering to Top Bar Contract */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm sticky top-0 z-40 px-4 sm:px-6">
        <div className="h-full max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Brand Title (single text line/anchor) */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs tracking-wider shadow-sm">
              TG
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg leading-none whitespace-nowrap">
              TAGAD Talibon
            </span>
          </Link>

          {/* Zone 2: Nav Links (single-line, desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Mobile Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/login"
              className="py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Sign In</span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Municipal Citizen Transparency Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Municipality of Talibon, Bohol
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  GFPS Transparency Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                Dedicated to statutory compliance under RA 9710 (Magna Carta of Women) and PCW-DILG-DBM-NEDA Joint Memorandum Circulars. Zero personally identifiable information (PII) is published on this public portal.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                25 Barangays Active
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                FY 2026 Live
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <span>TAGAD System v2.0 • Talibon Analytics for Gender and Development</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/demographics" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Demographics
              </Link>
              <Link to="/public-programs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Programs
              </Link>
              <Link to="/feedback" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Submit Feedback
              </Link>
              <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-slate-700 dark:text-slate-300">
                Official Access
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
