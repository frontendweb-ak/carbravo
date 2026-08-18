import { STATUS_CONFIG, type ProgramWorkflowStatus } from "@/config/constants";
import Box from "@mui/material/Box";

export type StatusDotTone =
	| ProgramWorkflowStatus
	| "primary"
	| "success"
	| "warning"
	| "error"
	| "info"
	| "neutral";

interface StatusDotProps {
	status?: ProgramWorkflowStatus;
	tone?: StatusDotTone;
	className?: string;
}

function StatusDot({ status, tone, className }: StatusDotProps) {
	const color = tone
		? tone === "DRAFT" ||
			tone === "REVIEW" ||
			tone === "APPROVED" ||
			tone === "ACTIVE" ||
			tone === "EXPIRED"
			? STATUS_CONFIG[tone].color
			: `${tone}.main`
		: status
			? STATUS_CONFIG[status].color
			: "text.secondary";

	return (
		<Box
			aria-hidden
			className={className}
			sx={{
				width: 8,
				height: 8,
				borderRadius: "50%",
				backgroundColor: color,
				flexShrink: 0,
			}}
		/>
	);
}

export { StatusDot };

