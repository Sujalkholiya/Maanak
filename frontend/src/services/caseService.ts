import { api } from './api';
import { DEMO_CASES } from '../data/mockData';
import { InspectionCase } from '../types';

interface GetCasesResponse {
  success: boolean;
  count: number;
  cases: any[];
}

interface SingleCaseResponse {
  success: boolean;
  case: any;
}

const normalizeCase = (c: any): InspectionCase => {
  if (!c) return DEMO_CASES[0];
  return {
    ...c,
    id: c.caseId || c.id || c._id,
    caseId: c.caseId || c.id || c._id,
    productName: c.productName || 'Unnamed Packaged Commodity',
    category: c.category || 'Standard Retail Commodity',
    manufacturer: c.manufacturer || '',
    batchNo: c.batchNo || '',
    brand: c.brand || '',
    location: c.location || 'Depot Inspection Unit',
    overallStatus: c.overallStatus || 'NEEDS_HUMAN_VERIFICATION',
    caseStatus: c.caseStatus || 'Needs Review',
    priority: c.priority || 'Medium',
    officer: c.officer || 'Officer Vikram Sharma (LM-DL-4029)',
    officerId: c.officerId || 'LM-DL-4029',
    image: c.image || DEMO_CASES[0].image,
    createdDate: c.createdDate || new Date().toISOString().split('T')[0],
    lastUpdated: c.lastUpdated || new Date().toISOString().split('T')[0],
    findingsCount: c.findingsCount || {
      compliant: (c.rules || []).filter((r: any) => r.status === 'COMPLIANT').length,
      potentialNonCompliance: (c.rules || []).filter((r: any) => r.status === 'POTENTIAL_NON_COMPLIANCE').length,
      needsVerification: (c.rules || []).filter((r: any) => r.status === 'NEEDS_HUMAN_VERIFICATION').length,
    },
    applicability: c.applicability || DEMO_CASES[0].applicability,
    declarations: c.declarations || [],
    rules: c.rules || [],
    boundingBoxes: c.boundingBoxes || [],
    officerNotes: c.officerNotes || '',
    officerDecision: c.officerDecision || 'IDLE',
  };
};

export const caseService = {
  async getAllCases(): Promise<InspectionCase[]> {
    try {
      const res = await api.get<any>('/cases');
      const list = Array.isArray(res) ? res : (res?.cases || res?.data || []);
      if (Array.isArray(list) && list.length > 0) {
        return list.map(normalizeCase);
      }
      return DEMO_CASES;
    } catch (error) {
      console.warn('API /cases unavailable, falling back to cached demo cases:', error);
      return DEMO_CASES;
    }
  },

  async getCaseById(id: string): Promise<InspectionCase> {
    try {
      const res = await api.get<SingleCaseResponse>(`/cases/${id}`);
      if (res && res.case) {
        return normalizeCase(res.case);
      }
    } catch (error) {
      console.warn(`API /cases/${id} unavailable, looking in local demo data:`, error);
    }
    const found = DEMO_CASES.find((c) => c.id === id);
    return found || DEMO_CASES[0];
  },

  getDefaultCase(): InspectionCase {
    return DEMO_CASES[0];
  },

  async createCase(caseData: Partial<InspectionCase>): Promise<InspectionCase> {
    const payload = {
      caseId: caseData.id || `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      productName: caseData.productName || 'Inspected Package Sample',
      manufacturer: caseData.manufacturer || '',
      category: caseData.category || 'Standard Retail Commodity',
      batchNo: caseData.batchNo || '',
      brand: caseData.brand || '',
      location: caseData.location || 'New Delhi Container Depot',
      priority: caseData.priority || 'Medium',
      officer: caseData.officer || 'Officer Vikram Sharma (LM-DL-4029)',
      officerId: caseData.officerId || 'LM-DL-4029',
      image: caseData.image || DEMO_CASES[0].image,
      declarations: caseData.declarations || [],
      applicability: caseData.applicability || DEMO_CASES[0].applicability,
      rules: caseData.rules || [],
      boundingBoxes: caseData.boundingBoxes || [],
      findingsCount: caseData.findingsCount || {
        compliant: (caseData.rules || []).filter((r: any) => r.status === 'COMPLIANT').length,
        potentialNonCompliance: (caseData.rules || []).filter((r: any) => r.status === 'POTENTIAL_NON_COMPLIANCE').length,
        needsVerification: (caseData.rules || []).filter((r: any) => r.status === 'NEEDS_HUMAN_VERIFICATION').length,
      },
      overallStatus: caseData.overallStatus || 'NEEDS_HUMAN_VERIFICATION',
      officerNotes: caseData.officerNotes || '',
      officerDecision: caseData.officerDecision || 'IDLE',
    };

    try {
      const res = await api.post<SingleCaseResponse>('/cases', payload);
      if (res && res.case) {
        return normalizeCase(res.case);
      }
    } catch (error) {
      console.warn('API /cases create failed, using local instance:', error);
    }

    return normalizeCase(payload);
  },

  async updateCase(id: string, updates: Partial<InspectionCase>): Promise<InspectionCase> {
    try {
      const res = await api.put<SingleCaseResponse>(`/cases/${id}`, updates);
      if (res && res.case) {
        return normalizeCase(res.case);
      }
    } catch (error) {
      console.warn(`API /cases/${id} update failed, updating locally:`, error);
    }
    return normalizeCase({ ...DEMO_CASES[0], ...updates, id });
  },

  async updateVerification(
    id: string,
    decision: 'CONFIRMED' | 'REJECTED' | 'RESCAN_REQUESTED',
    notes: string
  ): Promise<InspectionCase> {
    try {
      const res = await api.put<SingleCaseResponse>(`/cases/${id}/verification`, {
        officerDecision: decision,
        officerNotes: notes,
      });
      if (res && res.case) {
        return normalizeCase(res.case);
      }
    } catch (error) {
      console.warn(`API /cases/${id}/verification failed:`, error);
    }
    return normalizeCase({
      ...DEMO_CASES[0],
      id,
      officerDecision: decision,
      officerNotes: notes,
    });
  },

  async deleteCase(id: string): Promise<boolean> {
    try {
      await api.delete(`/cases/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete case ${id}:`, error);
      return false;
    }
  },

  searchCases(cases: InspectionCase[], query: string): InspectionCase[] {
    const q = query.toLowerCase().trim();
    if (!q) return cases;
    return cases.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.productName.toLowerCase().includes(q) ||
        c.manufacturer.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  },
};
