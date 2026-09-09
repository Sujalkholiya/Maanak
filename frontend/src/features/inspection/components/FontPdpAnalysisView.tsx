import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Ruler,
  Maximize2,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { InspectionCase } from '../../../types';
import { DemoBadge } from '../../../components/common/DemoBadge';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { complianceService, EvaluatePdpResponse } from '../../../services/complianceService';

interface FontPdpAnalysisViewProps {
  currentCase: InspectionCase;
  onProceedToReview: () => void;
}

export const FontPdpAnalysisView: React.FC<FontPdpAnalysisViewProps> = ({
  currentCase,
  onProceedToReview,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<'NET_QTY' | 'MRP' | 'MFR'>('NET_QTY');
  const [pdpResult, setPdpResult] = useState<EvaluatePdpResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    const runPdp = async () => {
      try {
        const res = await complianceService.evaluatePdp({
          packageShape: 'rectangular',
          heightCm: 26.0,
          widthCm: 16.0,
          measuredDeclarations: [
            { declarationKey: 'NET_QTY', label: 'Net Quantity', measuredHeightMm: 2.4 },
            { declarationKey: 'MRP', label: 'MRP Numeral', measuredHeightMm: 3.2 },
            { declarationKey: 'MFR', label: 'Manufacturer Details', measuredHeightMm: 1.8 },
          ],
        });
        if (isMounted && res && res.success) {
          setPdpResult(res);
        }
      } catch (err) {
        console.warn('Live PDP evaluation fallback:', err);
      }
    };
    runPdp();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-blue-700" />
              Principal Display Panel (PDP) & Font Measurement Workspace
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Optical estimation of PDP surface area and statutory character height under Schedule II of Packaged Commodities Rules.
          </p>
        </div>

        <button
          onClick={onProceedToReview}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <span>Send to Officer Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mandatory Regulatory Warning Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-900 text-sm">
            Statutory Optical Adjudication Advisory
          </div>
          <p className="leading-relaxed">
            Image-based measurement may be affected by camera distance, perspective, lens characteristics, resolution, lighting glare, and flexible package geometry. Digital calculations are <strong>strictly advisory estimates</strong>. Legally binding measurements in statutory seizure or prosecution require verified physical micrometers, traveling microscopes, or certified optical comparators.
          </p>
        </div>
      </div>

      {/* Main Measurement Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Calibrated Visual Measurement Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-800">
                Optical Caliper View — Macro Zoom (4.2x)
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                Resolution: 14.8 px / mm
              </span>
            </div>

            {/* Macro crop visual area with SVG ruler overlays */}
            <div className="relative aspect-16/10 w-full bg-slate-950 rounded-xl overflow-hidden mt-3 border-2 border-slate-800 flex items-center justify-center">
              {/* Synthetic Macro Numeral Image Representation */}
              <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                {/* Simulated high-contrast macro crop of "500 g" */}
                <div className="relative p-8 border border-dashed border-cyan-500/40 rounded-lg bg-slate-950/80">
                  <span className="font-mono text-6xl font-black tracking-tight text-white select-none">
                    500 g
                  </span>

                  {/* Character bounding box lines */}
                  <div className="absolute inset-x-8 top-8 bottom-8 border-2 border-amber-400 pointer-events-none">
                    <span className="absolute -top-5 left-0 text-[10px] font-mono text-amber-300 bg-slate-900 px-1 border border-amber-400/60 rounded">
                      Numeral Height Box
                    </span>
                  </div>

                  {/* Vertical measurement caliper ruler on the right */}
                  <div className="absolute -right-8 top-8 bottom-8 w-6 flex flex-col justify-between items-center text-cyan-400 font-mono text-[10px]">
                    <div className="w-3 border-t-2 border-cyan-400"></div>
                    <div className="h-full border-r-2 border-dashed border-cyan-400 flex items-center pr-2">
                      <span className="rotate-90 origin-center text-[10px] whitespace-nowrap">
                        Est: 2.4 mm
                      </span>
                    </div>
                    <div className="w-3 border-b-2 border-cyan-400"></div>
                  </div>

                  {/* Statutory requirement baseline guideline */}
                  <div className="absolute -right-16 -top-2 bottom-8 w-6 border-r-2 border-rose-500 flex items-center pr-2">
                    <span className="text-rose-400 text-[10px] font-mono font-bold whitespace-nowrap -rotate-90">
                      Req: 4.0 mm
                    </span>
                  </div>
                </div>

                {/* Reference scale grid */}
                <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700 px-2 py-1 rounded text-[10px] font-mono text-emerald-400">
                  Grid: 0.5 mm intervals · Perspective Corrected
                </div>
              </div>
            </div>

            {/* Selector buttons for target fields */}
            <div className="flex gap-2 mt-3 text-xs">
              <button
                onClick={() => setSelectedCharacter('NET_QTY')}
                className={`flex-1 py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                  selectedCharacter === 'NET_QTY'
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Net Quantity ("500 g")
              </button>
              <button
                onClick={() => setSelectedCharacter('MRP')}
                className={`flex-1 py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                  selectedCharacter === 'MRP'
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                MRP Numeral ("₹420")
              </button>
              <button
                onClick={() => setSelectedCharacter('MFR')}
                className={`flex-1 py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                  selectedCharacter === 'MFR'
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Manufacturer Address
              </button>
            </div>
          </div>
        </div>

        {/* Right: Metrics & Comparison vs Schedule II (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Measurement Parameter
              </div>
              <h3 className="font-black text-base text-slate-900 mt-0.5">
                Schedule II Numeral Height Evaluation
              </h3>
            </div>

            {/* 3 Metric Rows */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-slate-500 font-semibold">Principal Display Panel (PDP) Area</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                    ~416 cm² (160mm × 260mm)
                  </div>
                </div>
                <span className="text-[11px] font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  Table I: Range 200–500 cm²
                </span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-amber-800 font-semibold">Estimated Visual Height</span>
                  <span className="font-mono font-bold text-amber-900 text-sm">
                    2.4 mm (±0.4 mm)
                  </span>
                </div>
                <div className="text-[11px] text-amber-700 mt-1">
                  Confidence: 84% · Optical Perspective Variance
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Statutory Minimum Threshold</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">4.0 mm</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Legal Reference: Schedule II Table I Row 3
                </div>
              </div>
            </div>

            {/* Adjudication Status */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-300 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">Current Determination:</span>
                <StatusBadge status="NEEDS_HUMAN_VERIFICATION" size="sm" />
              </div>
              <p className="text-[11px] text-amber-900 mt-1.5 leading-relaxed">
                Because visual estimation (2.4 mm) is within uncertainty range of curvature, digital analysis cannot establish a conclusive violation. Physical verification by the inspecting officer using an authorized optical comparator is mandatory.
              </p>
            </div>

            {/* Officer Action */}
            <div className="pt-2">
              <button
                onClick={onProceedToReview}
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
              >
                Confirm Physical Gauge Requirement in Case File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

