// src/components/ui/status-dot.tsx

import { STATUS_CONFIG, type AppStatus } from "@/config/constants";
import { cn } from "@/utils";

interface StatusDotProps {
	status: AppStatus;
	className?: string;
}

export function StatusDot({ status, className }: StatusDotProps) {
	return (
		<span
			aria-hidden
			className={cn(
				"size-2 rounded-full",
				STATUS_CONFIG[status].dot,
				className,
			)}
		/>
	);
}
