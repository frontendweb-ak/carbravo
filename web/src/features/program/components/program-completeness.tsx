import { Typography } from "@/components/ui";
import { Box, LinearProgress, useTheme } from "@mui/material";

export interface ProgramCompletenessProps {
	value: number;
	label?: string;
}

function ProgramCompleteness({
	value,
	label = "Completeness",
}: ProgramCompletenessProps) {
	const theme = useTheme();
	const { palette } = theme;
	const normalizedValue = Math.min(100, Math.max(0, value));

	return (
		<Box sx={{ px: 3, pb: 0.5 }}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					mb: 2,
				}}
			>
				<Typography
					sx={{
						fontSize: 11,
						lineHeight: 1.2,
						fontWeight: 600,
						color: "text.secondary",
					}}
				>
					{label}
				</Typography>

				<Typography
					sx={{
						fontSize: 11,
						lineHeight: 1.2,
						fontWeight: 700,
						color: "text.primary",
					}}
				>
					{normalizedValue}%
				</Typography>
			</Box>

			<LinearProgress
				variant="determinate"
				value={normalizedValue}
				aria-label={`${label} ${normalizedValue}%`}
				sx={{
					height: 6,
					borderRadius: "999px",
					backgroundColor: palette.background.default,
					"& .MuiLinearProgress-bar": {
						borderRadius: "999px",
						backgroundColor: palette.success.main,
						transition: "transform 300ms ease",
					},
				}}
			/>
		</Box>
	);
}

export { ProgramCompleteness };
