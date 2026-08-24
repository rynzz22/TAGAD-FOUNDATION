import React, { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import api from '../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { cn } from '../lib/utils';
import { Skeleton } from '../components/ui/skeleton';
import { 
  Users, 
  Target, 
  Banknote, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from '../components/ui/table';

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
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <Target className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Failed to load analytics</h3>
        <p className="text-gray-500 max-w-xs mt-2">There was an error fetching the dashboard statistics. Please try refreshing the page.</p>
      </div>
    );
  }

  const COLORS = ['#6366F1', '#F472B6', '#10B981', '#F59E0B', '#8B5CF6'];
  const GENDER_COLORS = ['#6366F1', '#F472B6'];

  const genderData = [
    { name: 'Male', value: stats.totalMale },
    { name: 'Female', value: stats.totalFemale },
  ];

  const budgetUsagePercent = stats.totalBudgetAllocated > 0 
    ? (stats.totalBudgetUsed / stats.totalBudgetAllocated) * 100 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Dashboard Overview</h1>
          <p className="text-sm font-medium text-[#6B7280]">Analytics for Gender and Development - Year {year}</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-[#E5E7EB] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Report Year</span>
          <select 
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-[#6366F1] cursor-pointer"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-[#E5E7EB] border-l-4 border-l-[#6366F1] bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B7280]">Total Beneficiaries</p>
                <h3 className="text-4xl font-bold mt-2 text-[#111827]">{stats.totalBeneficiaries.toLocaleString()}</h3>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
                    <span className="text-xs font-semibold text-[#6B7280]">M: {stats.totalMale}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#F472B6]" />
                    <span className="text-xs font-semibold text-[#6B7280]">F: {stats.totalFemale}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#EEF2FF] rounded-lg">
                <Users className="h-6 w-6 text-[#6366F1]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#E5E7EB] bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B7280]">Active Programs</p>
                <h3 className="text-4xl font-bold mt-2 text-[#111827]">{stats.totalPrograms}</h3>
                <p className="text-[10px] text-emerald-600 flex items-center mt-3 font-bold uppercase tracking-wide">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> Current Year
                </p>
              </div>
              <div className="p-3 bg-[#ECFDF5] rounded-lg">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#E5E7EB] bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B7280]">GAD Budget Allocated</p>
                <h3 className="text-3xl font-bold mt-2 text-[#111827]">₱{stats.totalBudgetAllocated.toLocaleString()}</h3>
                <p className="text-[10px] text-[#9CA3AF] mt-3 font-medium uppercase">Planned budget total</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Banknote className="h-6 w-6 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#E5E7EB] bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B7280]">Budget Utilized</p>
                <h3 className="text-3xl font-bold mt-2 text-[#111827]">₱{stats.totalBudgetUsed.toLocaleString()}</h3>
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex-1 h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#6366F1] transition-all duration-700 ease-out" 
                      style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#6366F1]">{budgetUsagePercent.toFixed(1)}%</span>
                </div>
              </div>
              <div className="p-3 bg-[#EEF2FF] rounded-lg">
                <TrendingUp className="h-6 w-6 text-[#6366F1]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-[#E5E7EB] shadow-sm bg-white rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-50 px-6 py-5">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7280]">Beneficiaries by Barangay</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] pt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byBarangay} margin={{ top: 0, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="barangay" 
                  fontSize={10} 
                  interval={0} 
                  angle={-45} 
                  textAnchor="end" 
                  height={60} 
                  stroke="#9CA3AF"
                  tick={{ fill: '#6B7280', fontWeight: 500 }}
                />
                <YAxis fontSize={10} stroke="#9CA3AF" tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px', fontWeight: 600 }} />
                <Bar dataKey="male" stackId="a" fill="#6366F1" name="Male" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="female" stackId="a" fill="#F472B6" name="Female" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-[#E5E7EB] shadow-sm bg-white rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-50 px-6 py-5">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7280]">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center p-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontWeight: 600, fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#E5E7EB] shadow-sm bg-white rounded-xl overflow-hidden">
        <CardHeader className="border-b border-gray-50 px-6 py-5">
          <CardTitle className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7280]">Recent Data Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-none">
                <TableHead className="text-[10px] font-bold uppercase py-4 pl-6 text-slate-500">Beneficiary</TableHead>
                <TableHead className="text-[10px] font-bold uppercase py-4 text-slate-500">Sex</TableHead>
                <TableHead className="text-[10px] font-bold uppercase py-4 text-slate-500">Barangay</TableHead>
                <TableHead className="text-[10px] font-bold uppercase py-4 text-slate-500">Sector</TableHead>
                <TableHead className="text-[10px] font-bold uppercase py-4 pr-6 text-slate-500">Date Encoded</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentBeneficiaries.map((b: any) => (
                <TableRow key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-semibold text-slate-900 py-4 pl-6">{b.firstName} {b.lastName}</TableCell>
                  <TableCell className="py-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold",
                      b.sex === 'MALE' ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'
                    )}>
                      {b.sex}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 py-4">{b.barangay}</TableCell>
                  <TableCell className="text-slate-600 py-4">{b.sector}</TableCell>
                  <TableCell className="text-[#9CA3AF] text-xs font-medium py-4 pr-6">
                    {new Date(b.dateEncoded).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                </TableRow>
              ))}
              {stats.recentBeneficiaries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-[#9CA3AF] italic text-sm">
                    No recent activities found for this period
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
