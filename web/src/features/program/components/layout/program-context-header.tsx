// src/features/program/components/program-context-header.tsx

import {
	Box,
	Container,
	Divider,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import type { ReactNode } from "react";

import type { ProgramWorkflowStatus } from "@/config/constants";
import { ProgramIdentityHeader } from "@/features/program/components/program-identity-header";
import { RevisionChips } from "@/features/program/components/revision-chips";
import { SaveStatus } from "@/features/program/components/save-status";

export interface ProgramRevisionTab {
	id: "current" | "active" | "history";
	label: string;
	subtitle: string;
	active?: boolean;
}

export interface ProgramContextHeaderProps {
	name?: ReactNode;
	type?: ReactNode;
	number?: ReactNode;
	revision?: ReactNode;
	status?: ProgramWorkflowStatus;

	saved?: boolean;
	saveLabel?: ReactNode;
	onSave?: () => void;

	backHref?: string;
	backLabel?: ReactNode;

	hideSave?: boolean;
	saveDisabled?: boolean;

	className?: string;

	revisionTabs?: ProgramRevisionTab[];

	onRevisionChange?: (revisionId: ProgramRevisionTab["id"]) => void;
}

function ProgramContextHeader({
	name = "Untitled program",
	type = "INC",
	number = "—",
	revision = "1.0",
	status = "DRAFT",

	saved = true,
	saveLabel = "Save draft",
	onSave,

	backHref = "/programs",
	backLabel = "← Programs",

	hideSave = false,
	saveDisabled = false,

	className,
	revisionTabs = [],
	onRevisionChange,
}: ProgramContextHeaderProps) {
	const theme = useTheme();
	const { palette } = theme;

	return (
		<Box
			className={className}
			sx={{ pt: 1.25, backgroundColor: "background.default" }}
		>
			<Container
				maxWidth={false}
				sx={{
					width: "100%",
					maxWidth: 1360,
					mx: "auto",
					px: {
						xs: 2,
						sm: 3,
						lg: 4,
					},
				}}
			>
				{/* =====================================================
				    HEADER
				===================================================== */}

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "minmax(0, 1fr) auto",
						alignItems: "center",
						columnGap: 2,
						minHeight: 42,
						mb: 0.75,
					}}
				>
					{/* Identity */}
					<Box sx={{ minWidth: 0, overflow: "hidden" }}>
						<ProgramIdentityHeader
							backHref={backHref}
							backLabel={backLabel}
							name={name}
							type={type}
							number={number}
							revision={revision}
							status={status}
						/>
					</Box>

					{/* Save status */}
					<Box sx={{ flexShrink: 0 }}>
						<SaveStatus
							saved={saved}
							hideSave={hideSave}
							saveDisabled={saveDisabled}
							saveLabel={String(saveLabel ?? "Save draft")}
							onSave={onSave}
						/>
					</Box>
				</Box>

				<Stack
					direction="row"
					sx={{
						width: "100%",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 2,
						pb: 1.5,
					}}
				>
					{revisionTabs.length > 0 ? (
						<RevisionChips
							options={revisionTabs.map((tab) => ({
								id: tab.id,
								label: tab.label,
								subtitle: tab.subtitle,
								active: tab.active,
							}))}
							onChange={onRevisionChange}
						/>
					) : (
						<Box />
					)}

					{/* Active revision notice */}

					{status === "ACTIVE" && (
						<Stack
							direction="row"
							sx={{
								alignItems: "center",
								minHeight: 30,
								gap: 0.75,
								px: 1.5,
								py: 0.5,
								borderRadius: 999,
								backgroundColor: palette.muted.main,
								flexShrink: 0,
							}}
						>
							<Typography
								component="span"
								sx={{
									fontSize: 12,
									lineHeight: 1,
								}}
							>
								🔒
							</Typography>

							<Typography
								sx={{
									fontSize: 11,
									lineHeight: 1.2,
									color: palette.muted.foreground,
									fontWeight: 600,
									whiteSpace: "nowrap",
								}}
							>
								This revision is active and posted — read-only. Clone or revise
								to make changes.
							</Typography>
						</Stack>
					)}
				</Stack>
			</Container>

			{/* Divider */}

			<Container
				maxWidth={false}
				sx={{
					width: "100%",
					maxWidth: 1360,
					mx: "auto",
					px: { xs: 2, sm: 3, lg: 4 },
				}}
			>
				<Divider sx={{ borderColor: "divider" }} />
			</Container>
		</Box>
	);
}

export { ProgramContextHeader };

