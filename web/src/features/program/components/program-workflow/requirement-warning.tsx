// src/features/program/components/program-workflow/requirement-warning.tsx

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Button, Typography } from "@/components/ui";

import type { WorkflowRequirement } from "./types";

interface RequirementWarningProps {
	programId: number | undefined;
	revisionId?: number | undefined;
	items: WorkflowRequirement[];
}

const REQUIREMENT_ROUTES: Record<
	WorkflowRequirement["key"],
	(programId: string) => string
> = {
	setup: (programId) => `/programs/${programId}/setup`,
	vehicles: (programId) => `/programs/${programId}/vehicles`,
	geography: (programId) => `/programs/${programId}/geography`,
	"incentive-values": (programId) => `/programs/${programId}/incentive-values`,
	summary: (programId) => `/programs/${programId}/summary`,
};

function RequirementWarning({ programId, items }: RequirementWarningProps) {
	const navigate = useNavigate();

	const handleNavigate = (key: WorkflowRequirement["key"]) => {
		navigate(REQUIREMENT_ROUTES[key](programId));
	};

	return (
		<Box
			sx={{
				mt: 1.5,
				p: 1.5,
				border: "1px solid",
				borderColor: "warning.main",
				borderRadius: 1.5,
				backgroundColor: "warning.soft",
			}}
		>
			<Typography variant="bodySmall" weight="bold" color="warning">
				Complete these required sections before submitting:
			</Typography>

			<Stack
				direction="row"
				sx={{
					mt: 1,
					flexWrap: "wrap",
					gap: 1,
				}}
			>
				{items.map((item) => (
					<Button
						key={item.key}
						type="button"
						variant="outline"
						size="small"
						endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
						onClick={() => handleNavigate(item.key)}
						sx={{
							borderRadius: 999,
							textTransform: "none",
							fontSize: "0.75rem",
							fontWeight: 700,
							backgroundColor: "background.paper",
						}}
					>
						{item.label}
					</Button>
				))}
			</Stack>
		</Box>
	);
}

export { RequirementWarning };
