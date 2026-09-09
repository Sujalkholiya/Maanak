import React, { useState, useEffect } from 'react';
import {
  Crosshair,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  X,
  RefreshCw,
  Eye,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Shield,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { BoundingBox, InspectionCase } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useInspectionCase } from '../../../hooks/useInspectionCase';
import { complianceService } from '../../../services/complianceService';

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
  const { updateCurrentCase } = useInspectionCase();
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [selectedBoxId, setSelectedBoxId] = useState<string>(
    currentCase.boundingBoxes.find((b) => b.status !== 'COMPLIANT')?.id ||
      currentCase.boundingBoxes[0]?.id ||
      ''
  );
  const [filterMode, setFilterMode] = useState<'ALL' | 'ISSUES_ONLY' | 'COMPLIANT_ONLY'>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const runEvaluation = async () => {
      try {
        setIsEvaluating(true);
        const res = await complianceService.evaluateRules({
          category: currentCase.category,
          declarations: currentCase.declarations,
          applicability: currentCase.applicability,
        });
        if (isMounted && res && res.ruleEvaluations && res.ruleEvaluations.length > 0) {
          updateCurrentCase({
            rules: res.ruleEvaluations,
            overallStatus: res.overallStatus,
            findingsCount: {
              compliant: res.summary.compliant,
              potentialNonCompliance: res.summary.potentialNonCompliance,
              needsVerification: res.summary.needsHumanVerification,
            },
          });
        }
      } catch (err) {
        console.warn('Live rule evaluation fallback:', err);
      } finally {
        if (isMounted) setIsEvaluating(false);
      }
    };

    runEvaluation();
    return () => {
      isMounted = false;
    };
  }, [currentCase.id, currentCase.declarations, currentCase.applicability]);

  const selectedBox = currentCase.boundingBoxes.find((b) => b.id === selectedBoxId);

  const filteredBoxes = currentCase.boundingBoxes.filter((b) => {
    if (filterMode === 'ISSUES_ONLY') return b.status !== 'COMPLIANT';
    if (filterMode === 'COMPLIANT_ONLY') return b.status === 'COMPLIANT';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. HEADER: FOCUSED & CLEAN (Does not compete with package) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#111413] tracking-tight flex items-center gap-2">
              <Crosshair className="w-6 h-6 text-[#0E8A8A]" />
              Compliance X-Ray Visual Workspace
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#727A78] mt-0.5">
            Interactive package canvas: Click any highlighted declaration to inspect evidentiary justification, statutory limits, and required officer action.
          </p>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: 8 COLS IMMERSIVE IMAGE CANVAS + 4 COLS CONTEXTUAL EVIDENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Annotated Packaging Canvas (8 cols - Maximum Visual Room) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Restrained Canvas Toolbar */}
          <div className="flex items-center justify-between bg-[#0F1F1E] text-white px-4 py-2 rounded-xl text-xs shadow-xs border border-[#1E3836]">
            {/* Layer Filter Pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#8EA3A0] font-semibold mr-1 text-[11px]">Layer:</span>
              <button
                onClick={() => setFilterMode('ALL')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  filterMode === 'ALL' ? 'bg-[#22C2C2] text-[#0F1F1E] font-bold shadow-xs' : 'text-[#C2C9C8] hover:text-white'
                }`}
              >
                All ({currentCase.boundingBoxes.length})
              </button>
              <button
                onClick={() => setFilterMode('ISSUES_ONLY')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                  filterMode === 'ISSUES_ONLY'
                    ? 'bg-[#C1443A] text-white shadow-xs font-bold'
                    : 'text-[#C2C9C8] hover:text-rose-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                Issues Only ({currentCase.boundingBoxes.filter((b) => b.status !== 'COMPLIANT').length})
              </button>
              <button
                onClick={() => setFilterMode('COMPLIANT_ONLY')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                  filterMode === 'COMPLIANT_ONLY'
                    ? 'bg-[#2F7D5F] text-white shadow-xs font-bold'
                    : 'text-[#C2C9C8] hover:text-emerald-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Compliant ({currentCase.boundingBoxes.filter((b) => b.status === 'COMPLIANT').length})
              </button>
            </div>

            {/* Subtle Zoom Controls */}
            <div className="flex items-center gap-2 text-[#C2C9C8]">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                className="p-1 hover:bg-[#1A2E2C] rounded text-[#C2C9C8] hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-[11px] text-slate-300 w-12 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Large Immersive Package Canvas */}
          <div className="relative aspect-4/5 w-full bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-xl flex items-center justify-center select-none">
            <div
              className="relative w-full h-full transition-transform duration-200 flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={currentCase.image}
                alt="Packaged Commodity Evidentiary Scan"
                className="w-full h-full object-contain filter contrast-105 pointer-events-none"
              />

              {/* Interactive Clickable Bounding Boxes with Visual Emphasis */}
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
                      ? 'bg-emerald-500/30 ring-4 ring-emerald-400/80 shadow-lg'
                      : 'bg-emerald-500/15 hover:bg-emerald-500/25'
                    : box.status === 'POTENTIAL_NON_COMPLIANCE'
                    ? isSelected
                      ? 'bg-rose-500/40 ring-4 ring-rose-400/90 shadow-xl'
                      : 'bg-rose-500/25 hover:bg-rose-500/35'
                    : isSelected
                    ? 'bg-amber-500/40 ring-4 ring-amber-400/90 shadow-xl'
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
                    className={`absolute cursor-pointer border-[2.5px] rounded-lg transition-all duration-150 ${borderColor} ${bgColor} ${
                      isSelected ? 'z-30' : 'z-10'
                    }`}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                  >
                    {/* Floating Label Pill */}
                    <div
                      className={`absolute -top-5 left-0 flex items-center gap-1.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-md shadow-md whitespace-nowrap ${badgeBg}`}
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

              {/* Metric Calibration Baseline */}
              {showRuler && (
                <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-[10px] font-mono text-cyan-300 flex items-center gap-2.5 shadow-md">
                  <span className="w-8 h-1 bg-cyan-400 inline-block border-x border-white"></span>
                  <span>10 mm (148 px) Metrology Scale</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Select Region Pills (Low visual clutter) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Select Declaration:
            </span>
            {currentCase.boundingBoxes.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBoxId(b.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
                  selectedBoxId === b.id
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
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

        {/* Right: Contextual Evidence & Explainability Drawer (4 cols - Focused, Clean) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedBox ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-5 space-y-4">
              {/* Header: Finding Title + StatusBadge */}
              <div className="border-b border-slate-100 pb-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Inspected Declaration Region
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <h3 className="font-black text-base text-slate-900">{selectedBox.label}</h3>
                  <StatusBadge status={selectedBox.status} />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{selectedBox.sourceRegion}</div>
              </div>

              {/* 1. WHAT & WHY (High Visual Prominence) */}
              <div className="space-y-2.5 text-xs">
                {/* WHAT */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    WHAT WAS DETECTED
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedBox.value}
                  </div>
                  {selectedBox.hindiValue && (
                    <div className="text-slate-600 font-medium text-xs mt-0.5">
                      {selectedBox.hindiValue}
                    </div>
                  )}
                </div>

                {/* WHY (Highlighted for Non-Compliance or Review) */}
                {selectedBox.issueReason ? (
                  <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl text-rose-950">
                    <div className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      WHY IT WAS FLAGGED
                    </div>
                    <p className="mt-1 leading-relaxed font-medium">
                      {selectedBox.issueReason}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-[#EDF5F1] border border-[#D4E8DF] rounded-xl text-[#2F7D5F]">
                    <div className="text-[10px] font-bold text-[#2F7D5F] uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2F7D5F]" />
                      RULE SATISFIED
                    </div>
                    <p className="mt-1 leading-relaxed font-medium text-[#3F4544]">
                      Declaration matches gazetted format, font criteria, and statutory metric specifications.
                    </p>
                  </div>
                )}

                {/* 2. STATUTORY REQUIREMENT */}
                <div className="p-3 bg-[#F7F6F3] rounded-xl border border-[#E6E4DF]">
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#727A78] uppercase tracking-wider">
                    <span>APPLICABLE REQUIREMENT</span>
                    <span className="font-mono text-[#0E8A8A] font-bold">{selectedBox.ruleId}</span>
                  </div>
                  <div className="font-bold text-[#111413] mt-1">{selectedBox.ruleName}</div>
                  {selectedBox.legalLimit && (
                    <div className="text-[11px] text-[#727A78] mt-1 font-mono">
                      Threshold: {selectedBox.legalLimit}
                    </div>
                  )}
                </div>

                {/* 3. PROGRESSIVE DISCLOSURE: TECHNICAL METADATA (On Demand) */}
                <div className="pt-1">
                  <button
                    onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-[#F7F6F3] hover:bg-[#EFECE6] text-[#3F4544] text-[11px] font-semibold border border-[#E6E4DF] transition-colors"
                  >
                    <span>{showTechnicalDetails ? 'Hide Technical Metadata' : 'Show Details & Technical Metadata'}</span>
                    <span className="text-[10px] text-[#727A78]">{showTechnicalDetails ? '▲' : '▼'}</span>
                  </button>

                  {showTechnicalDetails && (
                    <div className="space-y-2 mt-2">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 bg-[#F7F6F3] rounded-lg border border-[#E6E4DF]">
                          <span className="text-[#727A78]">Confidence:</span>
                          <div className="font-mono font-bold text-[#111413] text-sm">
                            {Math.round(selectedBox.confidence * 100)}%
                          </div>
                        </div>
                        <div className="p-2.5 bg-[#F7F6F3] rounded-lg border border-[#E6E4DF]">
                          <span className="text-[#727A78]">Coordinates:</span>
                          <div className="font-mono text-[#3F4544]">
                            X:{selectedBox.x}% Y:{selectedBox.y}%
                          </div>
                        </div>
                      </div>

                      {selectedBox.physicalVerificationRequired && (
                        <div className="p-2.5 bg-[#FDF7ED] border border-[#F5E5C9] rounded-lg text-[#C98A2C] text-[11px] leading-relaxed">
                          <span className="font-bold text-[#C98A2C]">System Limitation: </span>
                          <span className="text-[#3F4544]">{selectedBox.physicalVerificationRequired}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 4. RECOMMENDED OFFICER ACTION (Primary CTAs) */}
              <div className="pt-3 border-t border-[#E6E4DF] space-y-2">
                <div className="text-[10px] font-bold text-[#727A78] uppercase tracking-wider">
                  RECOMMENDED OFFICER ACTION
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onProceedToReview && onProceedToReview()}
                    className="py-2.5 px-3 bg-[#22C2C2] hover:bg-[#1EB0B0] text-[#0F1F1E] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Confirm Finding
                  </button>
                  <button
                    onClick={() => alert('Officer Observation: Finding set as dismissed with notes.')}
                    className="py-2.5 px-3 bg-[#F4F3EE] hover:bg-[#E6E4DF] text-[#3F4544] rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#E6E4DF] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Dismiss
                  </button>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <button
                    onClick={() => alert('Field request: Re-scan with macro illumination requested.')}
                    className="text-[#727A78] hover:text-[#111413] font-medium inline-flex items-center gap-1 text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Request Re-scan
                  </button>
                  <button
                    onClick={() => onProceedToReview && onProceedToReview()}
                    className="text-[#0E8A8A] hover:text-[#0b6d6d] font-bold inline-flex items-center gap-1 text-xs"
                  >
                    Full Review Console →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E6E4DF] p-8 text-center text-[#727A78] text-xs">
              Select a bounding box on the package canvas to inspect legal evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
