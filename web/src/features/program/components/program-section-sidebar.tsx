import { Typography } from "@/components/ui";
import CheckIcon from "@mui/icons-material/Check";
import {
	Box,
	ButtonBase,
	Divider,
	LinearProgress,
	Paper,
	Stack,
} from "@mui/material";
import type { ReactNode } from "react";

export type ProgramSectionStatus = "pending" | "warning" | "completed";

export interface SidebarProgramSection {
	id: string;
	number: number;
	label: ReactNode;
	requiredForSubmission?: boolean;
	completed?: boolean;
	status?: ProgramSectionStatus;
}

export interface ProgramSectionSidebarProps {
	sections: SidebarProgramSection[];
	activeSection?: string;
	onSectionChange?: (sectionId: string) => void;
	completion?: number;
	title?: ReactNode;
	disabled?: boolean;
}

function ProgramSectionSidebar({
	sections,
	activeSection,
	onSectionChange,
	completion = 0,
	title = "Sections · Edit in any order",
	disabled = false,
}: ProgramSectionSidebarProps) {
	const normalizedCompletion = Math.min(100, Math.max(0, completion));

	return (
		<Paper
			variant="outlined"
			sx={{
				width: 246,
				maxWidth: "100%",
				px: 2.5,
				py: 4,
				borderRadius: "16px",
				borderColor: "#DCE4E7",
				backgroundColor: "#FFFFFF",
				boxShadow: "0 1px 3px rgba(16, 42, 56, 0.06)",
				overflow: "hidden",
			}}
		>
			{/* Header */}
			<Box sx={{ px: 1.25, pt: 0.5, pb: 0.75, mb: 2 }}>
				<Typography
					weight="bold"
					color="secondary"
					sx={{
						lineHeight: 1.2,
						color: "#81939C",
						textTransform: "uppercase",
						letterSpacing: "0.04em",
						whiteSpace: "nowrap",
					}}
				>
					{title}
				</Typography>
			</Box>

			{/* Sections */}
			<Stack component="nav" aria-label="Program sections" spacing={1}>
				{sections.map((section) => {
					const isActive = activeSection === section.id;

					const isCompleted =
						section.completed === true || section.status === "completed";

					const isWarning = section.status === "warning";

					return (
						<ButtonBase
							key={section.id}
							disabled={disabled}
							onClick={() => onSectionChange?.(section.id)}
							aria-current={isActive ? "step" : undefined}
							sx={{
								width: "100%",
								minHeight: 37,

								display: "flex",
								alignItems: "center",
								justifyContent: "flex-start",

								gap: 1,

								p: 2,

								borderRadius: "9px",

								textAlign: "left",

								color: "#294957",

								transition:
									"background-color 120ms ease, border-color 120ms ease",

								border: "1px solid transparent",

								"&:hover": {
									backgroundColor: isActive ? "#EAF3FD" : "#F7F9FA",
								},

								"&.Mui-disabled": {
									opacity: 0.5,
									cursor: "not-allowed",
								},

								...(isActive && {
									backgroundColor: "#EAF3FD",
									borderColor: "#C9E0F8",
								}),
							}}
						>
							{/* Number */}
							<Box
								sx={{
									width: 22,
									height: 22,

									flexShrink: 0,

									display: "flex",
									alignItems: "center",
									justifyContent: "center",

									borderRadius: "6px",

									fontSize: 11,
									lineHeight: 1,
									fontWeight: 700,

									...(isActive && {
										backgroundColor: "#1976B9",
										color: "#FFFFFF",
									}),

									...(!isActive &&
										!isCompleted &&
										!isWarning && {
											backgroundColor: "#E8EEF0",
											color: "#91A2AA",
										}),

									...(!isActive &&
										isWarning &&
										!isCompleted && {
											backgroundColor: "#FFF0D8",
											color: "#C57A00",
										}),

									...(!isActive &&
										isCompleted && {
											backgroundColor: "#E5F2E0",
											color: "#5E9E3D",
										}),
								}}
							>
								{isCompleted && !isActive ? (
									<CheckIcon
										aria-hidden
										sx={{
											fontSize: 14,
											strokeWidth: 3,
										}}
									/>
								) : (
									section.number
								)}
							</Box>

							{/* Label */}
							<Typography
								sx={{
									minWidth: 0,
									flex: 1,

									fontSize: 13,
									lineHeight: 1.2,
									fontWeight: 700,

									color: isActive ? "#155D91" : "#294957",

									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{section.label}
							</Typography>

							{/* Status dot */}
							<Box
								aria-hidden
								sx={{
									width: 8,
									height: 8,

									flexShrink: 0,

									borderRadius: "50%",

									backgroundColor: "#D2DDE1",

									...(isWarning &&
										!isCompleted && {
											backgroundColor: "#E4A22A",
										}),

									...(isCompleted && {
										backgroundColor: "#69A94B",
									}),
								}}
							/>
						</ButtonBase>
					);
				})}
			</Stack>

			{/* Divider */}
			<Divider
				sx={{
					my: 1.25,
					mx: 0.5,
					borderColor: "#DCE4E7",
				}}
			/>

			{/* Completion */}
			<Box
				sx={{
					px: 1.25,
					pb: 0.5,
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",

						mb: 0.5,
					}}
				>
					<Typography
						sx={{
							fontSize: 11,
							lineHeight: 1.2,
							fontWeight: 600,
							color: "#8A9BA3",
						}}
					>
						Completeness
					</Typography>

					<Typography
						sx={{
							fontSize: 11,
							lineHeight: 1.2,
							fontWeight: 700,
							color: "#294957",
						}}
					>
						{normalizedCompletion}%
					</Typography>
				</Box>

				<LinearProgress
					variant="determinate"
					value={normalizedCompletion}
					aria-label="Program completeness"
					sx={{
						height: 6,

						borderRadius: "999px",

						backgroundColor: "#E7ECEE",

						"& .MuiLinearProgress-bar": {
							borderRadius: "999px",
							backgroundColor: "#1976B9",

							transition: "transform 300ms ease",
						},
					}}
				/>
			</Box>
		</Paper>
	);
}

export { ProgramSectionSidebar };
