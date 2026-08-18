import { Card, Typography } from "@/components/ui";
import CheckIcon from "@mui/icons-material/Check";
import { Box, ButtonBase, Divider, Stack, useTheme } from "@mui/material";
import type { ReactNode } from "react";
import { ProgramCompleteness } from "./program-completeness";

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
	const theme = useTheme();
	const { palette } = theme;

	return (
		<Card variant="outlined" sx={{ px: 2.5 }}>
			{/* Header */}
			<Box sx={{ px: 2, pt: 0.5, pb: 0.75, mb: 3 }}>
				<Typography
					weight="bold"
					color="secondary"
					variant="bodySmall"
					sx={{
						fontSize: 11,
						lineHeight: 1.2,
						color: "text.secondary",
						textTransform: "uppercase",
						letterSpacing: "0.04em",
						whiteSpace: "nowrap",
					}}
				>
					{title}
				</Typography>
			</Box>

			{/* Sections */}
			<Stack component="nav" aria-label="Program sections">
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

								gap: 3,
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
									backgroundColor: palette.info.soft,
									borderColor: palette.info.softBorder,
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
										backgroundColor: "info.main",
										color: "info.contrastText",
									}),

									...(!isActive &&
										!isCompleted &&
										!isWarning && {
											backgroundColor: "muted.main",
											color: "muted.foreground",
										}),

									...(!isActive &&
										isWarning &&
										!isCompleted && {
											backgroundColor: "warning.soft",
											color: "warning.softForeground",
										}),

									...(!isActive &&
										isCompleted && {
											backgroundColor: "success.soft",
											color: "success.softForeground",
										}),
								}}
							>
								{isCompleted && !isActive ? (
									<CheckIcon
										aria-hidden
										sx={{ fontSize: 14, strokeWidth: 3 }}
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
									color: isActive ? palette.info.main : palette.text.primary,
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
									backgroundColor: palette.muted.main,
									...(isWarning &&
										!isCompleted && {
											backgroundColor: palette.warning.main,
										}),
									...(isCompleted && {
										backgroundColor: palette.success.main,
									}),
								}}
							/>
						</ButtonBase>
					);
				})}
			</Stack>

			{/* Divider */}
			<Divider sx={{ my: 3, mx: 1.5, borderColor: "divider" }} />

			{/* Completion */}
			<ProgramCompleteness value={completion} label="Completeness" />
		</Card>
	);
}

export { ProgramSectionSidebar };

