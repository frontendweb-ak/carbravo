// src/features/program/components/program-workflow/workflow-stepper.tsx

import { Box } from "@mui/material";

import { ProgramSection } from "../program-section";

import type { ProgramWorkflowStatus } from "@/config/constants";
import {
	WorkflowStepperStep,
	type WorkflowStep,
} from "./workflow-stepper-step";

const WORKFLOW_STEPS: WorkflowStep[] = [
	{
		status: "DRAFT",
		label: "Draft",
	},
	{
		status: "REVIEW",
		label: "Submitted",
	},
	{
		status: "APPROVED",
		label: "Approved",
	},
	{
		status: "ACTIVE",
		label: "Active",
	},
	{
		status: "EXPIRED",
		label: "Expired",
	},
];

const STATUS_INDEX: Record<ProgramWorkflowStatus, number> = {
	DRAFT: 0,
	REVIEW: 1,
	APPROVED: 2,
	ACTIVE: 3,
	EXPIRED: 4,
};

export interface WorkflowStepperProps {
	status: ProgramWorkflowStatus;
}

function WorkflowStepper({ status }: WorkflowStepperProps) {
	const currentIndex = STATUS_INDEX[status];

	return (
		<ProgramSection title="Workflow status">
			<Box sx={{ width: "100%", minWidth: 0, overflow: "hidden" }}>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns:
							"32px minmax(16px, 1fr) 32px minmax(16px, 1fr) 32px minmax(16px, 1fr) 32px minmax(16px, 1fr) 32px",
						alignItems: "start",
						width: "100%",
						minWidth: 0,
					}}
				>
					{WORKFLOW_STEPS.map((step, index) => {
						const completed = index < currentIndex;
						const active = index === currentIndex;
						const future = index > currentIndex;

						return (
							<WorkflowStepperStep
								key={step.status}
								step={step}
								index={index}
								completed={completed}
								active={active}
								future={future}
							/>
						);
					})}

					{/* Connectors */}
					{WORKFLOW_STEPS.slice(0, -1).map((step, index) => (
						<Box
							key={`connector-${step.status}`}
							sx={{
								gridColumn: index * 2 + 2,
								gridRow: 1,
								height: 2,
								mt: "15px",
								backgroundColor:
									index < currentIndex ? "success.main" : "control.border",
								minWidth: 0,
							}}
						/>
					))}
				</Box>
			</Box>
		</ProgramSection>
	);
}

export { WorkflowStepper };
