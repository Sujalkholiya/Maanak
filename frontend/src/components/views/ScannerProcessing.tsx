import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  Cpu,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { InspectionCase } from '../../types';

interface ScannerProcessingProps {
  currentCase: InspectionCase;
  onComplete: () => void;
}

export const ScannerProcessing: React.FC<ScannerProcessingProps> = ({
  currentCase,
  onComplete,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  const pipelineSteps = [
    { label: 'Package detected & normalized', detail: 'Identified 3D geometry & perspective plane' },
    { label: 'Label region & PDP detected', detail: 'Principal Display Panel boundary mapped (416 cm²)' },
    { label: 'Bilingual OCR completed', detail: 'English and Devanagari text tokens synthesized' },
    { label: 'Declarations structured & extracted', detail: '10 legally recognized fields classified' },
    { label: 'Applicability engine determined', detail: 'Evaluated Packaged Commodities Schedule II context' },
    { label: 'Versioned legal rules evaluated', detail: 'Evaluated against Gazette Version 2026.3' },
    { label: 'Compliance X-Ray & evidence generated', detail: 'Cryptographic SHA-256 hash assigned to raw frames' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCompletedSteps((prev) => {
        if (prev < pipelineSteps.length) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(timer);
  }, [pipelineSteps.length]);

  const progressPercent = Math.round((completedSteps / pipelineSteps.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-700 animate-spin" style={{ animationDuration: '3s' }} />
            <h2 className="text-lg font-black text-slate-900">
              Regulatory Intelligence Pipeline
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Processing evidentiary imagery through computer vision, multilingual OCR, and versioned statutory validation.
          </p>
        </div>

        <div className="text-right">
          <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            {progressPercent}% COMPLETE
          </span>
        </div>
      </div>

      {/* Main Grid: Left Package Image, Right Pipeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Package Image with Scanning Laser effect */}
        <div className="md:col-span-5 relative aspect-4/5 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-md">
          <img
            src={currentCase.image}
            alt="Package Being Processed"
            className="w-full h-full object-contain filter contrast-105"
          />

          {/* Animated Scanning Bar */}
          {completedSteps < pipelineSteps.length && (
            <div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/80 animate-pulse"
              style={{
                top: `${(completedSteps / pipelineSteps.length) * 90 + 5}%`,
                transition: 'top 0.4s ease-in-out',
              }}
            ></div>
          )}

          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-mono text-cyan-300 border border-slate-700">
            {currentCase.id}
          </div>
        </div>

        {/* Right: Step-by-Step Progress Checklist */}
        <div className="md:col-span-7 space-y-2.5">
          {pipelineSteps.map((step, idx) => {
            const isDone = completedSteps > idx;
            const isCurrent = completedSteps === idx;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                    : isCurrent
                    ? 'bg-blue-50/80 border-blue-300 text-blue-950 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-700 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-mono text-slate-400">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>{step.label}</span>
                    {isDone && (
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                        DONE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {step.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skip / View Direct Result button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          <span>View Extraction & Applicability Result</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

