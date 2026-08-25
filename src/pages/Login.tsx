import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Loader2, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Welcome to TAGAD System');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#6366F1] opacity-[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#6366F1] opacity-[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-[#EEF2FF] text-[#6366F1] mb-6 shadow-sm border border-indigo-50">
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-[#111827] tracking-tighter">TAGAD System</h1>
          <p className="text-[#6B7280] font-medium mt-3">Talibon Analytics for Gender and Development</p>
        </div>

        <Card className="border-[#E5E7EB] shadow-2xl bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="space-y-2 p-10 pb-4">
            <CardTitle className="text-2xl font-bold text-[#111827]">Secure Login</CardTitle>
            <CardDescription className="text-sm font-medium text-[#6B7280]">
              Please enter your LGU credentials to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6 p-10 pt-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#374151]">Official Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@talibon.gov.ph" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl border-[#D1D5DB] py-6 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-[#374151]">Password</Label>
                  <button type="button" className="text-xs font-bold text-[#6366F1] hover:underline">Forgot password?</button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl border-[#D1D5DB] py-6 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />
              </div>
            </CardContent>
            <CardFooter className="p-10 pt-0">
              <Button type="submit" className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl shadow-lg shadow-indigo-200 h-14 text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In to Dashboard'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] mb-2">© {new Date().getFullYear()} Municipality of Talibon, Bohol</p>
          <div className="flex justify-center gap-4">
            <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-widest bg-[#EEF2FF] px-3 py-1 rounded-full">GAD Compliant</span>
            <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-widest bg-[#EEF2FF] px-3 py-1 rounded-full">Secure SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
