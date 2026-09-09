import { api } from './api';
import { ApplicabilityContext, ExtractedDeclaration, RuleEvaluation, ComplianceState } from '../types';

export interface EvaluateApplicabilityPayload {
  productName?: string;
  commodity?: string;
  category?: string;
  packageType?: string;
  isImported?: boolean;
  isInstitutional?: boolean;
  declarations?: ExtractedDeclaration[];
}

export interface EvaluateApplicabilityResponse {
  success: boolean;
  evaluation: ApplicabilityContext;
}

export interface EvaluateRulesPayload {
  category?: string;
  declarations?: ExtractedDeclaration[];
  applicability?: Partial<ApplicabilityContext>;
}

export interface EvaluateRulesResponse {
  success: boolean;
  overallStatus: ComplianceState;
  summary: {
    totalRules: number;
    compliant: number;
    potentialNonCompliance: number;
    needsHumanVerification: number;
  };
  ruleEvaluations: RuleEvaluation[];
}

export interface PdpDeclarationMeasurement {
  declarationKey?: string;
  label?: string;
  measuredHeightMm: number;
}

export interface EvaluatePdpPayload {
  packageShape?: string;
  heightCm?: number;
  widthCm?: number;
  circumferenceCm?: number;
  totalAreaCm?: number;
  isEmbossedOrMolded?: boolean;
  measuredDeclarations?: PdpDeclarationMeasurement[];
}

export interface EvaluatePdpResponse {
  success: boolean;
  packageDimensions: {
    packageShape: string;
    heightCm: number;
    widthCm: number;
    circumferenceCm: number;
  };
  pdpAreaSqCm: number;
  calculationMethod: string;
  statutoryRule: string;
  scheduleRef: string;
  areaTier: string;
  minNumeralHeightMm: number;
  overallStatus: ComplianceState;
  evaluatedDeclarations: Array<{
    declarationKey: string;
    label: string;
    measuredHeightMm: number;
    statutoryMinimumMm: number;
    isCompliant: boolean;
    status: ComplianceState;
    differenceMm: number;
    legalClause: string;
    notes: string;
  }>;
}

export const complianceService = {
  async evaluateApplicability(
    payload: EvaluateApplicabilityPayload
  ): Promise<EvaluateApplicabilityResponse> {
    return api.post<EvaluateApplicabilityResponse>('/applicability/evaluate', payload);
  },

  async evaluateRules(
    payload: EvaluateRulesPayload
  ): Promise<EvaluateRulesResponse> {
    return api.post<EvaluateRulesResponse>('/rules/evaluate', payload);
  },

  async evaluatePdp(
    payload: EvaluatePdpPayload
  ): Promise<EvaluatePdpResponse> {
    return api.post<EvaluatePdpResponse>('/pdp/evaluate', payload);
  },

  async getRuleLibrary(): Promise<any[]> {
    try {
      const res = await api.get<{ success: boolean; rules: any[] }>('/rules');
      if (res && Array.isArray(res.rules)) {
        return res.rules;
      }
      return [];
    } catch (e) {
      console.warn('API /rules library fetch failed:', e);
      return [];
    }
  },
};
