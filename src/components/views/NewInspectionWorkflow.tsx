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
  Sparkles,
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
    { num: 1, id: 'CAPTURE', label: '01 CAPTURE', icon: Camera },
    { num: 2, id: 'EXTRACT', label: '02 EXTRACT', icon: FileCheck2 },
    { num: 3, id: 'APPLICABILITY', label: '03 DETERMINE APPLICABILITY', icon: Scale },
    { num: 4, id: 'RULES', label: '04 CHECK RULES', icon: ShieldCheck },
    { num: 5, id: 'REVIEW', label: '05 REVIEW', icon: UserCheck },
    { num: 6, id: 'REPORT', label: '06 REPORT', icon: FileText },
  ];

  const handleProceedToAnalysis = () => {
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setCurrentStep(2);
  };

  return (
    <div className="space-y-6">
      {/* Persistent Inspection Metadata Bar */}
      <div className="bg-[#0F172A] text-white p-4 rounded-xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Case Identifier</span>
            <span className="font-mono font-bold text-cyan-300 text-sm">{currentCase.id}</span>
          </div>
          <div className="border-l border-slate-700 pl-4">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Commodity</span>
            <span className="font-semibold text-white truncate max-w-xs block">{currentCase.productName}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Inspection Timestamp</span>
            <span className="font-mono text-slate-300">{currentCase.createdDate}</span>
          </div>
          <div className="border-l border-slate-700 pl-4 text-right">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Authorized Officer</span>
            <span className="font-bold text-white">{currentCase.officer}</span>
          </div>
        </div>
      </div>

      {/* Horizontal Stepper */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCurrent = currentStep === step.num;
            const isPast = currentStep > step.num;

            return (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-blue-700 text-white shadow-xs'
                    : isPast
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : isPast ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Processing overlay state */}
      {isProcessing ? (
        <ScannerProcessing currentCase={currentCase} onComplete={handleProcessingComplete} />
      ) : (
        <>
          {/* Active Step Content */}
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

      {/* Stepper Navigation Footer */}
      {!isProcessing && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs font-semibold">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Step
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenXRay}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              Open Compliance X-Ray
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
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

