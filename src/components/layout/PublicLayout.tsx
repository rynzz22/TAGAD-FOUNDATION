import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Public Top Bar adhering to Top Bar Contract */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30 px-6">
        <div className="h-full max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Zone 1: Brand Title */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs tracking-wider">
              TG
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg leading-none">
              TAGAD Talibon
            </span>
          </Link>

          {/* Zone 2: Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap shrink-0"
            >
              Transparency
            </Link>
            <a
              href="#demographics"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap shrink-0"
            >
              Demographics
            </a>
            <a
              href="#programs"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap shrink-0"
            >
              GAD Programs
            </a>
            <a
              href="#barangays"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap shrink-0"
            >
              Barangays
            </a>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              Official Portal Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Municipal Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Municipality of Talibon, Bohol
            </span>
            <span className="hidden md:inline">•</span>
            <span>Gender and Development Focal Point System (GFPS)</span>
          </div>
          <div>
            <span>TAGAD System v1.0.0 — Sprint 1 Foundation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
