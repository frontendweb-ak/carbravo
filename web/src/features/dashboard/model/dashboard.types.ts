export type DashboardParentStatus = "DRAFT" | "ACTIVE" | "EXPIRED";
export type DashboardProgramStatus = "DRAFT" | "REVIEW" | "APPROVED" | "ACTIVE" | "EXPIRED";
export type DashboardEventType = "INCENTIVE_REVISION" | "INCENTIVE_PROGRAM";
export type ActivityColor = "DRAFT" | "REVIEW" | "APPROVED" | "ACTIVE" | "EXPIRED";

export interface DashboardStatusCount {
  status: DashboardParentStatus;
  total: number;
  pendingApproval: number;
}

export interface DashboardSummary {
  counts: DashboardStatusCount[];
}

export interface ActivityItem {
  id: string;
  entityType: DashboardEventType;
  entityId: number;
  actor: string;
  operation: string;
  operationLabel: string;
  changedAt: string;
  programName: string;
  programIdentifier: string;
  color?: ActivityColor;
}

export interface ExpiringProgram {
  id: string;
  programId: number;
  programIdentifier: string;
  name: string;
  revisionId: number;
  revision: string;
  startsAt: string;
  expiresAt: string;
  vehicles: string;
  includedStates: string[];
  status: "ACTIVE";
}
