// src/pages/programs/[programId]/edit/approval/page.tsx

import { Box } from "@mui/material";

import type { ProgramWorkflowStatus } from "@/config/constants";
import { ProgramWorkflow } from "@/features/program/components/program-workflow";
import { useProgramEditor } from "@/features/program/editor/program-editor-context";

export default function ApprovalPage() {
	const { mode, programId, revisionId, isReadOnly } = useProgramEditor();

	const status: ProgramWorkflowStatus = "DRAFT";

	const requirements = [
		{
			key: "setup" as const,
			label: "Setup",
			complete: false,
		},
		{
			key: "vehicles" as const,
			label: "Vehicles",
			complete: false,
		},
		{
			key: "geography" as const,
			label: "Geography",
			complete: false,
		},
		{
			key: "incentive-values" as const,
			label: "Incentive Values",
			complete: false,
		},
		{
			key: "summary" as const,
			label: "10-Point Summary",
			complete: false,
		},
	];

	const handleSubmitForReview = () => {
		if (isReadOnly) return;

		console.log("Submit revision for review", {
			programId,
			revisionId,
		});
	};

	const handleApprove = () => {
		if (isReadOnly) return;

		console.log("Approve revision", {
			programId,
			revisionId,
		});
	};

	const handlePostToProduction = () => {
		if (isReadOnly) return;

		console.log("Post revision to production", {
			programId,
			revisionId,
		});
	};

	const handleExpire = () => {
		if (isReadOnly) return;

		console.log("Expire program", {
			programId,
			revisionId,
		});
	};

	return (
		<Box sx={{ width: "100%" }}>
			<ProgramWorkflow
				programId={programId}
				revisionId={revisionId}
				status={status}
				requirements={requirements}
				onSubmitForReview={isReadOnly ? undefined : handleSubmitForReview}
				onApprove={isReadOnly ? undefined : handleApprove}
				onPostToProduction={isReadOnly ? undefined : handlePostToProduction}
				onExpire={isReadOnly ? undefined : handleExpire}
				loading={false}
			/>
		</Box>
	);
}