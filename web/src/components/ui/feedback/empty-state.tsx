import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export interface EmptyStateProps {
	icon?: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
	return (
		<Box
			sx={{
				minHeight: 160,
				px: 3,
				py: 4,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
			}}
		>
			{icon && (
				<Box
					sx={(theme) => ({
						width: 40,
						height: 40,
						mb: 2,
						borderRadius: "50%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: theme.palette.muted.main,
						color: theme.palette.text.secondary,
					})}
				>
					{icon}
				</Box>
			)}

			<Typography
				variant="subtitle2"
				sx={{
					fontWeight: 600,
				}}
			>
				{title}
			</Typography>

			{description && (
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						mt: 0.5,
						maxWidth: 480,
					}}
				>
					{description}
				</Typography>
			)}

			{action && (
				<Box
					sx={{
						mt: 3,
					}}
				>
					{action}
				</Box>
			)}
		</Box>
	);
}

export { EmptyState };
