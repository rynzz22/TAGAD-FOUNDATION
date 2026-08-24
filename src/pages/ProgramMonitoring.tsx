import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Loader2, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';

const ProgramMonitoring: React.FC = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    office: '',
    sector: '',
    budget: '',
    year: new Date().getFullYear().toString(),
    status: 'Active',
    targetMale: '0',
    targetFemale: '0',
    actualMale: '0',
    actualFemale: '0'
  });

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/programs');
      setPrograms(data);
    } catch (error) {
      toast.error('Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      office: user?.office || '',
      sector: '',
      budget: '',
      year: new Date().getFullYear().toString(),
      status: 'Active',
      targetMale: '0',
      targetFemale: '0',
      actualMale: '0',
      actualFemale: '0'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      description: p.description || '',
      office: p.office,
      sector: p.sector,
      budget: p.budget.toString(),
      year: p.year.toString(),
      status: p.status,
      targetMale: p.targetMale.toString(),
      targetFemale: p.targetFemale.toString(),
      actualMale: p.actualMale.toString(),
      actualFemale: p.actualFemale.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      await api.delete(`/programs/${id}`);
      toast.success('Program deleted');
      fetchPrograms();
    } catch (error) {
      toast.error('Failed to delete program');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year),
        budget: parseFloat(formData.budget),
        targetMale: parseInt(formData.targetMale),
        targetFemale: parseInt(formData.targetFemale),
        actualMale: parseInt(formData.actualMale),
        actualFemale: parseInt(formData.actualFemale)
      };
      if (editingId) {
        await api.put(`/programs/${editingId}`, payload);
        toast.success('Program updated');
      } else {
        await api.post('/programs', payload);
        toast.success('Program created');
      }
      setIsModalOpen(false);
      fetchPrograms();
    } catch (error) {
      toast.error('Failed to save program');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Program Monitoring</h1>
          <p className="text-sm font-medium text-[#6B7280]">Track GAD-related programs and actual vs target impact</p>
        </div>
        {user?.role !== 'VIEWER' && (
          <Button onClick={handleOpenAdd} className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg shadow-sm font-semibold">
            <Plus className="h-4 w-4 mr-2" /> New Program
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="py-24 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-[#6366F1]" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((p) => {
              const totalTarget = p.targetMale + p.targetFemale;
              const totalActual = p.actualMale + p.actualFemale;
              const progress = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
              
              return (
                <Card key={p.id} className="border-[#E5E7EB] shadow-sm h-full flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <header className="px-6 py-5 border-b border-gray-50 flex items-start justify-between">
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-[#111827] line-clamp-1">{p.title}</h3>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-[#6B7280] uppercase tracking-wider">
                          {p.sector}
                        </span>
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest",
                          p.status === 'Active' ? 'bg-[#EEF2FF] text-[#6366F1]' : 
                          p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                        )}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-[#EEF2FF] transition-colors">
                      <Target className="h-5 w-5 text-[#9CA3AF] group-hover:text-[#6366F1]" />
                    </div>
                  </header>
                  <CardContent className="flex-1 p-6 space-y-6">
                    <p className="text-xs font-medium text-[#6B7280] leading-relaxed line-clamp-2">{p.description || 'No description provided.'}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">Beneficiary Reach</span>
                        <span className="text-xs font-bold text-[#111827]">{totalActual.toLocaleString()} / {totalTarget.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#6366F1] rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">Budget</p>
                        <p className="text-sm font-bold text-[#111827]">₱{p.budget.toLocaleString()}</p>
                      </div>
                      <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">Office</p>
                        <p className="text-sm font-bold text-[#111827] truncate">{p.office}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      {user?.role !== 'VIEWER' && (
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(p)} className="h-9 px-4 text-[#6366F1] font-semibold hover:bg-[#EEF2FF] rounded-lg">
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      )}
                      {user?.role === 'ADMIN' && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="h-9 px-4 text-red-400 font-semibold hover:bg-red-50 rounded-lg">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl rounded-2xl p-8 border-none shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#111827]">{editingId ? 'Edit Program' : 'Create New Program'}</DialogTitle>
            <p className="text-sm text-[#6B7280]">Define the scope and objectives for your GAD program.</p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-[#374151]">Program Title <span className="text-red-500">*</span></Label>
              <Input id="title" className="rounded-lg border-[#D1D5DB] py-6" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-[#374151]">Description</Label>
              <Input id="description" className="rounded-lg border-[#D1D5DB] py-6" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="office" className="text-sm font-semibold text-[#374151]">Responsible Office <span className="text-red-500">*</span></Label>
                <Input id="office" className="rounded-lg border-[#D1D5DB] py-6" value={formData.office} onChange={e => setFormData({...formData, office: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector" className="text-sm font-semibold text-[#374151]">Sector <span className="text-red-500">*</span></Label>
                <Select value={formData.sector} onValueChange={val => setFormData({...formData, sector: val})}>
                  <SelectTrigger className="rounded-lg border-[#D1D5DB] py-6"><SelectValue placeholder="Select sector" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {["Women", "Senior Citizens", "PWD", "Youth", "Indigenous Peoples", "Farmers", "Fisherfolk", "Urban Poor"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-semibold text-[#374151]">Budget (₱) <span className="text-red-500">*</span></Label>
                <Input id="budget" type="number" step="0.01" className="rounded-lg border-[#D1D5DB] py-6" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="text-sm font-semibold text-[#374151]">Year <span className="text-red-500">*</span></Label>
                <Input id="year" type="number" className="rounded-lg border-[#D1D5DB] py-6" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 p-6 rounded-xl bg-gray-50 border border-gray-100">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9CA3AF]">Target Beneficiaries</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#6B7280]">Male</Label>
                    <Input className="h-10 rounded-lg border-[#D1D5DB]" type="number" value={formData.targetMale} onChange={e => setFormData({...formData, targetMale: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#6B7280]">Female</Label>
                    <Input className="h-10 rounded-lg border-[#D1D5DB]" type="number" value={formData.targetFemale} onChange={e => setFormData({...formData, targetFemale: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9CA3AF]">Actual Beneficiaries</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#6B7280]">Male</Label>
                    <Input className="h-10 rounded-lg border-[#D1D5DB]" type="number" value={formData.actualMale} onChange={e => setFormData({...formData, actualMale: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#6B7280]">Female</Label>
                    <Input className="h-10 rounded-lg border-[#D1D5DB]" type="number" value={formData.actualFemale} onChange={e => setFormData({...formData, actualFemale: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#374151]">Status</Label>
              <Select value={formData.status} onValueChange={val => setFormData({...formData, status: val})}>
                <SelectTrigger className="rounded-lg border-[#D1D5DB] py-6"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-6 gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-lg text-[#6B7280] font-semibold">Cancel</Button>
              <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg shadow-sm font-bold min-w-[140px]" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Save Program'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgramMonitoring;
