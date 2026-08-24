import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const talibonBarangays = [
    'Bagacay', 'Balintawak', 'Burgos', 'Busalian', 'Calituban', 'Cataban', 'Guindacpan',
    'Magsaysay', 'Mahanay', 'Nocnocan', 'Poblacion', 'Rizal', 'San Agustin', 'San Carlos',
    'San Francisco', 'San Isidro', 'San Jose', 'San Pedro', 'San Roque', 'Santo Niño',
    'Sikatuna', 'Suba', 'Tanghaligi', 'Tilmobo', 'Zamora'
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <span>Official GAD Transparency Portal</span>
            <span>•</span>
            <span>Municipality of Talibon, Bohol</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Talibon Analytics for Gender and Development
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            TAGAD provides transparent, auditable, and sex-disaggregated data tracking for all Gender and Development (GAD) programs, projects, and budget expenditures across Talibon&apos;s 25 barangays.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/login"
              className="py-2.5 px-5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              Sign In to Official Workspace
            </Link>
            <a
              href="#demographics"
              className="py-2.5 px-5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Explore Public GAD Indicators
            </a>
          </div>
        </div>
      </section>

      {/* Core Mandate & Transparency Pillar Grid */}
      <section id="demographics" className="py-12 px-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Municipal GAD Mandate & Transparency
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Statutory compliance in accordance with PCW-DILG-DBM-NEDA Joint Memorandum Circulars.
            </p>
          </div>
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Fiscal Year 2026 Active Monitoring
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Statutory Requirement
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              At least 5% GAD Budget
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Philippine law mandates that at least 5% of the total municipal annual budget be allocated specifically for gender-responsive programs and basic services.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Sex-Disaggregated Data
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              100% Disaggregated Tracking
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Every beneficiary and participant is tracked with sex-disaggregated indicators to guarantee equitable access to municipal interventions.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Coverage Scope
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              25 Barangays of Talibon
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Centralized monitoring spans mainland and island barangays, empowering local focal persons with auditable GAD planning matrices.
            </p>
          </div>
        </div>
      </section>

      {/* Barangays Directory */}
      <section id="barangays" className="py-12 px-6 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Talibon Barangay GAD Coverage Network
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Participating barangay focal units connected to the TAGAD centralized data registry.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {talibonBarangays.map((brgy) => (
              <div
                key={brgy}
                className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
              >
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {brgy}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active GAD Unit" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
