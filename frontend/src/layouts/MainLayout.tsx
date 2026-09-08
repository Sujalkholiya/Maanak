import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { TopBar } from '../components/common/TopBar';
import { GlobalSearchModal } from '../components/common/GlobalSearchModal';
import { ShortcutsModal } from '../components/common/ShortcutsModal';
import { ToastContainer } from '../components/common/Toast';
import { useInspectionCase } from '../hooks/useInspectionCase';
import { useToast } from '../hooks/useToast';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { ROUTES } from '../app/router/routes';
import { X, Loader2, AlertTriangle } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectCase } = useInspectionCase();
  const { toasts, showToast, dismissToast } = useToast();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Workflow Exit Protection State
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  const isWorkflowRoute = (pathname: string) => {
    return (
      pathname.startsWith('/inspection/') ||
      pathname === ROUTES.WORKFLOW.EVIDENCE_VAULT ||
      pathname === ROUTES.WORKFLOW.INSPECTION_REPORT ||
      pathname === ROUTES.WORKFLOW.COMPLIANCE_XRAY ||
      pathname === ROUTES.WORKFLOW.SCAN_PACKAGE ||
      pathname === ROUTES.WORKFLOW.NEW_INSPECTION
    );
  };

  const requestNavigation = (targetRoute: string) => {
    setIsMobileMenuOpen(false);
    const inWorkflow = isWorkflowRoute(location.pathname);
    const targetInWorkflow = isWorkflowRoute(targetRoute);

    // If user is inside workflow and clicks outside workflow, show discard confirmation
    if (inWorkflow && !targetInWorkflow) {
      setPendingRoute(targetRoute);
      setIsDiscardModalOpen(true);
      return;
    }

    navigate(targetRoute);
  };

  const handleConfirmDiscard = () => {
    if (pendingRoute) {
      navigate(pendingRoute);
    }
    setPendingRoute(null);
    setIsDiscardModalOpen(false);
  };

  const handleCancelDiscard = () => {
    setPendingRoute(null);
    setIsDiscardModalOpen(false);
  };

  // Setup universal keyboard shortcuts (Ctrl+K, N, S, ?, Esc)
  useKeyboardShortcuts({
    isSearchOpen,
    setIsSearchOpen,
    isShortcutsOpen,
    setIsShortcutsOpen,
  });

  const handleSelectCase = (caseId: string) => {
    selectCase(caseId);
    requestNavigation(ROUTES.WORKFLOW.COMPLIANCE_XRAY);
  };

  const handleNavigateView = (view: string) => {
    let targetRoute = '';
    switch (view) {
      case 'dashboard':
        targetRoute = ROUTES.DASHBOARD;
        break;
      case 'new-inspection':
        targetRoute = ROUTES.WORKFLOW.NEW_INSPECTION;
        break;
      case 'scan-package':
        targetRoute = ROUTES.WORKFLOW.SCAN_PACKAGE;
        break;
      case 'compliance-xray':
        targetRoute = ROUTES.WORKFLOW.COMPLIANCE_XRAY;
        break;
      case 'declaration-extraction':
        targetRoute = ROUTES.TOOLS.DECLARATION;
        break;
      case 'applicability-engine':
        targetRoute = ROUTES.TOOLS.APPLICABILITY;
        break;
      case 'font-pdp-analysis':
        targetRoute = ROUTES.TOOLS.FONT_PDP;
        break;
      case 'product-listings':
        targetRoute = ROUTES.TOOLS.ECOMMERCE;
        break;
      case 'human-verification':
        targetRoute = ROUTES.TOOLS.OFFICER_REVIEW;
        break;
      case 'cases':
        targetRoute = ROUTES.CASES;
        break;
      case 'reports':
        targetRoute = ROUTES.WORKFLOW.INSPECTION_REPORT;
        break;
      case 'evidence-vault':
        targetRoute = ROUTES.WORKFLOW.EVIDENCE_VAULT;
        break;
      case 'manufacturers':
        targetRoute = ROUTES.GOVERNANCE.MANUFACTURERS;
        break;
      case 'heatmap':
        targetRoute = ROUTES.GOVERNANCE.HEATMAP;
        break;
      case 'analytics':
        targetRoute = ROUTES.GOVERNANCE.ANALYTICS;
        break;
      case 'audit-trail':
        targetRoute = ROUTES.GOVERNANCE.AUDIT;
        break;
      case 'rule-library':
        targetRoute = ROUTES.GOVERNANCE.RULE_LIBRARY;
        break;
      case 'offline-field':
        targetRoute = ROUTES.GOVERNANCE.OFFLINE;
        break;
      case 'settings':
        targetRoute = ROUTES.GOVERNANCE.SETTINGS;
        break;
      case 'login':
        targetRoute = ROUTES.AUTH;
        break;
      default:
        targetRoute = view.startsWith('/') ? view : `/${view}`;
    }
    requestNavigation(targetRoute);
  };

  const isDashboard = location.pathname === ROUTES.HOME || location.pathname === ROUTES.DASHBOARD;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F6F3] font-sans text-[#111413]">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          pendingReviewsCount={3}
          isOfflineMode={isOfflineMode}
          onNavigate={requestNavigation}
          onTriggerSync={() =>
            showToast(
              'HQ Cloud Sync Complete',
              'All inspection records synchronized with Central Legal Metrology server.',
              'success'
            )
          }
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu backdrop"
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full bg-[#0F1F1E] flex flex-col">
            <div className="p-3 border-b border-[#1A2F2D] flex justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-[#727A78] hover:text-white rounded min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title="Close Navigation"
                aria-label="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              pendingReviewsCount={3}
              isOfflineMode={isOfflineMode}
              onNavigate={requestNavigation}
              onCloseMobileDrawer={() => setIsMobileMenuOpen(false)}
              onTriggerSync={() =>
                showToast(
                  'HQ Cloud Sync Complete',
                  'All inspection records synchronized with Central Legal Metrology server.',
                  'success'
                )
              }
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden bg-[#F7F6F3] relative">
        {/* Subtle Government Watermark Background (Official Legal Metrology Emblem) */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] md:w-[540px] md:h-[540px] lg:w-[620px] lg:h-[620px] xl:w-[680px] xl:h-[680px] max-w-[80%] max-h-[75vh] hidden sm:flex items-center justify-center">
            <img
              src="/background.png"
              alt=""
              className="w-full h-full object-contain opacity-[0.05] filter grayscale-[25%] saturate-[70%] mix-blend-multiply pointer-events-none select-none"
            />
          </div>
        </div>

        {/* MAIN HEADER / CONTROL BAR */}
        <TopBar
          onOpenSearch={() => setIsSearchOpen(true)}
          isOfflineMode={isOfflineMode}
          onToggleOffline={() => setIsOfflineMode(!isOfflineMode)}
          onNavigateView={handleNavigateView}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onSignOut={() => navigate(ROUTES.AUTH)}
        />

        {/* Scrollable Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-transparent relative z-10">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[300px] text-[#727A78]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0E8A8A]" />
                  <span className="text-xs font-medium">Loading inspection workspace...</span>
                </div>
              </div>
            }
          >
            <Outlet />
          </React.Suspense>
        </main>
      </div>

      {/* Global Universal Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCase={handleSelectCase}
        onNavigateView={handleNavigateView}
      />



      {/* Global Interactive Toast Notification System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Field Officer Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Workflow Discard Changes Confirmation Modal */}
      {isDiscardModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="discard-modal-title"
          onClick={handleCancelDiscard}
        >
          <div
            className="bg-white rounded-2xl border border-[#E6E4DF] max-w-md w-full p-6 shadow-2xl space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 id="discard-modal-title" className="text-base font-bold text-[#111413]">
                  Discard Active Inspection Changes?
                </h3>
                <p className="text-xs text-[#727A78] mt-1.5 leading-relaxed">
                  You are currently in the middle of an active inspection workflow. If you exit now, any unsaved declarations, photos, or docket progress will be discarded.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6E4DF] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleCancelDiscard}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#111413] bg-[#F4F3EE] hover:bg-[#E6E4DF] transition-colors cursor-pointer"
              >
                Continue Inspection
              </button>
              <button
                type="button"
                onClick={handleConfirmDiscard}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#C1443A] hover:bg-[#A8382F] shadow-xs transition-colors cursor-pointer"
              >
                Discard Changes & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
