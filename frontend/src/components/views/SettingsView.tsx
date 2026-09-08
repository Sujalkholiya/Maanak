import React from 'react';
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
} from 'lucide-react';
import { DemoBadge } from '../common/DemoBadge';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-700" />
              Terminal & System Configuration
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Enforcement terminal settings, cryptographic signing credentials, and local model parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Hardware & Calibration */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Smartphone className="w-4 h-4 text-blue-700" />
            Field Terminal Diagnostics
          </div>
          <div className="space-y-2.5 text-slate-600">
            <div className="flex justify-between">
              <span>Device Model:</span>
              <span className="font-mono text-slate-900 font-semibold">T-900 Rugged Terminal</span>
            </div>
            <div className="flex justify-between">
              <span>Camera Sensor:</span>
              <span className="font-mono text-slate-900 font-semibold">Sony IMX-766 Metrology Spec</span>
            </div>
            <div className="flex justify-between">
              <span>Macro Calibrator:</span>
              <span className="text-emerald-700 font-semibold">14.8 px/mm Active</span>
            </div>
            <div className="flex justify-between">
              <span>GPS Precision:</span>
              <span className="font-mono text-slate-900">±1.2 meters (NavIC / GPS)</span>
            </div>
          </div>
        </div>

        {/* Regulatory Database */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Database className="w-4 h-4 text-blue-700" />
            Rule Database Engine
          </div>
          <div className="space-y-2.5 text-slate-600">
            <div className="flex justify-between">
              <span>Active Rule Version:</span>
              <span className="font-mono text-blue-700 font-bold">2026.3 (Gazette Synced)</span>
            </div>
            <div className="flex justify-between">
              <span>Local Model Engine:</span>
              <span className="font-mono text-slate-900">METROSCAN-Vision-Edge v4.2</span>
            </div>
            <div className="flex justify-between">
              <span>Language Models:</span>
              <span className="font-medium text-slate-900">English + Devanagari OCR</span>
            </div>
            <div className="flex justify-between">
              <span>Last Gazette Pull:</span>
              <span className="font-mono text-slate-900">2026-09-08 04:00 IST</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

