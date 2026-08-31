import React, { useEffect, useState } from 'react';
import {
   PieChart,
   Pie,
   Cell,
   ResponsiveContainer,
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
 } from 'recharts';
 import api from '../api/axios';
 import { Skeleton } from '../components/ui/skeleton';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get(`/dashboard/stats?year=${year}`);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [year]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-16 space-y-3">
        <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400">
          Failed to load analytics
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          There was an error fetching the dashboard statistics. Please refresh the page.
        </p>
      </div>
    );
  }

  const rawData = stats?.data || stats || {};
  const summary = rawData?.summary || rawData;

  const totalBeneficiaries = Number(summary?.totalBeneficiaries ?? rawData?.totalBeneficiaries ?? 0);
  const totalMale = Number(summary?.totalMale ?? rawData?.totalMale ?? 0);
  const totalFemale = Number(summary?.totalFemale ?? rawData?.totalFemale ?? 0);
  const totalPrograms = Number(summary?.totalPrograms ?? rawData?.totalPrograms ?? 0);
  const totalBudgetAllocated = Number(summary?.totalBudgetAllocated ?? rawData?.totalBudgetAllocated ?? 0);
  const totalBudgetUsed = Number(summary?.totalBudgetUsed ?? rawData?.totalBudgetUsed ?? 0);
  const byBarangay = Array.isArray(rawData?.byBarangay) ? rawData.byBarangay : [];
  const recentBeneficiaries = Array.isArray(rawData?.recentBeneficiaries) ? rawData.recentBeneficiaries : [];

  const GENDER_COLORS = ['#334155', '#94a3b8'];

  const genderData = [
    { name: 'Male', value: totalMale },
    { name: 'Female', value: totalFemale },
  ];

  const budgetUsagePercent =
    totalBudgetAllocated > 0 ? (totalBudgetUsed / totalBudgetAllocated) * 100 : 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header & Controls */}
      <section className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Municipality of Talibon • Gender and Development Statistics
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="dash-year" className="font-medium text-slate-600 dark:text-slate-400">
            Year:
          </label>
          <select
            id="dash-year"
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-slate-900 dark:text-slate-100"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
          >
            {[2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-1 border-l-2 border-slate-900 dark:border-white pl-4">
          <div className="text-xs text-slate-500 font-medium">Total Beneficiaries</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
            {totalBeneficiaries.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            M: {totalMale.toLocaleString()} • F: {totalFemale.toLocaleString()}
          </div>
        </div>

        <div className="space-y-1 border-l-2 border-slate-300 dark:border-slate-700 pl-4">
          <div className="text-xs text-slate-500 font-medium">Active Programs</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
            {totalPrograms}
          </div>
          <div className="text-[11px] text-slate-500">FY {year} Monitoring</div>
        </div>

        <div className="space-y-1 border-l-2 border-slate-300 dark:border-slate-700 pl-4">
          <div className="text-xs text-slate-500 font-medium">GAD Budget Allocated</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(totalBudgetAllocated)}
          </div>
          <div className="text-[11px] text-slate-500">Annual GAD Plan Total</div>
        </div>

        <div className="space-y-1 border-l-2 border-slate-300 dark:border-slate-700 pl-4">
          <div className="text-xs text-slate-500 font-medium">Budget Utilized</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(totalBudgetUsed)}
          </div>
          <div className="text-[11px] text-slate-500">
            {budgetUsagePercent.toFixed(1)}% of planned budget
          </div>
        </div>
      </section>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Barangay Distribution (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Beneficiaries by Barangay
            </h2>
            <p className="text-xs text-slate-500">Disaggregated demographic distribution</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byBarangay} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="barangay"
                  fontSize={10}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  stroke="#94A3B8"
                  tick={{ fill: '#64748B' }}
                />
                <YAxis fontSize={10} stroke="#94A3B8" tick={{ fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    borderRadius: '4px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="male" stackId="a" fill="#334155" name="Male" />
                <Bar dataKey="female" stackId="a" fill="#94A3B8" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Ratio (1 col) */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Gender Distribution
            </h2>
            <p className="text-xs text-slate-500">Male and Female participant ratio</p>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                >
                  {genderData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    borderRadius: '4px',
                  }}
                />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* Recent Entries */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Recent Data Entries
          </h2>
          <p className="text-xs text-slate-500">Latest encoded demographic records</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Beneficiary</th>
                <th className="py-2.5 px-3 font-semibold">Sex</th>
                <th className="py-2.5 px-3 font-semibold">Barangay</th>
                <th className="py-2.5 px-3 font-semibold">Sector</th>
                <th className="py-2.5 px-3 font-semibold text-right">Date Encoded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentBeneficiaries.map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                    {b.firstName} {b.lastName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{b.sex}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{b.barangay}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{b.sector}</td>
                  <td className="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400">
                    {b.dateEncoded
                      ? new Date(b.dateEncoded).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recent'}
                  </td>
                </tr>
              ))}
              {recentBeneficiaries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No recent data entries recorded for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

