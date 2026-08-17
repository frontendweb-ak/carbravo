import { STATUS_CONFIG, type ProgramWorkflowStatus } from "@/config/constants";
import { cn } from "@/utils";

interface StatusDotProps {
	status: ProgramWorkflowStatus;
	className?: string;
}

export function StatusDot({ status, className }: StatusDotProps) {
	const normalized = status.toUpperCase() as keyof typeof STATUS_CONFIG;

	const config = STATUS_CONFIG[normalized];

	return (
		<span
			aria-hidden
			className={cn("size-2 rounded-full", config.dotClass, className)}
		/>
	);
}
