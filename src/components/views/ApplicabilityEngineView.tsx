import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Shield,
  Layers,
  ArrowRight,
  Info,
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
  const [showRationale, setShowRationale] = useState<boolean>(true);
  const [commodityOverride, setCommodityOverride] = useState<string>(
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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">
              Determining Applicable Requirements
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Requirements are evaluated based on commodity, packaging material, trade channel, and net quantity before compliance rules are evaluated.
          </p>
        </div>

        <button
          onClick={onProceedToRuleValidation}
          className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <span>Validate Applicable Rules</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Core Principle Banner */}
      <div className="bg-blue-50/80 border-l-4 border-blue-600 p-4 rounded-r-xl text-xs text-slate-800 leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-blue-950 mb-0.5">
          <Scale className="w-4 h-4 text-blue-700" />
          Regulatory Principle: Context Precedes Adjudication
        </div>
        A missing declaration cannot be declared an offense without first verifying whether the statutory requirement legally applies to this specific commodity category, packaging scale, and distribution modality.
      </div>

      {/* Product Legal Context Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Commodity Class
          </div>
          <div className="font-bold text-sm text-slate-900 mt-1 truncate">
            {commodityOverride}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Second Schedule Entry 14</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Package Configuration
          </div>
          <div className="font-bold text-sm text-slate-900 mt-1 truncate">
            {applicability.packageType}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Rule 2(l) Pre-Packaged</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Trade Channel
          </div>
          <div className="font-bold text-sm text-slate-900 mt-1">
            {isInstitutional ? 'Institutional / Bulk' : 'Retail Consumer'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {isInstitutional ? 'Exemption Rule 3(c)' : 'Standard Rule 6'}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Origin Origin
          </div>
          <div className="font-bold text-sm text-slate-900 mt-1">
            {isImported ? 'Imported Consignment' : 'Domestic Manufacture'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Rule 6(1)(ma) Trigger</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Net Quantity Scale
          </div>
          <div className="font-bold text-sm text-slate-900 mt-1 font-mono">500 g (&gt; 50g)</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">USP Mandatory</div>
        </div>
      </div>

      {/* Applicability Result Overview (3 Metric Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Applicable */}
        <div className="bg-white rounded-xl border border-emerald-200 p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Applicable Requirements
            </span>
            <div className="text-3xl font-black text-emerald-700 mt-1">
              {applicability.applicableRequirementsCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Statutory declarations required by law
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            ✓
          </div>
        </div>

        {/* Conditional */}
        <div className="bg-white rounded-xl border border-blue-200 p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Conditional Requirements
            </span>
            <div className="text-3xl font-black text-blue-700 mt-1">
              {applicability.conditionalRequirementsCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Triggered by dimensions / multi-piece contents
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            ?
          </div>
        </div>

        {/* Exemptions */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Potential Exemptions
            </span>
            <div className="text-3xl font-black text-slate-700 mt-1">
              {isInstitutional ? 2 : applicability.potentialExemptionsCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isInstitutional ? 'Industrial exemption active' : 'No retail packaging exemptions apply'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-lg">
            0
          </div>
        </div>
      </div>

      {/* Expandable "Why does this apply?" Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          onClick={() => setShowRationale(!showRationale)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-blue-700" />
            <span className="font-bold text-slate-900 text-sm">
              Statutory Basis & Rationale: Why Do These Requirements Apply?
            </span>
          </div>
          {showRationale ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {showRationale && (
          <div className="p-5 border-t border-slate-200 space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-slate-800">
              <span className="font-bold text-slate-900 font-sans">Primary Authority: </span>
              {applicability.statutoryBasis}
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Statutory Deductions:
              </div>
              <ul className="space-y-2">
                {applicability.rationalePoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                    <span className="text-blue-600 font-bold font-mono">0{i + 1}.</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Context Adjustment Simulator for Officers */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-slate-600">
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
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Mark as Institutional Supply (Rule 3(c))</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isImported}
                    onChange={(e) => setIsImported(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
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

