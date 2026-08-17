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
			case "DRAFT":
				result.draft += item.total;
				break;

			case "REVIEW":
				result.review += item.total;
				break;

			case "APPROVED":
				result.approved += item.total;
				break;

			case "ACTIVE":
				result.active += item.total;
				break;

			case "EXPIRED":
				result.expired += item.total;
				break;
		}
	}

	return result;
}
export function mapStatus(status: string): DashboardProgramStatus {
	switch (status.toUpperCase()) {
		case "DRAFT":
			return "DRAFT";

		case "REVIEW":
			return "REVIEW";

		case "APPROVED":
			return "APPROVED";

		case "ACTIVE":
			return "ACTIVE";

		case "EXPIRED":
			return "EXPIRED";

		default:
			return "DRAFT";
	}
}