import { Box, Typography } from "@mui/material";

import { PROGRAM_MESSAGES } from "@/features/program/constants/messages";

export function ProgramNoDraft() {
	const message = PROGRAM_MESSAGES.noDraftRevision;

	return (
		<Box
			sx={{
				minHeight: "50vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Box sx={{ textAlign: "center" }}>
				<Typography
					variant="h6"
					sx={{
						fontSize: "1.125rem",
						fontWeight: 600,
					}}
				>
					{message.title}
				</Typography>

				<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
					{message.description}
				</Typography>
			</Box>
		</Box>
	);
}
