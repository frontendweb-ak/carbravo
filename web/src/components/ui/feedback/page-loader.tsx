import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export interface PageLoaderProps {
	message?: string;
	fullPage?: boolean;
}

function PageLoader({
	message = "Loading...",
	fullPage = true,
}: PageLoaderProps) {
	return (
		<Box
			role="status"
			aria-live="polite"
			sx={{
				minHeight: fullPage ? "calc(100vh - 120px)" : 160,
				width: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1.5,
				}}
			>
				<CircularProgress size={18} />

				<Typography variant="body2" color="text.secondary">
					{message}
				</Typography>
			</Box>
		</Box>
	);
}

export { PageLoader };

