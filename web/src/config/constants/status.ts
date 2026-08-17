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
		badgeVariant: "statusDraft",
		textClass: "text-status-draft",
		dotClass: "bg-status-draft",
	},

	REVIEW: {
		label: "Review",
		badgeVariant: "statusReview",
		textClass: "text-status-review",
		dotClass: "bg-status-review",
	},

	APPROVED: {
		label: "Approved",
		badgeVariant: "statusApproved",
		textClass: "text-status-approved",
		dotClass: "bg-status-approved",
	},

	ACTIVE: {
		label: "Active",
		badgeVariant: "statusActive",
		textClass: "text-status-active",
		dotClass: "bg-status-active",
	},

	EXPIRED: {
		label: "Expired",
		badgeVariant: "statusExpired",
		textClass: "text-status-expired",
		dotClass: "bg-status-expired",
	},
} as const;
