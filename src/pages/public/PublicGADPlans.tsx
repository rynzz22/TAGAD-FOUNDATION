import React, { useEffect, useState } from 'react';
import {
  FileText,
  Building,
  Coins,
  ShieldCheck,
  ShieldAlert,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Search,
} from 'lucide-react';
import { publicApi } from '../../api/publicApi';
import { PublicGADPlan, PublicOffice } from '../../types/public.types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const PublicGADPlans: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

  const [plans, setPlans] = useState<PublicGADPlan[]>([]);
  const [offices, setOffices] = useState<PublicOffice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const offList = await publicApi.getOffices();
        setOffices(offList);
      } catch (err) {
        console.error('Failed to load offices list:', err);
      }
    };
    fetchOffices();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await publicApi.getGADPlans({
        year: selectedYear,
        officeId: selectedOfficeId || undefined,
      });
      setPlans(res);
      // Auto-expand all plans by default
      const initialExpanded: Record<string, boolean> = {};
      res.forEach((p) => {
        initialExpanded[p.id] = true;
      });
      setExpandedPlans(initialExpanded);
    } catch (err: any) {
      console.error('Failed to load GAD plans:', err);
      setError(err?.response?.data?.error?.message || 'Failed to retrieve approved GAD plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [selectedYear, selectedOfficeId]);

  const toggleExpand = (id: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredPlans = plans.filter(
    (p) =>
      p.officeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.office.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.items.some(
        (item) =>
          item.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.genderIssue.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.targetGroup.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const totalGADBudget = filteredPlans.reduce((acc, curr) => acc + (curr.gadBudget || 0), 0);
  const totalItemsCount = filteredPlans.reduce((acc, curr) => acc + (curr.items?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory GPB Transparency Archive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Approved Annual GAD Plans & Budgets (GPB)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Official statutory Gender and Development Plan and Budget matrices reviewed and approved by the Talibon GFPS and Municipal Council in accordance with PCW guidelines.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <label htmlFor="plans-year" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Fiscal Year:
            </label>
            <select
              id="plans-year"
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
            <Building className="w-4 h-4 text-slate-400" />
            <label htmlFor="plans-office" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Office / Department:
            </label>
            <select
              id="plans-office"
              value={selectedOfficeId}
              onChange={(e) => setSelectedOfficeId(e.target.value)}
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-100"
            >
              <option value="">All Municipal Offices</option>
              {offices.map((off) => (
                <option key={off.id} value={off.id}>
                  {off.name} ({off.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search activities, issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={loadPlans}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Aggregate Metric Banner */}
      {!loading && !error && filteredPlans.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500">Approved Department Plans</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {filteredPlans.length} GPB Submissions
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500">Total Statutory GAD Budget</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(totalGADBudget)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500">Scheduled Line Activities</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {totalItemsCount} GAD Line Items
            </div>
          </div>
        </div>
      )}

      {/* Loading & Error State */}
      {loading && (
        <div className="py-16">
          <LoadingSpinner size="lg" text="Retrieving approved statutory GAD plans..." />
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
            onClick={loadPlans}
            className="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Plans List */}
      {!loading && !error && (
        <div className="space-y-6">
          {filteredPlans.map((plan) => {
            const isExpanded = expandedPlans[plan.id] !== false;
            return (
              <div
                key={plan.id}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Plan Header Bar */}
                <div
                  onClick={() => toggleExpand(plan.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>APPROVED GPB</span>
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        FY {plan.fiscalYear}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {plan.officeName} ({plan.office})
                    </h3>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-semibold text-slate-500">
                        GAD Budget Allocated
                      </div>
                      <div className="text-base font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {formatCurrency(plan.gadBudget)}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label="Toggle plan items"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Plan Items Matrix */}
                {isExpanded && (
                  <div className="p-5 space-y-4">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Approved GAD Plan Line Activities ({plan.items.length})
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {plan.items.map((item, idx) => (
                        <div key={item.id || idx} className="py-4 first:pt-0 last:pb-0 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                {idx + 1}. {item.activity}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                <strong>Gender Issue / Mandate:</strong> {item.genderIssue}
                              </p>
                            </div>

                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 text-right space-y-0.5">
                              <div className="text-[10px] text-slate-500 font-medium">Allocated Budget</div>
                              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                {formatCurrency(item.budget)}
                              </div>
                              <div className="text-[9px] text-slate-400">{item.fundSource}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                            <div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">Target Group:</span>{' '}
                              {item.targetGroup}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">Indicator:</span>{' '}
                              {item.performanceIndicator}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">Responsible Unit:</span>{' '}
                              {item.responsibleOffice}
                            </div>
                          </div>
                        </div>
                      ))}

                      {plan.items.length === 0 && (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No line items registered for this plan.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredPlans.length === 0 && (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No approved GAD plans found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No approved annual GAD plans match your selected fiscal year and office filters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
