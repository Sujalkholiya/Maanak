import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Database,
  Cpu,
  RefreshCw,
  HardDrive,
  Key,
  Smartphone,
  CheckCircle2,
  XCircle,
  Activity,
  Server,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../../app/providers/AuthContext';
import { api } from '../../../services/api';
import { useToast } from '../../../hooks/useToast';

export const SettingsView: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const testBackendConnection = async () => {
    setIsPinging(true);
    const start = Date.now();
    try {
      await api.get('/rules');
      const diff = Date.now() - start;
      setBackendStatus('connected');
      setLatencyMs(diff);
      showToast('Backend Connected', `Response received in ${diff} ms from http://localhost:3000`, 'success');
    } catch {
      setBackendStatus('error');
      setLatencyMs(null);
      showToast('Backend Unreachable', 'Could not communicate with port 3000', 'error');
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    testBackendConnection();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-700" />
              Terminal & System Configuration
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-300">
              Operational Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Enforcement terminal settings, backend API server status, cryptographic signing credentials, and active officer session.
          </p>
        </div>

        <button
          onClick={testBackendConnection}
          disabled={isPinging}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          <span>Test API Ping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Backend API Server Telemetry */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Server className="w-4 h-4 text-blue-700" />
              Backend API & Database Status
            </div>
            {backendStatus === 'connected' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Online
              </span>
            ) : backendStatus === 'checking' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                Checking...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-300">
                <XCircle className="w-3 h-3 text-rose-600" /> Offline
              </span>
            )}
          </div>

          <div className="space-y-2.5 text-slate-600">
            <div className="flex justify-between">
              <span>API Gateway:</span>
              <span className="font-mono text-slate-900 font-semibold">http://localhost:3000</span>
            </div>
            <div className="flex justify-between">
              <span>Database Cluster:</span>
              <span className="font-mono text-slate-900 font-semibold">MongoDB Atlas (Maanak DB)</span>
            </div>
            <div className="flex justify-between">
              <span>Round-Trip Latency:</span>
              <span className="font-mono font-bold text-emerald-700">
                {latencyMs !== null ? `${latencyMs} ms` : 'Testing...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>CORS Policy:</span>
              <span className="text-slate-900 font-medium">Credentials Enabled (Port 5173 ↔ 3000)</span>
            </div>
          </div>
        </div>

        {/* Active Officer Authentication Profile */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <UserCheck className="w-4 h-4 text-blue-700" />
              Active Officer Profile
            </div>
            <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
              {user?.role || 'Officer'}
            </span>
          </div>

          <div className="space-y-2.5 text-slate-600">
            <div className="flex justify-between">
              <span>Officer Name:</span>
              <span className="font-bold text-slate-900">{user?.fullName || user?.userName || 'Vikram Sharma'}</span>
            </div>
            <div className="flex justify-between">
              <span>Officer ID:</span>
              <span className="font-mono font-bold text-blue-800">{user?.officerId || 'LM-DL-4029'}</span>
            </div>
            <div className="flex justify-between">
              <span>Official Email:</span>
              <span className="font-mono text-slate-800">{user?.email || 'officer.vikram@maanak.gov.in'}</span>
            </div>
            <div className="flex justify-between">
              <span>Enforcement Division:</span>
              <span className="text-slate-900 font-medium">{user?.department || 'Legal Metrology Enforcement Division'}</span>
            </div>
          </div>
        </div>

        {/* Regulatory Rule Engine Specification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Database className="w-4 h-4 text-blue-700" />
            Statutory Rule Database Engine
          </div>
          <div className="space-y-2.5 text-slate-600">
            <div className="flex justify-between">
              <span>Active Rule Library:</span>
              <span className="font-mono text-blue-700 font-bold">Ver. 2026.3 (Schedule II Synced)</span>
            </div>
            <div className="flex justify-between">
              <span>Statutory Basis:</span>
              <span className="text-slate-900 font-medium">Legal Metrology Act, 2009 · Section 18</span>
            </div>
            <div className="flex justify-between">
              <span>Automated Clauses:</span>
              <span className="font-mono text-slate-900">Rule 6(1)(a)-(ma), Rule 7, Rule 9, Rule 18(2)</span>
            </div>
            <div className="flex justify-between">
              <span>Enforcement Standard:</span>
              <span className="text-emerald-700 font-semibold">Deterministic Legal Decisioning</span>
            </div>
          </div>
        </div>

        {/* Field Terminal Hardware Calibration */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Smartphone className="w-4 h-4 text-blue-700" />
            Field Terminal Diagnostics
          </div>
          <div className="space-y-2.5 text-slate-600">
            <div className="flex justify-between">
              <span>Device Model:</span>
              <span className="font-mono text-slate-900 font-semibold">T-900 Rugged Enforcement Terminal</span>
            </div>
            <div className="flex justify-between">
              <span>Vision Engine:</span>
              <span className="font-mono text-slate-900 font-semibold">Tesseract.js OCR v5 + Metrology Heuristics</span>
            </div>
            <div className="flex justify-between">
              <span>Macro Calibrator:</span>
              <span className="text-emerald-700 font-semibold">14.8 px/mm Active (Rule 9 Calibrated)</span>
            </div>
            <div className="flex justify-between">
              <span>GPS Telemetry:</span>
              <span className="font-mono text-slate-900">NavIC / GPS ±1.2m Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
