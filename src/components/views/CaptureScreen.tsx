import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Layers,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Crosshair,
  RefreshCw,
  Sliders,
  ChevronRight,
  Info,
} from 'lucide-react';
import { InspectionCase } from '../../types';
import { DemoBadge } from '../common/DemoBadge';

interface CaptureScreenProps {
  currentCase: InspectionCase;
  onProceedToAnalysis: () => void;
  onSelectSampleCase: (caseId: string) => void;
}

export const CaptureScreen: React.FC<CaptureScreenProps> = ({
  currentCase,
  onProceedToAnalysis,
  onSelectSampleCase,
}) => {
  const [activeAngle, setActiveAngle] = useState<'FRONT' | 'BACK' | 'SIDE' | 'BOTTOM'>('BACK');
  const [hasReferenceMarker, setHasReferenceMarker] = useState(true);
  const [simulatedCapture, setSimulatedCapture] = useState(false);

  const angleImages: Record<string, string> = {
    FRONT: 'https://images.unsplash.com/photo-1508061252445-5350f377c130?auto=format&fit=crop&w=1200&q=80',
    BACK: currentCase.image || 'https://images.unsplash.com/photo-1508061252445-5350f377c130?auto=format&fit=crop&w=1200&q=80',
    SIDE: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    BOTTOM: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900">Capture Package Evidence</h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Capture multi-angle evidentiary photographs under diffuse ambient lighting. Calibrated markers enable metric character measurement.
          </p>
        </div>

        {/* Switch demo sample package */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Sample Commodity:</span>
          <select
            value={currentCase.id}
            onChange={(e) => onSelectSampleCase(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
          >
            <option value="CASE-2026-0841">Royal Feast Almonds (Dual MRP Discrepancy)</option>
            <option value="CASE-2026-0842">Himalayan Basmati Rice (Compliant Standard)</option>
            <option value="CASE-2026-0843">SunGlow Sunflower Oil (Missing USP & Temp)</option>
            <option value="CASE-2026-0844">Everfresh Baby Formula (Contrast & IMS)</option>
            <option value="CASE-2026-0845">Apex Cleaner (Institutional Exemption)</option>
          </select>
        </div>
      </div>

      {/* Main Capture Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Viewport (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Angle Selection Tabs */}
          <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl border border-slate-300">
            <div className="flex gap-1">
              {(['FRONT', 'BACK', 'SIDE', 'BOTTOM'] as const).map((angle) => (
                <button
                  key={angle}
                  onClick={() => setActiveAngle(angle)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeAngle === angle
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {angle} PANEL
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 pr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Optical Feed Active
            </div>
          </div>

          {/* Large Image / Viewfinder Area */}
          <div className="relative aspect-4/3 w-full bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-lg group">
            <img
              src={angleImages[activeAngle]}
              alt={`Package ${activeAngle}`}
              className="w-full h-full object-contain filter contrast-105"
            />

            {/* Viewfinder Overlay Guides */}
            <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="border-t-2 border-l-2 border-cyan-400/70 w-8 h-8"></div>
                <div className="border-t-2 border-r-2 border-cyan-400/70 w-8 h-8"></div>
              </div>

              {/* Center Crosshair */}
              <div className="self-center flex flex-col items-center">
                <Crosshair className="w-10 h-10 text-cyan-400/50 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-300/80 bg-slate-900/80 px-2 py-0.5 rounded mt-1">
                  ALIGN PRINCIPAL DISPLAY PANEL
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div className="border-b-2 border-l-2 border-cyan-400/70 w-8 h-8"></div>
                <div className="border-b-2 border-r-2 border-cyan-400/70 w-8 h-8"></div>
              </div>
            </div>

            {/* Reference Marker Graphic if Enabled */}
            {hasReferenceMarker && (
              <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-emerald-400/70 rounded-lg p-2 text-white text-[11px] shadow-md flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-slate-950">
                  REF
                </div>
                <div>
                  <span className="font-semibold text-emerald-300">Metric Calibration Marker Detected</span>
                  <div className="text-[10px] text-slate-400">Scale: 1.00 mm = 14.8 px (±0.05)</div>
                </div>
              </div>
            )}

            {/* Capture action bar overlay */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setSimulatedCapture(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md flex items-center gap-2 backdrop-blur-xs transition-colors"
              >
                <Camera className="w-4 h-4" />
                Capture Frame
              </button>
              <button
                onClick={() => alert('Demo: Upload image from field terminal')}
                className="bg-slate-800/90 hover:bg-slate-700 text-white text-xs px-3 py-2.5 rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
            </div>
          </div>

          {/* Bottom helper notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Officer Capture Advisory:</span> For commodities packaged in flexible pouches, ensure the label is flattened to prevent optical perspective foreshortening from distorting mandatory numeral measurements.
            </div>
          </div>
        </div>

        {/* Right Quality & Calibration Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Image Quality Score Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Optical Quality Assessment</h3>
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Score: 86% (Good)
              </span>
            </div>

            {/* Quality Checklist */}
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Resolution
                </span>
                <span className="font-mono text-slate-600">4032 × 3024 (✓ High)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Motion Blur
                </span>
                <span className="font-mono text-slate-600">Sharp (Laplacian &gt; 240)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ambient Lighting
                </span>
                <span className="font-mono text-slate-600">Optimal (520 Lux)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Planar Perspective
                </span>
                <span className="font-mono text-slate-600">Skew &lt; 2.1°</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200">
                <span className="font-medium text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Surface Specular Glare
                </span>
                <span className="font-mono text-amber-800">Minor Specular (7%)</span>
              </div>
            </div>

            {/* Technical Limitation Disclaimer */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">System Technical Limitation:</span>
              <p className="mt-0.5">
                Perspective distortion may affect visual measurement. If font height falls within ±0.5 mm of statutory thresholds, physical caliper verification is flagged.
              </p>
            </div>
          </div>

          {/* Reference Marker Calibration Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Physical Scale Calibration</h3>
              <button
                onClick={() => setHasReferenceMarker(!hasReferenceMarker)}
                className="text-xs text-blue-700 font-semibold hover:underline"
              >
                {hasReferenceMarker ? 'Disable Marker' : 'Enable Marker'}
              </button>
            </div>

            <div className="mt-3 text-xs">
              {hasReferenceMarker ? (
                <div className="space-y-2 text-slate-700">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Reference Target Detected
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Calibration scale locked from certified 50mm metrology target coupon.
                  </p>
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200 font-mono text-[11px] text-emerald-900">
                    Pixel Scale: 14.8 px/mm · Status: CALIBRATED
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-slate-700">
                  <div className="flex items-center gap-2 text-amber-800 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Calibration Unavailable
                  </div>
                  <p className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200 leading-normal">
                    Physical scale cannot be reliably estimated from this image alone without reference marker or fixed-focus hardware sensor.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Primary Proceed Action */}
          <button
            onClick={onProceedToAnalysis}
            className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
          >
            <span>Proceed to Declaration Extraction</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

