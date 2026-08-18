import { Box, Typography } from "@mui/material";

import { formatProgramDate } from "@/utils";
import type { Program } from "../model/programs.types";
import { getProgramTypeLabel } from "../utils";
import { ProgramStatusBadge } from "./program-status-badge";

export function ProgramMobileContent({ program }: { program: Program }) {
	return (
		<Box
			sx={{
				minWidth: 0,
				flex: 1,
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
					gap: 1.5,
				}}
			>
				<Box sx={{ minWidth: 0 }}>
					<Typography
						variant="body2"
						sx={{
							fontWeight: 600,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{program.name || "Untitled program"}
					</Typography>

					<Typography
						variant="caption"
						color="text.secondary"
						sx={{
							display: "block",
							mt: 0.25,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{program.identifier || "—"}
					</Typography>
				</Box>

				<ProgramStatusBadge status={program.status} />
			</Box>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
					gap: 1.5,
					mt: 1.5,
				}}
			>
				<Box>
					<Typography variant="caption" color="text.secondary">
						Type
					</Typography>

					<Typography
						variant="body2"
						sx={{
							mt: 0.25,
							fontWeight: 500,
						}}
					>
						{getProgramTypeLabel(program.type)}
					</Typography>
				</Box>

				<Box>
					<Typography variant="caption" color="text.secondary">
						Revision
					</Typography>

					<Typography
						variant="body2"
						sx={{
							mt: 0.25,
							fontWeight: 500,
						}}
					>
						{program.revision?.label ?? "—"}
					</Typography>
				</Box>

				<Box
					sx={{
						gridColumn: "1 / -1",
					}}
				>
					<Typography variant="caption" color="text.secondary">
						Delivery period
					</Typography>

					<Typography
						variant="body2"
						sx={{
							mt: 0.25,
							fontWeight: 500,
						}}
					>
						{formatProgramDate(program.deliveryStartDate)}
						{" – "}
						{formatProgramDate(program.deliveryEndDate)}
					</Typography>
				</Box>

				{program.hasDraft && (
					<Box
						sx={{
							gridColumn: "1 / -1",
						}}
					>
						<Typography
							variant="caption"
							sx={{
								fontWeight: 500,
								color: "primary.main",
							}}
						>
							Draft revision available
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
}
