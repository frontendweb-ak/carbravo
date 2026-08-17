import CheckIcon from "@mui/icons-material/Check";
import {
	Box,
	Button,
	Container,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import type { ProgramWorkflowStatus } from "@/config/constants";
import { StatusBadge } from "../ui";

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
	revisionTabs = [],
	onRevisionChange,
	className,
}: ProgramContextHeaderProps) {
	return (
		<Box
			className={className}
			sx={{
				py: 1.75,
			}}
		>
			{/* ============================================================
			    HEADER
			============================================================ */}

			<Container
				maxWidth={false}
				sx={{
					width: "100%",
					maxWidth: 1360,
					mx: "auto",
					px: { xs: 2, sm: 3, lg: 4 },
				}}
			>
				<Stack
					sx={{
						direction: "row",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 2,
						mb: 2,
					}}
				>
					{/* Left */}

					<Stack
						sx={{
							direction: "row",
							alignItems: "center",
							gap: 1.5,
							minWidth: 0,
						}}
					>
						<Link
							to={backHref}
							style={{
								flexShrink: 0,
								textDecoration: "none",
							}}
						>
							<Typography
								variant="body2"
								sx={{
									fontWeight: 700,
									color: "text.secondary",
									transition: "color 150ms",
									"&:hover": {
										color: "text.primary",
									},
								}}
							>
								{backLabel}
							</Typography>
						</Link>

						{/* Vertical separator */}

						<Box
							sx={{
								width: 1,
								height: 24,
								backgroundColor: "divider",
								flexShrink: 0,
							}}
						/>

						{/* Program name */}

						<Typography
							variant="h5"
							noWrap
							sx={{
								minWidth: 0,
								fontWeight: 700,
								color: "brandTeal.main",
							}}
						>
							{name}
						</Typography>

						{/* Type */}

						<Typography
							variant="caption"
							sx={{
								flexShrink: 0,
								fontWeight: 500,
								color: "text.secondary",
							}}
						>
							{type}
						</Typography>

						<Typography
							variant="caption"
							sx={{
								flexShrink: 0,
								color: "text.secondary",
							}}
						>
							·
						</Typography>

						<Typography
							variant="caption"
							sx={{
								flexShrink: 0,
								color: "text.secondary",
							}}
						>
							{number}
						</Typography>

						{/* Revision */}

						<Box
							sx={{
								flexShrink: 0,
								px: 1.5,
								py: 0.5,
								borderRadius: 1.5,
								backgroundColor: "action.hover",
							}}
						>
							<Typography
								variant="caption"
								sx={{
									fontWeight: 600,
									color: "text.primary",
								}}
							>
								Rev: {revision}
							</Typography>
						</Box>

						{/* Status */}

						<StatusBadge status={status} />
					</Stack>

					{/* Right */}

					<Stack
						sx={{
							direction: "row",
							alignItems: "center",
							gap: 2,
							flexShrink: 0,
						}}
					>
						{saved && (
							<Stack sx={{ direction: "row", alignItems: "center", gap: 0.75 }}>
								<CheckIcon
									aria-hidden
									sx={{
										fontSize: 18,
										color: "success.main",
									}}
								/>

								<Typography
									variant="body2"
									sx={{
										fontWeight: 500,
										color: "success.main",
										whiteSpace: "nowrap",
									}}
								>
									All changes saved
								</Typography>
							</Stack>
						)}

						{!hideSave && (
							<Button
								type="button"
								variant="outlined"
								disabled={saveDisabled}
								onClick={onSave}
							>
								{saveLabel}
							</Button>
						)}
					</Stack>
				</Stack>

				{/* ============================================================
				    REVISION NAVIGATION
				============================================================ */}

				<Stack
					sx={{
						direction: "row",
						alignItems: "center",
						pb: 2,
						justifyContent: "space-between",
						gap: 2,
					}}
				>
					{revisionTabs.length > 0 ? (
						<Stack
							role="tablist"
							aria-label="Program revisions"
							sx={{
								gap: 1,
								direction: "row",
								alignItems: "center",
							}}
						>
							{revisionTabs.map((tab) => {
								const active = tab.active ?? false;

								return (
									<Button
										key={tab.id}
										type="button"
										role="tab"
										aria-selected={active}
										onClick={() => onRevisionChange?.(tab.id)}
										variant={active ? "contained" : "outlined"}
										color={active ? "inherit" : "primary"}
										sx={{
											minWidth: 0,
											borderRadius: 999,
											px: 2,
											py: 0.75,
											fontSize: 12,
											fontWeight: 700,
											textTransform: "none",

											...(active
												? {
														backgroundColor: "foreground",
														color: "background.default",
														"&:hover": {
															backgroundColor: "foreground",
														},
													}
												: {
														backgroundColor: "background.paper",
														color: "text.secondary",
														borderColor: "divider",
														"&:hover": {
															backgroundColor: "action.hover",
															borderColor: "divider",
														},
													}),
										}}
									>
										<Box
											component="span"
											sx={{
												display: "inline-flex",
												alignItems: "center",
												gap: 1,
											}}
										>
											<span>{tab.label}</span>

											<Box
												component="span"
												sx={{
													color: active ? "text.disabled" : "text.secondary",
												}}
											>
												{tab.subtitle}
											</Box>
										</Box>
									</Button>
								);
							})}
						</Stack>
					) : (
						<Box />
					)}

					{/* Active revision notice */}

					{status === "ACTIVE" && (
						<Stack
							sx={{
								gap: 1,
								alignItems: "center",
								direction: "row",
								borderRadius: 999,
								backgroundColor: "action.hover",
								px: 2,
								py: 1,
							}}
						>
							<Typography component="span" variant="caption">
								🔒
							</Typography>

							<Typography
								variant="body2"
								sx={{
									color: "text.secondary",
									fontWeight: 500,
								}}
							>
								This revision is active and posted — read-only. Clone or revise
								to make changes.
							</Typography>
						</Stack>
					)}
				</Stack>
			</Container>

			{/* ============================================================
			    DIVIDER
			============================================================ */}

			<Container
				maxWidth={false}
				sx={{
					width: "100%",
					maxWidth: 1360,
					mx: "auto",
					px: { xs: 2, sm: 3, lg: 4 },
				}}
			>
				<Divider />
			</Container>
		</Box>
	);
}

export { ProgramContextHeader };
