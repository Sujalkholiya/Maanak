import React, { useState, useEffect } from 'react';
import {
  History,
  Shield,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  User,
  Cpu,
  ArrowDown,
  RefreshCw,
} from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '../../../data/mockData';
import { useInspectionCase } from '../../../hooks/useInspectionCase';
import { caseService } from '../../../services/caseService';

export const AuditTrailView: React.FC = () => {
  const { allCases } = useInspectionCase();
  const [selectedCaseFilter, setSelectedCaseFilter] = useState('ALL');
  const [selectedActorFilter, setSelectedActorFilter] = useState('ALL');
  const [auditLogs, setAuditLogs] = useState<any[]>(MOCK_AUDIT_LOGS);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const liveLogs = await caseService.getAuditTrail();
      if (liveLogs && liveLogs.length > 0) {
        setAuditLogs(liveLogs);
      }
    } catch (e) {
      console.warn('Failed to load audit trail:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [allCases.length]);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesCase =
      selectedCaseFilter === 'ALL' || log.caseId === selectedCaseFilter;
    const matchesActor =
      selectedActorFilter === 'ALL' ||
      (selectedActorFilter === 'OFFICER' && !log.actor.includes('Engine')) ||
      (selectedActorFilter === 'SYSTEM' && log.actor.includes('Engine'));
    return matchesCase && matchesActor;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-700" />
              Immutable Enforcement Audit Trail
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-300">
              Live Chained Records
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Complete sequential evidentiary event log. Every capture, OCR transformation, statutory evaluation, and officer sign-off is cryptographically recorded.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Logs
          </button>
          <span className="font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 font-bold flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            Append-Only Integrity Log
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Case Docket:</span>
            <select
              value={selectedCaseFilter}
              onChange={(e) => setSelectedCaseFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium outline-none"
            >
              <option value="ALL">All Recorded Cases ({allCases.length} active in DB)</option>
              {allCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseId || c.id} — {c.productName.slice(0, 30)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Actor Type:</span>
            <select
              value={selectedActorFilter}
              onChange={(e) => setSelectedActorFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium outline-none"
            >
              <option value="ALL">All Actors</option>
              <option value="OFFICER">Authorized Officers Only</option>
              <option value="SYSTEM">Automated System Engines Only</option>
            </select>
          </div>
        </div>

        <span className="font-mono text-slate-500 font-semibold">
          Showing {filteredLogs.length} verified events
        </span>
      </div>

      {/* Timeline Chained Events */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {filteredLogs.map((ev) => {
            const isOfficer = !ev.actor.includes('Engine');

            return (
              <div key={ev.id} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isOfficer
                      ? 'bg-blue-600 border-white text-white shadow-sm'
                      : 'bg-slate-800 border-white text-cyan-300 shadow-sm'
                  }`}
                >
                  {isOfficer ? (
                    <User className="w-3 h-3" />
                  ) : (
                    <Cpu className="w-3 h-3" />
                  )}
                </div>

                {/* Event Card */}
                <div className="bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200 p-4 transition-colors text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {ev.action}
                      </span>
                      <span className="font-mono text-blue-700 font-semibold">{ev.caseId}</span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500">
                      {ev.timestamp}
                    </div>
                  </div>

                  <p className="text-slate-800 font-medium leading-relaxed">
                    {ev.details}
                  </p>

                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div>
                      Actor: <strong className="text-slate-700">{ev.actor}</strong> ({ev.actorRole})
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 truncate max-w-xs">
                      IP: {ev.ipAddress || '10.42.12.89'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuditTrailView;
