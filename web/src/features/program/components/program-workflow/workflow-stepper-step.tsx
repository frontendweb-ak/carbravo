import { Typography } from "@/components/ui";
import type { ProgramWorkflowStatus } from "@/config/constants";
import CheckIcon from "@mui/icons-material/Check";
import { Box } from "@mui/material";
export interface WorkflowStep {
	status: ProgramWorkflowStatus;
	label: string;
}

export interface StepProps {
	step: WorkflowStep;
	index: number;
	completed: boolean;
	active: boolean;
	future: boolean;
}
function WorkflowStepperStep({
	step,
	index,
	completed,
	active,
	future,
}: StepProps) {
	return (
		<Box
			sx={{
				gridColumn: index * 2 + 1,
				gridRow: 1,

				display: "flex",
				flexDirection: "column",
				alignItems: "center",

				minWidth: 0,
				position: "relative",
				zIndex: 1,
			}}
		>
			<Box
				sx={{
					width: 32,
					height: 32,
					borderRadius: "50%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
					fontSize: "0.75rem",
					fontWeight: 700,
					backgroundColor:
						active || completed ? "success.main" : "background.paper",
					color:
						active || completed
							? "success.contrastText"
							: future
								? "text.muted"
								: "text.primary",
					border: "2px solid",
					borderColor:
						active || completed ? "success.main" : "control.borderStrong",
					boxShadow: active
						? (theme) => `0 0 0 4px ${theme.palette.success.soft}`
						: "none",
				}}
			>
				{completed ? <CheckIcon sx={{ fontSize: 17 }} /> : index + 1}
			</Box>

			<Typography
				variant="labelSmall"
				weight={active || completed ? "bold" : "medium"}
				color={active ? "default" : completed ? "secondary" : "muted"}
				sx={{ mt: 0.75, whiteSpace: "nowrap", textAlign: "center" }}
			>
				{step.label}
			</Typography>
		</Box>
	);
}

export { WorkflowStepperStep };
