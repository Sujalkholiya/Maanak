import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Search,
  Download,
  Eye,
  FileCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { MOCK_EVIDENCE_ITEMS } from '../../../data/mockData';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { DemoBadge } from '../../../components/common/DemoBadge';

export const EvidenceVaultView: React.FC = () => {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    MOCK_EVIDENCE_ITEMS[0].id
  );
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const selectedEvidence =
    MOCK_EVIDENCE_ITEMS.find((e) => e.id === selectedEvidenceId) ||
    MOCK_EVIDENCE_ITEMS[0];

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-700" />
              Cryptographic Evidence Vault
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Immutable repository of captured packaging imagery, calibration frames, and SHA-256 integrity signatures for judicial submission.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Integrity Chain: 100% Validated
          </span>
        </div>
      </div>

      {/* Main Grid: Left Evidence List Table, Right Deep-Dive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Captured Evidentiary Artifacts</h3>
            <span className="text-xs text-slate-500 font-mono">
              {MOCK_EVIDENCE_ITEMS.length} Secure Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Evidence ID</th>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Commodity</th>
                  <th className="py-2.5 px-3">Captured</th>
                  <th className="py-2.5 px-3">Finding</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_EVIDENCE_ITEMS.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedEvidenceId(item.id)}
                    className={`cursor-pointer transition-colors ${
                      selectedEvidenceId === item.id
                        ? 'bg-blue-50/70 font-semibold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">
                      {item.id}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{item.caseId}</td>
                    <td className="py-3 px-3 text-slate-900 max-w-[150px] truncate">
                      {item.productName}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {item.capturedAt.split(' ')[1]}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="px-2.5 py-1 text-xs text-blue-700 bg-white border border-blue-200 rounded hover:bg-blue-50">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Deep-Dive Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  {selectedEvidence.id}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">
                  {selectedEvidence.productName}
                </h3>
              </div>
              <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Integrity Verified
              </span>
            </div>

            {/* Image Preview */}
            <div className="relative aspect-4/3 w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
              <img
                src={selectedEvidence.thumbnailUrl}
                alt="Vault Item"
                className="w-full h-full object-contain filter contrast-105"
              />
              <div className="absolute top-2 right-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300">
                {selectedEvidence.resolution}
              </div>
            </div>

            {/* Cryptographic SHA-256 Signature */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-500 font-bold uppercase text-[10px]">
                <span>SHA-256 Cryptographic Checksum:</span>
                <button
                  onClick={() => handleCopyHash(selectedEvidence.sha256Hash)}
                  className="text-blue-700 hover:text-blue-800 flex items-center gap-1 font-semibold"
                >
                  <Copy className="w-3 h-3" />
                  {copiedHash ? 'Copied!' : 'Copy Hash'}
                </button>
              </div>
              <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-cyan-300 break-all border border-slate-800 select-all">
                {selectedEvidence.sha256Hash}
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
              <div className="flex justify-between">
                <span>Associated Case:</span>
                <span className="font-mono font-bold text-slate-900">{selectedEvidence.caseId}</span>
              </div>
              <div className="flex justify-between">
                <span>Captured Timestamp:</span>
                <span className="font-mono text-slate-800">{selectedEvidence.capturedAt}</span>
              </div>
              <div className="flex justify-between">
                <span>Recording Terminal:</span>
                <span className="font-medium text-slate-800">{selectedEvidence.captureDevice}</span>
              </div>
              <div className="flex justify-between">
                <span>Investigating Officer:</span>
                <span className="font-medium text-slate-800">{selectedEvidence.officer}</span>
              </div>
              <div className="flex justify-between">
                <span>Applied Statutory Rule:</span>
                <span className="font-mono text-blue-700">{selectedEvidence.ruleRef}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => alert('Demo: Downloading tamper-evident ZIP container with cryptographic manifest.')}
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Sealed Evidence Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

