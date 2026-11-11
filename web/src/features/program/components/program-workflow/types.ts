// src/features/program/components/program-workflow/types.ts

import type { ProgramWorkflowStatus } from "@/config/constants";
import type { ApprovalAuditEventDto } from "../../api/revisions.api";

export interface WorkflowRequirement {
	key: "setup" | "vehicles" | "geography" | "eligibility" | "incentive-values" | "marketing" | "summary";
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
	onReject?: (reason: string) => void;
	onPostToProduction?: () => void;
	onExpire?: () => void;

	auditTimeline?: ApprovalAuditEventDto[];

	loading?: boolean;
}
