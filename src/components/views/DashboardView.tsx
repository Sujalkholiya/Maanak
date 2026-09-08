import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  PlusCircle,
  ScanLine,
  FileText,
  FolderOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Calendar,
  Layers,
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Title and Demo Tag */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Inspection Command Center
            </h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Monitor inspections, compliance findings, pending verification and regulatory updates across regional enforcement circles.
          </p>
        </div>

        {/* Quick Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('new-inspection')}
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            New Inspection
          </button>
          <button
            onClick={() => onNavigate('scan-package')}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
          >
            <ScanLine className="w-4 h-4" />
            Scan Package
          </button>
        </div>
      </div>

      {/* Top KPI Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Inspections Today */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Inspections Today</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight">248</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-600 font-semibold">+14.2%</span> from yesterday
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Active Circles: 18</span>
            <span>Target: 250</span>
          </div>
        </div>

        {/* Card 2: Compliant */}
        <div className="bg-white rounded-xl border border-emerald-200/80 p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            <span>Compliant</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-emerald-700 tracking-tight">173</div>
            <div className="text-xs text-emerald-800/80 mt-1">
              69.8% of scanned commodities
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-700">
            <span>Checks Performed: 1,384</span>
            <span>0 Violations</span>
          </div>
        </div>

        {/* Card 3: Potential Non-Compliance */}
        <div className="bg-white rounded-xl border border-rose-200/80 p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-800 text-xs font-semibold uppercase tracking-wider">
            <span>Potential Non-Compliance</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-rose-700 tracking-tight">51</div>
            <div className="text-xs text-rose-800/80 mt-1">
              Rule/evidence mismatch detected
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-rose-100 flex items-center justify-between text-[11px] text-rose-700">
            <span>Top Issue: MRP Alteration (26)</span>
            <span className="font-semibold">Notice Drafting</span>
          </div>
        </div>

        {/* Card 4: Human Review */}
        <div className="bg-white rounded-xl border border-amber-200/80 p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold uppercase tracking-wider">
            <span>Needs Human Review</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <HelpCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-amber-700 tracking-tight">24</div>
            <div className="text-xs text-amber-800/80 mt-1">
              Insufficient digital optical certainty
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px] text-amber-700">
            <span>Physical Gauge Recommended</span>
            <span className="font-semibold">Action Required</span>
          </div>
        </div>
      </div>

      {/* Prominent "Needs Attention" Panel */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/30 border border-amber-300 rounded-xl p-4.5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  3 Cases Require Authorized Officer Verification
                </span>
                <span className="px-2 py-0.2 text-[10px] font-bold bg-amber-200 text-amber-900 rounded">
                  High Priority
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Automated vision detected discrepancies on price stickers and borderline font measurements on Principal Display Panels. Final adjudication requires an authorized officer note.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('human-verification')}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shrink-0 transition-colors shadow-xs"
          >
            Review Pending Queue (3)
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mini Preview of Pending Attention Cases */}
        <div className="mt-3.5 pt-3 border-t border-amber-200/60 grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {pendingAttentionCases.slice(0, 3).map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className="bg-white/90 border border-amber-200 hover:border-amber-400 p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] font-bold text-slate-800">{c.id}</span>
                  <span className="text-[10px] text-slate-500">· {c.category.split('/')[0]}</span>
                </div>
                <div className="text-xs font-semibold text-slate-700 truncate">{c.productName}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Analytics & Compliance Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inspection Activity Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Inspection Activity Today</h2>
              <p className="text-xs text-slate-500">Hourly throughput across enforcement inspection terminals</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span> Scans
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Potential Issues
              </span>
            </div>
          </div>

          {/* Clean SVG Bar Chart representation */}
          <div className="pt-4">
            <div className="h-48 w-full flex items-end justify-between gap-2 px-2">
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
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.total}
                  </div>
                  <div className="w-full flex items-end gap-1 justify-center max-w-[40px]">
                    <div
                      className="w-1/2 bg-blue-600 rounded-t hover:bg-blue-700 transition-all"
                      style={{ height: `${(bar.total / 60) * 100}%` }}
                      title={`Total Scans: ${bar.total}`}
                    ></div>
                    <div
                      className="w-1/2 bg-rose-500 rounded-t hover:bg-rose-600 transition-all"
                      style={{ height: `${(bar.issues / 60) * 100}%` }}
                      title={`Potential Issues: ${bar.issues}`}
                    ></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1">{bar.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Peak Activity Window: 10:00 – 12:00 IST</span>
            <span className="text-blue-700 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('analytics')}>
              View Full Compliance Analytics →
            </span>
          </div>
        </div>

        {/* Compliance Distribution (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Compliance Distribution</h2>
              <DemoBadge label="Demo" />
            </div>

            {/* Visual breakdown bars */}
            <div className="mt-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Compliant (173)
                  </span>
                  <span className="font-mono text-slate-700">69.8%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '69.8%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Potential Non-Compliance (51)
                  </span>
                  <span className="font-mono text-slate-700">20.5%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '20.5%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-amber-800 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    Human Verification (24)
                  </span>
                  <span className="font-mono text-slate-700">9.7%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '9.7%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">Rule Engine Version:</span> 2026.3
            <p className="text-[11px] text-slate-500 mt-0.5">
              All compliance evaluations reflect gazetted amendments up to September 2026.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Cases & Regulatory Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Inspection Cases</h2>
              <p className="text-xs text-slate-500">Live feed of scanned packaged commodities</p>
            </div>
            <button
              onClick={() => onNavigate('cases')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              View All Cases ({DEMO_CASES.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Commodity & Brand</th>
                  <th className="py-2.5 px-3">Manufacturer</th>
                  <th className="py-2.5 px-3">Compliance Finding</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DEMO_CASES.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{c.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{c.productName}</div>
                      <div className="text-[11px] text-slate-500">{c.category}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{c.manufacturer}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={c.overallStatus} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectCase(c.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded border border-slate-300 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regulatory Updates Feed (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Regulatory Updates</h2>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Active v2026.3
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {MOCK_RULE_LIBRARY.slice(0, 3).map((rule) => (
                <div
                  key={rule.id}
                  onClick={() => onNavigate('rule-library')}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue-800">{rule.id}</span>
                    <span className="text-[10px] text-slate-500">{rule.effectiveFrom}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">{rule.rule}</div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{rule.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('rule-library')}
              className="w-full text-center py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Browse Complete Versioned Rule Repository →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

