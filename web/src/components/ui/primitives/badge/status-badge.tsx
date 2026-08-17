import type { ReactNode } from "react";

import {
	STATUS_CONFIG,
	type ProgramWorkflowStatus,
} from "@/config/constants/status";

import { Badge, type BadgeProps } from "./badge";

export interface StatusBadgeProps extends Omit<
	BadgeProps,
	"variant" | "children"
> {
	status: ProgramWorkflowStatus;
	children?: ReactNode;
}

function StatusBadge({
	status,
	children,
	size = "default",
	className,
	...props
}: StatusBadgeProps) {
	const config = STATUS_CONFIG[status];

	return (
		<Badge
			{...props}
			size={size}
			variant={config.badgeVariant}
			data-status={status}
			className={className}
		>
			{children ?? config.label}
		</Badge>
	);
}

export { StatusBadge };

