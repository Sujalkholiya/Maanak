import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useWorkflowNavigation } from '../../hooks/useWorkflowNavigation';

interface WorkflowNavControlsProps {
  onCustomNext?: () => void;
  onCustomPrev?: () => void;
  isNextDisabled?: boolean;
  nextButtonText?: string;
  prevButtonText?: string;
  className?: string;
}

export const WorkflowNavControls: React.FC<WorkflowNavControlsProps> = ({
  onCustomNext,
  onCustomPrev,
  isNextDisabled = false,
  nextButtonText,
  prevButtonText,
  className = '',
}) => {
  const {
    currentPhase,
    currentPhaseIndex,
    totalPhases,
    isWorkflowRoute,
    isFirstPhase,
    isLastPhase,
    nextPhaseLabel,
    prevPhaseLabel,
    goToNextPhase,
    goToPrevPhase,
  } = useWorkflowNavigation();

  if (!isWorkflowRoute || !currentPhase) {
    return null;
  }

  const handleNext = () => {
    if (onCustomNext) {
      onCustomNext();
    } else {
      goToNextPhase();
    }
  };

  const handlePrev = () => {
    if (onCustomPrev) {
      onCustomPrev();
    } else {
      goToPrevPhase();
    }
  };

  const stepNumber = currentPhase.stepNumber;
  const nextLabel = nextButtonText || (nextPhaseLabel ? `Advance to ${nextPhaseLabel}` : 'Complete Workflow');
  const prevLabel = prevButtonText || (prevPhaseLabel ? `Back to ${prevPhaseLabel}` : 'Previous Step');

  return (
    <nav
      aria-label="Workflow Phase Navigation"
      className={`no-print bg-white px-4 py-3 rounded-xl border border-[#E6E4DF] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold ${className}`}
    >
      {/* Left: Previous Step Button */}
      <button
        disabled={isFirstPhase}
        onClick={handlePrev}
        className="w-full sm:w-auto px-4 py-2 min-h-[44px] bg-[#F4F3EE] hover:bg-[#E6E4DF] disabled:opacity-30 disabled:hover:bg-[#F4F3EE] text-[#3F4544] rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>{prevLabel}</span>
      </button>

      {/* Center: Stage Indicator */}
      <div className="flex items-center gap-2 text-center text-[#727A78] font-medium text-[11px] order-first sm:order-none">
        <span className="font-mono text-[#0E8A8A] font-bold bg-[#E8F9F9] px-2 py-0.5 rounded border border-[#22C2C2]/30">
          Phase {stepNumber} of {totalPhases}
        </span>
        <span className="hidden md:inline">·</span>
        <span className="hidden md:inline font-bold text-[#111413]">{currentPhase.label}</span>
      </div>

      {/* Right: Next Step Button */}
      <div className="w-full sm:w-auto flex items-center justify-end">
        {isLastPhase ? (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-5 py-2 min-h-[44px] bg-[#2F7D5F] hover:bg-[#25664D] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Inspection</span>
          </button>
        ) : (
          <button
            disabled={isNextDisabled}
            onClick={handleNext}
            className="w-full sm:w-auto px-5 py-2 min-h-[44px] bg-[#22C2C2] hover:bg-[#1EB0B0] disabled:opacity-40 disabled:hover:bg-[#22C2C2] text-[#0F1F1E] font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
          >
            <span>{nextLabel}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
};
