import { Box, Typography } from "@mui/material";

import type { Program } from "../model/programs.types";

export function ProgramRevision({ program }: { program: Program }) {
	const revision = program.revision;

	return (
		<Box>
			<Typography
				variant="body2"
				sx={{
					fontWeight: 500,
				}}
			>
				{revision?.label ?? "—"}
			</Typography>

			{revision?.isMinorRevision && (
				<Typography variant="caption" color="text.secondary">
					Minor revision
				</Typography>
			)}

			{revision?.isSubmitted && !revision.approved && (
				<Typography
					variant="caption"
					sx={{
						display: "block",
						color: "warning.main",
					}}
				>
					Pending approval
				</Typography>
			)}
		</Box>
	);
}
