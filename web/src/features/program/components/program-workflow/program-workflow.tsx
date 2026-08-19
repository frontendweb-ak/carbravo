// src/features/program/components/program-workflow/program-workflow.tsx

import { Stack } from "@mui/material";

import type { ProgramWorkflowProps } from "./types";
import { WorkflowActionCard } from "./workflow-action-card";
import { WorkflowStepper } from "./workflow-stepper";
import { WorkflowTimeline } from "./workflow-timeline";

function ProgramWorkflow({
	programId,
	revisionId,
	status,
	requirements = [],
	onSubmitForReview,
	onApprove,
	onPostToProduction,
	onExpire,
	loading = false,
}: ProgramWorkflowProps) {
	const incompleteRequirements = requirements.filter((item) => !item.complete);

	const canSubmit = status === "DRAFT" && incompleteRequirements.length === 0;

	return (
		<Stack spacing={2.5}>
			<WorkflowStepper status={status} />

			<WorkflowActionCard
				programId={programId}
				revisionId={revisionId}
				status={status}
				canSubmit={canSubmit}
				incompleteRequirements={incompleteRequirements}
				onSubmitForReview={onSubmitForReview}
				onApprove={onApprove}
				onPostToProduction={onPostToProduction}
				onExpire={onExpire}
				loading={loading}
			/>

			<WorkflowTimeline status={status} />
		</Stack>
	);
}

export { ProgramWorkflow };
