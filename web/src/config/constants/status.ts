export const STATUS_CONFIG = {
	DRAFT: { label: "Draft", color: "status.draft" },
	REVIEW: { label: "Review", color: "status.review" },
	APPROVED: { label: "Approved", color: "status.approved" },
	ACTIVE: { label: "Active", color: "status.active" },
	EXPIRED: { label: "Expired", color: "status.expired" },
} as const;
export type ProgramWorkflowStatus = keyof typeof STATUS_CONFIG;

export const PROGRAM_STATUSES = Object.keys(
	STATUS_CONFIG,
) as ProgramWorkflowStatus[];
