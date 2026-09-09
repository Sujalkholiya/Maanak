export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  AUTH: '/login',

  // Primary 5-phase linear workflow
  WORKFLOW: {
    NEW_INSPECTION: '/inspection/new',
    SCAN_PACKAGE: '/inspection/scan',
    COMPLIANCE_XRAY: '/inspection/compliance-xray',
    EVIDENCE_VAULT: '/evidence-vault',
    INSPECTION_REPORT: '/inspection/report',
  },

  // Detailed Inspection Sub-Workspaces
  TOOLS: {
    DECLARATION: '/inspection/declaration',
    APPLICABILITY: '/inspection/applicability',
    FONT_PDP: '/inspection/font-pdp',
    ECOMMERCE: '/ecommerce-comparison',
    OFFICER_REVIEW: '/inspection/review',
  },

  // Case Management & Governance
  CASES: '/cases',
  GOVERNANCE: {
    MANUFACTURERS: '/manufacturers',
    HEATMAP: '/heatmap',
    ANALYTICS: '/analytics',
    AUDIT: '/audit-trail',
    RULE_LIBRARY: '/rule-library',
    OFFLINE: '/offline-field',
    SETTINGS: '/settings',
  },
} as const;

export type AppRoute =
  | typeof ROUTES.HOME
  | typeof ROUTES.DASHBOARD
  | typeof ROUTES.AUTH
  | (typeof ROUTES.WORKFLOW)[keyof typeof ROUTES.WORKFLOW]
  | (typeof ROUTES.TOOLS)[keyof typeof ROUTES.TOOLS]
  | typeof ROUTES.CASES
  | (typeof ROUTES.GOVERNANCE)[keyof typeof ROUTES.GOVERNANCE];
