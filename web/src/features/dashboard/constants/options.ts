import type { ProgramWorkflowStatus } from "@/config/constants";

export const ACTIVITY_OPERATIONS = {
	CREATE: {
		label: "created draft",
		color: "DRAFT",
	},
	UPDATE: {
		label: "updated",
		color: "DRAFT",
	},
	REVISE: {
		label: "revised",
		color: "REVIEW",
	},
	SUBMIT: {
		label: "submitted",
		color: "REVIEW",
	},
	APPROVE: {
		label: "approved",
		color: "APPROVED",
	},
	POST_TO_PRODUCTION: {
		label: "published",
		color: "ACTIVE",
	},
} as const satisfies Record<
	string,
	{
		label: string;
		color: ProgramWorkflowStatus;
	}
>;
