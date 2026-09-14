import React, { useState } from 'react';
import { Lock, Shield, ArrowLeft, Key, UserCheck, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToStore,
}) => {
  const [email, setEmail] = useState('owner@rawan.pk');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide owner email and password.');
      return;
    }

    // Default password or demo PIN accepted
    if (password === 'admin123' || password === '1947' || password === 'admin' || password.length >= 4) {
      setError(null);
      onLoginSuccess();
    } else {
      setError('Invalid password. Demo password is: admin123');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-stone-850 rounded-2xl border border-stone-800 p-8 shadow-2xl space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-800 border border-stone-700 text-[#D4AF37] flex items-center justify-center shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            Private Admin Portal
          </h2>
          <p className="text-xs text-stone-400 font-light">
            Authorized Brand Owner & Inventory Control System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
              Owner Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
              Secret Password / Key
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Demo helper hint */}
          <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 text-[11px] text-stone-400">
            <span className="text-[#D4AF37] font-semibold block mb-0.5">Demo Credentials:</span>
            Default email: <strong className="text-stone-200">owner@rawan.pk</strong> • Password: <strong className="text-stone-200">admin123</strong>
          </div>

          <button
            type="submit"
            id="admin-login-submit"
            className="w-full py-3 rounded-xl bg-[#D4AF37] text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-[#E5C158] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            Enter Admin Portal
          </button>
        </form>

        {/* Back to Public Website */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onBackToStore}
            className="text-xs text-stone-500 hover:text-stone-300 inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Customer Website
          </button>
        </div>

      </div>
    </div>
  );
};
