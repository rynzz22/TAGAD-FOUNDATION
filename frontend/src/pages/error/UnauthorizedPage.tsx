import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex p-4 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20 shadow-inner">
          <ShieldAlert className="w-12 h-12 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white font-mono">403</h1>
          <h2 className="text-xl font-semibold text-slate-200">Access Forbidden</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your current TAGAD account role does not have the required administrative clearance to access this module.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors shadow-lg shadow-indigo-600/25"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-lg border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Re-authenticate
          </Link>
        </div>
      </div>
    </div>
  );
};
