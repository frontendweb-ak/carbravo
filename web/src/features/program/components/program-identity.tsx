import { Box, Typography } from "@mui/material";

import type { Program } from "../model/programs.types";

export function ProgramIdentity({ program }: { program: Program }) {
	return (
		<Box sx={{ minWidth: 0 }}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					minWidth: 0,
				}}
			>
				<Typography
					variant="body2"
					sx={{
						minWidth: 0,
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						fontWeight: 600,
					}}
				>
					{program.name || "Untitled program"}
				</Typography>

				{/* {program.hasDraft && (
					<Chip
						label="Draft revision"
						size="small"
						color="primary"
						sx={{
							flexShrink: 0,
							height: 20,
							fontSize: 11,
							fontWeight: 600,
						}}
					/>
				)} */}
			</Box>

			<Typography
				variant="caption"
				color="text.secondary"
				sx={{
					display: "block",
					mt: 0.25,
				}}
			>
				{program.identifier || "—"}
			</Typography>
		</Box>
	);
}
