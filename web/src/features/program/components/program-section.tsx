import type { ReactNode } from "react";

import { Card } from "@/components/ui";
import { Box, CardContent, Stack, Typography } from "@mui/material";

interface ProgramSectionProps {
	title: ReactNode;
	description?: ReactNode;
	headerAction?: ReactNode;
	children: ReactNode;
}

function ProgramSection({
	title,
	description,
	headerAction,
	children,
}: ProgramSectionProps) {
	return (
		<Card variant="outlined" sx={{ p: 2.5 }}>
			<CardContent
				sx={{
					p: 3,
					"&:last-child": {
						pb: 3,
					},
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "flex-start",
						justifyContent: "space-between",
						gap: 2,
						mb: 3,
					}}
				>
					<Stack spacing={0.5} sx={{ minWidth: 0 }}>
						{typeof title === "string" ? (
							<Typography variant="h6" sx={{ fontWeight: 700 }}>
								{title}
							</Typography>
						) : (
							title
						)}

						{description && (
							<Typography variant="body2" color="text.secondary">
								{description}
							</Typography>
						)}
					</Stack>

					{headerAction && <Box sx={{ flexShrink: 0 }}>{headerAction}</Box>}
				</Box>

				{children}
			</CardContent>
		</Card>
	);
}

export { ProgramSection };

