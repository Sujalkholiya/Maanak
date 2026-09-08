import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Shield,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { DemoBadge } from '../common/DemoBadge';

interface AuthViewProps {
  onLoginSuccess: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [officerId, setOfficerId] = useState('LM-DL-4029');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberDevice, setRememberDevice] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="max-w-4xl w-full bg-[#0B192C] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left: Branding & Institutional Positioning (5 cols) */}
        <div className="md:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-b from-[#0B192C] to-[#07111F] border-r border-slate-800/80">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-900/50 mb-6 border border-blue-400/30">
              <ShieldCheck className="w-7 h-7 text-blue-100" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-blue-400 tracking-widest uppercase bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/40">
                GOVERNMENT REGULATORY TECHNOLOGY
              </span>
              <h1 className="text-2xl font-black text-white tracking-wider">
                METROSCAN
              </h1>
              <p className="text-xs font-semibold text-slate-300">
                Legal Metrology Compliance Intelligence Platform
              </p>
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Evidence-backed compliance assistance for packaged commodity inspections under SIH Problem Statement SIH26034.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>National Rule Repository v2026.3 Active</span>
            </div>
            <div>Enforcement Circle: Delhi & Northern Zone-I</div>
          </div>
        </div>

        {/* Right: Officer Login Card (7 cols) */}
        <div className="md:col-span-7 p-8 sm:p-10 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">
                Authorized Officer Portal
              </h2>
              <DemoBadge label="Demo Login" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Restricted access for gazetted Legal Metrology enforcement officers.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  OFFICER IDENTIFIER (TOKEN / ID)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg outline-none font-mono text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  SECURITY KEY / PASSWORD
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg outline-none font-mono text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Remember enforcement tablet</span>
                </label>
                <span className="text-blue-700 font-semibold cursor-pointer hover:underline">
                  Hardware Token Sync
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Authenticate & Access Command Center</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-500">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-tight">
              Statutory Security Advisory: Unauthorized access or tampering with digital metrology audit logs is an offense under the IT Act and Legal Metrology Act.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

