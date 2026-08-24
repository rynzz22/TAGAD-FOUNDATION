import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';
import { validateLoginInput } from '../../lib/validation/auth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@talibon.gov.ph');
  const [password, setPassword] = useState('Admin@1234');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateLoginInput(email, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center justify-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-sm tracking-wider">
            TG
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            TAGAD
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Official GAD Personnel Sign In
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Municipality of Talibon • Gender and Development Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Official Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@talibon.gov.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className={errors.email ? 'border-rose-500' : ''}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Account Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className={errors.password ? 'border-rose-500' : ''}
              />
              {errors.password && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In to TAGAD'}
            </Button>
          </form>

          {/* Quick Development Credentials Info Box */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Development Access:</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                ADMIN
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg font-mono text-[11px] space-y-1 border border-slate-200/60 dark:border-slate-800">
              <div>Email: <span className="text-slate-900 dark:text-slate-100">admin@talibon.gov.ph</span></div>
              <div>Pass: <span className="text-slate-900 dark:text-slate-100">Admin@1234</span></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            ← Back to Public Transparency Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
