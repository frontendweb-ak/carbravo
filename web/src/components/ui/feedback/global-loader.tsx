import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Logo } from "@/components/layout/logo";

export interface GlobalLoaderProps {
	visible?: boolean;
	message?: string;
}

function GlobalLoader({
	visible = true,
	message = "Loading...",
}: GlobalLoaderProps) {
	if (!visible) {
		return null;
	}

	return (
		<Backdrop
			open
			sx={{
				zIndex: (theme) => theme.zIndex.modal + 1,
				backgroundColor: "rgba(255,255,255,0.95)",
				backdropFilter: "blur(4px)",
			}}
		>
			<Stack
				spacing={2}
				sx={{
					alignItems: "center",
				}}
				role="status"
				aria-live="polite"
				aria-label={message}
			>
				<Logo size={40} />

				<CircularProgress size={20} />

				<Typography variant="body2" color="text.secondary">
					{message}
				</Typography>
			</Stack>
		</Backdrop>
	);
}

export { GlobalLoader };
