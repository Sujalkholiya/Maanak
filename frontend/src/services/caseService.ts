import { DEMO_CASES } from '../data/mockData';
import { InspectionCase } from '../types';

export const caseService = {
  getAllCases(): InspectionCase[] {
    return DEMO_CASES;
  },

  getCaseById(id: string): InspectionCase | undefined {
    return DEMO_CASES.find((c) => c.id === id);
  },

  getDefaultCase(): InspectionCase {
    return DEMO_CASES[0];
  },

  searchCases(query: string): InspectionCase[] {
    const q = query.toLowerCase().trim();
    if (!q) return DEMO_CASES;
    return DEMO_CASES.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.productName.toLowerCase().includes(q) ||
        c.manufacturer.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  },
};
