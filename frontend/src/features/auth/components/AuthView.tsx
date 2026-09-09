import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex items-center justify-center p-4 selection:bg-[#0D7C66] selection:text-white font-sans">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/80 px-8 py-9 sm:px-9 sm:py-10">
        {/* Header Branding */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <img
            src="/logo.png"
            alt="MAANAK"
            className="w-11 h-11 object-contain shrink-0"
          />
          <div className="flex flex-col">
            <h1 className="font-extrabold text-[19px] text-[#0F172A] tracking-wider leading-none">
              MAANAK
            </h1>
            <span className="text-[9.5px] font-semibold text-[#475569] tracking-wider uppercase mt-1 leading-none">
              LEGAL METROLOGY COMPLIANCE
            </span>
          </div>
        </div>

        {/* Subtitle / Description */}
        <p className="text-center text-[12.5px] text-[#64748B] leading-relaxed max-w-[310px] mx-auto mb-6">
          Sign in with your authorized officer credentials to access the Inspection Command Center.
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-[#E2E8F0] mb-6" />

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#334155] mb-1.5">
              User ID / Officer ID
            </label>
            <input
              type="text"
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              placeholder="e.g. LM-DL-4029"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] bg-white border border-[#CBD5E1] rounded-lg outline-none transition-all focus:border-[#0D7C66] focus:ring-2 focus:ring-[#0D7C66]/15"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#334155] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] bg-white border border-[#CBD5E1] rounded-lg outline-none transition-all focus:border-[#0D7C66] focus:ring-2 focus:ring-[#0D7C66]/15"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] p-0.5 cursor-pointer transition-colors focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-2.5 px-4 bg-[#0D7C66] hover:bg-[#0B6B58] active:bg-[#095A4A] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center tracking-wide"
          >
            Sign In
          </button>
        </form>

        {/* Footer Legal Notice */}
        <div className="mt-7 text-center space-y-1 text-[10.5px] text-[#94A3B8] leading-tight">
          <p>Restricted access for gazetted Legal Metrology enforcement officers.</p>
          <p>Unauthorized access is an offense under the IT Act.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
