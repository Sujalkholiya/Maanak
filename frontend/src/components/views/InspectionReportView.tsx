import React from 'react';
import {
  Printer,
  Download,
  CheckCircle2,
  Shield,
  FileCheck,
} from 'lucide-react';
import { InspectionCase } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { DemoBadge } from '../common/DemoBadge';

interface InspectionReportViewProps {
  currentCase: InspectionCase;
}

export const InspectionReportView: React.FC<InspectionReportViewProps> = ({ currentCase }) => {
  const checklistItems = [
    { label: 'Case Identification & Authority', done: true },
    { label: 'Packaging Classification', done: true },
    { label: 'Manufacturer & Geotagged Records', done: true },
    { label: '10 Structured Declarations', done: true },
    { label: 'Applicability Decision Matrix', done: true },
    { label: 'Versioned Legal Cross-References', done: true },
    { label: 'Evidentiary Crops & SHA-256 Hashes', done: true },
    { label: 'Officer Adjudication & Observations', done: true },
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-10">
      {/* 1. TOP ACTION BAR (No-print) */}
      <div className="no-print bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-700" />
              6. Statutory Legal Notice & Dossier
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Legal Metrology inspection dossier compiled under Section 18 enforcement standards.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
          <button
            onClick={() => alert('Downloading formal legal inspection PDF dossier.')}
            className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* 2. PRE-GENERATION AUDIT CHECKLIST (Clean white card, muted labels) */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-3.5 text-xs shadow-xs">
        <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2 flex items-center justify-between">
          <span>Evidentiary Dossier Checklist</span>
          <span className="text-emerald-700 font-mono font-bold">8 / 8 VERIFIED</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-slate-600">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate text-[11px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FORMAL INSPECTION REPORT PREVIEW (Clean document layout) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-slate-900 text-xs">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-lg shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Legal Metrology Enforcement Wing
              </div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                Statutory Packaging Inspection Dossier
              </h1>
              <div className="text-xs text-slate-500">
                Issued pursuant to Legal Metrology (Packaged Commodities) Rules, 2011
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="font-mono font-bold text-sm text-slate-900">
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

        {/* Section 1: Inspection & Officer Identification */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
            1. Inspection Particulars
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Investigating Officer</span>
              <span className="font-semibold text-slate-900">{currentCase.officer}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Officer Authorization ID</span>
              <span className="font-mono font-semibold text-slate-900">{currentCase.officerId}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Jurisdiction Circle</span>
              <span className="font-semibold text-slate-800">{currentCase.location}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Statutory Rule Version</span>
              <span className="font-mono font-semibold text-blue-700">Gazette v2026.3</span>
            </div>
          </div>
        </div>

        {/* Section 2: Commodity & Manufacturer Profile */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
            2. Commodity Profile
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Commodity Name</span>
              <span className="font-semibold text-slate-900">{currentCase.productName}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Manufacturer / Packer</span>
              <span className="font-semibold text-slate-900">{currentCase.manufacturer}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Batch Number</span>
              <span className="font-mono font-semibold text-slate-800">{currentCase.batchNo}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Category Classification</span>
              <span className="text-slate-800">{currentCase.category}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Extracted Declarations Table */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
            3. Extracted Mandatory Declarations
          </h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3">Statutory Field</th>
                  <th className="py-2 px-3">Extracted Label Value</th>
                  <th className="py-2 px-3">Confidence</th>
                  <th className="py-2 px-3">Rule Reference</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentCase.declarations.slice(0, 6).map((d) => (
                  <tr key={d.fieldId} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-800">{d.label}</td>
                    <td className="py-2 px-3 text-slate-900 font-medium">{d.detectedValue}</td>
                    <td className="py-2 px-3 font-mono text-slate-500">
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

        {/* Section 4: Unified Finding Details (One unified card, thin dividers, NO stacked pastel boxes) */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
            4. Identified Findings & Metric Evaluations
          </h3>
          <div className="space-y-2.5">
            {currentCase.rules
              .filter((r) => r.status !== 'COMPLIANT')
              .map((rule) => (
                <div
                  key={rule.ruleId}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white border-l-4 border-l-rose-500 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">
                      {rule.ruleId}: {rule.requirement}
                    </span>
                    <StatusBadge status={rule.status} size="sm" />
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Evidentiary Snippet: </span>
                    <span className="font-mono font-medium text-slate-900">"{rule.evidenceSnippet}"</span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-800">Statutory Offense Rationale: </strong>
                    <span>{rule.whyExplanation}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Section 5: Officer Final Determination & Audit Hash */}
        <div className="pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-slate-500 block text-[10px]">
                Authorized Officer Final Endorsement
              </span>
              <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 leading-relaxed">
                "Physical inspection verified at New Delhi depot. MRP sticker altered without requisite gazette endorsement. Notice issued under Section 18 of Legal Metrology Act."
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                Digital Signature Token: <strong className="text-slate-800">LM-DL-4029</strong>
              </div>
            </div>

            <div className="space-y-1.5 border-l border-slate-200 pl-4">
              <span className="font-bold uppercase tracking-wider text-slate-500 block text-[10px]">
                Cryptographic Evidentiary Chain of Custody
              </span>
              <div className="font-mono text-[10px] text-slate-600 space-y-1">
                <div className="truncate">Hash: SHA256: 7c981290384a9e87123984019283401928340192834091823908129381029384</div>
                <div>Device: Rugged Enforcement Terminal T-900</div>
                <div>Geotag: 28.4975° N, 77.2911° E · 2026-09-08 11:42 IST</div>
                <div className="text-emerald-700 font-bold">✓ INTEGRITY VERIFIED</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
