import { useLocation, useNavigate } from 'react-router-dom';
import {
  WORKFLOW_PHASES,
  getWorkflowPhaseByRoute,
  getWorkflowIndex,
} from '../app/router/workflow';
import { WorkflowPhaseItem } from '../types/workflow';

export interface WorkflowNavigationHook {
  currentPhase: WorkflowPhaseItem | undefined;
  currentPhaseIndex: number;
  totalPhases: number;
  isWorkflowRoute: boolean;
  isFirstPhase: boolean;
  isLastPhase: boolean;
  nextRoute: string | null;
  prevRoute: string | null;
  nextPhaseLabel: string | null;
  prevPhaseLabel: string | null;
  goToNextPhase: () => void;
  goToPrevPhase: () => void;
  goToPhase: (stepNumber: number) => void;
}

export function useWorkflowNavigation(): WorkflowNavigationHook {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPhase = getWorkflowPhaseByRoute(location.pathname);
  const currentPhaseIndex = getWorkflowIndex(location.pathname);
  const totalPhases = WORKFLOW_PHASES.length;

  const isWorkflowRoute = currentPhaseIndex >= 0;
  const isFirstPhase = currentPhaseIndex === 0;
  const isLastPhase = currentPhaseIndex === totalPhases - 1;

  const nextPhase =
    isWorkflowRoute && !isLastPhase ? WORKFLOW_PHASES[currentPhaseIndex + 1] : null;
  const prevPhase =
    isWorkflowRoute && !isFirstPhase ? WORKFLOW_PHASES[currentPhaseIndex - 1] : null;

  const nextRoute = nextPhase ? nextPhase.route : null;
  const prevRoute = prevPhase ? prevPhase.route : null;
  const nextPhaseLabel = nextPhase ? nextPhase.label : null;
  const prevPhaseLabel = prevPhase ? prevPhase.label : null;

  const goToNextPhase = () => {
    if (nextRoute) {
      navigate(nextRoute);
    }
  };

  const goToPrevPhase = () => {
    if (prevRoute) {
      navigate(prevRoute);
    }
  };

  const goToPhase = (stepNumber: number) => {
    const target = WORKFLOW_PHASES.find((p) => p.stepNumber === stepNumber);
    if (target) {
      navigate(target.route);
    }
  };

  return {
    currentPhase,
    currentPhaseIndex,
    totalPhases,
    isWorkflowRoute,
    isFirstPhase,
    isLastPhase,
    nextRoute,
    prevRoute,
    nextPhaseLabel,
    prevPhaseLabel,
    goToNextPhase,
    goToPrevPhase,
    goToPhase,
  };
}
