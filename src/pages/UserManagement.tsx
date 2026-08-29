import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../modules/auth/AuthContext';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { UserPlus, UserCog, ShieldCheck, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { cn } from '../lib/utils';

const UserManagement: React.FC = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ENCODER',
    office: '',
    isActive: true
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      const payload = response.data?.data ?? response.data;
      setUsers(Array.isArray(payload) ? payload : []);
    } catch (error) {
      toast.error('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'ENCODER',
      office: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (u: any) => {
    setEditingId(u.id);
    setFormData({
      name: u.name || u.email?.split('@')[0] || '',
      email: u.email || '',
      password: '', // Don't show password
      role: u.role || 'ENCODER',
      office: u.office || u.office?.name || u.office?.code || '',
      isActive: u.isActive !== undefined ? Boolean(u.isActive) : true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const payload = { ...formData };
        if (!payload.password) delete (payload as any).password;
        await api.put(`/users/${editingId}`, payload);
        toast.success('User updated successfully');
      } else {
        if (!formData.password) throw new Error('Password is required');
        await api.post('/users', formData);
        toast.success('User created successfully');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      const msg = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]">User Management</h1>
          <p className="text-sm font-medium text-[#6B7280]">Manage system access and roles</p>
        </div>
        {isAdmin && (
          <Button onClick={handleOpenAdd} className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg shadow-sm font-semibold px-6">
            <UserPlus className="h-4 w-4 mr-2" /> Add User
          </Button>
        )}
      </div>

      <Card className="border-[#E5E7EB] shadow-sm bg-white rounded-xl overflow-hidden">
        <header className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#EEF2FF] rounded-lg">
              <ShieldCheck className="h-5 w-5 text-[#6366F1]" />
            </div>
            <h2 className="text-lg font-bold text-[#111827]">System Users</h2>
          </div>
          <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">{users.length} Active Accounts</span>
        </header>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-24 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-[#6366F1]" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-none">
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4 pl-8 text-[#6B7280]">Name</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4 text-[#6B7280]">Email</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4 text-[#6B7280]">Role</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4 text-[#6B7280]">Office</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4 text-[#6B7280]">Status</TableHead>
                  {isAdmin && <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4 pr-8 text-[#6B7280] text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-20 text-[#9CA3AF] italic text-sm">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => {
                    const roleUpper = (u.role || '').toUpperCase();
                    const officeName = u.office || u.office?.name || u.office?.code || '-';
                    const isActive = u.isActive !== undefined ? Boolean(u.isActive) : true;
                    return (
                      <TableRow key={u.id} className="hover:bg-gray-50/50 border-b border-gray-50 last:border-0 transition-colors group">
                        <TableCell className="font-bold text-[#111827] text-sm py-5 pl-8">{u.name || u.email?.split('@')[0]}</TableCell>
                        <TableCell className="text-[#374151] text-sm py-5">{u.email}</TableCell>
                        <TableCell className="py-5">
                          {roleUpper === 'ADMIN' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-50 text-red-500 uppercase tracking-widest">Admin</span>
                          ) : roleUpper === 'ENCODER' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#EEF2FF] text-[#6366F1] uppercase tracking-widest">Encoder</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-gray-100 text-[#6B7280] uppercase tracking-widest">{roleUpper || 'Viewer'}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-[#6B7280] text-sm py-5">{officeName}</TableCell>
                        <TableCell className="py-5">
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest",
                            isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-[#9CA3AF]"
                          )}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right py-5 pr-8">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(u)} className="h-9 w-9 text-[#6366F1] hover:bg-white hover:shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              <UserCog className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-8 border-none shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#111827]">{editingId ? 'Edit User' : 'Add New User'}</DialogTitle>
            <p className="text-sm text-[#6B7280]">Assign roles and office permissions to municipal staff.</p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-[#374151]">Full Name <span className="text-red-500">*</span></Label>
              <Input id="name" className="rounded-lg border-[#D1D5DB] py-6" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Juan De La Cruz" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-[#374151]">Email Address <span className="text-red-500">*</span></Label>
              <Input id="email" type="email" className="rounded-lg border-[#D1D5DB] py-6" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="juan@talibon.gov.ph" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-[#374151]">{editingId ? 'New Password (leave blank to keep current)' : 'Password'}</Label>
              <Input id="password" type="password" className="rounded-lg border-[#D1D5DB] py-6" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingId} />
            </div>
            <div className="grid grid-cols-2 gap-6 pb-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#374151]">System Role <span className="text-red-500">*</span></Label>
                <Select value={formData.role} onValueChange={val => setFormData({...formData, role: val})}>
                  <SelectTrigger className="rounded-lg border-[#D1D5DB] py-6"><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="SUPER_ADMIN">Super Admin (System-wide)</SelectItem>
                    <SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
                    <SelectItem value="ENCODER">Encoder (Data Entry)</SelectItem>
                    <SelectItem value="VIEWER">Viewer (Read Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="office" className="text-sm font-semibold text-[#374151]">Office <span className="text-red-500">*</span></Label>
                <Input id="office" className="rounded-lg border-[#D1D5DB] py-6" value={formData.office} onChange={e => setFormData({...formData, office: e.target.value})} placeholder="e.g. MSWDO" required />
              </div>
            </div>
            {editingId && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  className="w-5 h-5 rounded border-[#D1D5DB] text-[#6366F1] focus:ring-[#6366F1]"
                  checked={formData.isActive} 
                  onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                />
                <Label htmlFor="isActive" className="text-sm font-bold text-[#111827] cursor-pointer">Account Active</Label>
                <span className="text-[10px] font-medium text-[#6B7280]">Deactivating will revoke all system access immediately.</span>
              </div>
            )}
            <DialogFooter className="pt-6 gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-lg text-[#6B7280] font-semibold">Cancel</Button>
              <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg shadow-sm font-bold min-w-[140px]" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Save User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
