import React, { useState } from 'react';
import {
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Maximize2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { InspectionCase } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { DemoBadge } from '../../../components/common/DemoBadge';

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
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  const rules = currentCase.rules;

  const filteredRules = rules.filter((r) => {
    if (filter === 'ISSUES') return r.status !== 'COMPLIANT';
    if (filter === 'COMPLIANT') return r.status === 'COMPLIANT';
    return true;
  });

  const issuesCount = rules.filter((r) => r.status !== 'COMPLIANT').length;
  const compliantCount = rules.filter((r) => r.status === 'COMPLIANT').length;

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-8">
      {/* 1. CLEAN HEADER */}
      <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              4. Rule Validation Engine
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluating extracted package evidence against Legal Metrology (Packaged Commodities) Rules, 2011 (Gazette v2026.3).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenXRay}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive X-Ray</span>
          </button>
          <button
            onClick={onProceedToReview}
            className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Proceed to Officer Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. SLIM METADATA BAR */}
      <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <span className="text-slate-400 font-medium">Standard: </span>
            <strong className="text-slate-700">Packaged Commodities Rules</strong>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            <span className="text-slate-400 font-medium">Gazette Version: </span>
            <strong className="text-blue-700 font-mono">v2026.3</strong>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            <span className="text-slate-400 font-medium">Effective: </span>
            <strong className="text-slate-700 font-mono">2026-01-01</strong>
          </div>
        </div>

        {/* Segmented Filter Control */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              filter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({rules.length})
          </button>
          <button
            onClick={() => setFilter('ISSUES')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
              filter === 'ISSUES'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Issues ({issuesCount})
          </button>
          <button
            onClick={() => setFilter('COMPLIANT')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
              filter === 'COMPLIANT'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Compliant ({compliantCount})
          </button>
        </div>
      </div>

      {/* 3. RULE CARDS (Progressive disclosure: collapsed by default, white card, left-border accent only) */}
      <div className="space-y-2.5">
        {filteredRules.map((rule) => {
          const isExpanded = expandedRuleId === rule.ruleId;

          const leftAccentBorder =
            rule.status === 'COMPLIANT'
              ? 'border-l-4 border-l-emerald-500'
              : rule.status === 'POTENTIAL_NON_COMPLIANCE'
              ? 'border-l-4 border-l-rose-500'
              : 'border-l-4 border-l-amber-500';

          return (
            <div
              key={rule.ruleId}
              className={`bg-white rounded-xl border border-slate-200 shadow-xs transition-all ${leftAccentBorder}`}
            >
              {/* Collapsed Header / Summary Row */}
              <div
                onClick={() => setExpandedRuleId(isExpanded ? null : rule.ruleId)}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer hover:bg-slate-50/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      {rule.ruleId}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {rule.requirement}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>Clause: <strong className="text-slate-600 font-mono">{rule.legalClause}</strong></span>
                    <span>·</span>
                    <span className="truncate">Evidence: "{rule.evidenceSnippet}"</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <StatusBadge status={rule.status} size="sm" />
                  <button
                    type="button"
                    className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-semibold"
                  >
                    <span>{isExpanded ? 'Hide' : 'Details'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Progressive Disclosure Section */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 text-xs space-y-3 bg-slate-50/30 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Left: Validation Logic */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Statutory Validation Logic
                      </span>
                      <p className="text-slate-700 mt-1 leading-relaxed">
                        {rule.validationLogic}
                      </p>
                    </div>

                    {/* Right: Rationale */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Determination Rationale
                      </span>
                      <p className="text-slate-700 mt-1 leading-relaxed font-medium">
                        {rule.whyExplanation}
                      </p>
                    </div>
                  </div>

                  {/* Inline System Limitation Disclaimer (not a competing colored box) */}
                  {rule.systemLimitation && (
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Technical Limitation: </strong>
                        {rule.systemLimitation}
                      </span>
                    </div>
                  )}

                  {/* Footer Meta & Canvas Link */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span>Source: {rule.source}</span>
                      <span>·</span>
                      <span>Confidence: {Math.round(rule.confidence * 100)}%</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenXRay();
                      }}
                      className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
                    >
                      <span>Inspect on Package Canvas</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
