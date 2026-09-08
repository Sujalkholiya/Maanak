import React, { useState } from 'react';
import {
  WifiOff,
  Wifi,
  RefreshCw,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UploadCloud,
  FileCheck2,
  HardDrive,
} from 'lucide-react';
import { MOCK_OFFLINE_QUEUE } from '../../data/mockData';
import { OfflineQueueItem } from '../../types';
import { DemoBadge } from '../common/DemoBadge';

interface OfflineFieldModeViewProps {
  isOffline: boolean;
  onToggleOffline: () => void;
  onNewOfflineInspection: () => void;
}

export const OfflineFieldModeView: React.FC<OfflineFieldModeViewProps> = ({
  isOffline,
  onToggleOffline,
  onNewOfflineInspection,
}) => {
  const [queue, setQueue] = useState<OfflineQueueItem[]>(MOCK_OFFLINE_QUEUE);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setQueue((prev) => prev.map((item) => ({ ...item, status: 'SYNCED' })));
      setIsSyncing(false);
    }, 1500);
  };

  const pendingCount = queue.filter((q) => q.status === 'PENDING').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-amber-600" />
              Offline Field Inspection Mode
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Resilient edge architecture for field raids in rural markets, basements, and inland container depots without cellular connectivity.
          </p>
        </div>

        {/* Toggle connection state simulator */}
        <button
          onClick={onToggleOffline}
          className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
            isOffline
              ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
              : 'bg-emerald-100 border-emerald-400 text-emerald-900'
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-4 h-4 text-amber-700" />
              <span>Simulate Reconnecting to HQ</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 text-emerald-700" />
              <span>Connected (Simulate Loss of Signal)</span>
            </>
          )}
        </button>
      </div>

      {/* Offline Status Hero Card */}
      <div
        className={`p-6 rounded-2xl border text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isOffline ? 'bg-amber-950 border-amber-800' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full inline-block animate-ping ${
                isOffline ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            ></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {isOffline ? 'OFFLINE FIELD MODE ACTIVE' : 'HQ CLOUD CONNECTIVITY RESTORED'}
            </span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {pendingCount > 0
              ? `${pendingCount} Inspections Waiting for Sync`
              : 'All Field Inspections Synchronized'}
          </h3>
          <p className="text-xs text-slate-300">
            Local SQLite database caching evidentiary frames, timestamps, and GPS coordinates securely.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncAll}
            disabled={isSyncing || pendingCount === 0}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Docket...' : 'Sync All to Central Server'}</span>
          </button>
        </div>
      </div>

      {/* Local Edge Capabilities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <Camera className="w-8 h-8 text-blue-700 shrink-0" />
          <div>
            <div className="font-bold text-slate-900">On-Device Edge OCR</div>
            <div className="text-slate-500 text-[11px]">Bilingual lightweight model active</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <HardDrive className="w-8 h-8 text-emerald-700 shrink-0" />
          <div>
            <div className="font-bold text-slate-900">Encrypted Local Vault</div>
            <div className="text-slate-500 text-[11px]">AES-256 stored in terminal RAM/SSD</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <FileCheck2 className="w-8 h-8 text-indigo-700 shrink-0" />
          <div>
            <div className="font-bold text-slate-900">Immediate Seizure Docket</div>
            <div className="text-slate-500 text-[11px]">Printable offline panchnama receipts</div>
          </div>
        </div>
      </div>

      {/* Local Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Local Inspection Synchronization Queue</h3>
          <span className="font-mono text-xs text-slate-500">
            {queue.length} Local Dockets
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {queue.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-700">{item.caseId}</span>
                  <span className="font-bold text-slate-900">{item.productName}</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Logged: {item.timestamp} · {item.imagesCount} Evidentiary Images Stored
                </div>
              </div>

              <div className="flex items-center gap-3">
                {item.status === 'SYNCED' ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    SYNCED TO HQ
                  </span>
                ) : item.status === 'SYNCING' ? (
                  <span className="inline-flex items-center gap-1 font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-300">
                    <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                    SYNCING...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    PENDING SYNC
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

