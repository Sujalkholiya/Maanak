import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileText,
  AlertTriangle,
  Shield,
  Send,
  HelpCircle,
  Eye,
  Check,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { InspectionCase } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { DemoBadge } from '../common/DemoBadge';

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
  const [hasDraftedAi, setHasDraftedAi] = useState<boolean>(false);

  const issues = currentCase.rules.filter((r) => r.status !== 'COMPLIANT');
  const activeIssue = issues[selectedIssueIndex] || currentCase.rules[0];

  const handleGenerateDraft = () => {
    setOfficerNote(
      `Finding confirmed upon physical inspection. Commodity ${currentCase.productName} (Batch ${currentCase.batchNo}) displays potential non-compliance under ${activeIssue?.legalClause}. Detected evidence shows "${activeIssue?.evidenceSnippet}". System advisory limitation acknowledged. Forwarded for statutory review.`
    );
    setHasDraftedAi(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-700" />
              Officer Verification Workspace
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Human-in-the-loop regulatory review. Authorized enforcement officers authenticate or dismiss automated findings prior to formal report signing.
          </p>
        </div>

        <button
          onClick={onProceedToReport}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <span>Proceed to Formal Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Trust & Legal Authority Notice */}
      <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-800 text-xs flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Statutory Human Oversight Mandate:
            </span>
            <p className="text-slate-300 text-xs mt-0.5">
              "System output is strictly advisory. Legal determination, compounding notices, and prosecution decisions remain the sole statutory prerogative of the authorized officer."
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block font-mono text-[10px] text-emerald-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700 shrink-0">
          Officer: Vikram Sharma (LM-DL-4029)
        </span>
      </div>

      {/* Case Identity Strip */}
      <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-300 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-slate-500 font-semibold">Case ID:</span>
          <div className="font-mono font-bold text-blue-800">{currentCase.id}</div>
        </div>
        <div>
          <span className="text-slate-500 font-semibold">Product Name:</span>
          <div className="font-semibold text-slate-900 truncate">{currentCase.productName}</div>
        </div>
        <div>
          <span className="text-slate-500 font-semibold">Manufacturer:</span>
          <div className="text-slate-800 truncate">{currentCase.manufacturer}</div>
        </div>
        <div>
          <span className="text-slate-500 font-semibold">Inspection Timestamp:</span>
          <div className="font-mono text-slate-700">{currentCase.createdDate}</div>
        </div>
      </div>

      {/* Main Layout: Left Evidence Image Crop, Right Finding Details & Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Evidentiary Photo with Highlight Crop (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-800">Target Evidentiary Region</span>
              <span className="text-slate-500 text-[11px]">Macro Region 04</span>
            </div>

            <div className="relative aspect-4/3 w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
              <img
                src={currentCase.image}
                alt="Evidence Highlight Crop"
                className="w-full h-full object-contain filter contrast-110"
              />

              <div className="absolute inset-0 border-4 border-rose-500/80 rounded-xl pointer-events-none"></div>

              <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white text-[10px] px-2 py-1 rounded font-mono border border-slate-700">
                Crop Hash: SHA256: 9f86d...0a08
              </div>
            </div>

            <div className="text-[11px] text-slate-500 space-y-1">
              <div>Capture Device: Rugged Enforcement Terminal T-900</div>
              <div>GPS Geotag: 28.4975° N, 77.2911° E (Container Depot)</div>
            </div>
          </div>
        </div>

        {/* Right: Finding Review Form & Officer Observation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            {/* Finding Status and Rule ID */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  {activeIssue?.ruleId || 'RULE-6-1-E'}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">
                  {activeIssue?.requirement || 'Maximum Retail Price Declaration & Sticker Prohibition'}
                </h3>
              </div>
              <StatusBadge status={activeIssue?.status || 'POTENTIAL_NON_COMPLIANCE'} />
            </div>

            {/* Structured Review Fields */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                  Detected Evidence:
                </span>
                <div className="font-semibold text-slate-900 text-sm mt-0.5">
                  {activeIssue?.evidenceSnippet}
                </div>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950">
                <span className="font-bold text-rose-800 uppercase text-[10px] tracking-wider">
                  System Finding Rationale:
                </span>
                <p className="mt-0.5 leading-relaxed font-medium">
                  {activeIssue?.whyExplanation}
                </p>
              </div>

              {activeIssue?.systemLimitation && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950">
                  <span className="font-bold text-amber-800 uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    System Technical Limitation:
                  </span>
                  <p className="mt-0.5 leading-relaxed text-[11px]">
                    {activeIssue.systemLimitation}
                  </p>
                </div>
              )}
            </div>

            {/* Officer Observation Input & AI Draft Assistant */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Officer Observation Notes (Mandatory for Legal Record):
                </label>
                <button
                  onClick={handleGenerateDraft}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Generate Observation Draft
                </button>
              </div>

              <textarea
                rows={3}
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                placeholder="Enter authorized officer observations, physical verification findings, or reasons for acceptance/rejection..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl font-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed bg-slate-50/50"
              ></textarea>
            </div>

            {/* Officer Decision Buttons */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Select Final Officer Adjudication:
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                <button
                  onClick={() => setDecisionState('CONFIRMED')}
                  className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    decisionState === 'CONFIRMED'
                      ? 'bg-emerald-700 text-white ring-2 ring-emerald-500'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  Confirm Finding
                </button>

                <button
                  onClick={() => setDecisionState('REJECTED')}
                  className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    decisionState === 'REJECTED'
                      ? 'bg-rose-700 text-white ring-2 ring-rose-500'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-300'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  Reject Finding
                </button>

                <button
                  onClick={() => setDecisionState('RESCAN')}
                  className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    decisionState === 'RESCAN'
                      ? 'bg-slate-800 text-white ring-2 ring-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Request Re-scan
                </button>
              </div>

              {decisionState !== 'IDLE' && (
                <div className="p-2 bg-blue-50 text-blue-900 border border-blue-200 rounded text-xs flex items-center justify-between mt-2">
                  <span>Officer decision recorded in cryptographic audit log.</span>
                  <span className="font-mono font-bold text-blue-800">{decisionState}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

