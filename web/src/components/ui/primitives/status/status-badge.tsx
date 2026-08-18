import type { ReactNode } from "react";

import {
	STATUS_CONFIG,
	type ProgramWorkflowStatus,
} from "@/config/constants/status";

import { Badge } from "../badge";
import { getStatusBadgeTone } from "../badge/badge.utils";

export interface StatusBadgeProps {
	status: ProgramWorkflowStatus;
	children?: ReactNode;
}

function StatusBadge({ status, children }: StatusBadgeProps) {
	return (
		<Badge tone={getStatusBadgeTone(status)}>
			{children ?? STATUS_CONFIG[status].label}
		</Badge>
	);
}

export { StatusBadge };
