import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Building,
  ShieldCheck,
  ShieldAlert,
  ArrowUpDown,
  Filter,
  PieChart as PieIcon,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { publicApi } from '../../api/publicApi';
import { PublicDemographicsData, PublicBarangay, BarangayBreakdown } from '../../types/public.types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const SECTOR_COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'];

export const PublicDemographics: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedBarangayId, setSelectedBarangayId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<'total' | 'female' | 'male' | 'barangay'>('total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [data, setData] = useState<PublicDemographicsData | null>(null);
  const [barangays, setBarangays] = useState<PublicBarangay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarangays = async () => {
      try {
        const brgyList = await publicApi.getBarangays();
        setBarangays(brgyList);
      } catch (err) {
        console.error('Failed to load barangays list:', err);
      }
    };
    fetchBarangays();
  }, []);

  const loadDemographics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await publicApi.getDemographics({
        year: selectedYear,
        barangayId: selectedBarangayId || undefined,
      });
      setData(res);
    } catch (err: any) {
      console.error('Failed to load demographics:', err);
      setError(err?.response?.data?.error?.message || 'Failed to retrieve demographic statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemographics();
  }, [selectedYear, selectedBarangayId]);

  const totals = data?.totals;
  const bySector = data?.bySector || [];
  const rawBarangays = data?.byBarangay || [];

  // Filter & sort barangays for the table and chart
  const filteredBarangays = rawBarangays
    .filter((b) => b.barangay.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'barangay') {
        comparison = a.barangay.localeCompare(b.barangay);
      } else {
        comparison = (a[sortField] || 0) - (b[sortField] || 0);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const toggleSort = (field: 'total' | 'female' | 'male' | 'barangay') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero-PII Public Transparency</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sex-Disaggregated Citizen Demographics
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Aggregated demographic indicators of constituents reached by Gender and Development (GAD) initiatives across Talibon&apos;s 25 barangays. Individual names and sensitive PII are protected under statutory privacy guidelines.
        </p>
      </div>

      {/* Filter Control Surface */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <label htmlFor="demographics-year" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Fiscal Year:
            </label>
            <select
              id="demographics-year"
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
            <label htmlFor="demographics-barangay" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Barangay Filter:
            </label>
            <select
              id="demographics-barangay"
              value={selectedBarangayId}
              onChange={(e) => setSelectedBarangayId(e.target.value)}
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-100"
            >
              <option value="">All 25 Barangays</option>
              {barangays.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={loadDemographics}
          className="self-end sm:self-auto p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading & Error State */}
      {loading && (
        <div className="py-16">
          <LoadingSpinner size="lg" text="Aggregating demographic metrics..." />
        </div>
      )}

      {error && !loading && (
        <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>Failed to Load Data</span>
          </div>
          <p className="text-xs">{error}</p>
          <button
            type="button"
            onClick={loadDemographics}
            className="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && totals && (
        <>
          {/* Totals Metric Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total Disaggregated Reach
                </span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                {totals.totalBeneficiaries.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Registered constituents in GAD programs
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
                  Female Beneficiaries
                </span>
                <span className="text-xs font-bold text-pink-600 bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded">
                  {totals.femalePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                {totals.female.toLocaleString()}
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-pink-500 h-full rounded-full"
                  style={{ width: `${totals.femalePercentage}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  Male Beneficiaries
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                  {totals.malePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                {totals.male.toLocaleString()}
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${totals.malePercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sector Representation Breakdown */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-indigo-600" />
                  <span>Sectoral Classification Distribution</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Beneficiaries tracked across special sectors (PWD, 4Ps, Solo Parents, Senior Citizens, Youth, IP)
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {bySector.length} Sectors
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bySector.map((sec, idx) => {
                const pct = sec.percentage ? sec.percentage.toFixed(1) : '0';
                return (
                  <div
                    key={sec.sector}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length] }}
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {sec.sector}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {pct}%
                      </span>
                    </div>

                    <div className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {sec.count.toLocaleString()}
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(2, parseFloat(pct)))}%`,
                          backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Barangay Demographic Comparison Chart */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Barangay Reach Breakdown
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sex-disaggregated participant volume per barangay
              </p>
            </div>

            <div className="h-72 w-full">
              {filteredBarangays.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredBarangays} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                    <XAxis
                      dataKey="barangay"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      interval={0}
                      angle={-45}
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
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="female" name="Female" fill="#ec4899" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="male" name="Male" fill="#4f46e5" radius={[4, 4, 0, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No records match the current filter criteria.
                </div>
              )}
            </div>
          </div>

          {/* Barangay Granular Data Table */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Barangay Directory & Disaggregated Counts
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {filteredBarangays.length} of {rawBarangays.length} barangays
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search barangay..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">
                      <button
                        type="button"
                        onClick={() => toggleSort('barangay')}
                        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <span>Barangay</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-2.5 px-3 font-semibold text-right">
                      <button
                        type="button"
                        onClick={() => toggleSort('female')}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <span>Female Reach</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-2.5 px-3 font-semibold text-right">
                      <button
                        type="button"
                        onClick={() => toggleSort('male')}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <span>Male Reach</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-2.5 px-3 font-semibold text-right">
                      <button
                        type="button"
                        onClick={() => toggleSort('total')}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <span>Total Constituents</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-2.5 px-3 font-semibold text-right">Female Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredBarangays.map((b) => {
                    const ratio = b.total > 0 ? (b.female / b.total) * 100 : 0;
                    return (
                      <tr
                        key={b.barangay}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {b.barangay}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-pink-600 dark:text-pink-400 tabular-nums">
                          {b.female.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-indigo-600 dark:text-indigo-400 tabular-nums">
                          {b.male.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                          {b.total.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-600 dark:text-slate-400 tabular-nums">
                          {ratio.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                  {filteredBarangays.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No barangays matched your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
