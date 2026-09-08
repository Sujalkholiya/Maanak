import { LucideIcon } from 'lucide-react';

export type WorkflowPhaseStatus = 'completed' | 'active' | 'pending';

export interface WorkflowPhaseItem {
  id: string;
  stepNumber: number;
  label: string;
  shortLabel: string;
  route: string;
  icon?: LucideIcon;
  description: string;
}

export interface WorkflowState {
  currentPhaseIndex: number;
  currentPhase: WorkflowPhaseItem;
  totalPhases: number;
  isFirstPhase: boolean;
  isLastPhase: boolean;
  nextRoute: string | null;
  prevRoute: string | null;
}
