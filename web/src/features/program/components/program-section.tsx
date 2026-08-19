// src/components/ui/program-section.tsx

import type { ReactNode } from "react";

import { Box, Stack } from "@mui/material";

import { Card, Typography } from "@/components/ui";

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
		<Card
			variant="outlined"
			sx={{
				width: "100%",
				overflow: "hidden",
			}}
		>
			<Box sx={{ p: 2.5 }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "flex-start",
						justifyContent: "space-between",
						gap: 2,
						mb: 3,
					}}
				>
					<Stack
						spacing={0.25}
						sx={{
							minWidth: 0,
						}}
					>
						{typeof title === "string" ? (
							<Typography
								variant="body"
								weight="bold"
								color="default"
								sx={{
									lineHeight: 1.4,
								}}
							>
								{title}
							</Typography>
						) : (
							title
						)}

						{description !== undefined && (
							<Typography
								variant="bodyMedium"
								weight="regular"
								color="secondary"
								sx={{
									lineHeight: 1.4,
								}}
							>
								{description}
							</Typography>
						)}
					</Stack>

					{headerAction !== undefined && (
						<Box
							sx={{
								flexShrink: 0,
								display: "flex",
								alignItems: "center",
							}}
						>
							{headerAction}
						</Box>
					)}
				</Box>

				{children}
			</Box>
		</Card>
	);
}

export { ProgramSection };
