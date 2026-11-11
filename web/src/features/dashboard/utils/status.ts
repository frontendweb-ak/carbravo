import type { DashboardStatusCount } from "../model/dashboard.types";

export interface StatusCounts {
  draft: number;
  review: number;
  approved: number | null;
  active: number;
  expired: number;
}

export function getStatusCounts(counts: DashboardStatusCount[]): StatusCounts {
  const byStatus = new Map(counts.map((item) => [item.status, item]));
  const draftCount = byStatus.get("DRAFT");
  const activeCount = byStatus.get("ACTIVE");
  const expiredCount = byStatus.get("EXPIRED");

  const pendingReview =
    (draftCount?.pendingApproval ?? 0) +
    (activeCount?.pendingApproval ?? 0) +
    (expiredCount?.pendingApproval ?? 0);

  return {
    draft: Math.max(0, (draftCount?.total ?? 0) - (draftCount?.pendingApproval ?? 0)),
    review: pendingReview,
    // The OpenAPI dashboard summary has no approved aggregate.
    approved: null,
    active: Math.max(0, (activeCount?.total ?? 0) - (activeCount?.pendingApproval ?? 0)),
    expired: expiredCount?.total ?? 0,
  };
}
