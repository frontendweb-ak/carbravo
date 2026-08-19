import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import ErrorOutline from "@mui/icons-material/ErrorOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import type { ReactNode } from "react";

export interface ErrorStateProps {
	title?: ReactNode;
	description?: ReactNode;
	onRetry?: () => void;
	retryLabel?: ReactNode;

	// NEW
	fullPage?: boolean;
}

function ErrorState({
	title = "Unable to load data",
	description = "Something went wrong while loading this information.",
	onRetry,
	retryLabel = "Try again",
	fullPage = false,
}: ErrorStateProps) {
	return (
		<Box
			role="alert"
			sx={{
				minHeight: fullPage ? "calc(100vh - 120px)" : 160,
				width: "100%",
				px: 3,
				py: 4,

				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",

				textAlign: "center",
			}}
		>
			<Box
				sx={(theme) => ({
					width: 48,
					height: 48,
					mb: 2,
					borderRadius: "50%",

					display: "flex",
					alignItems: "center",
					justifyContent: "center",

					bgcolor: theme.palette.error.main + "14",
					color: theme.palette.error.main,
				})}
			>
				<ErrorOutline />
			</Box>

			<Typography
				variant="h6"
				sx={{
					fontWeight: 600,
				}}
			>
				{title}
			</Typography>

			<Typography
				variant="body2"
				color="text.secondary"
				sx={{
					mt: 1,
					maxWidth: 480,
					lineHeight: 1.6,
				}}
			>
				{description}
			</Typography>

			{onRetry && (
				<Button
					variant="outlined"
					size="small"
					startIcon={<RefreshIcon />}
					onClick={onRetry}
					sx={{
						mt: 3,
					}}
				>
					{retryLabel}
				</Button>
			)}
		</Box>
	);
}

export { ErrorState };

