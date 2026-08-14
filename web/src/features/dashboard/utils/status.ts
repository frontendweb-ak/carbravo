import type {
	DashboardProgramStatus,
	DashboardStatusCount,
} from "../model/dashboard.types";

export interface StatusCounts {
	draft: number;
	review: number;
	approved: number;
	active: number;
	expired: number;
}

export function getStatusCounts(counts: DashboardStatusCount[]): StatusCounts {
	const result: StatusCounts = {
		draft: 0,
		review: 0,
		approved: 0,
		active: 0,
		expired: 0,
	};

	for (const item of counts) {
		switch (item.status) {
			case "draft":
				result.draft += item.total;
				break;

			case "active":
				result.active += item.total;
				break;

			case "expired":
				result.expired += item.total;
				break;

			case "review":
				result.review += item.total;
				break;

			case "approved":
				result.approved += item.total;
				break;
		}

		// pendingApproval is a separate API concept.
		// It contributes to the Review card.
		// result.review += item.pendingApproval;
	}

	return result;
}

export function mapStatus(status: string): DashboardProgramStatus {
	switch (status.toUpperCase()) {
		case "DRAFT":
			return "draft";
		case "REVIEW":
			return "review";
		case "APPROVED":
			return "approved";
		case "ACTIVE":
			return "active";
		case "EXPIRED":
			return "expired";
		default:
			return "draft";
	}
}

