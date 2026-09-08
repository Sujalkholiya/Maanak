import React, { useState } from 'react';
import {
  UserCheck,
  Check,
  XCircle,
  RefreshCw,
  FileText,
  Shield,
  ArrowRight,
  Info,
} from 'lucide-react';
import { InspectionCase } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { DemoBadge } from '../../../components/common/DemoBadge';

interface HumanVerificationViewProps {
  currentCase: InspectionCase;
  onProceedToReport: () => void;
}

export const HumanVerificationView: React.FC<HumanVerificationViewProps> = ({
  currentCase,
  onProceedToReport,
}) => {
  const [selectedIssueIndex, setSelectedIssueIndex] = useState<number>(0);
  const [officerNote, setOfficerNote] = useState<string>(
    'Inspected physical sample at New Delhi container depot. Adhesive sticker elevated price from ₹360 to ₹420 without requisite gazette endorsement. Recommended issuance of statutory notice under Section 18.'
  );
  const [decisionState, setDecisionState] = useState<'IDLE' | 'CONFIRMED' | 'REJECTED' | 'RESCAN'>('IDLE');

  const issues = currentCase.rules.filter((r) => r.status !== 'COMPLIANT');
  const activeIssue = issues[selectedIssueIndex] || currentCase.rules[0];

  const handleGenerateDraft = () => {
    setOfficerNote(
      `Finding confirmed upon physical inspection. Commodity ${currentCase.productName} (Batch ${currentCase.batchNo}) displays potential non-compliance under ${activeIssue?.legalClause}. Detected evidence shows "${activeIssue?.evidenceSnippet}". Forwarded for statutory notice.`
    );
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-8">
      {/* 1. CLEAN HEADER */}
      <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-700" />
              5. Officer Verification Workspace
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Human-in-the-loop statutory review. Review AI detections and append officer determination prior to notice generation.
          </p>
        </div>

        <button
          onClick={onProceedToReport}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <span>Proceed to Legal Notice</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. STATUTORY OVERSIGHT NOTICE (Clean white card, no dark navy / neon green clash) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs border-l-4 border-l-blue-600">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-blue-700 shrink-0" />
          <div>
            <span className="font-bold text-slate-900 text-xs">
              Statutory Human Oversight Mandate:
            </span>
            <span className="text-slate-600 text-xs ml-1">
              Automated findings are advisory. Legal adjudication and compounding notices remain the sole statutory responsibility of the investigating officer.
            </span>
          </div>
        </div>

        <div className="shrink-0 text-slate-500 text-[11px] font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          Authorized Officer: <strong className="text-slate-800">Vikram Sharma (LM-DL-4029)</strong>
        </div>
      </div>

      {/* 3. CASE CONTEXT STRIP */}
      <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <span className="text-slate-400 font-medium">Case: </span>
            <strong className="text-slate-800 font-mono">{currentCase.id}</strong>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            <span className="text-slate-400 font-medium">Commodity: </span>
            <strong className="text-slate-800">{currentCase.productName}</strong>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            <span className="text-slate-400 font-medium">Manufacturer: </span>
            <strong className="text-slate-800">{currentCase.manufacturer}</strong>
          </div>
        </div>

        {/* Issue Selector if multiple issues */}
        {issues.length > 1 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Flagged Item:</span>
            <div className="flex gap-1">
              {issues.map((issue, idx) => (
                <button
                  key={issue.ruleId}
                  onClick={() => setSelectedIssueIndex(idx)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    selectedIssueIndex === idx
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. MAIN LAYOUT: LEFT EVIDENCE REGION + RIGHT REVIEW FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Evidentiary Photo Crop (4 cols, neutral gray border, clean hash chip) */}
        <div className="lg:col-span-5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-800">Target Evidentiary Crop</span>
            <span className="text-slate-400 text-[11px]">Region 04</span>
          </div>

          <div className="relative aspect-4/3 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-200 shadow-inner">
            <img
              src={currentCase.image}
              alt="Evidence Highlight Crop"
              className="w-full h-full object-contain filter contrast-105"
            />

            {/* Neutral border overlay with subtle corner accents */}
            <div className="absolute inset-2 border border-rose-500/60 rounded-md pointer-events-none"></div>

            {/* Monospace code chip (gray background, not white-on-navy) */}
            <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[10px] px-2 py-0.5 rounded font-mono border border-slate-700/60">
              SHA256: 9f86d...0a08
            </div>
          </div>

          <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
            <div>Device: Rugged Enforcement Terminal T-900</div>
            <div>Geotag: 28.4975° N, 77.2911° E (Container Depot)</div>
          </div>
        </div>

        {/* Right: Finding Review Form & Officer Decision (7 cols, clean white card) */}
        <div className="lg:col-span-7 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          {/* Finding Title & Status */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                {activeIssue?.ruleId || 'RULE-6-1-E'}
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-1">
                {activeIssue?.requirement || 'Maximum Retail Price Declaration'}
              </h3>
            </div>
            <StatusBadge status={activeIssue?.status || 'POTENTIAL_NON_COMPLIANCE'} size="sm" />
          </div>

          {/* Clean Structured Content Rows (Dividers, no clashing colored boxes) */}
          <div className="space-y-2.5 text-xs">
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
                Detected Evidence Snippet
              </span>
              <div className="font-bold text-slate-900 text-xs mt-0.5">
                "{activeIssue?.evidenceSnippet}"
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 bg-white border-l-4 border-l-rose-500">
              <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
                Regulatory Offense Rationale
              </span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">
                {activeIssue?.whyExplanation}
              </p>
            </div>

            {activeIssue?.systemLimitation && (
              <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Technical Limitation: </strong>
                  {activeIssue.systemLimitation}
                </span>
              </div>
            )}
          </div>

          {/* Officer Observation Notes */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                Officer Observation Notes (Statutory Record)
              </label>
              <button
                onClick={handleGenerateDraft}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>Auto-Draft Notes</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={officerNote}
              onChange={(e) => setOfficerNote(e.target.value)}
              placeholder="Enter authorized officer observations..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-sans text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white leading-relaxed"
            />
          </div>

          {/* Officer Decision Buttons (Clean segmented action grid) */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Select Officer Adjudication:
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                onClick={() => setDecisionState('CONFIRMED')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  decisionState === 'CONFIRMED'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Finding</span>
              </button>

              <button
                onClick={() => setDecisionState('REJECTED')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  decisionState === 'REJECTED'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-800 border border-slate-200'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Finding</span>
              </button>

              <button
                onClick={() => setDecisionState('RESCAN')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  decisionState === 'RESCAN'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Request Re-scan</span>
              </button>
            </div>

            {decisionState !== 'IDLE' && (
              <div className="p-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-[11px] flex items-center justify-between">
                <span>Decision recorded in tamper-proof audit trail.</span>
                <span className="font-mono font-bold text-blue-700">{decisionState}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
