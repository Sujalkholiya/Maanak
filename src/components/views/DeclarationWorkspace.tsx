import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Edit3,
  Check,
  Languages,
  Eye,
  ExternalLink,
  ChevronRight,
  Info,
  Maximize2,
} from 'lucide-react';
import { ExtractedDeclaration, InspectionCase } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { DemoBadge } from '../common/DemoBadge';

interface DeclarationWorkspaceProps {
  currentCase: InspectionCase;
  onProceedToApplicability: () => void;
  onOpenXRay: () => void;
}

export const DeclarationWorkspace: React.FC<DeclarationWorkspaceProps> = ({
  currentCase,
  onProceedToApplicability,
  onOpenXRay,
}) => {
  const [declarations, setDeclarations] = useState<ExtractedDeclaration[]>(
    currentCase.declarations
  );
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'ISSUES' | 'VERIFIED'>('ALL');
  const [selectedFieldForPreview, setSelectedFieldForPreview] = useState<string>('f5'); // MRP by default

  const handleStartEdit = (dec: ExtractedDeclaration) => {
    setEditingFieldId(dec.fieldId);
    setEditValue(dec.detectedValue);
  };

  const handleSaveEdit = (fieldId: string) => {
    setDeclarations((prev) =>
      prev.map((d) => (d.fieldId === fieldId ? { ...d, detectedValue: editValue, manualOverride: editValue } : d))
    );
    setEditingFieldId(null);
  };

  const filteredDeclarations = declarations.filter((d) => {
    if (activeTab === 'ISSUES') return d.status !== 'COMPLIANT';
    if (activeTab === 'VERIFIED') return d.status === 'COMPLIANT';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900">
              Structured Declaration Extraction & Multilingual OCR
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            10 statutory fields mapped from packaging imagery. English and Devanagari labels synchronized with confidence metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenXRay}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            Open Compliance X-Ray
          </button>
          <button
            onClick={onProceedToApplicability}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Proceed to Applicability Engine</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Package Preview with OCR Regions, Right Field Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image with Bounding Boxes (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-800">Source Evidentiary Image</span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                <Languages className="w-3.5 h-3.5" />
                EN + DEVN (Hindi)
              </span>
            </div>

            {/* Interactive Package Graphic with Overlays */}
            <div className="relative aspect-4/5 w-full bg-slate-950 rounded-xl overflow-hidden mt-3 border border-slate-800 group">
              <img
                src={currentCase.image}
                alt="Package Back Panel"
                className="w-full h-full object-contain filter contrast-105"
              />

              {/* Bounding box overlays */}
              {currentCase.boundingBoxes.map((box) => {
                const isSelected = selectedFieldForPreview === box.id || box.id === 'box-mrp';
                return (
                  <div
                    key={box.id}
                    onClick={() => onOpenXRay()}
                    className={`absolute cursor-pointer transition-all border-2 rounded ${
                      box.status === 'COMPLIANT'
                        ? 'border-emerald-500 bg-emerald-500/15 hover:bg-emerald-500/30'
                        : box.status === 'POTENTIAL_NON_COMPLIANCE'
                        ? 'border-rose-500 bg-rose-500/20 hover:bg-rose-500/40 animate-pulse'
                        : 'border-amber-500 bg-amber-500/20 hover:bg-amber-500/40'
                    }`}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                    title={`${box.label}: ${box.value}`}
                  >
                    <span
                      className={`absolute -top-4 left-0 text-[9px] font-bold px-1 rounded text-white shadow-2xs whitespace-nowrap ${
                        box.status === 'COMPLIANT'
                          ? 'bg-emerald-700'
                          : box.status === 'POTENTIAL_NON_COMPLIANCE'
                          ? 'bg-rose-700'
                          : 'bg-amber-700'
                      }`}
                    >
                      {box.label}
                    </span>
                  </div>
                );
              })}

              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-xs p-2 rounded-lg text-white text-[11px] flex items-center justify-between">
                <span>Click any bounding box to open full X-Ray</span>
                <span className="text-cyan-400 font-mono text-[10px]">10 Fields Localized</span>
              </div>
            </div>

            {/* Multilingual Legend */}
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Language Detection:</span>
                <span className="text-emerald-700 font-bold">Dual-Script Match</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Statutory declarations conform to the bilingual option under Rule 9(3) (English numerals and Hindi transliterations).
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Declaration Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter tabs */}
          <div className="flex items-center justify-between bg-slate-100 p-1 rounded-xl border border-slate-300 text-xs">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Declarations ({declarations.length})
              </button>
              <button
                onClick={() => setActiveTab('ISSUES')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'ISSUES' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-rose-700'
                }`}
              >
                Issues / Review ({declarations.filter((d) => d.status !== 'COMPLIANT').length})
              </button>
              <button
                onClick={() => setActiveTab('VERIFIED')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'VERIFIED' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                Compliant ({declarations.filter((d) => d.status === 'COMPLIANT').length})
              </button>
            </div>

            <span className="text-[11px] text-slate-500 pr-2">RuleDB v2026.3 Synced</span>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredDeclarations.map((dec) => {
              const isEditing = editingFieldId === dec.fieldId;

              return (
                <div
                  key={dec.fieldId}
                  className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                    dec.status === 'POTENTIAL_NON_COMPLIANCE'
                      ? 'border-rose-300 bg-rose-50/20'
                      : dec.status === 'NEEDS_HUMAN_VERIFICATION'
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{dec.label}</span>
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                          {dec.ruleId}
                        </span>
                        {dec.isMandatory && (
                          <span className="text-[9px] font-bold text-red-700 bg-red-100 px-1 py-0.2 rounded">
                            MANDATORY
                          </span>
                        )}
                      </div>
                      {dec.hindiLabel && (
                        <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                          {dec.hindiLabel}
                        </div>
                      )}
                    </div>

                    <StatusBadge status={dec.status} size="sm" />
                  </div>

                  {/* Detected Value Display / Edit Form */}
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full text-xs font-medium p-2 border border-blue-400 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-100"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingFieldId(null)}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(dec.fieldId)}
                            className="px-3 py-1 bg-blue-700 text-white text-xs font-semibold rounded flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Save Override
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-semibold text-slate-900 break-words">
                          {dec.detectedValue}
                        </div>
                        {dec.detectedHindiValue && (
                          <div className="text-xs text-slate-600 mt-0.5 font-medium">
                            {dec.detectedHindiValue}
                          </div>
                        )}
                        {dec.manualOverride && (
                          <span className="inline-block mt-1 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            Manual Officer Override Applied
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Finding Note / Advisory if any */}
                  {dec.notes && (
                    <div className="mt-2.5 p-2 bg-amber-50/80 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed">
                      <span className="font-bold">System Observation:</span> {dec.notes}
                    </div>
                  )}

                  {/* Metadata and Card Actions */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>
                        Confidence:{' '}
                        <strong className="text-slate-800 font-mono">
                          {Math.round(dec.confidence * 100)}%
                        </strong>
                      </span>
                      <span>·</span>
                      <span className="text-slate-600">{dec.sourceRegion}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenXRay()}
                        className="text-blue-700 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Evidence
                      </button>
                      <button
                        onClick={() => handleStartEdit(dec)}
                        className="text-slate-600 hover:text-slate-800 font-semibold inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

