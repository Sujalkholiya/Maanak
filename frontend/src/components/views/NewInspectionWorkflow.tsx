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
      <div className="bg-white px-4 py-2.5 rounded-xl border border-[#E6E4DF] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[10px] font-mono font-bold bg-[#22C2C2]/15 text-[#0E8A8A] px-2 py-0.5 rounded border border-[#22C2C2]/30 shrink-0">
            {currentCase.id}
          </span>
          <span className="font-bold text-[#111413] truncate">
            {currentCase.productName}
          </span>
          <span className="text-[#727A78] text-[11px] hidden sm:inline">
            · {currentCase.category}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#727A78] shrink-0">
          <span className="hidden md:inline">
            Officer: <strong className="text-[#111413] font-medium">{currentCase.officer.split('(')[0]}</strong>
          </span>
          <span className="text-[#727A78]">
            {currentCase.createdDate}
          </span>
        </div>
      </div>

      {/* 2. COMPACT STEP TRACKER */}
      <div className="bg-white px-4 py-2 rounded-xl border border-[#E6E4DF] shadow-xs">
        <div className="flex items-center justify-between gap-1 overflow-x-auto">
          {steps.map((step, idx) => {
            const isCurrent = currentStep === step.num;
            const isPast = currentStep > step.num;

            return (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${isCurrent
                      ? 'bg-[#22C2C2] text-[#0F1F1E] font-bold shadow-xs'
                      : isPast
                        ? 'text-[#2F7D5F] hover:bg-[#EDF5F1]'
                        : 'text-[#727A78] hover:bg-[#F4F3EE] hover:text-[#111413]'
                    }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${isCurrent
                        ? 'bg-[#0F1F1E] text-[#22C2C2]'
                        : isPast
                          ? 'bg-[#2F7D5F] text-white'
                          : 'bg-[#E6E4DF] text-[#727A78]'
                      }`}
                  >
                    {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : step.num}
                  </div>
                  <span className="whitespace-nowrap">{step.label}</span>
                </button>

                {idx < steps.length - 1 && (
                  <div
                    className={`hidden sm:block flex-1 h-0.5 min-w-3 max-w-8 mx-1 transition-colors ${isPast ? 'bg-[#2F7D5F]' : 'bg-[#E6E4DF]'
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
        <div className="bg-white px-4 py-3 rounded-xl border border-[#E6E4DF] shadow-xs flex items-center justify-between text-xs font-semibold">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            className="px-3.5 py-2 bg-[#F4F3EE] hover:bg-[#E6E4DF] disabled:opacity-30 text-[#3F4544] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center gap-2.5">
            {/* Demoted to secondary ghost action */}
            <button
              onClick={onOpenXRay}
              className="px-3 py-2 text-[#3F4544] hover:text-[#111413] border border-[#E6E4DF] hover:border-[#22C2C2] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open deep inspection overlay"
            >
              <Crosshair className="w-3.5 h-3.5 text-[#0E8A8A]" />
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
                className="px-4 py-2 bg-[#22C2C2] hover:bg-[#1EB0B0] text-[#0F1F1E] font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
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
