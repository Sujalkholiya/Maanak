import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  PlusCircle,
  ScanLine,
  FolderOpen,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DEMO_CASES, MOCK_RULE_LIBRARY } from '../../data/mockData';
import { StatusBadge } from '../common/StatusBadge';
import { DemoBadge } from '../common/DemoBadge';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectCase: (caseId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onSelectCase }) => {
  const pendingAttentionCases = DEMO_CASES.filter(
    (c) => c.overallStatus === 'POTENTIAL_NON_COMPLIANCE' || c.overallStatus === 'NEEDS_HUMAN_VERIFICATION'
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. PRIMARY: COMMAND HEADER & ACTIONS (Immediate 3-second focus) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Inspection Command Center
            </h1>
            <DemoBadge />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time enforcement docket, pending officer adjudications, and automated rule mismatch alerts.
          </p>
        </div>

        {/* High-Emphasis Primary CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('new-inspection')}
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Start New Inspection
          </button>
          <button
            onClick={() => onNavigate('scan-package')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <ScanLine className="w-4 h-4" />
            Scan Package
          </button>
        </div>
      </div>

      {/* 2. PRIMARY: "WHAT NEEDS MY ATTENTION?" COMMAND HERO */}
      <section className="bg-gradient-to-r from-amber-500/10 via-amber-50/60 to-white border border-amber-300/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-slate-900 text-base sm:text-lg">
                  3 Cases Require Authorized Officer Verification
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 rounded font-mono">
                  ACTION REQUIRED
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Automated computer vision detected price sticker alterations and borderline font measurements on Principal Display Panels. Final adjudication requires an authorized officer note.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('human-verification')}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 transition-colors shadow-xs"
          >
            <span>Review Pending Queue (3)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Prominent Quick-Action Cards for Urgent Cases */}
        <div className="mt-4 pt-3.5 border-t border-amber-200/80 grid grid-cols-1 md:grid-cols-3 gap-3">
          {pendingAttentionCases.slice(0, 3).map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className="bg-white hover:bg-amber-50/40 border border-amber-200 hover:border-amber-400 p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded">
                    {c.id}
                  </span>
                  <span className="text-[10px] text-slate-600">· {c.category.split('/')[0]}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 truncate mt-1 group-hover:text-blue-700 transition-colors">
                  {c.productName}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 shrink-0 transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. PRIMARY: COMPLIANCE OVERVIEW METRICS (Clear 60/30/10 hierarchy) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Enforcement Circle Compliance Overview
            </h3>
            <p className="text-xs text-slate-500">Commodities scanned across regional inspection checkpoints today</p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500">Zone-I Northern Circle</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Attention State 1: Potential Non-Compliance (High Emphasis) */}
          <div className="rounded-xl border-2 border-rose-300 bg-rose-50/40 p-4 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between text-rose-800 text-xs font-bold uppercase tracking-wider">
              <span>Potential Non-Compliance</span>
              <span className="p-1 rounded-md bg-rose-100 text-rose-700">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-rose-700 tracking-tight font-mono">51</div>
              <div className="text-xs text-rose-800 font-medium mt-0.5">
                Rule/evidence mismatch detected
              </div>
            </div>
            <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between text-[11px] text-rose-700 font-medium">
              <span>Top: MRP Sticker Overprint</span>
              <span className="font-bold underline cursor-pointer" onClick={() => onNavigate('cases')}>Review →</span>
            </div>
          </div>

          {/* Attention State 2: Human Verification Queue (High Emphasis) */}
          <div className="rounded-xl border-2 border-amber-300 bg-amber-50/40 p-4 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase tracking-wider">
              <span>Needs Human Review</span>
              <span className="p-1 rounded-md bg-amber-100 text-amber-700">
                <HelpCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-amber-700 tracking-tight font-mono">24</div>
              <div className="text-xs text-amber-800 font-medium mt-0.5">
                Insufficient optical certainty
              </div>
            </div>
            <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-amber-700 font-medium">
              <span>Physical Gauge Required</span>
              <span className="font-bold underline cursor-pointer" onClick={() => onNavigate('human-verification')}>Queue →</span>
            </div>
          </div>

          {/* Baseline State 3: Compliant Standard */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <span>Compliant Packages</span>
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-emerald-700 tracking-tight font-mono">173</div>
              <div className="text-xs text-emerald-800/80 font-medium mt-0.5">
                69.8% of inspected packages
              </div>
            </div>
            <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-700">
              <span>Checks Passed: 1,384</span>
              <span>0 Offenses</span>
            </div>
          </div>

          {/* Baseline State 4: Total Inspections */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Total Inspected Today</span>
              <span className="p-1 rounded-md bg-blue-50 text-blue-700">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-slate-900 tracking-tight font-mono">248</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                <span className="text-emerald-600 font-bold">+14.2%</span> from yesterday
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
              <span>Active Officers: 18</span>
              <span>Target: 250</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECONDARY: RECENT INSPECTIONS DOCKET (The Daily Workbench) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Inspection Cases & Docket</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any scanned packaged commodity to inspect evidence, bounding boxes, or sign off observations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('cases')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            View Full Case Register ({DEMO_CASES.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Commodity & Brand</th>
                <th className="py-3 px-4">Manufacturer</th>
                <th className="py-3 px-4">Compliance Finding</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Inspecting Officer</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEMO_CASES.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{c.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{c.productName}</div>
                    <div className="text-[11px] text-slate-500">{c.category} · Batch {c.batchNo}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{c.manufacturer}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={c.overallStatus} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : c.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {c.officer.split('(')[0]}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectCase(c.id)}
                      className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                    >
                      Inspect Canvas
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. SUPPORTING: OPERATIONAL INTELLIGENCE & ANALYTICS (Quieter Visual Weight) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Inspection Activity Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Inspection Activity & Throughput
              </h4>
              <p className="text-[11px] text-slate-500">Hourly packaging scans vs. potential non-compliance flags</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span> Total Scans
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Issues
              </span>
            </div>
          </div>

          <div className="pt-3">
            <div className="h-40 w-full flex items-end justify-between gap-2 px-1">
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
                  <div className="w-full flex items-end gap-1 justify-center max-w-[36px]">
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
            <button onClick={() => onNavigate('analytics')} className="text-blue-700 font-semibold hover:underline">
              Full Analytics →
            </button>
          </div>
        </div>

        {/* Regulatory Updates & Compliance Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Gazette Updates (v2026.3)
              </h4>
              <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                Current Standard
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {MOCK_RULE_LIBRARY.slice(0, 2).map((rule) => (
                <div
                  key={rule.id}
                  onClick={() => onNavigate('rule-library')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50 cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-800">{rule.id}</span>
                    <span className="text-[10px] text-slate-500">{rule.effectiveFrom}</span>
                  </div>
                  <div className="font-semibold text-slate-800 mt-1">{rule.rule}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Repository Status: Synced</span>
            <button
              onClick={() => onNavigate('rule-library')}
              className="text-blue-700 font-semibold hover:underline"
            >
              Browse Repository →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
