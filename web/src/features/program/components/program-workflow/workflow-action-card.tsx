import { Button } from "@/components/ui";
import type { ProgramWorkflowStatus } from "@/config/constants";
import { Box } from "@mui/material";
import { RequirementWarning } from "./requirement-warning";
import type { WorkflowRequirement } from "./types";
import { WorkflowMessage } from "./workflow-message";

interface WorkflowActionCardProps {
	programId: number | undefined;
	revisionId?: number;

	status: ProgramWorkflowStatus;
	canSubmit: boolean;
	incompleteRequirements: WorkflowRequirement[];

	onSubmitForReview?: () => void;
	onApprove?: () => void;
	onPostToProduction?: () => void;
	onExpire?: () => void;

	loading: boolean;
}

function WorkflowActionCard({
	programId,
	revisionId,
	status,
	canSubmit,
	incompleteRequirements,
	onSubmitForReview,
	onApprove,
	onPostToProduction,
	onExpire,
	loading,
}: WorkflowActionCardProps) {
	const isDraft = status === "DRAFT";
	const isSubmitted = status === "ACTIVE";
	const isApproved = status === "APPROVED";
	const isActive = status === "ACTIVE";
	const isExpired = status === "EXPIRED";

	return (
		<Box
			sx={{
				border: "1px solid",
				borderColor: "control.border",
				borderRadius: 2,
				backgroundColor: "background.paper",
				p: 2.5,
			}}
		>
			{isDraft && (
				<>
					<Button
						color="primary"
						disabled={!canSubmit || loading}
						onClick={onSubmitForReview}
						sx={{
							textTransform: "none",
							fontWeight: 700,
							borderRadius: 1,
						}}
					>
						Submit for review
					</Button>

					{incompleteRequirements.length > 0 && (
						<RequirementWarning
							programId={programId}
							revisionId={revisionId}
							items={incompleteRequirements}
						/>
					)}
				</>
			)}

			{isSubmitted && (
				<WorkflowMessage
					title="Submitted for review"
					description="This program is waiting for approval."
				/>
			)}

			{isSubmitted && onApprove && (
				<Button
					color="success"
					disabled={loading}
					onClick={onApprove}
					sx={{
						mt: 2,
						textTransform: "none",
						fontWeight: 700,
					}}
				>
					Approve program
				</Button>
			)}

			{isApproved && (
				<>
					<WorkflowMessage
						title="Program approved"
						description="The program has been approved and is ready to be posted to production."
					/>

					{onPostToProduction && (
						<Button
							color="success"
							disabled={loading}
							onClick={onPostToProduction}
							sx={{
								mt: 2,
								textTransform: "none",
								fontWeight: 700,
							}}
						>
							Post to production
						</Button>
					)}
				</>
			)}

			{isActive && (
				<>
					<WorkflowMessage
						title="Program is active"
						description="This program is currently available in production."
					/>

					{onExpire && (
						<Button
							variant="outline"
							color="error"
							disabled={loading}
							onClick={onExpire}
							sx={{
								mt: 2,
								textTransform: "none",
								fontWeight: 700,
							}}
						>
							Expire program
						</Button>
					)}
				</>
			)}

			{isExpired && (
				<WorkflowMessage
					title="Program expired"
					description="This program is no longer active."
				/>
			)}
		</Box>
	);
}

export { WorkflowActionCard };
