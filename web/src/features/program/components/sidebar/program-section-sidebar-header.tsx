import { Typography } from "@/components/ui";
import { Box } from "@mui/material";
import type { ReactNode } from "react";

export interface ProgramSectionSidebarHeaderProps {
	title?: ReactNode;
}

function ProgramSectionSidebarHeader({
	title = "Sections · Edit in any order",
}: ProgramSectionSidebarHeaderProps) {
	return (
		<Box sx={{ px: 2, pt: 0.5, pb: 0.75, mb: 3 }}>
			<Typography
				weight="bold"
				color="secondary"
				variant="bodySmall"
				sx={{
					fontSize: 11,
					lineHeight: 1.2,
					color: "text.secondary",
					textTransform: "uppercase",
					letterSpacing: "0.04em",
					whiteSpace: "nowrap",
				}}
			>
				{title}
			</Typography>
		</Box>
	);
}

export { ProgramSectionSidebarHeader };
