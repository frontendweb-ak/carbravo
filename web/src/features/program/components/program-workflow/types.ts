// src/features/program/components/program-workflow/types.ts

import type { ProgramWorkflowStatus } from "@/config/constants";

export interface WorkflowRequirement {
	key: "setup" | "vehicles" | "geography" | "incentive-values" | "summary";
	label: string;
	complete: boolean;
}
export interface ProgramWorkflowProps {
	programId: number | undefined;
	revisionId?: number | undefined;

	status: ProgramWorkflowStatus;

	requirements?: WorkflowRequirement[];

	onSubmitForReview?: () => void;
	onApprove?: () => void;
	onPostToProduction?: () => void;
	onExpire?: () => void;

	loading?: boolean;
}
