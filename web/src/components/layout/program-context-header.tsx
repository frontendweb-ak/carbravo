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
			sx={{ pt: 1.25, backgroundColor: "background.default" }}
		>
			<Container
				maxWidth={false}
				sx={{
					width: "100%",
					maxWidth: 1360,
					mx: "auto",
					px: { xs: 2, sm: 3, lg: 4 },
				}}
			>
				{/* HEADER */}
				<Stack
					sx={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 2,
						minHeight: 42,
						mb: 0.75,
					}}
				>
					{/* Left */}
					<Stack
						sx={{
							flexDirection: "row",
							alignItems: "center",
							gap: 1.75,
							flexShrink: 0,
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
								sx={{
									fontSize: 13,
									lineHeight: 1,
									fontWeight: 700,
									color: "#607984",
									transition: "color 150ms ease",
									"&:hover": {
										color: "#244B5A",
									},
								}}
							>
								{backLabel}
							</Typography>
						</Link>

						{/* Vertical separator */}
						<Box
							sx={{
								width: "1px",
								height: 26,
								backgroundColor: "#D7E0E3",
								flexShrink: 0,
							}}
						/>

						{/* Program name */}
						<Typography
							variant="h5"
							noWrap
							sx={{
								minWidth: 0,
								fontSize: 18,
								lineHeight: 1,
								fontWeight: 800,
								color: "#244B5A",
							}}
						>
							{name}
						</Typography>

						{/* Type */}
						<Typography
							sx={{
								flexShrink: 0,
								fontSize: 11,
								lineHeight: 1,
								fontWeight: 500,
								color: "#8A9BA3",
							}}
						>
							{type}
						</Typography>

						<Typography
							sx={{
								flexShrink: 0,
								fontSize: 11,
								lineHeight: 1,
								color: "#A0ADB3",
							}}
						>
							·
						</Typography>

						<Typography
							sx={{
								flexShrink: 0,
								fontSize: 11,
								lineHeight: 1,
								color: "#8A9BA3",
							}}
						>
							{number}
						</Typography>

						{/* Revision */}
						<Box
							sx={{
								display: "inline-flex",
								alignItems: "center",
								flexShrink: 0,
								height: 26,
								px: 1.25,
								borderRadius: "7px",
								backgroundColor: "#E7EFF1",
							}}
						>
							<Typography
								sx={{
									fontSize: 11,
									lineHeight: 1,
									fontWeight: 700,
									color: "#244B5A",
								}}
							>
								Rev: {revision}
							</Typography>
						</Box>

						{/* Status */}
						<Box
							sx={{
								flexShrink: 0,
								display: "flex",
								alignItems: "center",
							}}
						>
							<StatusBadge status={status} />
						</Box>
					</Stack>

					{/* Right */}
					<Stack
						sx={{
							direction: "row",
							alignItems: "center",
							gap: 1.75,
							flexShrink: 0,
						}}
					>
						{saved && (
							<Stack
								sx={{
									direction: "row",
									alignItems: "center",
									gap: 0.5,
								}}
							>
								<CheckIcon
									aria-hidden
									sx={{
										fontSize: 16,
										color: "#5E9E3D",
									}}
								/>

								<Typography
									sx={{
										fontSize: 12,
										lineHeight: 1,
										fontWeight: 600,
										color: "#5E9E3D",
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
								sx={{
									height: 36,
									minWidth: 99,
									px: 1.75,
									borderRadius: "10px",

									backgroundColor: "#FFFFFF",
									borderColor: "#CFDCE0",

									color: "#355666",

									fontSize: 12,
									fontWeight: 700,
									textTransform: "none",

									boxShadow: "0 1px 2px rgba(16, 42, 56, 0.03)",

									"&:hover": {
										backgroundColor: "#FFFFFF",
										borderColor: "#B9C9CE",
										boxShadow: "0 1px 2px rgba(16, 42, 56, 0.03)",
									},
								}}
							>
								{saveLabel}
							</Button>
						)}
					</Stack>
				</Stack>

				{/* REVISION NAVIGATION */}
				<Stack
					sx={{
						flexDirection: "row",
						alignItems: "center",
						pb: 1.5,
						justifyContent: "space-between",
						gap: 2,
					}}
				>
					{revisionTabs.length > 0 ? (
						<Stack
							role="tablist"
							aria-label="Program revisions"
							sx={{
								gap: 0.75,
								flexDirection: "row",
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
											height: 32,

											borderRadius: "18px",

											px: 1.75,
											py: 0,

											fontSize: 11,
											fontWeight: 700,
											lineHeight: 1,

											textTransform: "none",

											...(active
												? {
														backgroundColor: "#244B57",
														color: "#FFFFFF",
														border: "1px solid #244B57",

														"&:hover": {
															backgroundColor: "#244B57",
														},
													}
												: {
														backgroundColor: "#FFFFFF",
														color: "#607984",
														borderColor: "#D4E0E3",

														"&:hover": {
															backgroundColor: "#FFFFFF",
															borderColor: "#C4D2D6",
														},
													}),
										}}
									>
										<Box
											component="span"
											sx={{
												display: "inline-flex",
												alignItems: "center",
												gap: 0.75,
											}}
										>
											<span>{tab.label}</span>

											<Box
												component="span"
												sx={{
													color: active ? "rgba(255,255,255,0.72)" : "#8A9BA3",
													fontSize: 10,
													fontWeight: 600,
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
								gap: 0.75,
								alignItems: "center",
								flexDirection: "row",
								minHeight: 30,
								borderRadius: 999,
								backgroundColor: "#E7ECEE",
								px: 1.5,
								py: 0.5,
							}}
						>
							<Typography component="span" sx={{ fontSize: 12, lineHeight: 1 }}>
								🔒
							</Typography>

							<Typography
								sx={{
									fontSize: 11,
									lineHeight: 1.2,
									color: "#637780",
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

			{/* DIVIDER */}
			<Container
				maxWidth={false}
				sx={{
					width: "100%",
					maxWidth: 1360,
					mx: "auto",
					px: { xs: 2, sm: 3, lg: 4 },
				}}
			>
				<Divider
					sx={{
						borderColor: "#DCE4E6",
					}}
				/>
			</Container>
		</Box>
	);
}

export { ProgramContextHeader };

