import { Typography } from "@/components/ui";
import { Box } from "@mui/material";

function WorkflowMessage({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<Box>
			<Typography variant="body" weight="bold">
				{title}
			</Typography>

			<Typography variant="bodyMedium" color="secondary" sx={{ mt: 0.25 }}>
				{description}
			</Typography>
		</Box>
	);
}

export { WorkflowMessage };
