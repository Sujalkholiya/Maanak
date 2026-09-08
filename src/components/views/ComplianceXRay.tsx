import React, { useState } from 'react';
import {
  Crosshair,
  ZoomIn,
  ZoomOut,
  Maximize,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Shield,
  FileText,
  RotateCcw,
  ExternalLink,
  Check,
  X,
  RefreshCw,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { BoundingBox, InspectionCase } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { DemoBadge } from '../common/DemoBadge';

interface ComplianceXRayProps {
  currentCase: InspectionCase;
  onNavigateToRule?: (ruleId: string) => void;
  onProceedToReview?: () => void;
  onSelectSampleCase: (caseId: string) => void;
}

export const ComplianceXRay: React.FC<ComplianceXRayProps> = ({
  currentCase,
  onNavigateToRule,
  onProceedToReview,
  onSelectSampleCase,
}) => {
  const [selectedBoxId, setSelectedBoxId] = useState<string>(
    currentCase.boundingBoxes.find((b) => b.status !== 'COMPLIANT')?.id ||
      currentCase.boundingBoxes[0]?.id ||
      ''
  );
  const [filterMode, setFilterMode] = useState<'ALL' | 'ISSUES_ONLY' | 'COMPLIANT_ONLY'>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRuler, setShowRuler] = useState<boolean>(true);

  const selectedBox = currentCase.boundingBoxes.find((b) => b.id === selectedBoxId);

  const filteredBoxes = currentCase.boundingBoxes.filter((b) => {
    if (filterMode === 'ISSUES_ONLY') return b.status !== 'COMPLIANT';
    if (filterMode === 'COMPLIANT_ONLY') return b.status === 'COMPLIANT';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Toolbar */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-blue-700" />
              Compliance X-Ray Canvas
            </h2>
            <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
              Signature Visual Workspace
            </span>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Explainable compliance mapping: Click on any localized bounding box to inspect evidentiary justification, legal thresholds, and system limitations.
          </p>
        </div>

        {/* Commodity Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Active Case:</span>
          <select
            value={currentCase.id}
            onChange={(e) => onSelectSampleCase(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
          >
            <option value="CASE-2026-0841">Royal Feast Almonds (Dual MRP Discrepancy)</option>
            <option value="CASE-2026-0842">Himalayan Basmati Rice (Compliant Standard)</option>
            <option value="CASE-2026-0843">SunGlow Sunflower Oil (Missing USP & Temp)</option>
            <option value="CASE-2026-0844">Everfresh Baby Formula (Contrast & IMS)</option>
          </select>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Interactive Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Canvas Controls Bar */}
          <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs">
            {/* Filter mode */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold mr-1">Layer:</span>
              <button
                onClick={() => setFilterMode('ALL')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filterMode === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Regions ({currentCase.boundingBoxes.length})
              </button>
              <button
                onClick={() => setFilterMode('ISSUES_ONLY')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filterMode === 'ISSUES_ONLY'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-rose-400'
                }`}
              >
                Issues Only ({currentCase.boundingBoxes.filter((b) => b.status !== 'COMPLIANT').length})
              </button>
              <button
                onClick={() => setFilterMode('COMPLIANT_ONLY')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filterMode === 'COMPLIANT_ONLY'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                Compliant ({currentCase.boundingBoxes.filter((b) => b.status === 'COMPLIANT').length})
              </button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-[11px] text-slate-300 w-10 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative aspect-4/5 w-full bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-xl flex items-center justify-center select-none">
            <div
              className="relative w-full h-full transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={currentCase.image}
                alt="High Resolution Commodity Evidence"
                className="w-full h-full object-contain filter contrast-105 pointer-events-none"
              />

              {/* Bounding Box Overlays */}
              {filteredBoxes.map((box) => {
                const isSelected = box.id === selectedBoxId;

                const borderColor =
                  box.status === 'COMPLIANT'
                    ? 'border-emerald-400'
                    : box.status === 'POTENTIAL_NON_COMPLIANCE'
                    ? 'border-rose-500'
                    : 'border-amber-400';

                const bgColor =
                  box.status === 'COMPLIANT'
                    ? isSelected
                      ? 'bg-emerald-500/35'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30'
                    : box.status === 'POTENTIAL_NON_COMPLIANCE'
                    ? isSelected
                      ? 'bg-rose-500/40'
                      : 'bg-rose-500/25 hover:bg-rose-500/35'
                    : isSelected
                    ? 'bg-amber-500/40'
                    : 'bg-amber-500/25 hover:bg-amber-500/35';

                const badgeBg =
                  box.status === 'COMPLIANT'
                    ? 'bg-emerald-700'
                    : box.status === 'POTENTIAL_NON_COMPLIANCE'
                    ? 'bg-rose-700'
                    : 'bg-amber-700';

                return (
                  <div
                    key={box.id}
                    onClick={() => setSelectedBoxId(box.id)}
                    className={`absolute cursor-pointer border-2 rounded transition-all duration-150 ${borderColor} ${bgColor} ${
                      isSelected ? 'ring-4 ring-cyan-400/80 ring-offset-1 z-20 shadow-lg' : 'z-10'
                    }`}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                  >
                    {/* Floating label badge */}
                    <div
                      className={`absolute -top-5 left-0 flex items-center gap-1 text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow-md whitespace-nowrap ${badgeBg}`}
                    >
                      {box.status === 'COMPLIANT' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>}
                      {box.status === 'POTENTIAL_NON_COMPLIANCE' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-ping"></span>
                      )}
                      {box.status === 'NEEDS_HUMAN_VERIFICATION' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
                      )}
                      <span>{box.label}</span>
                    </div>
                  </div>
                );
              })}

              {/* Calibration Metric Ruler Overlay if enabled */}
              {showRuler && (
                <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700 rounded px-2.5 py-1 text-[10px] font-mono text-cyan-300 flex items-center gap-2">
                  <span className="w-8 h-1 bg-cyan-400 inline-block border-x border-white"></span>
                  <span>10 mm (148 px) Metric Benchmark</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom quick list pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {currentCase.boundingBoxes.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBoxId(b.id)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
                  selectedBoxId === b.id
                    ? 'bg-blue-700 text-white border-blue-700 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    b.status === 'COMPLIANT'
                      ? 'bg-emerald-500'
                      : b.status === 'POTENTIAL_NON_COMPLIANCE'
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                ></span>
                <span>{b.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Contextual Evidence Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedBox ? (
            <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-5 space-y-4">
              {/* Header: Finding Title and Status */}
              <div className="border-b border-slate-200 pb-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Selected Evidence Region
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <h3 className="font-black text-base text-slate-900">{selectedBox.label}</h3>
                  <StatusBadge status={selectedBox.status} />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Source: {selectedBox.sourceRegion}
                </div>
              </div>

              {/* The Core 8-Factor Explainability Matrix */}
              <div className="space-y-3 text-xs">
                {/* 1. WHAT */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    1. WHAT WAS DETECTED
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedBox.value}
                  </div>
                  {selectedBox.hindiValue && (
                    <div className="text-slate-600 font-medium mt-0.5">
                      {selectedBox.hindiValue}
                    </div>
                  )}
                </div>

                {/* 2. WHY */}
                {selectedBox.issueReason && (
                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl">
                    <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                      2. WHY (FINDING RATIONALE)
                    </div>
                    <p className="text-rose-950 font-medium mt-1 leading-relaxed">
                      {selectedBox.issueReason}
                    </p>
                  </div>
                )}

                {/* 3. APPLICABLE RULE */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>3. APPLICABLE STATUTORY RULE</span>
                    <span className="font-mono text-blue-700">{selectedBox.ruleId}</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-1">{selectedBox.ruleName}</div>
                  {selectedBox.legalLimit && (
                    <div className="text-[11px] text-slate-600 mt-1 font-mono">
                      Statutory Threshold: {selectedBox.legalLimit}
                    </div>
                  )}
                </div>

                {/* 4. CONFIDENCE & EVIDENCE COORDINATES */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500">Optical Confidence:</span>
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      {Math.round(selectedBox.confidence * 100)}%
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500">Region Coordinates:</span>
                    <div className="font-mono text-slate-800">
                      X:{selectedBox.x}% Y:{selectedBox.y}%
                    </div>
                  </div>
                </div>

                {/* 5. SYSTEM TECHNICAL LIMITATION */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950">
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    5. SYSTEM LIMITATION & NON-ESTABLISHMENT
                  </div>
                  <p className="text-[11px] mt-1 leading-relaxed text-amber-900">
                    {selectedBox.physicalVerificationRequired ||
                      'Digital computer vision cannot replace gazetted physical inspection in court proceedings. Visual measurements remain indicative.'}
                  </p>
                </div>
              </div>

              {/* 6. OFFICER DECISION CONTROLS */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  6. AUTHORIZED OFFICER ACTION
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onProceedToReview && onProceedToReview()}
                    className="py-2.5 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Confirm Finding
                  </button>
                  <button
                    onClick={() => alert('Officer Observation: Finding set as dismissed with notes.')}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject Finding
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    onClick={() => alert('Field request dispatched to officer terminal: Re-scan with macro illumination requested.')}
                    className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Request Re-scan
                  </button>
                  <button
                    onClick={() => onProceedToReview && onProceedToReview()}
                    className="text-blue-700 hover:text-blue-800 font-bold inline-flex items-center gap-1"
                  >
                    Open Review Console →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
              Select a bounding box on the package canvas to inspect legal evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

