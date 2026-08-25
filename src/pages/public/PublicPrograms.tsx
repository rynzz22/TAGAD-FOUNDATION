import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Search,
  Building,
  Users,
  Coins,
  ShieldCheck,
  ShieldAlert,
  Filter,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { publicApi } from '../../api/publicApi';
import { PublicProgram } from '../../types/public.types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const PublicPrograms: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [programs, setPrograms] = useState<PublicProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await publicApi.getPrograms({
        year: selectedYear,
        sector: selectedSector || undefined,
      });
      setPrograms(res);
    } catch (err: any) {
      console.error('Failed to load public programs:', err);
      setError(err?.response?.data?.error?.message || 'Failed to retrieve public GAD programs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, [selectedYear, selectedSector]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredPrograms = programs.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.office.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAllocated = filteredPrograms.reduce((acc, curr) => acc + (curr.budgetTarget || 0), 0);
  const totalExpended = filteredPrograms.reduce((acc, curr) => acc + (curr.budgetActual || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory GAD Transparency</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Municipal GAD Programs & Projects
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Public directory of gender-responsive projects implemented by municipal departments (MSWDO, MHO, MAO, MPDC, Mayor&apos;s Office) for the welfare of women, children, and specialized sectors.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <label htmlFor="programs-year" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Fiscal Year:
            </label>
            <select
              id="programs-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-100"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="programs-sector" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Sector:
            </label>
            <select
              id="programs-sector"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-100"
            >
              <option value="">All Sectors</option>
              <option value="Health">Health & Nutrition</option>
              <option value="Social Protection">Social Protection</option>
              <option value="Agriculture">Agriculture & Fisheries</option>
              <option value="Education">Education & Youth</option>
              <option value="Infrastructure">Infrastructure & Sanitation</option>
              <option value="Governance">Governance & Gender Mainstreaming</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs or office..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={loadPrograms}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Aggregate Banner for Filtered Result */}
      {!loading && !error && filteredPrograms.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500">Programs Listed</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {filteredPrograms.length} Initiatives
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500">Total Program Budget Target</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(totalAllocated)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500">Expended to Date</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(totalExpended)}
            </div>
          </div>
        </div>
      )}

      {/* Loading & Error State */}
      {loading && (
        <div className="py-16">
          <LoadingSpinner size="lg" text="Retrieving public GAD programs directory..." />
        </div>
      )}

      {error && !loading && (
        <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>Connection Error</span>
          </div>
          <p className="text-xs">{error}</p>
          <button
            type="button"
            onClick={loadPrograms}
            className="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Program Cards Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrograms.map((prog) => {
            const budgetPct =
              prog.budgetTarget > 0
                ? Math.min(100, Math.round((prog.budgetActual / prog.budgetTarget) * 100))
                : 0;

            const isCompleted = prog.status === 'COMPLETED';

            return (
              <div
                key={prog.id}
                className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {prog.sector}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        FY {prog.fiscalYear}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{prog.status}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {prog.description || 'No detailed project narrative provided for this program.'}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Implementing Unit: <strong className="text-slate-700 dark:text-slate-300">{prog.officeName || prog.office}</strong></span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {/* Financial Utilization Progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-slate-400" />
                        <span>Budget Allocation</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(prog.budgetTarget)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${budgetPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Utilized: {formatCurrency(prog.budgetActual)}</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{budgetPct}%</span>
                    </div>
                  </div>

                  {/* Sex-Disaggregated Target vs Actual */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-lg bg-pink-50/60 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/30 text-xs space-y-0.5">
                      <div className="text-[10px] font-semibold text-pink-700 dark:text-pink-300">
                        Female Reach
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white tabular-nums">
                        {prog.actualFemale.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ {prog.targetFemale.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs space-y-0.5">
                      <div className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                        Male Reach
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white tabular-nums">
                        {prog.actualMale.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ {prog.targetMale.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPrograms.length === 0 && (
            <div className="col-span-full py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
              <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No GAD programs found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active or completed GAD programs match your selected fiscal year and sector filters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
