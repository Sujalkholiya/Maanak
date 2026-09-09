export type RouteParam = Record<string, string | undefined>;

export interface NavigationState {
  from?: string;
  caseId?: string;
  phase?: number;
}
