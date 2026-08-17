import { STATUS_CONFIG, type ProgramWorkflowStatus } from "@/config/constants";
import { Box } from "@mui/material";

interface StatusDotProps {
	status: ProgramWorkflowStatus;
	className?: string;
}

export function StatusDot({ status, className }: StatusDotProps) {
	const normalized = status.toUpperCase() as keyof typeof STATUS_CONFIG;

	const config = STATUS_CONFIG[normalized];

	return (
		<Box
			aria-hidden
			className={className}
			sx={{
				width: 8,
				height: 8,
				borderRadius: "50%",
				backgroundColor: config.color,
				flexShrink: 0,
			}}
		/>
	);
}
