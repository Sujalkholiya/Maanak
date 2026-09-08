import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  PlusCircle,
  ScanLine,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  MapPin,
  Building2,
  FileText,
  FolderOpen,
  Check,
  Flag,
  Share2,
  X,
  Clock,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  Download,
} from 'lucide-react';
import { DEMO_CASES } from '../../data/mockData';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectCase: (caseId: string) => void;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'warning' | 'info' | 'error', undoAction?: () => void) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectCase,
  onShowToast,
}) => {
  // State for interactive work queue
  const initialCases = DEMO_CASES.filter(
    (c) =>
      c.overallStatus === 'POTENTIAL_NON_COMPLIANCE' ||
      c.overallStatus === 'NEEDS_HUMAN_VERIFICATION'
  ).slice(0, 3);

  const [queueCases, setQueueCases] = useState(initialCases);
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'High' | 'Medium'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'POTENTIAL_NON_COMPLIANCE' | 'NEEDS_HUMAN_VERIFICATION'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGuidanceDismissed, setIsGuidanceDismissed] = useState(false);

  // Time pressure / SLA metadata mapping
  const slaData: Record<string, { flaggedTime: string; slaRemaining: string; urgent: boolean }> = {
    'CASE-2026-0841': { flaggedTime: '42m ago', slaRemaining: '1h 18m', urgent: true },
    'CASE-2026-0843': { flaggedTime: '1h 10m ago', slaRemaining: '45m', urgent: true },
    'CASE-2026-0844': { flaggedTime: '2h 15m ago', slaRemaining: '2h 45m', urgent: false },
  };

  // Inline action handlers with undo capability
  const handleQuickApprove = (caseId: string) => {
    const caseObj = queueCases.find((c) => c.id === caseId);
    if (!caseObj) return;

    setQueueCases((prev) => prev.filter((c) => c.id !== caseId));
    setSelectedCaseIds((prev) => prev.filter((id) => id !== caseId));

    onShowToast?.(
      `Case ${caseId} Approved`,
      `${caseObj.productName} marked compliant with officer digital certificate.`,
      'success',
      () => {
        setQueueCases((prev) => [caseObj, ...prev]);
        onShowToast?.('Action Undone', `Case ${caseId} restored to queue.`, 'info');
      }
    );
  };

  const handleQuickFlag = (caseId: string) => {
    const caseObj = queueCases.find((c) => c.id === caseId);
    if (!caseObj) return;

    setQueueCases((prev) => prev.filter((c) => c.id !== caseId));
    setSelectedCaseIds((prev) => prev.filter((id) => id !== caseId));

    onShowToast?.(
      `Notice Issued for ${caseId}`,
      `Statutory discrepancy notice dispatched to ${caseObj.manufacturer}.`,
      'warning',
      () => {
        setQueueCases((prev) => [caseObj, ...prev]);
        onShowToast?.('Action Undone', `Case ${caseId} notice retracted.`, 'info');
      }
    );
  };

  const handleQuickEscalate = (caseId: string) => {
    const caseObj = queueCases.find((c) => c.id === caseId);
    if (!caseObj) return;

    setQueueCases((prev) => prev.filter((c) => c.id !== caseId));
    setSelectedCaseIds((prev) => prev.filter((id) => id !== caseId));

    onShowToast?.(
      `Case ${caseId} Escalated`,
      `Transferred to Zonal Controller with evidence dossier attached.`,
      'error',
      () => {
        setQueueCases((prev) => [caseObj, ...prev]);
        onShowToast?.('Action Undone', `Case ${caseId} escalation cancelled.`, 'info');
      }
    );
  };

  // Bulk actions
  const handleBulkApprove = () => {
    const count = selectedCaseIds.length;
    const removedCases = queueCases.filter((c) => selectedCaseIds.includes(c.id));
    setQueueCases((prev) => prev.filter((c) => !selectedCaseIds.includes(c.id)));
    setSelectedCaseIds([]);

    onShowToast?.(
      `Bulk Approved: ${count} Cases`,
      'Official verification certificates signed for selected commodities.',
      'success',
      () => {
        setQueueCases((prev) => [...removedCases, ...prev]);
        onShowToast?.('Bulk Action Undone', `${count} cases restored.`, 'info');
      }
    );
  };

  const handleBulkFlag = () => {
    const count = selectedCaseIds.length;
    const removedCases = queueCases.filter((c) => selectedCaseIds.includes(c.id));
    setQueueCases((prev) => prev.filter((c) => !selectedCaseIds.includes(c.id)));
    setSelectedCaseIds([]);

    onShowToast?.(
      `Bulk Flagged: ${count} Cases`,
      'Legal Metrology notices prepared for dispatch.',
      'warning',
      () => {
        setQueueCases((prev) => [...removedCases, ...prev]);
        onShowToast?.('Bulk Action Undone', `${count} cases restored.`, 'info');
      }
    );
  };

  const toggleSelectCase = (caseId: string) => {
    setSelectedCaseIds((prev) =>
      prev.includes(caseId) ? prev.filter((id) => id !== caseId) : [...prev, caseId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCaseIds.length === filteredCases.length) {
      setSelectedCaseIds([]);
    } else {
      setSelectedCaseIds(filteredCases.map((c) => c.id));
    }
  };

  // Filtering
  const filteredCases = queueCases.filter((c) => {
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && c.overallStatus !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.productName.toLowerCase().includes(q) ||
        c.manufacturer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ============================================================ */}
      {/* 1. EXECUTIVE PAGE HEADER: UNMISSABLE PRIMARY CTAs */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111413] tracking-tight">
            Inspection Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#727A78] mt-1">
            Enforcement Circle Zone-I · Real-time operational triage and active inspection queue.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('new-inspection')}
            className="inline-flex items-center gap-2 bg-[#22C2C2] hover:bg-[#1EB0B0] active:bg-[#18A0A0] text-[#0F1F1E] text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98]"
            title="Start New Guided Inspection"
          >
            <PlusCircle className="w-4 h-4 text-[#0F1F1E]" />
            <span>+ New Inspection</span>
          </button>
          <button
            onClick={() => onNavigate('scan-package')}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F7F6F3] text-[#111413] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-[#E6E4DF] hover:border-[#D5D2CA] shadow-2xs transition-all active:scale-[0.98] group"
            title="Scan Package (Hot key: S)"
          >
            <ScanLine className="w-4 h-4 text-[#727A78] group-hover:text-[#111413]" />
            <span>Scan Package</span>
            <kbd className="text-[10px] font-mono bg-[#F7F6F3] border border-[#E6E4DF] px-1.5 py-0.5 rounded text-[#727A78]">
              S
            </kbd>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. PERSISTENT "WHAT'S NEXT" GUIDANCE LAYER */}
      {/* ============================================================ */}
      {!isGuidanceDismissed && (
        <div className="bg-[#F4F3EE] border border-[#E6E4DF] border-l-4 border-l-[#22C2C2] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#22C2C2] text-[#0F1F1E] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#0E8A8A] bg-[#E8F9F9] px-2 py-0.5 rounded border border-[#22C2C2]/30">
                  RECOMMENDED NEXT ACTION
                </span>
                {queueCases.length > 0 && (
                  <span className="text-xs font-bold text-[#111413]">
                    {queueCases.length} Cases Awaiting Adjudication
                  </span>
                )}
              </div>
              <p className="text-xs text-[#3F4544] mt-1 leading-relaxed max-w-2xl">
                {queueCases.length > 0
                  ? `You have ${queueCases.length} flagged commodities requiring authorized officer review before shift completion. Clear priority cases or issue discrepancy notices inline below.`
                  : 'All urgent enforcement cases are adjudicated! Your inspection docket is clear for Zone-I Northern Circle.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {queueCases.length > 0 ? (
              <button
                onClick={() => {
                  if (queueCases[0]) {
                    onSelectCase(queueCases[0].id);
                    onNavigate('human-verification');
                  }
                }}
                className="inline-flex items-center gap-1.5 bg-[#22C2C2] hover:bg-[#1EB0B0] text-[#0F1F1E] text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
              >
                <span>Begin Triage ({queueCases.length} Left)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('scan-package')}
                className="inline-flex items-center gap-1.5 bg-[#2F7D5F] hover:bg-[#27664E] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
              >
                <span>Run Field Scan (S)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setIsGuidanceDismissed(true)}
              className="p-2 text-[#727A78] hover:text-[#111413] rounded-lg hover:bg-[#E6E4DF]/50 transition-colors"
              title="Dismiss guidance"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. ACTIONABLE METRIC CARDS (Hoverable, Clickable Entry Points) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Cases */}
        <div
          onClick={() => onNavigate('cases')}
          className="group bg-white rounded-xl border border-[#E6E4DF] hover:border-[#22C2C2] shadow-xs hover:shadow-md p-5 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#3F4544] flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-[#0E8A8A]" />
              Active Cases
            </span>
            <span className="text-[10px] font-mono font-bold text-[#0E8A8A] bg-[#E8F9F9] px-1.5 py-0.5 rounded border border-[#22C2C2]/30">
              Docket
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black text-[#111413] font-mono tracking-tight group-hover:text-[#0E8A8A] transition-colors">
              28
            </div>
            <div className="text-xs font-semibold text-[#0E8A8A] mt-1 flex items-center gap-1">
              <span>Review 5 high priority</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="text-[11px] text-[#727A78] font-mono">
            Zone-I Northern Circle
          </div>
        </div>

        {/* Card 2: Pending Verification */}
        <div
          onClick={() => onNavigate('human-verification')}
          className="group bg-white rounded-xl border border-[#E6E4DF] hover:border-[#D9A441] shadow-xs hover:shadow-md p-5 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111413] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D9A441] animate-pulse"></span>
              Pending Verification
            </span>
            <span className="p-1 rounded-md bg-[#FDF7ED] text-[#C98A2C]">
              <HelpCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black text-[#C98A2C] font-mono tracking-tight">
              {queueCases.length}
            </div>
            <div className="text-xs font-semibold text-[#C98A2C] mt-1 flex items-center gap-1">
              <span>Sign off {queueCases.length} urgent cases</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="text-[11px] text-[#727A78] font-medium">
            Requires gazetted officer stamp
          </div>
        </div>

        {/* Card 3: Today's Inspections */}
        <div
          onClick={() => onNavigate('cases')}
          className="group bg-white rounded-xl border border-[#E6E4DF] hover:border-[#2F7D5F] shadow-xs hover:shadow-md p-5 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#3F4544] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#2F7D5F]" />
              Today's Inspections
            </span>
            <span className="text-[10px] font-mono text-[#2F7D5F] font-semibold bg-[#EDF5F1] px-1.5 py-0.5 rounded border border-[#D4E8DF]">
              +14.2%
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black text-[#111413] font-mono tracking-tight group-hover:text-[#2F7D5F] transition-colors">
              248
            </div>
            <div className="text-xs font-semibold text-[#2F7D5F] mt-1 flex items-center gap-1">
              <span>View today's 248 scans</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="text-[11px] text-[#727A78] font-mono">
            Active Officers: 18 · Target: 250
          </div>
        </div>

        {/* Card 4: Compliance Rate */}
        <div
          onClick={() => onNavigate('analytics')}
          className="group bg-white rounded-xl border border-[#E6E4DF] hover:border-[#22C2C2] shadow-xs hover:shadow-md p-5 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#3F4544] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2F7D5F]" />
              Compliance Rate
            </span>
            <span className="text-[10px] font-mono text-[#727A78]">Target: 65%</span>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black text-[#2F7D5F] font-mono tracking-tight group-hover:text-[#27664E] transition-colors">
              69.8%
            </div>
            <div className="text-xs font-semibold text-[#0E8A8A] mt-1 flex items-center gap-1">
              <span>Explore rule benchmarks</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="text-[11px] text-[#2F7D5F] font-medium">
            1,384 statutory checks passed
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. REAL WORK QUEUE: TRIAGE, SORT, INLINE ACTIONS & BULK WORK */}
      {/* ============================================================ */}
      <section className="bg-white rounded-xl border border-[#E6E4DF] shadow-xs overflow-hidden">
        {/* Queue Header & Filter Triage Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E6E4DF] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FDF7ED] text-[#C98A2C] flex items-center justify-center border border-[#F5E5C9] shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#111413]">Prioritized Action Queue</h2>
                  <span className="text-[10px] font-mono font-bold text-[#C98A2C] bg-[#FDF7ED] px-2 py-0.5 rounded border border-[#F5E5C9]">
                    {queueCases.length} Active Work Items
                  </span>
                </div>
                <p className="text-xs text-[#727A78] mt-0.5">
                  Execute inline approvals, flag notices, or escalate with zero page-loads.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => onNavigate('human-verification')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E8A8A] hover:text-[#096666] bg-[#E8F9F9] px-3 py-1.5 rounded-lg border border-[#22C2C2]/30 transition-colors"
              >
                <span>Open Full Officer Review</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Triage Controls: Filters & Search */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E6E4DF] text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={toggleSelectAll}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E6E4DF] hover:bg-[#F7F6F3] text-[#3F4544] font-semibold"
                title="Select all cases for bulk action"
              >
                {selectedCaseIds.length > 0 && selectedCaseIds.length === filteredCases.length ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#0E8A8A]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-[#727A78]" />
                )}
                <span>Select All</span>
              </button>

              <div className="h-4 w-[1px] bg-[#E6E4DF] mx-1"></div>

              {/* Priority Filters */}
              <div className="flex items-center gap-1 bg-[#F4F3EE] p-0.5 rounded-lg border border-[#E6E4DF]">
                {(['ALL', 'High', 'Medium'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-colors ${
                      priorityFilter === p ? 'bg-white text-[#111413] shadow-2xs' : 'text-[#727A78] hover:text-[#111413]'
                    }`}
                  >
                    {p === 'ALL' ? 'All Priority' : `${p} Priority`}
                  </button>
                ))}
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1 bg-[#F4F3EE] p-0.5 rounded-lg border border-[#E6E4DF]">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-colors ${
                    statusFilter === 'ALL' ? 'bg-white text-[#111413] shadow-2xs' : 'text-[#727A78] hover:text-[#111413]'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setStatusFilter('POTENTIAL_NON_COMPLIANCE')}
                  className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-colors ${
                    statusFilter === 'POTENTIAL_NON_COMPLIANCE' ? 'bg-white text-[#C1443A] shadow-2xs' : 'text-[#727A78] hover:text-[#111413]'
                  }`}
                >
                  Issues Only
                </button>
                <button
                  onClick={() => setStatusFilter('NEEDS_HUMAN_VERIFICATION')}
                  className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-colors ${
                    statusFilter === 'NEEDS_HUMAN_VERIFICATION' ? 'bg-white text-[#C98A2C] shadow-2xs' : 'text-[#727A78] hover:text-[#111413]'
                  }`}
                >
                  Verification
                </button>
              </div>
            </div>

            {/* In-Queue Search Filter */}
            <div className="w-full sm:w-48">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by product, ID..."
                className="w-full px-2.5 py-1 text-xs border border-[#E6E4DF] rounded-lg outline-none focus:border-[#22C2C2] bg-[#F7F6F3] focus:bg-white text-[#111413]"
              />
            </div>
          </div>
        </div>

        {/* Floating Bulk Action Bar (appears when cases are selected) */}
        {selectedCaseIds.length > 0 && (
          <div className="bg-[#0F1F1E] text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top-2 duration-150 border-b border-[#1E3836]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C2C2]"></span>
              <span className="font-bold">{selectedCaseIds.length} Cases Selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkApprove}
                className="inline-flex items-center gap-1 bg-[#2F7D5F] hover:bg-[#27664E] text-white font-bold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                title="Bulk Approve and stamp selected cases"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Bulk Approve</span>
              </button>

              <button
                onClick={handleBulkFlag}
                className="inline-flex items-center gap-1 bg-[#C98A2C] hover:bg-[#A87222] text-white font-bold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                title="Bulk Flag notices for selected cases"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Bulk Flag</span>
              </button>

              <button
                onClick={() => {
                  onShowToast?.(
                    'Dossier Export Generated',
                    `PDF evidence compiled for ${selectedCaseIds.length} commodities.`,
                    'info'
                  );
                }}
                className="inline-flex items-center gap-1 bg-[#1A2E2C] hover:bg-[#233D3A] text-[#C2C9C8] font-semibold px-2.5 py-1.5 rounded-lg transition-colors border border-[#1E3836]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </button>

              <button
                onClick={() => setSelectedCaseIds([])}
                className="p-1.5 text-[#727A78] hover:text-white rounded transition-colors"
                title="Clear selection"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Action Queue Case Rows */}
        {filteredCases.length > 0 ? (
          <div className="divide-y divide-[#E6E4DF]">
            {filteredCases.map((c) => {
              const isSelected = selectedCaseIds.includes(c.id);
              const sla = slaData[c.id] || { flaggedTime: '1h ago', slaRemaining: '2h', urgent: false };

              return (
                <div
                  key={c.id}
                  className={`p-4 sm:p-5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${
                    isSelected ? 'bg-[#E8F9F9]/40' : 'hover:bg-[#F7F6F3] bg-white'
                  }`}
                  style={{
                    borderLeftColor:
                      c.overallStatus === 'POTENTIAL_NON_COMPLIANCE' ? '#C1443A' : '#C98A2C',
                  }}
                >
                  {/* Left Column: Checkbox, Case ID, SLA Badge, Details */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Checkbox with Minimum 44px Touch Target */}
                    <button
                      onClick={() => toggleSelectCase(c.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F7F6F3] text-[#727A78] shrink-0 mt-0.5"
                      title={isSelected ? 'Deselect case' : 'Select case'}
                      aria-label="Select case"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#0E8A8A]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#D5D2CA]" />
                      )}
                    </button>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      {/* Top Badges & SLA Indicator */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0E8A8A] bg-[#E8F9F9] px-2 py-0.5 rounded border border-[#22C2C2]/30">
                          {c.id}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            c.priority === 'High'
                              ? 'bg-[#FBF0EF] text-[#C1443A] border border-[#F4D6D4]'
                              : 'bg-[#FDF7ED] text-[#C98A2C] border border-[#F5E5C9]'
                          }`}
                        >
                          {c.priority} Priority
                        </span>

                        {/* SLA / Time Pressure Urgency Indicator */}
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
                            sla.urgent
                              ? 'bg-[#FBF0EF] text-[#C1443A] border-[#F4D6D4] font-bold'
                              : 'bg-[#F7F6F3] text-[#727A78] border-[#E6E4DF]'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>SLA: {sla.slaRemaining} left</span>
                          <span className="text-[#727A78]">({sla.flaggedTime})</span>
                        </span>

                        <span className="text-xs text-[#727A78] hidden sm:inline">
                          {c.category}
                        </span>
                      </div>

                      {/* Product Name */}
                      <div className="font-bold text-sm text-[#111413] leading-tight">
                        {c.productName}
                      </div>

                      {/* Manufacturer and Finding Summary */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#3F4544]">
                        <span>
                          Manufacturer: <strong className="text-[#111413] font-semibold">{c.manufacturer}</strong>
                        </span>
                        <span className="text-[#E6E4DF]">·</span>
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              c.overallStatus === 'POTENTIAL_NON_COMPLIANCE'
                                ? 'bg-[#C1443A]'
                                : 'bg-[#C98A2C]'
                            }`}
                          ></span>
                          <span
                            className={
                              c.overallStatus === 'POTENTIAL_NON_COMPLIANCE'
                                ? 'text-[#C1443A] font-semibold'
                                : 'text-[#C98A2C] font-semibold'
                            }
                          >
                            {c.overallStatus === 'POTENTIAL_NON_COMPLIANCE'
                              ? 'MRP Sticker Alteration Flagged'
                              : 'Borderline Font Measurement'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Inline One-Click Triage + Deeper Inspection */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0">
                    {/* Inline Quick Action 1: Approve (Min 44x44 target) */}
                    <button
                      onClick={() => handleQuickApprove(c.id)}
                      className="h-10 px-3 bg-[#EDF5F1] hover:bg-[#D4E8DF] text-[#2F7D5F] rounded-xl font-bold text-xs flex items-center gap-1.5 border border-[#D4E8DF] transition-colors shadow-2xs active:scale-95"
                      title="Quick Approve: Mark compliant with digital stamp"
                      aria-label="Approve case"
                    >
                      <Check className="w-4 h-4 text-[#2F7D5F]" />
                      <span>Approve</span>
                    </button>

                    {/* Inline Quick Action 2: Flag Notice (Min 44x44 target) */}
                    <button
                      onClick={() => handleQuickFlag(c.id)}
                      className="h-10 px-3 bg-[#FDF7ED] hover:bg-[#F5E5C9] text-[#C98A2C] rounded-xl font-bold text-xs flex items-center gap-1.5 border border-[#F5E5C9] transition-colors shadow-2xs active:scale-95"
                      title="Issue Legal Metrology Notice"
                      aria-label="Flag violation notice"
                    >
                      <Flag className="w-3.5 h-3.5 text-[#C98A2C]" />
                      <span>Flag Notice</span>
                    </button>

                    {/* Inline Quick Action 3: Escalate */}
                    <button
                      onClick={() => handleQuickEscalate(c.id)}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#F7F6F3] hover:bg-[#FBF0EF] text-[#3F4544] hover:text-[#C1443A] border border-[#E6E4DF] hover:border-[#F4D6D4] transition-colors"
                      title="Escalate to Controller"
                      aria-label="Escalate case"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Deep Review CTA */}
                    <button
                      onClick={() => {
                        onSelectCase(c.id);
                        onNavigate('compliance-xray');
                      }}
                      className="h-10 px-3.5 text-xs font-bold text-[#0F1F1E] bg-[#22C2C2] hover:bg-[#1EB0B0] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 ml-1"
                      title="Open Interactive X-Ray Canvas"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0F1F1E]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty / Cleared Work Queue State */
          <div className="p-12 text-center space-y-3 bg-[#FAF9F6]">
            <div className="w-12 h-12 rounded-full bg-[#EDF5F1] text-[#2F7D5F] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#111413]">
              Work Queue Cleared!
            </h3>
            <p className="text-xs text-[#727A78] max-w-sm mx-auto">
              All flagged items in Zone-I have been resolved or dispatched. New scans will appear here automatically.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('scan-package')}
                className="inline-flex items-center gap-2 bg-[#22C2C2] hover:bg-[#1EB0B0] text-[#0F1F1E] text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
              >
                <ScanLine className="w-4 h-4 text-[#0F1F1E]" />
                <span>Scan New Package (S)</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer: Case Register Link */}
        <div className="p-4 bg-[#FAF9F6] border-t border-[#E6E4DF] flex items-center justify-between text-xs">
          <span className="text-[#727A78]">
            Showing {filteredCases.length} items in active triage queue
          </span>
          <button
            onClick={() => onNavigate('cases')}
            className="font-semibold text-[#0E8A8A] hover:text-[#096666] flex items-center gap-1"
          >
            <span>View Full Case Register ({DEMO_CASES.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. GOVERNANCE & DEEP INTELLIGENCE ACCESS */}
      {/* ============================================================ */}
      <section className="bg-[#F4F3EE] rounded-xl border border-[#E6E4DF] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-[#111413] uppercase tracking-wider">
            Governance & Operational Intelligence
          </h3>
          <p className="text-xs text-[#727A78] mt-0.5">
            Deep historical reporting, manufacturer profiles, and geographic heatmaps are organized in Tier 3.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('analytics')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#FAF9F6] text-[#3F4544] rounded-lg text-xs font-semibold border border-[#E6E4DF] transition-colors shadow-2xs"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#0E8A8A]" />
            <span>Compliance Analytics</span>
          </button>
          <button
            onClick={() => onNavigate('heatmap')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#FAF9F6] text-[#3F4544] rounded-lg text-xs font-semibold border border-[#E6E4DF] transition-colors shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5 text-[#C1443A]" />
            <span>Geographic Heatmap</span>
          </button>
          <button
            onClick={() => onNavigate('manufacturers')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#FAF9F6] text-[#3F4544] rounded-lg text-xs font-semibold border border-[#E6E4DF] transition-colors shadow-2xs"
          >
            <Building2 className="w-3.5 h-3.5 text-[#C98A2C]" />
            <span>Manufacturers</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#FAF9F6] text-[#3F4544] rounded-lg text-xs font-semibold border border-[#E6E4DF] transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#727A78]" />
            <span>Reports</span>
          </button>
        </div>
      </section>
    </div>
  );
};
