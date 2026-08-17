import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export interface PageLoaderProps {
	message?: string;
}

function PageLoader({ message = "Loading..." }: PageLoaderProps) {
	return (
		<Box
			role="status"
			aria-live="polite"
			sx={{
				minHeight: 384, // 24rem = min-h-96
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
				<CircularProgress size={16} />

				<Typography variant="body2" color="text.secondary">
					{message}
				</Typography>
			</Box>
		</Box>
	);
}

export { PageLoader };
