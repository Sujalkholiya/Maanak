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
  ChevronRight,
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
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ISSUES' | 'COMPLIANT'>('ALL');

  const handleStartEdit = (dec: ExtractedDeclaration) => {
    setEditingFieldId(dec.fieldId);
    setEditValue(dec.detectedValue);
  };

  const handleSaveEdit = (fieldId: string) => {
    setDeclarations((prev) =>
      prev.map((d) =>
        d.fieldId === fieldId
          ? { ...d, detectedValue: editValue, manualOverride: editValue }
          : d
      )
    );
    setEditingFieldId(null);
  };

  const filteredDeclarations = declarations.filter((d) => {
    if (activeFilter === 'ISSUES') return d.status !== 'COMPLIANT';
    if (activeFilter === 'COMPLIANT') return d.status === 'COMPLIANT';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. HEADER (Clear, Focused) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck2 className="w-6 h-6 text-blue-700" />
              Structured Declarations & Bilingual OCR
            </h1>
            <DemoBadge />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            10 statutory fields extracted from packaging imagery. English numerals and Devanagari labels mapped to Rule 6 & Schedule II standards.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenXRay}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-cyan-400" />
            <span>Open X-Ray</span>
          </button>
          <button
            onClick={onProceedToApplicability}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Proceed to Applicability</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: 5 COLS EVACUATED IMAGE + 7 COLS GROUPED DECLARATIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Source Image Canvas (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-800">Source Evidentiary Image</span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                <Languages className="w-3.5 h-3.5" />
                English + Devanagari
              </span>
            </div>

            {/* Interactive Package Visual with Bounding Boxes */}
            <div className="relative aspect-4/5 w-full bg-slate-950 rounded-xl overflow-hidden mt-3 border border-slate-800">
              <img
                src={currentCase.image}
                alt="Packaging Back Panel"
                className="w-full h-full object-contain filter contrast-105"
              />

              {/* Bounding box overlays */}
              {currentCase.boundingBoxes.map((box) => (
                <div
                  key={box.id}
                  onClick={() => onOpenXRay()}
                  className={`absolute cursor-pointer rounded transition-all border-2 ${
                    box.status === 'COMPLIANT'
                      ? 'border-emerald-400/80 bg-emerald-500/15 hover:bg-emerald-500/30'
                      : box.status === 'POTENTIAL_NON_COMPLIANCE'
                      ? 'border-rose-500 bg-rose-500/25 ring-2 ring-rose-400/80 animate-pulse'
                      : 'border-amber-400 bg-amber-500/25 ring-2 ring-amber-400/80'
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
                    className={`absolute -top-4 left-0 text-[9px] font-bold px-1.5 rounded text-white shadow-xs whitespace-nowrap ${
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
              ))}

              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-xs p-2.5 rounded-lg text-white text-xs flex items-center justify-between border border-slate-700">
                <span>Click boxes to inspect full X-Ray</span>
                <span className="text-cyan-400 font-mono text-[11px] font-bold">10 Localized</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: UNIFIED DECLARATIONS TABLE (Combines related info instead of 10 disjointed cards) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Table Filter Header */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Statutory Declarations Register
                </span>
                <span className="font-mono text-xs text-slate-500">
                  ({declarations.length} Fields)
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setActiveFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    activeFilter === 'ALL'
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  All (10)
                </button>
                <button
                  onClick={() => setActiveFilter('ISSUES')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                    activeFilter === 'ISSUES'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-rose-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Issues (2)
                </button>
                <button
                  onClick={() => setActiveFilter('COMPLIANT')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                    activeFilter === 'COMPLIANT'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Compliant (8)
                </button>
              </div>
            </div>

            {/* Structured Table Rows */}
            <div className="divide-y divide-slate-100 text-xs">
              {filteredDeclarations.map((dec) => {
                const isEditing = editingFieldId === dec.fieldId;
                const isIssue = dec.status !== 'COMPLIANT';

                return (
                  <div
                    key={dec.fieldId}
                    className={`p-4 transition-colors ${
                      dec.status === 'POTENTIAL_NON_COMPLIANCE'
                        ? 'bg-rose-50/50'
                        : dec.status === 'NEEDS_HUMAN_VERIFICATION'
                        ? 'bg-amber-50/40'
                        : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">{dec.label}</span>
                          <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            {dec.ruleId}
                          </span>
                          {dec.isMandatory && (
                            <span className="text-[9px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                              MANDATORY
                            </span>
                          )}
                        </div>
                        {dec.hindiLabel && (
                          <div className="text-[11px] text-slate-500 font-sans">
                            {dec.hindiLabel}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <StatusBadge status={dec.status} size="sm" />
                      </div>
                    </div>

                    {/* Detected Value & Editing */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {isEditing ? (
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full text-xs font-semibold p-2 border border-blue-400 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-100"
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
                              className="px-3 py-1 bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1 shadow-2xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm break-words">
                            {dec.detectedValue}
                          </div>
                          {dec.detectedHindiValue && (
                            <div className="text-xs text-slate-600 font-medium mt-0.5">
                              {dec.detectedHindiValue}
                            </div>
                          )}
                          {dec.manualOverride && (
                            <span className="inline-block mt-1 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-semibold">
                              Officer Override Applied
                            </span>
                          )}
                        </div>
                      )}

                      {!isEditing && (
                        <div className="flex items-center gap-3 shrink-0 text-slate-400 text-xs">
                          <span className="font-mono text-[11px] text-slate-500">
                            {Math.round(dec.confidence * 100)}% conf
                          </span>
                          <button
                            onClick={() => onOpenXRay()}
                            className="text-blue-700 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                            title="Inspect in X-Ray"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Evidence
                          </button>
                          <button
                            onClick={() => handleStartEdit(dec)}
                            className="text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1"
                            title="Manual Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Mismatch Observation Banner if Flagged */}
                    {dec.notes && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-white/90 border border-amber-300/80 text-[11px] text-amber-950 leading-relaxed shadow-2xs">
                        <span className="font-bold text-amber-900">Flagged Issue: </span>
                        {dec.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
