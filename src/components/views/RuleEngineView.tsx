import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { InspectionCase, RuleEvaluation } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { DemoBadge } from '../common/DemoBadge';

interface RuleEngineViewProps {
  currentCase: InspectionCase;
  onOpenXRay: () => void;
  onProceedToReview: () => void;
}

export const RuleEngineView: React.FC<RuleEngineViewProps> = ({
  currentCase,
  onOpenXRay,
  onProceedToReview,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ISSUES' | 'COMPLIANT'>('ALL');

  const rules = currentCase.rules;

  const filteredRules = rules.filter((r) => {
    if (filter === 'ISSUES') return r.status !== 'COMPLIANT';
    if (filter === 'COMPLIANT') return r.status === 'COMPLIANT';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">
              Regulatory Validation
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Statutory rule engine checking extracted declarations against the Legal Metrology (Packaged Commodities) Rules, 2011 (Amended to Gazette Version 2026.3).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenXRay}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Interactive Compliance X-Ray</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={onProceedToReview}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Officer Verification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Meta Specs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-100 p-3.5 rounded-xl border border-slate-300 text-xs">
        <div>
          <span className="text-slate-500 font-semibold">Rule Set:</span>
          <div className="font-bold text-slate-800 truncate">Packaged Commodities Rules</div>
        </div>
        <div>
          <span className="text-slate-500 font-semibold">Rule Version:</span>
          <div className="font-bold text-blue-700 font-mono">2026.3 (Current Gazette)</div>
        </div>
        <div>
          <span className="text-slate-500 font-semibold">Effective Date:</span>
          <div className="font-bold text-slate-800 font-mono">2026-01-01</div>
        </div>
        <div>
          <span className="text-slate-500 font-semibold">Regulatory Source:</span>
          <div className="font-bold text-slate-800 truncate">Central Repository (Dept of CA)</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filter === 'ALL'
                ? 'bg-blue-700 border-blue-700 text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All Evaluated Rules ({rules.length})
          </button>
          <button
            onClick={() => setFilter('ISSUES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filter === 'ISSUES'
                ? 'bg-rose-700 border-rose-700 text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Potential Issues & Verification ({rules.filter((r) => r.status !== 'COMPLIANT').length})
          </button>
          <button
            onClick={() => setFilter('COMPLIANT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filter === 'COMPLIANT'
                ? 'bg-emerald-700 border-emerald-700 text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Compliant Rules ({rules.filter((r) => r.status === 'COMPLIANT').length})
          </button>
        </div>

        <span className="text-xs text-slate-500">
          Showing {filteredRules.length} evaluated rules
        </span>
      </div>

      {/* Rule Cards */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.ruleId}
            className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
              rule.status === 'POTENTIAL_NON_COMPLIANCE'
                ? 'border-rose-300 bg-rose-50/20'
                : rule.status === 'NEEDS_HUMAN_VERIFICATION'
                ? 'border-amber-300 bg-amber-50/20'
                : 'border-slate-200'
            }`}
          >
            {/* Header: Rule ID, Title, Status */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded">
                    {rule.ruleId}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{rule.requirement}</h3>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  Statutory Clause: {rule.legalClause}
                </div>
              </div>

              <StatusBadge status={rule.status} showSubtext />
            </div>

            {/* Content 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
              {/* Left: Evidence & Validation Logic */}
              <div className="space-y-2.5">
                <div>
                  <span className="font-semibold text-slate-600 uppercase text-[10px] tracking-wider">
                    Extracted Evidentiary Snippet:
                  </span>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-800 mt-1">
                    "{rule.evidenceSnippet}"
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-600 uppercase text-[10px] tracking-wider">
                    Validation Logic:
                  </span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {rule.validationLogic}
                  </p>
                </div>
              </div>

              {/* Right: Why explanation and System Limitation */}
              <div className="space-y-2.5">
                <div>
                  <span className="font-semibold text-slate-600 uppercase text-[10px] tracking-wider">
                    Regulatory Determination Rationale:
                  </span>
                  <p className="text-slate-700 font-medium mt-1 leading-relaxed">
                    {rule.whyExplanation}
                  </p>
                </div>

                {rule.systemLimitation && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                    <span className="font-bold text-[11px]">System Limitation: </span>
                    <span className="text-[11px] leading-relaxed">{rule.systemLimitation}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer: Metadata and Action */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span>
                  Source: <strong className="text-slate-700">{rule.source}</strong>
                </span>
                <span>·</span>
                <span>
                  Version: <strong className="text-slate-700 font-mono">{rule.version}</strong>
                </span>
                <span>·</span>
                <span>
                  Confidence: <strong className="text-slate-800 font-mono">{Math.round(rule.confidence * 100)}%</strong>
                </span>
              </div>

              <button
                onClick={onOpenXRay}
                className="text-blue-700 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
              >
                Inspect on Package Canvas →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

