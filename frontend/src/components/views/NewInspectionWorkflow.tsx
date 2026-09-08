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
  Check,
} from 'lucide-react';
import { InspectionCase } from '../../types';
import { CaptureScreen } from './CaptureScreen';
import { DeclarationWorkspace } from './DeclarationWorkspace';
import { ApplicabilityEngineView } from './ApplicabilityEngineView';
import { RuleEngineView } from './RuleEngineView';
import { HumanVerificationView } from './HumanVerificationView';
import { InspectionReportView } from './InspectionReportView';
import { ScannerProcessing } from './ScannerProcessing';

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
    { num: 1, id: 'CAPTURE', label: 'Capture', icon: Camera },
    { num: 2, id: 'EXTRACT', label: 'OCR Extract', icon: FileCheck2 },
    { num: 3, id: 'APPLICABILITY', label: 'Applicability', icon: Scale },
    { num: 4, id: 'RULES', label: 'Rule Validation', icon: ShieldCheck },
    { num: 5, id: 'REVIEW', label: 'Officer Review', icon: UserCheck },
    { num: 6, id: 'REPORT', label: 'Legal Notice', icon: FileText },
  ];

  const handleProceedToAnalysis = () => {
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setCurrentStep(2);
  };

  return (
    <div className="space-y-3.5 max-w-6xl mx-auto pb-8">
      {/* 1. CLEAN CASE DOCKET STRIP (White card, unified neutral styling) */}
      <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 shrink-0">
            {currentCase.id}
          </span>
          <span className="font-bold text-slate-900 truncate">
            {currentCase.productName}
          </span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            · {currentCase.category}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500 shrink-0">
          <span className="hidden md:inline">
            Officer: <strong className="text-slate-700 font-medium">{currentCase.officer.split('(')[0]}</strong>
          </span>
          <span className="text-slate-400">
            {currentCase.createdDate}
          </span>
        </div>
      </div>

      {/* 2. COMPACT STEP TRACKER */}
      <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-1 overflow-x-auto">
          {steps.map((step, idx) => {
            const isCurrent = currentStep === step.num;
            const isPast = currentStep > step.num;

            return (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${isCurrent
                      ? 'bg-blue-700 text-white shadow-xs'
                      : isPast
                        ? 'text-emerald-700 hover:bg-emerald-50'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${isCurrent
                        ? 'bg-white text-blue-700'
                        : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                  >
                    {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : step.num}
                  </div>
                  <span className="whitespace-nowrap">{step.label}</span>
                </button>

                {idx < steps.length - 1 && (
                  <div
                    className={`hidden sm:block flex-1 h-0.5 min-w-3 max-w-8 mx-1 transition-colors ${isPast ? 'bg-emerald-400' : 'bg-slate-200'
                      }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. STEP CONTENT WORKSPACE */}
      {isProcessing ? (
        <ScannerProcessing currentCase={currentCase} onComplete={handleProcessingComplete} />
      ) : (
        <div className="pt-1">
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
        </div>
      )}

      {/* 4. STREAMLINED WORKFLOW BOTTOM CONTROLS */}
      {!isProcessing && (
        <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs font-semibold">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center gap-2.5">
            {/* Demoted to secondary ghost action */}
            <button
              onClick={onOpenXRay}
              className="px-3 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open deep inspection overlay"
            >
              <Crosshair className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Inspect in Compliance X-Ray</span>
              <span className="sm:hidden">X-Ray</span>
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
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>Advance to Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
