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
import { Plus, Edit, Trash2, Loader2, Award } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';

const Accomplishments: React.FC = () => {
  const { user } = useAuth();
  const [accs, setAccs] = useState<any[]>([]);
  const [gadPlans, setGadPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    gadPlanId: '',
    actualOutput: '',
    actualBeneficiaryMale: '0',
    actualBeneficiaryFemale: '0',
    actualBudgetUsed: '',
    remarks: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accResponse, plansResponse] = await Promise.all([
        api.get('/accomplishments'),
        api.get('/gad-plans?status=APPROVED')
      ]);
      setAccs(accResponse.data);
      setGadPlans(plansResponse.data);
    } catch (error) {
      toast.error('Failed to fetch accomplishments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      gadPlanId: '',
      actualOutput: '',
      actualBeneficiaryMale: '0',
      actualBeneficiaryFemale: '0',
      actualBudgetUsed: '',
      remarks: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (a: any) => {
    setEditingId(a.id);
    setFormData({
      gadPlanId: a.gadPlanId.toString(),
      actualOutput: a.actualOutput,
      actualBeneficiaryMale: a.actualBeneficiaryMale.toString(),
      actualBeneficiaryFemale: a.actualBeneficiaryFemale.toString(),
      actualBudgetUsed: a.actualBudgetUsed.toString(),
      remarks: a.remarks || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this accomplishment record?')) return;
    try {
      await api.delete(`/accomplishments/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gadPlanId) return toast.error('Please select a GAD activity');
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        gadPlanId: parseInt(formData.gadPlanId),
        actualBeneficiaryMale: parseInt(formData.actualBeneficiaryMale),
        actualBeneficiaryFemale: parseInt(formData.actualBeneficiaryFemale),
        actualBudgetUsed: parseFloat(formData.actualBudgetUsed)
      };
      if (editingId) {
        await api.put(`/accomplishments/${editingId}`, payload);
        toast.success('Updated');
      } else {
        await api.post('/accomplishments', payload);
        toast.success('Added');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Accomplishment Report (GAR)</h1>
          <p className="text-sm font-medium text-[#6B7280]">Record achievements against the approved GAD Plan</p>
        </div>
        {user?.role !== 'VIEWER' && (
          <Button onClick={handleOpenAdd} className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg shadow-sm font-semibold px-6">
            <Plus className="h-4 w-4 mr-2" /> Add Achievement
          </Button>
        )}
      </div>

      <Card className="border-[#E5E7EB] shadow-sm bg-white rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-none">
                <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4 pl-6 text-[#6B7280] w-[400px]">Plan Activity / Achievement</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4 text-[#6B7280]">Beneficiaries (M/F)</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4 text-[#6B7280]">Utilized Budget</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4 text-[#6B7280]">Usage Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4 pr-6 text-[#6B7280] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-24 text-[#6366F1] animate-pulse font-bold text-lg"><Loader2 className="h-10 w-10 animate-spin mx-auto mb-2" /> Loading accomplishments...</TableCell></TableRow>
              ) : accs.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-24 text-[#9CA3AF] italic text-sm">No achievements recorded yet</TableCell></TableRow>
              ) : accs.map((a) => {
                const totalTarget = a.gadPlan.budget;
                const totalActual = a.actualBudgetUsed;
                const utilization = (totalActual / totalTarget) * 100;
                
                return (
                  <TableRow key={a.id} className="hover:bg-indigo-50/20 border-b border-gray-50 last:border-0 transition-colors group">
                    <TableCell className="py-5 pl-6">
                      <div className="font-bold text-[#111827] text-sm leading-tight mb-1">{a.gadPlan.activity}</div>
                      <div className="text-[11px] text-[#6B7280] font-medium italic line-clamp-1 bg-gray-50 py-1 px-2 rounded-md inline-block">
                        {a.actualOutput}
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="text-sm font-bold text-[#111827]">
                        {(a.actualBeneficiaryMale + a.actualBeneficiaryFemale).toLocaleString()} <span className="text-[10px] text-[#6B7280] font-medium ml-1">total</span>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mt-1 space-x-2">
                        <span>M: {a.actualBeneficiaryMale}</span>
                        <span className="text-gray-300">|</span>
                        <span>F: {a.actualBeneficiaryFemale}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="font-bold text-[#111827] text-sm">₱{a.actualBudgetUsed.toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mt-1">Target: ₱{a.gadPlan.budget.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[100px]">
                            <div 
                              className={cn("h-full rounded-full transition-all duration-700", utilization > 100 ? "bg-red-500" : "bg-[#6366F1]")} 
                              style={{ width: `${Math.min(utilization, 100)}%` }} 
                            />
                          </div>
                          <span className={cn("text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0", 
                            utilization > 100 ? "bg-red-50 text-red-500" : "bg-[#EEF2FF] text-[#6366F1]")}>
                            {utilization.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-5 pr-6">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user?.role !== 'VIEWER' && (
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(a)} className="h-8 w-8 text-[#6366F1] hover:bg-white hover:shadow-sm"><Edit className="h-4 w-4" /></Button>
                        )}
                        {user?.role === 'ADMIN' && (
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="h-8 w-8 text-red-400 hover:bg-white hover:shadow-sm"><Trash2 className="h-4 w-4" /></Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl rounded-2xl p-8 border-none shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#111827]">{editingId ? 'Edit Accomplishment' : 'Add New Accomplishment'}</DialogTitle>
            <p className="text-sm text-[#6B7280]">Document the progress and impact of your approved GAD activities.</p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#374151]">Reference GAD Activity <span className="text-red-500">*</span></Label>
              <Select value={formData.gadPlanId} onValueChange={val => setFormData({...formData, gadPlanId: val})}>
                <SelectTrigger className="rounded-lg border-[#D1D5DB] py-6 font-medium">
                  <SelectValue placeholder="Choose an approved plan activity..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl overflow-hidden shadow-2xl">
                  {gadPlans.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()} className="hover:bg-[#EEF2FF] py-3 cursor-pointer">
                      <span className="font-bold block">{p.activity}</span>
                      <span className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">{p.office} • Budget: ₱{p.budget.toLocaleString()}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actualOutput" className="text-sm font-semibold text-[#374151]">Actual Output / Deliverable <span className="text-red-500">*</span></Label>
              <Input id="actualOutput" className="rounded-lg border-[#D1D5DB] py-6" value={formData.actualOutput} onChange={e => setFormData({...formData, actualOutput: e.target.value})} placeholder="e.g. Conducted sensitivity training for 50 staff members" required />
            </div>
            <div className="grid grid-cols-2 gap-6 p-6 rounded-xl bg-gray-50 border border-gray-100">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9CA3AF]">Actual Beneficiaries</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#6B7280]">Male</Label>
                    <Input className="h-10 rounded-lg border-[#D1D5DB]" type="number" value={formData.actualBeneficiaryMale} onChange={e => setFormData({...formData, actualBeneficiaryMale: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#6B7280]">Female</Label>
                    <Input className="h-10 rounded-lg border-[#D1D5DB]" type="number" value={formData.actualBeneficiaryFemale} onChange={e => setFormData({...formData, actualBeneficiaryFemale: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2 pt-8">
                  <Label htmlFor="actualBudgetUsed" className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9CA3AF]">Actual Budget Used (₱) <span className="text-red-500">*</span></Label>
                  <Input id="actualBudgetUsed" type="number" step="0.01" className="rounded-lg border-[#D1D5DB] h-10 font-bold text-[#6366F1]" value={formData.actualBudgetUsed} onChange={e => setFormData({...formData, actualBudgetUsed: e.target.value})} required />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks" className="text-sm font-semibold text-[#374151]">Remarks / Qualitative Impact</Label>
              <Input id="remarks" className="rounded-lg border-[#D1D5DB] py-6" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} placeholder="Any additional notes or observations..." />
            </div>
            <DialogFooter className="pt-6 gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-lg text-[#6B7280] font-semibold">Cancel</Button>
              <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg shadow-sm font-bold min-w-[170px]" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Save Achievement'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accomplishments;
