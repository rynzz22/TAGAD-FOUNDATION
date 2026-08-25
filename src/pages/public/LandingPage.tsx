import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Coins,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Building2,
  Calendar,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { publicApi } from '../../api/publicApi';
import { PublicDashboardData } from '../../types/public.types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const SECTOR_COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'];

export const LandingPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [data, setData] = useState<PublicDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async (year: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await publicApi.getDashboard(year);
      setData(res);
    } catch (err: any) {
      console.error('Failed to load public dashboard:', err);
      setError(err?.response?.data?.error?.message || 'Unable to connect to municipal GAD server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedYear);
  }, [selectedYear]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const summary = data?.summary;
  const bySector = data?.bySector || [];
  const byBarangay = data?.byBarangay || [];

  // Top 8 barangays by total beneficiary count
  const topBarangays = [...byBarangay]
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const sexDistribution = summary
    ? [
        { name: 'Female', value: summary.totalFemale, color: '#ec4899' },
        { name: 'Male', value: summary.totalMale, color: '#4f46e5' },
      ]
    : [];

  return (
    <div className="flex flex-col">
      {/* Hero Mandate Surface */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Building2 className="w-3.5 h-3.5" />
              Municipality of Talibon, Bohol
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Republic Act No. 9710 GAD Mandate
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl leading-tight">
              Talibon Analytics for Gender and Development
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Official public transparency portal for monitoring statutory 5% GAD budget expenditures, sex-disaggregated demographic outcomes, and community programs across Talibon&apos;s 25 mainland and island barangays.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/demographics"
              className="py-2.5 px-5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <span>Explore Demographics</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/public-programs"
              className="py-2.5 px-5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Browse Active Programs
            </Link>
            <Link
              to="/feedback"
              className="py-2.5 px-5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Citizen Feedback &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-10">
        {/* Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Municipal GAD Performance Metrics</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live aggregated reporting for the selected fiscal year
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <label htmlFor="year-select" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Fiscal Year:
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={2026}>2026 (Current)</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => fetchDashboardData(selectedYear)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              title="Refresh dataset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16">
            <LoadingSpinner size="lg" text="Loading municipal GAD data from server..." />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>Data Retrieval Error</span>
            </div>
            <p className="text-xs">{error}</p>
            <button
              type="button"
              onClick={() => fetchDashboardData(selectedYear)}
              className="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Live Metrics Content */}
        {!loading && !error && summary && (
          <>
            {/* KPI 4-Card Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Beneficiaries */}
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Total Registered Reach
                  </span>
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {summary.totalBeneficiaries.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="font-semibold text-pink-600 dark:text-pink-400">
                    {summary.totalFemale.toLocaleString()} Female ({summary.femalePercentage.toFixed(1)}%)
                  </span>
                  <span>•</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {summary.totalMale.toLocaleString()} Male
                  </span>
                </div>
              </div>

              {/* Total GAD Budget Allocated */}
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    GAD Budget Target
                  </span>
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    <Coins className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatCurrency(summary.totalBudgetAllocated)}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Mandatory 5% Statutory GAD Plan
                </div>
              </div>

              {/* Total Budget Utilized */}
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Actual GAD Expenditure
                  </span>
                  <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatCurrency(summary.totalBudgetUsed)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Utilization Rate: <span className="font-bold text-slate-800 dark:text-slate-200">{summary.budgetUtilizationRate}%</span>
                </div>
              </div>

              {/* Active Programs Count */}
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Active GAD Programs
                  </span>
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {summary.totalPrograms}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Monitored across municipal offices
                </div>
              </div>
            </div>

            {/* Interactive Visuals Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sex-Disaggregation Breakdown (1 Col) */}
              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Sex-Disaggregated Reach
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Distribution of participants by sex
                  </p>
                </div>

                <div className="h-48 w-full flex items-center justify-center">
                  {summary.totalBeneficiaries > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sexDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={4}
                        >
                          {sexDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) => [
                            `${Number(value).toLocaleString()} citizens`,
                            'Count',
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-xs text-slate-400 text-center">No beneficiary data recorded for {selectedYear}</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2.5 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 space-y-1">
                    <div className="text-[11px] font-semibold text-pink-700 dark:text-pink-300">
                      Female
                    </div>
                    <div className="text-lg font-bold text-pink-900 dark:text-pink-100 tabular-nums">
                      {summary.totalFemale.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-pink-600 dark:text-pink-400 font-medium">
                      {summary.femalePercentage.toFixed(1)}% of total
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-1">
                    <div className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                      Male
                    </div>
                    <div className="text-lg font-bold text-indigo-900 dark:text-indigo-100 tabular-nums">
                      {summary.totalMale.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {(100 - summary.femalePercentage).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              </div>

              {/* Barangay Distribution Overview (2 Cols) */}
              <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Top Barangay Beneficiary Distribution
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Highest reach across Talibon&apos;s mainland and island units
                    </p>
                  </div>
                  <Link
                    to="/demographics"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
                  >
                    <span>View all 25</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="h-56 w-full">
                  {topBarangays.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topBarangays} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <XAxis
                          dataKey="barangay"
                          tick={{ fontSize: 10, fill: '#64748b' }}
                          interval={0}
                          angle={-25}
                          textAnchor="end"
                        />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="female" name="Female" fill="#ec4899" radius={[4, 4, 0, 0]} stackId="a" />
                        <Bar dataKey="male" name="Male" fill="#4f46e5" radius={[4, 4, 0, 0]} stackId="a" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400">
                      No barangay data available for {selectedYear}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sector Coverage Row */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Sectoral Representation
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Targeted vulnerable and priority groups served by GAD initiatives
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {bySector.length} Sectors Cataloged
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {bySector.length > 0 ? (
                  bySector.map((sec, idx) => (
                    <div
                      key={sec.sector}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-1"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length] }}
                        />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                          {sec.sector}
                        </span>
                      </div>
                      <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                        {sec.count.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-4 text-xs text-slate-400 text-center">
                    No sectoral records found.
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Mandate & Compliance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Statutory 5% Allocation
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every Philippine LGU is mandated to allocate at least 5% of its total annual budget to gender-responsive programs.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Sex-Disaggregated Audits
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every municipal activity logs male and female participant ratios to ensure balanced gender impact and equitable service delivery.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              All 25 Barangays Included
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              From Poblacion to island communities like Calituban, Guindacpan, and Mahanay, all barangays are represented in TAGAD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
