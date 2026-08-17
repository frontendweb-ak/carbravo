import CheckIcon from "@mui/icons-material/Check";
import {
	Box,
	ButtonBase,
	Divider,
	LinearProgress,
	Paper,
	Stack,
	Typography,
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
				width: "100%",
				minWidth: 0,
				borderRadius: 4,
				p: 1.5,
				boxShadow: 1,
			}}
		>
			{/* Header */}
			<Box sx={{ px: 1, pb: 1.5 }}>
				<Typography
					variant="overline"
					color="text.secondary"
					sx={{
						fontSize: 11,
						fontWeight: 700,
						letterSpacing: "0.08em",
					}}
				>
					{title}
				</Typography>
			</Box>

			{/* Sections */}
			<Stack component="nav" aria-label="Program sections" spacing={0.5}>
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
								display: "flex",
								alignItems: "center",
								justifyContent: "flex-start",
								gap: 1,
								borderRadius: 2,
								px: 1,
								py: 0.75,
								textAlign: "left",
								color: "text.primary",
								fontSize: "0.875rem",
								fontWeight: 600,
								transition: "background-color 150ms ease",

								"&:hover": {
									backgroundColor: "action.hover",
								},

								"&.Mui-disabled": {
									opacity: 0.5,
									cursor: "not-allowed",
								},

								...(isActive && {
									backgroundColor: (theme) => theme.palette.action.selected,
									color: "primary.main",

									outline: (theme) =>
										`1px solid ${theme.palette.primary.main}33`,
								}),
							}}
						>
							{/* Section indicator */}
							<Box
								sx={{
									width: 24,
									height: 24,
									flexShrink: 0,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: 1.5,
									fontSize: 11,
									fontWeight: 700,

									...(!isCompleted &&
										!isWarning && {
											backgroundColor: "action.hover",
											color: "text.secondary",
										}),

									...(isWarning &&
										!isCompleted && {
											backgroundColor: (theme) =>
												`${theme.palette.warning.main}1A`,
											color: "warning.main",
										}),

									...(isCompleted &&
										!isActive && {
											backgroundColor: (theme) =>
												`${theme.palette.success.main}1A`,
											color: "success.main",
										}),

									...(isActive && {
										backgroundColor: "primary.main",
										color: "primary.contrastText",
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
								variant="body2"
								sx={{
									minWidth: 0,
									flex: 1,
									fontWeight: 600,
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
									backgroundColor: "divider",

									...(isWarning &&
										!isCompleted && {
											backgroundColor: "warning.main",
										}),

									...(isCompleted && {
										backgroundColor: "success.main",
									}),
								}}
							/>
						</ButtonBase>
					);
				})}
			</Stack>

			{/* Divider */}
			<Divider sx={{ my: 1.5 }} />

			{/* Completion */}
			<Box sx={{ px: 1 }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						mb: 0.5,
					}}
				>
					<Typography variant="caption" color="text.secondary">
						Completeness
					</Typography>

					<Typography
						variant="caption"
						sx={{
							fontWeight: 700,
							color: "text.primary",
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
						borderRadius: 999,
						backgroundColor: "action.hover",

						"& .MuiLinearProgress-bar": {
							borderRadius: 999,
							backgroundColor: "primary.main",
							transition: "transform 300ms ease",
						},
					}}
				/>
			</Box>
		</Paper>
	);
}

export { ProgramSectionSidebar };
