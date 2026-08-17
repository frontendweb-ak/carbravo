import Chip from "@mui/material/Chip";

import {
	STATUS_CONFIG,
	type ProgramWorkflowStatus,
} from "@/config/constants/status";
import { alpha, useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";

export interface StatusBadgeProps {
	status: ProgramWorkflowStatus;
	children?: ReactNode;
}

function StatusBadge({ status, children }: StatusBadgeProps) {
	const theme = useTheme();

	const config = STATUS_CONFIG[status];

	const colorMap = {
		DRAFT: theme.palette.status.draft,
		REVIEW: theme.palette.status.review,
		APPROVED: theme.palette.status.approved,
		ACTIVE: theme.palette.status.active,
		EXPIRED: theme.palette.status.expired,
	};

	const color = colorMap[status];
	return (
		<Chip
			label={children ?? config.label}
			size="small"
			sx={{
				height: 24,
				fontSize: 12,
				fontWeight: 600,

				backgroundColor: alpha(color, 0.12),
				color,

				border: `1px solid ${alpha(color, 0.2)}`,
				borderRadius: 1,

				"& .MuiChip-label": {
					px: 1,
				},
			}}
		/>
	);
}

export { StatusBadge };
