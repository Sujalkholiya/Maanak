import React, { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { AuthLayout } from '../../layouts/AuthLayout';

// Lazy loaded page components for code splitting
const DashboardPage = lazy(() => import('../../pages/dashboard/DashboardPage'));
const NewInspectionPage = lazy(() => import('../../pages/inspection/NewInspectionPage'));
const ScanPackagePage = lazy(() => import('../../pages/inspection/ScanPackagePage'));
const ComplianceXRayPage = lazy(() => import('../../pages/inspection/ComplianceXRayPage'));
const EvidenceVaultPage = lazy(() => import('../../pages/evidence/EvidenceVaultPage'));
const InspectionReportPage = lazy(() => import('../../pages/reports/InspectionReportPage'));
const SettingsPage = lazy(() => import('../../pages/settings/SettingsPage'));

// Additional Inspection Sub-Tools
const DeclarationWorkspacePage = lazy(() => import('../../pages/inspection/DeclarationWorkspacePage'));
const ApplicabilityEnginePage = lazy(() => import('../../pages/inspection/ApplicabilityEnginePage'));
const FontPdpAnalysisPage = lazy(() => import('../../pages/inspection/FontPdpAnalysisPage'));
const HumanVerificationPage = lazy(() => import('../../pages/inspection/HumanVerificationPage'));
const EcommerceComparisonPage = lazy(() => import('../../pages/intelligence/EcommerceComparisonPage'));

// Governance & Cases
const CaseManagementPage = lazy(() => import('../../pages/cases/CaseManagementPage'));
const ManufacturerIntelligencePage = lazy(() => import('../../pages/intelligence/ManufacturerIntelligencePage'));
const HeatmapPage = lazy(() => import('../../pages/intelligence/HeatmapPage'));
const AnalyticsPage = lazy(() => import('../../pages/intelligence/AnalyticsPage'));
const AuditTrailPage = lazy(() => import('../../pages/audit/AuditTrailPage'));
const RuleLibraryPage = lazy(() => import('../../pages/rules/RuleLibraryPage'));
const OfflineFieldModePage = lazy(() => import('../../pages/offline/OfflineFieldModePage'));

// Auth & Fallback
const LoginPage = lazy(() => import('../../pages/auth/LoginPage'));
const NotFoundPage = lazy(() => import('../../pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },

      // Primary 5-Phase Workflow
      { path: 'inspection/new', element: <NewInspectionPage /> },
      { path: 'inspection/scan', element: <ScanPackagePage /> },
      { path: 'inspection/compliance-xray', element: <ComplianceXRayPage /> },
      { path: 'evidence-vault', element: <EvidenceVaultPage /> },
      { path: 'inspection/report', element: <InspectionReportPage /> },

      // Inspection Sub-Tools
      { path: 'inspection/declaration', element: <DeclarationWorkspacePage /> },
      { path: 'inspection/applicability', element: <ApplicabilityEnginePage /> },
      { path: 'inspection/font-pdp', element: <FontPdpAnalysisPage /> },
      { path: 'inspection/review', element: <HumanVerificationPage /> },
      { path: 'ecommerce-comparison', element: <EcommerceComparisonPage /> },

      // Cases & Governance
      { path: 'cases', element: <CaseManagementPage /> },
      { path: 'manufacturers', element: <ManufacturerIntelligencePage /> },
      { path: 'heatmap', element: <HeatmapPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'audit-trail', element: <AuditTrailPage /> },
      { path: 'rule-library', element: <RuleLibraryPage /> },
      { path: 'offline-field', element: <OfflineFieldModePage /> },
      { path: 'settings', element: <SettingsPage /> },

      // 404 Fallback
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
    ],
  },
]);
