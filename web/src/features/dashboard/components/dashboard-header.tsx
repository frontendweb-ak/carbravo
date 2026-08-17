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
						color: "primary.main",
						fontWeight: 700,
						letterSpacing: "0.08em",
					}}
				>
					Welcome back, {userName}
				</Typography>

				<Typography
					variant="h3"
					sx={{
						fontWeight: 700,
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
					<Typography variant="body2">{rightContent}</Typography>
				</Box>
			)}
		</Box>
	);
}

export { DashboardHeader };
