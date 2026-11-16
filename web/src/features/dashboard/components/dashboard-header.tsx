import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export interface DashboardHeaderProps {
	userName?: ReactNode;
	title?: ReactNode;
	rightContent?: ReactNode;
}

function DashboardHeader({
	userName = "Alex Chen",
	title = "Incentive authoring dashboard",
	rightContent,
}: DashboardHeaderProps) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "flex-end",
				justifyContent: "space-between",
				gap: 4,
			}}
		>
			<Box>
				<Typography
					variant="overline"
					sx={{
						color: "primary.dark",
						fontSize: "10.5px",
						fontWeight: 800,
						letterSpacing: "0.14em",
						mb: "7px",
					}}
				>
					Welcome back, {userName}
				</Typography>

				<Typography
					variant="h3"
					sx={{
						fontFamily: '"Sora", system-ui, sans-serif',
						fontSize: "29px",
						fontWeight: 800,
						lineHeight: 1.2,
						letterSpacing: "-0.02em",
						color: "text.primary",
					}}
				>
					{title}
				</Typography>
			</Box>

			{rightContent && (
				<Box
					sx={{
						flexShrink: 0,
						color: "text.secondary",
					}}
				>
					<Typography variant="body2" sx={{ fontSize: "12.5px" }}>{rightContent}</Typography>
				</Box>
			)}
		</Box>
	);
}

export { DashboardHeader };
