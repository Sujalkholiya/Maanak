import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Shield,
  Clock,
  UserCheck,
  FileCheck,
  AlertTriangle,
  Send,
  Building2,
} from 'lucide-react';
import { InspectionCase } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { DemoBadge } from '../common/DemoBadge';

interface InspectionReportViewProps {
  currentCase: InspectionCase;
}

export const InspectionReportView: React.FC<InspectionReportViewProps> = ({ currentCase }) => {
  const [checklistPassed, setChecklistPassed] = useState<boolean>(true);
  const [isGenerated, setIsGenerated] = useState<boolean>(true);

  const checklistItems = [
    { label: 'Case Identification & Circle Authority', done: true },
    { label: 'Product & Packaging Classification', done: true },
    { label: 'Manufacturer & Packer Geotagged Records', done: true },
    { label: '10 Structured Extracted Declarations', done: true },
    { label: 'Applicability Decision Matrix', done: true },
    { label: 'Versioned Legal Rule Cross-References (v2026.3)', done: true },
    { label: 'Evidentiary Region Crops with SHA-256 Hashes', done: true },
    { label: 'Optical Numeral Measurements (Schedule II)', done: true },
    { label: 'Officer Adjudication & Observations Signed', done: true },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">
              One-Click Legal Inspection Report
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Structured evidentiary inspection dossier compiled under Legal Metrology enforcement workflow standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
          <button
            onClick={() => alert('Demo: Downloading formal PDF dossier with embedded digital signatures.')}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            Generate PDF
          </button>
        </div>
      </div>

      {/* Pre-Generation Audit Checklist (Collapsible) */}
      <div className="no-print bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
        <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between">
          <span>Evidentiary Dossier Checklist (All Required Checks Satisfied)</span>
          <span className="text-emerald-700 font-mono">9 / 9 VERIFIED</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formal Inspection Report Document Preview */}
      <div className="print-page bg-white rounded-2xl border-2 border-slate-300 p-8 sm:p-10 shadow-lg space-y-8 font-sans text-slate-900">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xl border border-slate-700">
                <Shield className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">
                  LEGAL METROLOGY ENFORCEMENT WING · PROTOTYPE EVALUATION DOSSIER
                </div>
                <h1 className="text-2xl font-black text-slate-950 tracking-tight mt-0.5">
                  LEGAL METROLOGY INSPECTION REPORT
                </h1>
                <div className="text-xs text-slate-600 font-medium">
                  Under the Legal Metrology Act, 2009 & Packaged Commodities Rules
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono font-bold text-base text-blue-900">
                {currentCase.id}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Date: {currentCase.createdDate}
              </div>
              <span className="inline-block mt-1">
                <StatusBadge status={currentCase.overallStatus} size="sm" />
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Inspection & Officer Identification */}
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-3">
            1. Inspection & Officer Particulars
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Inspecting Officer:</span>
              <span className="font-bold text-slate-900">{currentCase.officer}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Officer Identity ID:</span>
              <span className="font-mono font-bold text-slate-900">{currentCase.officerId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Inspection Jurisdiction:</span>
              <span className="font-semibold text-slate-800">{currentCase.location}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Rule Engine Version:</span>
              <span className="font-mono font-semibold text-blue-800">Gazette v2026.3</span>
            </div>
          </div>
        </div>

        {/* Section 2: Commodity & Manufacturer Profile */}
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-3">
            2. Commodity & Manufacturer Profile
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Product Trade Name:</span>
              <span className="font-bold text-slate-900">{currentCase.productName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Manufacturer / Packer:</span>
              <span className="font-semibold text-slate-900">{currentCase.manufacturer}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Batch / Lot Number:</span>
              <span className="font-mono font-bold text-slate-800">{currentCase.batchNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Category Classification:</span>
              <span className="text-slate-800">{currentCase.category}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Extracted Declarations Table */}
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-3">
            3. Statutory Declarations Extracted from Packaging
          </h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3">Statutory Field</th>
                  <th className="py-2 px-3">Extracted Label Value</th>
                  <th className="py-2 px-3">Optical Confidence</th>
                  <th className="py-2 px-3">Statutory Rule</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentCase.declarations.slice(0, 6).map((d) => (
                  <tr key={d.fieldId}>
                    <td className="py-2 px-3 font-semibold text-slate-800">{d.label}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">{d.detectedValue}</td>
                    <td className="py-2 px-3 font-mono text-slate-600">
                      {Math.round(d.confidence * 100)}%
                    </td>
                    <td className="py-2 px-3 font-mono text-blue-700">{d.ruleId}</td>
                    <td className="py-2 px-3 text-right">
                      <StatusBadge status={d.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Applicability Assessment */}
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-2">
            4. Statutory Applicability Determination
          </h3>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <div className="font-bold text-slate-800">
              Authority: {currentCase.applicability.statutoryBasis}
            </div>
            <p className="text-slate-600 leading-relaxed">
              Commodity falls under standard retail food packaging provisions. Evaluated {currentCase.applicability.applicableRequirementsCount} mandatory declarations, {currentCase.applicability.conditionalRequirementsCount} conditional requirements, and 0 exemptions.
            </p>
          </div>
        </div>

        {/* Section 5: Specific Compliance Findings & Measurements */}
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-3">
            5. Identified Findings & Metric Evaluations
          </h3>
          <div className="space-y-2.5 text-xs">
            {currentCase.rules
              .filter((r) => r.status !== 'COMPLIANT')
              .map((rule) => (
                <div
                  key={rule.ruleId}
                  className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/40 text-rose-950 space-y-1"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>
                      {rule.ruleId}: {rule.requirement}
                    </span>
                    <StatusBadge status={rule.status} size="sm" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-700">
                    Evidence Snippet: "{rule.evidenceSnippet}"
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    <strong>Statutory Offense Rationale:</strong> {rule.whyExplanation}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Section 6: Officer Final Determination & Cryptographic Audit */}
        <div className="pt-4 border-t-2 border-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-slate-600 block text-[11px]">
                Authorized Officer Final Endorsement
              </span>
              <p className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-800 italic leading-relaxed">
                "Inspected physical sample at New Delhi container depot. Adhesive sticker elevated price from ₹360 to ₹420 without requisite gazette endorsement. Recommended issuance of statutory notice under Section 18."
              </p>
              <div className="text-[11px] text-slate-500">
                Officer Signature: <strong>[DIGITALLY SIGNED VIA TOKEN LM-DL-4029]</strong>
              </div>
            </div>

            <div className="space-y-2 border-l border-slate-200 pl-4">
              <span className="font-bold uppercase tracking-wider text-slate-600 block text-[11px]">
                Cryptographic Evidentiary Chain of Custody
              </span>
              <div className="font-mono text-[10px] text-slate-600 space-y-1">
                <div>Dossier Hash: SHA256: 7c981290384a9e87123984019283401928340192834091823908129381029384</div>
                <div>Capture Device: Rugged Enforcement Terminal T-900 (Zone 1)</div>
                <div>Geotag: 28.4975° N, 77.2911° E · Timestamp: 2026-09-08 11:42 IST</div>
                <div className="text-emerald-700 font-bold">✓ TAMPER CHECK VERIFIED</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

