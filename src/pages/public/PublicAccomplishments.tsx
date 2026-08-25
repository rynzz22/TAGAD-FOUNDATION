import React, { useEffect, useState } from 'react';
import {
  Award,
  Calendar,
  Building,
  Coins,
  Users,
  ShieldCheck,
  ShieldAlert,
  Filter,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { publicApi } from '../../api/publicApi';
import { PublicAccomplishment } from '../../types/public.types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const PublicAccomplishments: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [accomplishments, setAccomplishments] = useState<PublicAccomplishment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccomplishments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await publicApi.getAccomplishments({
        year: selectedYear,
        quarter: selectedQuarter ? parseInt(selectedQuarter, 10) : undefined,
      });
      setAccomplishments(res);
    } catch (err: any) {
      console.error('Failed to load accomplishments:', err);
      setError(err?.response?.data?.error?.message || 'Failed to retrieve GAD accomplishments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccomplishments();
  }, [selectedYear, selectedQuarter]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredAccomplishments = accomplishments.filter(
    (a) =>
      a.activityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.actualOutput.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.outputSummary && a.outputSummary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      a.office.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUtilized = filteredAccomplishments.reduce((acc, curr) => acc + (curr.actualBudgetUsed || 0), 0);
  const totalBeneficiariesServed = filteredAccomplishments.reduce(
    (acc, curr) => acc + (curr.totalBeneficiaries || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Auditable GAD Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          GAD Accomplishments & Transparency Feed
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Physical and financial accomplishments verified by the Talibon Gender and Development Focal Point System (GFPS). Transparent evidence of public fund utilization and citizen impact.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <label htmlFor="accomp-year" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Fiscal Year:
            </label>
            <select
              id="accomp-year"
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
            <Calendar className="w-4 h-4 text-slate-400" />
            <label htmlFor="accomp-quarter" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Quarter:
            </label>
            <select
              id="accomp-quarter"
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-100"
            >
              <option value="">All Quarters</option>
              <option value="1">Q1 (Jan - Mar)</option>
              <option value="2">Q2 (Apr - Jun)</option>
              <option value="3">Q3 (Jul - Sep)</option>
              <option value="4">Q4 (Oct - Dec)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search output or office..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={loadAccomplishments}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Aggregate Metric Banner */}
      {!loading && !error && filteredAccomplishments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500">Accomplishment Reports</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {filteredAccomplishments.length} Recorded Entries
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500">Verified Budget Expended</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(totalUtilized)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500">Total Citizens Directly Served</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {totalBeneficiariesServed.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Loading & Error State */}
      {loading && (
        <div className="py-16">
          <LoadingSpinner size="lg" text="Retrieving accomplishment reports..." />
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
            onClick={loadAccomplishments}
            className="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Accomplishments Feed List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredAccomplishments.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Q{item.quarter} • FY {item.fiscalYear}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {item.activityTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.office}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Physical Output (2 Cols) */}
                <div className="md:col-span-2 space-y-2">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Actual Physical Output:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    {item.actualOutput}
                  </p>
                  {item.outputSummary && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      Note: {item.outputSummary}
                    </p>
                  )}
                </div>

                {/* Financial & Reach Summary (1 Col) */}
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Coins className="w-3 h-3 text-emerald-500" />
                      <span>Actual Budget Expended</span>
                    </div>
                    <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(item.actualBudgetUsed)}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-500" />
                      <span>Citizens Reached</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.totalBeneficiaries.toLocaleString()} Total
                      </span>
                      <span className="text-[11px] text-slate-500">
                        <strong className="text-pink-600 dark:text-pink-400">{item.actualFemale} F</strong> /{' '}
                        <strong className="text-indigo-600 dark:text-indigo-400">{item.actualMale} M</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredAccomplishments.length === 0 && (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
              <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No accomplishment records found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No GAD accomplishments have been logged or verified for the selected year and quarter.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
