import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, UserCheck, AlertCircle, Loader2, Sparkles, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../../app/providers/AuthContext';
import { useToast } from '../../../hooks/useToast';

interface AuthViewProps {
  onLoginSuccess: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [officerId, setOfficerId] = useState('LM-DL-4029');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  
  // Additional registration fields
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickFill = (officerCode: string, pass: string) => {
    setOfficerId(officerCode);
    setPassword(pass);
    setErrorMessage('');
    showToast('Credentials Auto-Filled', `Ready to sign in as ${officerCode}`, 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        if (!userName.trim() || !email.trim() || !password.trim()) {
          setErrorMessage('Username, email, and password are required.');
          setIsLoading(false);
          return;
        }

        await register({
          userName: userName.trim(),
          email: email.trim(),
          password,
          fullName: fullName.trim() || userName.trim(),
          officerId: officerId.trim() || `LM-DL-${Math.floor(1000 + Math.random() * 9000)}`,
          role: 'Officer',
        });

        showToast('Officer Registered', 'Account created and authenticated successfully.', 'success');
        onLoginSuccess();
      } else {
        if (!officerId.trim() || !password.trim()) {
          setErrorMessage('Please enter your Officer ID and password.');
          setIsLoading(false);
          return;
        }

        await login({
          identifier: officerId.trim(),
          password,
        });

        showToast('Welcome Officer', 'Successfully authenticated with Central Enforcement HQ.', 'success');
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
      showToast('Authentication Failed', err.message || 'Please check credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex items-center justify-center p-4 selection:bg-[#0D7C66] selection:text-white font-sans">
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/80 px-8 py-8 sm:px-9 sm:py-9">
        {/* Header Branding */}
        <div className="flex items-center justify-center gap-3 mb-4">
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
        <p className="text-center text-[12px] text-[#64748B] leading-relaxed max-w-[320px] mx-auto mb-4">
          {isRegisterMode
            ? 'Register a new authorized Legal Metrology enforcement profile.'
            : 'Sign in with your authorized officer credentials to access the Inspection Command Center.'}
        </p>

        {/* Tab Switcher */}
        <div className="flex bg-[#F1F5F9] p-1 rounded-xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              !isRegisterMode
                ? 'bg-white text-[#0D7C66] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Officer Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              isRegisterMode
                ? 'bg-white text-[#0D7C66] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            New Officer Setup
          </button>
        </div>

        {/* Quick Demo Fill Helper (Sign In mode only) */}
        {!isRegisterMode && (
          <div className="mb-4 p-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#166534] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              Quick-Fill Verified Test Officer
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('LM-DL-4029', 'Password@123')}
                className="px-2.5 py-1 bg-white hover:bg-[#DCFCE7] text-[#166534] rounded-lg border border-[#86EFAC] text-[11px] font-semibold transition-colors flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3" />
                LM-DL-4029 (Vikram Sharma)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('LM-DL-8822', 'Password@123')}
                className="px-2.5 py-1 bg-white hover:bg-[#DCFCE7] text-[#166534] rounded-lg border border-[#86EFAC] text-[11px] font-semibold transition-colors flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3" />
                LM-DL-8822 (Priyanshu)
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* Login / Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegisterMode ? (
            <>
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] bg-white border border-[#CBD5E1] rounded-lg outline-none transition-all focus:border-[#0D7C66] focus:ring-2 focus:ring-[#0D7C66]/15"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="officer_vikram"
                    className="w-full px-3 py-2 text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] bg-white border border-[#CBD5E1] rounded-lg outline-none transition-all focus:border-[#0D7C66] focus:ring-2 focus:ring-[#0D7C66]/15"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Officer ID
                  </label>
                  <input
                    type="text"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    placeholder="LM-DL-4029"
                    className="w-full px-3 py-2 text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] bg-white border border-[#CBD5E1] rounded-lg outline-none transition-all focus:border-[#0D7C66] focus:ring-2 focus:ring-[#0D7C66]/15"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@maanak.gov.in"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] bg-white border border-[#CBD5E1] rounded-lg outline-none transition-all focus:border-[#0D7C66] focus:ring-2 focus:ring-[#0D7C66]/15"
                  required
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-medium text-[#334155] mb-1">
                Officer ID / Username / Email
              </label>
              <input
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="e.g. LM-DL-4029 or officer_vikram"
                className="w-full px-3.5 py-2 text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] bg-white border border-[#CBD5E1] rounded-lg outline-none transition-all focus:border-[#0D7C66] focus:ring-2 focus:ring-[#0D7C66]/15"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#334155] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-3.5 pr-10 py-2 text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] bg-white border border-[#CBD5E1] rounded-lg outline-none transition-all focus:border-[#0D7C66] focus:ring-2 focus:ring-[#0D7C66]/15"
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
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 bg-[#0D7C66] hover:bg-[#0B6B58] active:bg-[#095A4A] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 tracking-wide"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with HQ...</span>
              </>
            ) : isRegisterMode ? (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Create Officer Account</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to Terminal</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Legal Notice */}
        <div className="mt-6 text-center space-y-0.5 text-[10.5px] text-[#94A3B8] leading-tight">
          <p>Restricted access for gazetted Legal Metrology enforcement officers.</p>
          <p>Section 18 · Legal Metrology (Packaged Commodities) Rules, 2011.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
