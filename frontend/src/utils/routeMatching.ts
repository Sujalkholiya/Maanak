import { ROUTES } from '../app/router/routes';
import { getWorkflowPhaseByRoute } from '../app/router/workflow';

export function isRouteActive(currentPath: string, targetPath: string): boolean {
  if (targetPath === ROUTES.DASHBOARD || targetPath === ROUTES.HOME) {
    return currentPath === ROUTES.DASHBOARD || currentPath === ROUTES.HOME;
  }
  return currentPath.startsWith(targetPath);
}

export function getActiveSection(pathname: string): 'workflow' | 'tools' | 'governance' | 'other' {
  const workflowPhase = getWorkflowPhaseByRoute(pathname);
  if (workflowPhase) return 'workflow';

  if (
    pathname === ROUTES.TOOLS.DECLARATION ||
    pathname === ROUTES.TOOLS.APPLICABILITY ||
    pathname === ROUTES.TOOLS.FONT_PDP ||
    pathname === ROUTES.TOOLS.ECOMMERCE ||
    pathname === ROUTES.TOOLS.OFFICER_REVIEW
  ) {
    return 'tools';
  }

  if (
    pathname === ROUTES.GOVERNANCE.MANUFACTURERS ||
    pathname === ROUTES.GOVERNANCE.HEATMAP ||
    pathname === ROUTES.GOVERNANCE.ANALYTICS ||
    pathname === ROUTES.GOVERNANCE.AUDIT ||
    pathname === ROUTES.GOVERNANCE.RULE_LIBRARY ||
    pathname === ROUTES.GOVERNANCE.OFFLINE ||
    pathname === ROUTES.GOVERNANCE.SETTINGS
  ) {
    return 'governance';
  }

  return 'other';
}
