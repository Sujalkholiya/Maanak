import React, { useState } from 'react';
import {
  FileCheck2,
  AlertTriangle,
  Edit3,
  Check,
  Languages,
  Eye,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
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
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);

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

  const issuesCount = declarations.filter((d) => d.status !== 'COMPLIANT').length;
  const compliantCount = declarations.filter((d) => d.status === 'COMPLIANT').length;

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-8">
      {/* 1. CLEAN HEADER */}
      <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-700" />
              2. Structured OCR Extraction
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Bilingual extracted declarations mapped against Legal Metrology Rule 6 statutory fields.
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
            onClick={onProceedToApplicability}
            className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Proceed to Applicability</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: LEFT COMPACT EVACUATION IMAGE + RIGHT CLEAN DECLARATION ROWS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Source Image Canvas (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-800">Source Evidentiary Frame</span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              <Languages className="w-3 h-3 text-blue-600" />
              Bilingual OCR
            </span>
          </div>

          <div className="relative aspect-4/5 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
            <img
              src={currentCase.image}
              alt="Packaging Back Panel"
              className="w-full h-full object-contain filter contrast-105"
            />

            {/* Subtle bounding box overlays */}
            {currentCase.boundingBoxes.map((box) => (
              <div
                key={box.id}
                onClick={onOpenXRay}
                className={`absolute cursor-pointer rounded transition-all border ${
                  box.status === 'COMPLIANT'
                    ? 'border-emerald-400/80 bg-emerald-500/10 hover:bg-emerald-500/25'
                    : box.status === 'POTENTIAL_NON_COMPLIANCE'
                    ? 'border-rose-500 bg-rose-500/20 hover:bg-rose-500/35'
                    : 'border-amber-400 bg-amber-500/20 hover:bg-amber-500/35'
                }`}
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
                title={`${box.label}: ${box.value}`}
              />
            ))}

            <div className="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur-xs px-2.5 py-1.5 rounded text-white text-[11px] flex items-center justify-between border border-slate-700/80">
              <span className="text-slate-300">10 Localized Fields</span>
              <button
                onClick={onOpenXRay}
                className="text-cyan-300 font-bold hover:underline flex items-center gap-1 text-[10px]"
              >
                Inspect X-Ray →
              </button>
            </div>
          </div>
        </div>

        {/* Right: Clean Declarations Register (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header & Segmented Filter */}
          <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Statutory Declarations
              </span>
              <span className="font-mono text-xs text-slate-400">
                ({filteredDeclarations.length} of {declarations.length})
              </span>
            </div>

            {/* Segmented Filter Control */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  activeFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({declarations.length})
              </button>
              <button
                onClick={() => setActiveFilter('ISSUES')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                  activeFilter === 'ISSUES'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-rose-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                Issues ({issuesCount})
              </button>
              <button
                onClick={() => setActiveFilter('COMPLIANT')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                  activeFilter === 'COMPLIANT'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Compliant ({compliantCount})
              </button>
            </div>
          </div>

          {/* Clean Row List */}
          <div className="divide-y divide-slate-100 text-xs">
            {filteredDeclarations.map((dec) => {
              const isEditing = editingFieldId === dec.fieldId;
              const isExpanded = expandedFieldId === dec.fieldId;
              const isFlagged = dec.status !== 'COMPLIANT';

              // Colored left accent border only, white background
              const leftAccentBorder =
                dec.status === 'COMPLIANT'
                  ? 'border-l-4 border-l-emerald-500'
                  : dec.status === 'POTENTIAL_NON_COMPLIANCE'
                  ? 'border-l-4 border-l-rose-500'
                  : 'border-l-4 border-l-amber-500';

              return (
                <div
                  key={dec.fieldId}
                  className={`p-3.5 bg-white transition-colors hover:bg-slate-50/50 ${leftAccentBorder}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Field Name & Bilingual Label */}
                    <div className="min-w-0 sm:w-1/3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs">{dec.label}</span>
                        {dec.isMandatory && (
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            MANDATORY
                          </span>
                        )}
                      </div>
                      {dec.hindiLabel && (
                        <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                          {dec.hindiLabel}
                        </div>
                      )}
                    </div>

                    {/* Middle: Extracted Value or Inline Edit */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full text-xs font-semibold px-2 py-1 border border-blue-400 rounded-md bg-white outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(dec.fieldId)}
                            className="p-1 bg-blue-700 text-white rounded hover:bg-blue-800 shrink-0"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingFieldId(null)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded shrink-0"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                            {dec.detectedValue}
                          </div>
                          {dec.detectedHindiValue && (
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {dec.detectedHindiValue}
                            </div>
                          )}
                          {dec.manualOverride && (
                            <span className="inline-block mt-0.5 text-[9px] font-medium text-blue-700 bg-blue-50 px-1 py-0.2 rounded border border-blue-200">
                              Override Applied
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Status Badge & Icon Actions */}
                    <div className="shrink-0 flex items-center gap-2.5">
                      <StatusBadge status={dec.status} size="sm" />

                      <span className="font-mono text-[11px] text-slate-400">
                        {Math.round(dec.confidence * 100)}%
                      </span>

                      <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                        <button
                          onClick={onOpenXRay}
                          className="p-1 text-slate-400 hover:text-blue-700 rounded"
                          title="Inspect Evidence in X-Ray"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStartEdit(dec)}
                          className="p-1 text-slate-400 hover:text-slate-800 rounded"
                          title="Edit extracted value"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {(dec.notes || dec.ruleId) && (
                          <button
                            onClick={() =>
                              setExpandedFieldId(isExpanded ? null : dec.fieldId)
                            }
                            className="p-1 text-slate-400 hover:text-slate-800 rounded"
                            title="Toggle details"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Flagged Issue as Compact Inline Warning Row (not a huge tinted block) */}
                  {dec.notes && (
                    <div className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-900 bg-amber-50/60 px-2.5 py-1.5 rounded border border-amber-200/80">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="leading-tight">
                        <strong>Observed Discrepancy: </strong>
                        <span>{dec.notes}</span>
                      </div>
                    </div>
                  )}

                  {/* Progressive Disclosure Details */}
                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-semibold text-slate-600">Statutory Rule: </span>
                        <span className="font-mono text-blue-700 font-semibold">{dec.ruleId}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-600">Source Region: </span>
                        <span>{dec.sourceRegion || 'Macro Panel Region'}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
