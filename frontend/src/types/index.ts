export type ComplianceState =
  | 'COMPLIANT'
  | 'POTENTIAL_NON_COMPLIANCE'
  | 'NEEDS_HUMAN_VERIFICATION';

export type CaseStatus =
  | 'Potential Non-Compliance'
  | 'Needs Review'
  | 'Verified'
  | 'Rejected'
  | 'Closed'
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'UNDER_REVIEW'
  | 'COMPLETED';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface BoundingBox {
  id: string;
  label: string;
  value: string;
  hindiValue?: string;
  status: ComplianceState;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  confidence: number;
  ruleId: string;
  ruleName: string;
  sourceRegion: string;
  issueReason?: string;
  legalLimit?: string;
  physicalVerificationRequired?: string;
}

export interface ExtractedDeclaration {
  fieldId: string;
  label: string;
  hindiLabel?: string;
  detectedValue: string;
  detectedHindiValue?: string;
  confidence: number;
  sourceRegion: string;
  status: ComplianceState;
  ruleId: string;
  isMandatory: boolean;
  manualOverride?: string;
  notes?: string;
}

export interface ApplicabilityContext {
  commodity: string;
  packageType: string;
  isImported: boolean;
  isInstitutional: boolean;
  packageCategory: string;
  applicableRequirementsCount: number;
  conditionalRequirementsCount: number;
  potentialExemptionsCount: number;
  statutoryBasis: string;
  rationalePoints: string[];
}

export interface RuleEvaluation {
  ruleId: string;
  requirement: string;
  legalClause: string;
  applicability: 'Mandatory' | 'Conditional' | 'Exempt';
  exceptionClause?: string;
  validationLogic: string;
  effectiveDate: string;
  source: string;
  version: string;
  status: ComplianceState;
  evidenceSnippet: string;
  confidence: number;
  systemLimitation?: string;
  whyExplanation: string;
}

export interface InspectionCase {
  id: string;
  caseId?: string;
  productName: string;
  brand: string;
  manufacturer: string;
  category: string;
  batchNo: string;
  overallStatus: ComplianceState;
  caseStatus: CaseStatus;
  priority: PriorityLevel;
  officer: string;
  officerId: string;
  location: string;
  createdDate: string;
  lastUpdated: string;
  image: string;
  findingsCount: {
    compliant: number;
    potentialNonCompliance: number;
    needsVerification: number;
  };
  applicability: ApplicabilityContext;
  declarations: ExtractedDeclaration[];
  rules: RuleEvaluation[];
  boundingBoxes: BoundingBox[];
  officerNotes?: string;
  officerDecision?: 'CONFIRMED' | 'REJECTED' | 'RESCAN_REQUESTED';
}

export interface ManufacturerProfile {
  id: string;
  name: string;
  registrationNo: string;
  address: string;
  productsInspected: number;
  potentialFindings: number;
  verifiedFindings: number;
  recurringIssues: number;
  complianceRate: number;
  timeline: {
    month: string;
    status: ComplianceState;
    findingsCount: number;
  }[];
  recurringPatterns: {
    category: string;
    count: number;
    severity: PriorityLevel;
    sampleRule: string;
    description: string;
  }[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  caseId: string;
  details: string;
  ipAddress: string;
  hash: string;
}

export interface EvidenceItem {
  id: string;
  caseId: string;
  productName: string;
  thumbnailUrl: string;
  capturedAt: string;
  ruleRef: string;
  status: ComplianceState;
  sha256Hash: string;
  resolution: string;
  captureDevice: string;
  officer: string;
  integrityVerified: boolean;
}

export interface OfflineQueueItem {
  id: string;
  caseId: string;
  productName: string;
  timestamp: string;
  status: 'PENDING' | 'SYNCING' | 'SYNCED';
  imagesCount: number;
  offlineFindings: number;
}

