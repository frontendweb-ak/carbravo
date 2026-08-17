export const PROGRAM_STATUSES = [
	"DRAFT",
	"REVIEW",
	"APPROVED",
	"ACTIVE",
	"EXPIRED",
] as const;

export type ProgramWorkflowStatus = (typeof PROGRAM_STATUSES)[number];

export const STATUS_CONFIG = {
	DRAFT: {
		label: "Draft",
		color: "status.draft",
	},

	REVIEW: {
		label: "Review",
		color: "status.review",
	},

	APPROVED: {
		label: "Approved",
		color: "status.approved",
	},

	ACTIVE: {
		label: "Active",
		color: "status.active",
	},

	EXPIRED: {
		label: "Expired",
		color: "status.expired",
	},
} as const;