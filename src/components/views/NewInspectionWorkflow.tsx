import React, { useState } from 'react';
import {
  Camera,
  FileCheck2,
  Scale,
  ShieldCheck,
  UserCheck,
  FileText,
  ChevronRight,
  ChevronLeft,
  Crosshair,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { InspectionCase } from '../../types';
import { CaptureScreen } from './CaptureScreen';
import { DeclarationWorkspace } from './DeclarationWorkspace';
import { ApplicabilityEngineView } from './ApplicabilityEngineView';
import { RuleEngineView } from './RuleEngineView';
import { HumanVerificationView } from './HumanVerificationView';
import { InspectionReportView } from './InspectionReportView';
import { ScannerProcessing } from './ScannerProcessing';
import { DemoBadge } from '../common/DemoBadge';

interface NewInspectionWorkflowProps {
  currentCase: InspectionCase;
  onOpenXRay: () => void;
  onSelectSampleCase: (caseId: string) => void;
}

export const NewInspectionWorkflow: React.FC<NewInspectionWorkflowProps> = ({
  currentCase,
  onOpenXRay,
  onSelectSampleCase,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const steps = [
    { num: 1, id: 'CAPTURE', label: 'Capture Evidence', short: '01 Capture', icon: Camera },
    { num: 2, id: 'EXTRACT', label: 'Bilingual OCR', short: '02 Extract', icon: FileCheck2 },
    { num: 3, id: 'APPLICABILITY', label: 'Applicability Engine', short: '03 Applicability', icon: Scale },
    { num: 4, id: 'RULES', label: 'Rule Validation', short: '04 Rules', icon: ShieldCheck },
    { num: 5, id: 'REVIEW', label: 'Officer Verification', short: '05 Review', icon: UserCheck },
    { num: 6, id: 'REPORT', label: 'Legal Report', short: '06 Report', icon: FileText },
  ];

  const handleProceedToAnalysis = () => {
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setCurrentStep(2);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. PERSISTENT CASE STRIP (Clean, Uncluttered, High Contrast) */}
      <div className="bg-[#0B192C] text-white p-4 rounded-2xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 min-w-0">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
              Active Case Docket
            </span>
            <span className="font-mono font-bold text-cyan-300 text-sm">
              {currentCase.id}
            </span>
          </div>
          <div className="border-l border-slate-700/80 pl-4 min-w-0">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
              Packaged Commodity
            </span>
            <span className="font-semibold text-white truncate max-w-xs block">
              {currentCase.productName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
              Time Logged
            </span>
            <span className="font-mono text-slate-300 text-[11px]">{currentCase.createdDate}</span>
          </div>
          <div className="border-l border-slate-700/80 pl-4 text-right">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
              Investigating Officer
            </span>
            <span className="font-bold text-white text-xs">{currentCase.officer.split('(')[0]}</span>
          </div>
        </div>
      </div>

      {/* 2. VISUALLY CONNECTED WORKFLOW PIPELINE (Unmistakable Journey) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative flex items-center justify-between gap-2 overflow-x-auto py-1">
          {/* Connecting Base Line */}
          <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 h-0.5 bg-slate-200 -z-0 hidden md:block"></div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = currentStep === step.num;
            const isPast = currentStep > step.num;

            return (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`relative z-10 flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-blue-700 text-white shadow-md ring-4 ring-blue-100'
                    : isPast
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/80 hover:bg-emerald-100'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-mono ${
                    isCurrent
                      ? 'bg-white text-blue-800 font-bold'
                      : isPast
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isPast ? '✓' : step.num}
                </div>
                <div className="text-left">
                  <div className="leading-tight">{step.short}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. STEP CONTENT WORKSPACE */}
      {isProcessing ? (
        <ScannerProcessing currentCase={currentCase} onComplete={handleProcessingComplete} />
      ) : (
        <>
          {currentStep === 1 && (
            <CaptureScreen
              currentCase={currentCase}
              onProceedToAnalysis={handleProceedToAnalysis}
              onSelectSampleCase={onSelectSampleCase}
            />
          )}

          {currentStep === 2 && (
            <DeclarationWorkspace
              currentCase={currentCase}
              onProceedToApplicability={() => setCurrentStep(3)}
              onOpenXRay={onOpenXRay}
            />
          )}

          {currentStep === 3 && (
            <ApplicabilityEngineView
              currentCase={currentCase}
              onProceedToRuleValidation={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && (
            <RuleEngineView
              currentCase={currentCase}
              onOpenXRay={onOpenXRay}
              onProceedToReview={() => setCurrentStep(5)}
            />
          )}

          {currentStep === 5 && (
            <HumanVerificationView
              currentCase={currentCase}
              onProceedToReport={() => setCurrentStep(6)}
            />
          )}

          {currentStep === 6 && <InspectionReportView currentCase={currentCase} />}
        </>
      )}

      {/* 4. WORKFLOW BOTTOM CONTROLS */}
      {!isProcessing && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between text-xs font-semibold">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Phase
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenXRay}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <span>Inspect in Compliance X-Ray</span>
            </button>

            {currentStep < 6 && (
              <button
                onClick={() => {
                  if (currentStep === 1) {
                    handleProceedToAnalysis();
                  } else {
                    setCurrentStep((s) => Math.min(6, s + 1));
                  }
                }}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Advance to Next Phase</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
