import React, { useState } from 'react';
import {
  Scale,
  ChevronDown,
  ChevronUp,
  Shield,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { InspectionCase } from '../../types';
import { DemoBadge } from '../common/DemoBadge';

interface ApplicabilityEngineViewProps {
  currentCase: InspectionCase;
  onProceedToRuleValidation: () => void;
}

export const ApplicabilityEngineView: React.FC<ApplicabilityEngineViewProps> = ({
  currentCase,
  onProceedToRuleValidation,
}) => {
  // Collapsed by default as per design requirement
  const [showRationale, setShowRationale] = useState<boolean>(false);
  const [commodityOverride] = useState<string>(
    currentCase.applicability.commodity
  );
  const [isInstitutional, setIsInstitutional] = useState<boolean>(
    currentCase.applicability.isInstitutional
  );
  const [isImported, setIsImported] = useState<boolean>(
    currentCase.applicability.isImported
  );

  const applicability = currentCase.applicability;

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-8">
      {/* 1. CLEAN HEADER */}
      <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-700" />
              3. Statutory Applicability Determination
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Evaluating statutory scope based on commodity class, trade channel, net quantity, and packaging format.
          </p>
        </div>

        <button
          onClick={onProceedToRuleValidation}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <span>Validate Applicable Rules</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. REGULATORY PRINCIPLE (Standard white card, muted label, small icon) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-xs text-slate-600 leading-relaxed border-l-4 border-l-blue-600">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1">
          <Scale className="w-3.5 h-3.5 text-blue-700" />
          <span>Statutory Rule: Context Precedes Adjudication</span>
        </div>
        <p className="text-[11px] text-slate-600">
          A missing declaration cannot be adjudged a violation without first establishing statutory applicability under Schedule II and Rule 3 exemption criteria.
        </p>
      </div>

      {/* 3. PRODUCT LEGAL CONTEXT MATRIX (5 clean white cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Commodity Class
          </span>
          <div className="font-bold text-xs text-slate-900 mt-1 truncate">
            {commodityOverride}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Schedule II Entry 14</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Package Format
          </span>
          <div className="font-bold text-xs text-slate-900 mt-1 truncate">
            {applicability.packageType}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Rule 2(l) Pre-Packaged</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Trade Channel
          </span>
          <div className="font-bold text-xs text-slate-900 mt-1">
            {isInstitutional ? 'Institutional' : 'Retail Consumer'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {isInstitutional ? 'Rule 3(c) Exemption' : 'Standard Rule 6'}
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Consignment Origin
          </span>
          <div className="font-bold text-xs text-slate-900 mt-1">
            {isImported ? 'Imported' : 'Domestic'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Rule 6(1)(ma)</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Net Quantity Scale
          </span>
          <div className="font-mono font-bold text-xs text-slate-900 mt-1">500 g (&gt; 50g)</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">USP Mandatory</div>
        </div>
      </div>

      {/* 4. THREE SUMMARY METRIC CARDS (Clean white cards, colored badges/numbers, no full background fills) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Applicable */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Applicable Requirements
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {applicability.applicableRequirementsCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Statutory declarations required by law
            </p>
          </div>
          <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-sm">
            ✓
          </span>
        </div>

        {/* Conditional */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs border-l-4 border-l-blue-500 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Conditional Requirements
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {applicability.conditionalRequirementsCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Triggered by dimensions or packaging type
            </p>
          </div>
          <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-sm">
            ?
          </span>
        </div>

        {/* Exemptions */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs border-l-4 border-l-slate-400 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Potential Exemptions
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {isInstitutional ? 2 : applicability.potentialExemptionsCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isInstitutional ? 'Industrial exemption active' : 'No retail packaging exemptions'}
            </p>
          </div>
          <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center font-bold text-sm">
            0
          </span>
        </div>
      </div>

      {/* 5. COLLAPSIBLE "WHY DOES THIS APPLY?" PANEL (Collapsed by default for progressive disclosure) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          onClick={() => setShowRationale(!showRationale)}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/80 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-700" />
            <span className="font-bold text-slate-800 text-xs sm:text-sm">
              Statutory Basis & Rationale: Why Do These Requirements Apply?
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>{showRationale ? 'Hide' : 'View'}</span>
            {showRationale ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {showRationale && (
          <div className="p-4 border-t border-slate-200 space-y-3 text-xs bg-white">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
              <span className="font-bold text-slate-900">Primary Statutory Authority: </span>
              <span className="font-mono text-blue-700">{applicability.statutoryBasis}</span>
            </div>

            <div className="space-y-1.5">
              <div className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                Statutory Deductions & Triggers:
              </div>
              <ul className="space-y-1.5">
                {applicability.rationalePoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed text-xs">
                    <span className="text-blue-700 font-bold font-mono">0{i + 1}.</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Context Adjustment Simulator for Officers */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-slate-600 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Simulate Exemption / Alternate Channel:
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isInstitutional}
                    onChange={(e) => setIsInstitutional(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Mark as Institutional Supply (Rule 3(c))</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isImported}
                    onChange={(e) => setIsImported(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Imported Consignment</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
