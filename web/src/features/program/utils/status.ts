import type { Program } from "../model/programs.types";

const PROGRAM_STATUS_BADGES = {
	DRAFT: {
		label: "Draft",
		variant: "statusDraft",
	},
	ACTIVE: {
		label: "Active",
		variant: "statusActive",
	},
	EXPIRED: {
		label: "Expired",
		variant: "statusExpired",
	},
} as const satisfies Record<
	Program["status"],
	{
		label: string;
		variant: "statusDraft" | "statusActive" | "statusExpired";
	}
>;

export function getProgramStatusBadge(status: Program["status"]) {
	return PROGRAM_STATUS_BADGES[status];
}

/* -------------------------------------------------------------------------- */
/* Program type                                                                */
/* -------------------------------------------------------------------------- */

const PROGRAM_TYPE_LABELS = {
	CUSTOMER_CASH: "Customer Cash",
	APR: "APR",
	BONUS_CASH: "Bonus Cash",
} as const satisfies Record<NonNullable<Program["type"]>, string>;

export function getProgramTypeLabel(type: Program["type"]): string {
	if (!type) {
		return "—";
	}

	return PROGRAM_TYPE_LABELS[type];
}