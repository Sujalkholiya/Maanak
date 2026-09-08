import {
  PlusCircle,
  ScanLine,
  Crosshair,
  Lock,
  FileText,
} from 'lucide-react';
import { ROUTES } from './routes';
import { WorkflowPhaseItem } from '../../types/workflow';

export const WORKFLOW_PHASES: WorkflowPhaseItem[] = [
  {
    id: 'new-inspection',
    stepNumber: 1,
    label: 'New Inspection',
    shortLabel: 'Inspection',
    route: ROUTES.WORKFLOW.NEW_INSPECTION,
    icon: PlusCircle,
    description: 'Initiate guided case docket and metadata classification',
  },
  {
    id: 'scan-package',
    stepNumber: 2,
    label: 'Scan Package',
    shortLabel: 'Scan',
    route: ROUTES.WORKFLOW.SCAN_PACKAGE,
    icon: ScanLine,
    description: 'High-resolution multi-angle image capture and OCR preprocessing',
  },
  {
    id: 'compliance-xray',
    stepNumber: 3,
    label: 'Compliance X-Ray',
    shortLabel: 'X-Ray',
    route: ROUTES.WORKFLOW.COMPLIANCE_XRAY,
    icon: Crosshair,
    description: 'Visual bounding-box verification against statutory rule library',
  },
  {
    id: 'evidence-vault',
    stepNumber: 4,
    label: 'Evidence Vault',
    shortLabel: 'Evidence',
    route: ROUTES.WORKFLOW.EVIDENCE_VAULT,
    icon: Lock,
    description: 'Cryptographic SHA-256 sealed chain-of-custody artifacts',
  },
  {
    id: 'inspection-report',
    stepNumber: 5,
    label: 'Inspection Report',
    shortLabel: 'Report',
    route: ROUTES.WORKFLOW.INSPECTION_REPORT,
    icon: FileText,
    description: 'Formal Section 18 legal notice and statutory inspection dossier',
  },
];

export function getWorkflowPhaseByRoute(pathname: string): WorkflowPhaseItem | undefined {
  // Direct match
  const exact = WORKFLOW_PHASES.find((phase) => phase.route === pathname);
  if (exact) return exact;

  // Sub-route match (e.g. detailed tools falling under inspection phase)
  if (
    pathname.startsWith('/inspection/declaration') ||
    pathname.startsWith('/inspection/applicability') ||
    pathname.startsWith('/inspection/font-pdp') ||
    pathname.startsWith('/inspection/review')
  ) {
    return WORKFLOW_PHASES[0]; // Associated with new inspection workflow pipeline
  }

  return undefined;
}

export function getWorkflowIndex(pathname: string): number {
  const phase = getWorkflowPhaseByRoute(pathname);
  if (!phase) return -1;
  return WORKFLOW_PHASES.findIndex((p) => p.id === phase.id);
}
