import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Box, Typography } from "@mui/material";

import { formatProgramDate as formatDate } from "@/utils";

import type { Program } from "../model/programs.types";

export function ProgramDeliveryPeriod({ program }: { program: Program }) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.75,
				whiteSpace: "nowrap",
			}}
		>
			<CalendarTodayIcon
				aria-hidden
				sx={{
					width: 14,
					height: 14,
					color: "text.secondary",
				}}
			/>

			<Typography variant="body2">
				{program.deliveryStartDate
					? formatDate(program.deliveryStartDate)
					: "—"}

				{" – "}

				{program.deliveryEndDate ? formatDate(program.deliveryEndDate) : "—"}
			</Typography>
		</Box>
	);
}
