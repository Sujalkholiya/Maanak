import React from 'react';
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
  FileText,
  ExternalLink,
} from 'lucide-react';
import { DEMO_CASES, MOCK_RULE_LIBRARY } from '../../data/mockData';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectCase: (caseId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onSelectCase }) => {
  // Pending verification cases (3 cases requiring officer action)
  const pendingAttentionCases = DEMO_CASES.filter(
    (c) =>
      c.overallStatus === 'POTENTIAL_NON_COMPLIANCE' ||
      c.overallStatus === 'NEEDS_HUMAN_VERIFICATION'
  ).slice(0, 3);

  // Restrained status indicator (information, not decoration)
  const renderRestrainedStatus = (status: string) => {
    if (status === 'COMPLIANT' || status === 'Verified') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          Compliant
        </span>
      );
    }
    if (status === 'POTENTIAL_NON_COMPLIANCE' || status === 'Potential Non-Compliance') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
          Potential Non-Compliance
        </span>
      );
    }
    if (status === 'NEEDS_HUMAN_VERIFICATION' || status === 'Needs Review') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
          Needs Human Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ============================================================ */}
      {/* A. PAGE HEADER (Clean, Government-Grade Regulatory Center) */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Inspection Command Center
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs text-slate-500">
            <span>Real-time enforcement docket, officer adjudications, and automated rule mismatch alerts.</span>
            <span className="text-slate-300">·</span>
            <span className="font-mono text-[11px] text-slate-400">Zone-I Northern Circle</span>
            <span className="text-slate-300">·</span>
            <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              Demo Docket
            </span>
          </div>
        </div>

        {/* Primary Actions (One primary filled CTA, one secondary outline button) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('new-inspection')}
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start New Inspection</span>
          </button>
          <button
            onClick={() => onNavigate('scan-package')}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 shadow-2xs transition-colors"
          >
            <ScanLine className="w-4 h-4 text-slate-500" />
            <span>Scan Package</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* B. ACTION / ATTENTION AREA (Focused "Action Required" Panel) */}
      {/* ============================================================ */}
      <section className="bg-white rounded-xl border border-amber-200/90 shadow-2xs overflow-hidden">
        {/* Panel Header */}
        <div className="p-4 sm:p-5 border-b border-amber-100 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-200">
                  ACTION REQUIRED
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  3 cases require authorized officer verification
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Automated optical analysis flagged potential non-compliances and borderline font measurements requiring gazetted officer sign-off.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('human-verification')}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shrink-0 transition-colors shadow-2xs"
          >
            <span>Review Pending Queue (3)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Case Rows (clean, no large heavy colored boxes) */}
        <div className="divide-y divide-slate-100 p-2 sm:p-3">
          {pendingAttentionCases.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg hover:bg-slate-50/90 cursor-pointer transition-colors border-l-3"
              style={{
                borderLeftColor:
                  c.overallStatus === 'POTENTIAL_NON_COMPLIANCE' ? '#e11d48' : '#d97706',
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100 shrink-0">
                  {c.id}
                </span>
                <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                  {c.productName}
                </span>
                <span className="hidden md:inline text-[11px] text-slate-500 truncate">
                  · {c.manufacturer}
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <span
                  className={`text-xs font-medium flex items-center gap-1.5 ${
                    c.overallStatus === 'POTENTIAL_NON_COMPLIANCE'
                      ? 'text-rose-700'
                      : 'text-amber-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      c.overallStatus === 'POTENTIAL_NON_COMPLIANCE' ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                  ></span>
                  {c.overallStatus === 'POTENTIAL_NON_COMPLIANCE'
                    ? 'Potential non-compliance'
                    : 'Human verification required'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* C. KEY COMPLIANCE METRICS (Clean KPI Row with Dominant Numbers) */}
      {/* ============================================================ */}
      <section className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* KPI 1: Potential Non-Compliance */}
          <div className="p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Potential Non-Compliance
              </span>
              <span className="p-1 rounded-md bg-rose-50 text-rose-600">
                <AlertTriangle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-rose-700 tracking-tight font-mono">
                51
              </div>
              <div className="text-xs text-slate-500 mt-1">Rule/evidence mismatch detected</div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate">Top: MRP Sticker Overprint</span>
              <button
                onClick={() => onNavigate('cases')}
                className="font-semibold text-rose-700 hover:text-rose-800 hover:underline shrink-0 ml-1"
              >
                Review →
              </button>
            </div>
          </div>

          {/* KPI 2: Needs Human Review */}
          <div className="p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Needs Human Review
              </span>
              <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight font-mono">
                24
              </div>
              <div className="text-xs text-slate-500 mt-1">Insufficient optical certainty</div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate">Physical Gauge Required</span>
              <button
                onClick={() => onNavigate('human-verification')}
                className="font-semibold text-amber-700 hover:text-amber-800 hover:underline shrink-0 ml-1"
              >
                Queue →
              </button>
            </div>
          </div>

          {/* KPI 3: Compliant Packages */}
          <div className="p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Compliant Packages
              </span>
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight font-mono">
                173
              </div>
              <div className="text-xs text-slate-500 mt-1">69.8% of inspected packages</div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Checks Passed: 1,384</span>
              <span className="font-mono text-emerald-700 font-semibold">0 Offenses</span>
            </div>
          </div>

          {/* KPI 4: Total Inspected */}
          <div className="p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Total Inspected Today
              </span>
              <span className="p-1 rounded-md bg-blue-50 text-blue-600">
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
                248
              </div>
              <div className="text-xs text-slate-500 mt-1">
                <span className="text-emerald-600 font-semibold">+14.2%</span> from yesterday
              </div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Active Officers: 18</span>
              <span className="font-mono text-slate-600">Target: 250</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* D. ACTIVE INSPECTION CASES (Clean Government Case Register) */}
      {/* ============================================================ */}
      <section className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Table Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Active Inspection Cases & Docket
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any scanned packaged commodity to inspect evidence, bounding boxes, or sign off observations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('cases')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 shrink-0 self-start sm:self-auto"
          >
            <span>View Full Case Register ({DEMO_CASES.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean Case Register Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">CASE ID</th>
                <th className="py-3 px-4 font-semibold">COMMODITY</th>
                <th className="py-3 px-4 font-semibold">MANUFACTURER</th>
                <th className="py-3 px-4 font-semibold">FINDING</th>
                <th className="py-3 px-4 font-semibold">PRIORITY</th>
                <th className="py-3 px-4 font-semibold">OFFICER</th>
                <th className="py-3 px-4 text-right font-semibold">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEMO_CASES.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => onSelectCase(c.id)}
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-700 shrink-0">
                    {c.id}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                      {c.productName}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {c.category} · Batch {c.batchNo}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-normal">
                    {c.manufacturer}
                  </td>
                  <td className="py-3.5 px-4">
                    {renderRestrainedStatus(c.overallStatus)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          : c.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          : 'bg-slate-50 text-slate-600 border border-slate-200/60'
                      }`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                    {c.officer.split('(')[0]}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(c.id);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100/90 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 rounded-lg border border-slate-200/80 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Inspect Canvas</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================ */}
      {/* E & F. ANALYTICS & REGULATORY UPDATES (Secondary Visual Weight) */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inspection Activity & Throughput (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Inspection Activity & Throughput
              </h4>
              <p className="text-[11px] text-slate-500">Hourly packaging scans vs. potential non-compliance flags</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                <span className="w-2 h-2 rounded-xs bg-blue-600"></span> Total Scans
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                <span className="w-2 h-2 rounded-xs bg-rose-500"></span> Issues
              </span>
            </div>
          </div>

          <div className="pt-2">
            <div className="h-36 w-full flex items-end justify-between gap-2 px-1">
              {[
                { time: '08:00', total: 18, issues: 3 },
                { time: '09:00', total: 32, issues: 6 },
                { time: '10:00', total: 45, issues: 11 },
                { time: '11:00', total: 54, issues: 14 },
                { time: '12:00', total: 38, issues: 7 },
                { time: '13:00', total: 20, issues: 3 },
                { time: '14:00', total: 28, issues: 5 },
                { time: '15:00', total: 13, issues: 2 },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="w-full flex items-end gap-1 justify-center max-w-[32px]">
                    <div
                      className="w-1/2 bg-blue-600 rounded-t hover:bg-blue-700 transition-all"
                      style={{ height: `${(bar.total / 60) * 100}%` }}
                      title={`Total: ${bar.total}`}
                    ></div>
                    <div
                      className="w-1/2 bg-rose-500 rounded-t hover:bg-rose-600 transition-all"
                      style={{ height: `${(bar.issues / 60) * 100}%` }}
                      title={`Issues: ${bar.issues}`}
                    ></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">{bar.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Peak Enforcement Window: 10:00 – 12:00 IST</span>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Gazette Updates (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Gazette Updates (v2026.3)
                </h4>
              </div>
              <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                Current Standard
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {MOCK_RULE_LIBRARY.slice(0, 2).map((rule) => (
                <div
                  key={rule.id}
                  onClick={() => onNavigate('rule-library')}
                  className="p-3 rounded-lg border border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/80 cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-700">{rule.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{rule.effectiveFrom}</span>
                  </div>
                  <div className="font-semibold text-slate-800 mt-1 leading-snug">{rule.rule}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Repository Status: Synced</span>
            <button
              onClick={() => onNavigate('rule-library')}
              className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Browse Repository</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
