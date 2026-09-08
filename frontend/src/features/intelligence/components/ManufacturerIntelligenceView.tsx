import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Calendar,
  Layers,
  ChevronRight,
  Shield,
  FileText,
} from 'lucide-react';
import { MOCK_MANUFACTURERS } from '../../../data/mockData';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { DemoBadge } from '../../../components/common/DemoBadge';

export const ManufacturerIntelligenceView: React.FC = () => {
  const [selectedMfrId, setSelectedMfrId] = useState<string>('MFR-001');

  const mfr =
    MOCK_MANUFACTURERS.find((m) => m.id === selectedMfrId) || MOCK_MANUFACTURERS[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-700" />
              Manufacturer Intelligence & Pattern Detection
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Historical compliance analytics across inspected packaging lines. Neutral evidentiary tracking of recurring declaration formats.
          </p>
        </div>

        {/* Switch Manufacturer */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Entity:</span>
          <select
            value={selectedMfrId}
            onChange={(e) => setSelectedMfrId(e.target.value)}
            className="py-1.5 px-3 rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-800"
          >
            {MOCK_MANUFACTURERS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Manufacturer Profile Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {mfr.registrationNo}
              </span>
              <span className="text-xs text-slate-400">Registered Packer Entity</span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">{mfr.name}</h3>
            <p className="text-xs text-slate-300 mt-0.5">{mfr.address}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Overall Compliance Rate
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {mfr.complianceRate}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Products Inspected
          </div>
          <div className="text-3xl font-black text-slate-900 mt-1 font-mono">
            {mfr.productsInspected}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Packaged commodity SKUs</div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-rose-200 shadow-xs">
          <div className="text-xs font-bold text-rose-800 uppercase tracking-wider">
            Potential Findings
          </div>
          <div className="text-3xl font-black text-rose-700 mt-1 font-mono">
            {mfr.potentialFindings}
          </div>
          <div className="text-[11px] text-rose-700 mt-1">Automated vision detections</div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-amber-200 shadow-xs">
          <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            Verified Findings
          </div>
          <div className="text-3xl font-black text-amber-700 mt-1 font-mono">
            {mfr.verifiedFindings}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">Confirmed by authorized officers</div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-blue-200 shadow-xs">
          <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">
            Recurring Issue Patterns
          </div>
          <div className="text-3xl font-black text-blue-700 mt-1 font-mono">
            {mfr.recurringIssues}
          </div>
          <div className="text-[11px] text-blue-700 mt-1">Identified across multiple batches</div>
        </div>
      </div>

      {/* 6-Month Timeline of Compliance */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              6-Month Inspection & Finding Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Monthly audit trend across enforcement circles
            </p>
          </div>
          <DemoBadge label="Demonstration Trend" />
        </div>

        {/* Timeline Horizontal Chain */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
          {mfr.timeline.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-center space-y-1 ${
                item.status === 'COMPLIANT'
                  ? 'bg-emerald-50 border-emerald-200'
                  : item.status === 'POTENTIAL_NON_COMPLIANCE'
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-600">{item.month}</div>
              <div className="text-sm font-black font-mono">
                {item.findingsCount > 0 ? (
                  <span className="text-rose-700">{item.findingsCount} Issues</span>
                ) : (
                  <span className="text-emerald-700">0 Issues</span>
                )}
              </div>
              <div className="text-[10px] font-semibold text-slate-500">
                {item.status === 'COMPLIANT'
                  ? 'Compliant'
                  : item.status === 'POTENTIAL_NON_COMPLIANCE'
                  ? 'Finding'
                  : 'Review'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Neutral Recurring Pattern Analytics Panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Recurring Compliance Patterns (Not Fraud Categorization)
            </h3>
            <p className="text-xs text-slate-500">
              Statistical clustering of repetitive labeling issues across SKU variants
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {mfr.recurringPatterns.length} Patterns Tracked
          </span>
        </div>

        <div className="space-y-3">
          {mfr.recurringPatterns.map((pat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                    {pat.count} Cases
                  </span>
                  <span className="font-bold text-sm text-slate-900">{pat.category}</span>
                </div>
                <span className="font-mono text-slate-500 text-[11px]">
                  Sample Rule: {pat.sampleRule}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {pat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2">
          <Shield className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Investigative Guidance:</span> Repeated finding patterns allow enforcement officers to schedule joint factory audits under Rule 29 rather than treating each retail retail-shelf occurrence as an isolated event.
          </div>
        </div>
      </div>
    </div>
  );
};

