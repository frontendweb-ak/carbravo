import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";

import { formatProgramDate as formatProgramDateFromUtils } from "@/utils";

import type { Program } from "../model/programs.types";
import { getProgramTypeLabel } from "../utils";
import { ProgramStatusBadge } from "./program-status-badge";

export interface ProgramListProps {
	programs: Program[];
	isFetching?: boolean;
	onProgramClick?: (programId: number) => void;
	onClone?: (programId: number) => void;
}

function ProgramList({
	programs,
	isFetching = false,
	onProgramClick,
	onClone,
}: ProgramListProps) {
	return (
		<Card
			variant="outlined"
			sx={{
				overflow: "hidden",
			}}
		>
			<CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
				{/* Keep current content visible while fetching */}
				{isFetching && (
					<LinearProgress
						aria-hidden="true"
						variant="indeterminate"
						sx={{
							height: 2,
						}}
					/>
				)}

				{/* Desktop */}
				<Box
					sx={{
						display: {
							xs: "none",
							md: "block",
						},
					}}
				>
					<ProgramTable
						programs={programs}
						onClone={onClone}
						onProgramClick={onProgramClick}
					/>
				</Box>

				{/* Mobile */}
				<Box
					sx={{
						display: {
							xs: "block",
							md: "none",
						},
						"& > * + *": {
							borderTop: 1,
							borderColor: "divider",
						},
					}}
				>
					{programs.map((program) => (
						<ProgramMobileCard
							key={program.id}
							program={program}
							onClick={
								onProgramClick ? () => onProgramClick(program.id) : undefined
							}
						/>
					))}
				</Box>
			</CardContent>
		</Card>
	);
}

/* -------------------------------------------------------------------------- */
/* Desktop table                                                              */
/* -------------------------------------------------------------------------- */

interface ProgramTableProps {
	programs: Program[];
	onProgramClick?: (programId: number) => void;
	onClone?: (programId: number) => void;
}

function ProgramTable({
	programs,
	onProgramClick,
	onClone,
}: ProgramTableProps) {
	return (
		<TableContainer
			sx={{
				overflowX: "auto",
			}}
		>
			<Table
				aria-label="Incentive programs"
				sx={{
					borderCollapse: "collapse",
					minWidth: 900,
				}}
			>
				<caption
					style={{
						position: "absolute",
						width: 1,
						height: 1,
						padding: 0,
						margin: -1,
						overflow: "hidden",
						clip: "rect(0, 0, 0, 0)",
						whiteSpace: "nowrap",
						border: 0,
					}}
				>
					Incentive programs
				</caption>

				<TableHead>
					<TableRow
						sx={{
							backgroundColor: "action.hover",
						}}
					>
						<TableCell
							sx={{
								px: 2.5,
								py: 1.5,
								fontSize: 12,
								fontWeight: 600,
								color: "text.secondary",
							}}
						>
							Program
						</TableCell>

						<TableCell
							sx={{
								px: 2,
								py: 1.5,
								fontSize: 12,
								fontWeight: 600,
								color: "text.secondary",
							}}
						>
							Type
						</TableCell>

						<TableCell
							sx={{
								px: 2,
								py: 1.5,
								fontSize: 12,
								fontWeight: 600,
								color: "text.secondary",
							}}
						>
							Revision
						</TableCell>

						<TableCell
							sx={{
								px: 2,
								py: 1.5,
								fontSize: 12,
								fontWeight: 600,
								color: "text.secondary",
							}}
						>
							Delivery period
						</TableCell>

						<TableCell
							sx={{
								px: 2,
								py: 1.5,
								fontSize: 12,
								fontWeight: 600,
								color: "text.secondary",
							}}
						>
							Status
						</TableCell>

						<TableCell
							align="right"
							sx={{
								width: 160,
								px: 1.5,
								py: 1.5,
							}}
						>
							<Box component="span" sx={visuallyHidden}>
								Actions
							</Box>
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{programs.map((program) => (
						<ProgramTableRow
							key={program.id}
							program={program}
							onClone={onClone}
							onClick={
								onProgramClick ? () => onProgramClick(program.id) : undefined
							}
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

/* -------------------------------------------------------------------------- */
/* Desktop row                                                                */
/* -------------------------------------------------------------------------- */

interface ProgramTableRowProps {
	program: Program;
	onClick?: () => void;
	onClone?: (programId: number) => void;
}

function ProgramTableRow({ program, onClick, onClone }: ProgramTableRowProps) {
	const canOpen = Boolean(onClick);

	return (
		<TableRow
			hover={canOpen}
			sx={{
				"&:last-child td": {
					borderBottom: 0,
				},
			}}
		>
			{/* Program */}
			<TableCell sx={{ px: 2.5, py: 1.25 }}>
				{canOpen ? (
					<Box
						component="button"
						type="button"
						onClick={onClick}
						sx={{
							display: "block",
							width: "100%",
							minWidth: 0,
							border: 0,
							padding: 0,
							margin: 0,
							background: "transparent",
							textAlign: "left",
							cursor: "pointer",
							color: "inherit",
							font: "inherit",
						}}
					>
						<ProgramIdentity program={program} />
					</Box>
				) : (
					<ProgramIdentity program={program} />
				)}
			</TableCell>

			{/* Type */}
			<TableCell sx={{ px: 2, py: 1.25 }}>
				<Typography variant="body2">
					{getProgramTypeLabel(program.type)}
				</Typography>
			</TableCell>

			{/* Revision */}
			<TableCell sx={{ px: 2, py: 1.25 }}>
				<RevisionInfo program={program} />
			</TableCell>

			{/* Delivery */}
			<TableCell sx={{ px: 2, py: 1.25 }}>
				<DeliveryPeriod program={program} />
			</TableCell>

			{/* Status */}
			<TableCell sx={{ px: 2, py: 1.25 }}>
				<ProgramStatusBadge status={program.status} />
			</TableCell>

			{/* Actions */}
			<TableCell
				align="right"
				sx={{
					px: 1.5,
					py: 1.25,
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						gap: 1,
					}}
				>
					<Button
						type="button"
						variant="contained"
						color="secondary"
						size="small"
						aria-label={`Open ${program.name || "program"}`}
						onClick={onClick}
					>
						Open
					</Button>

					<Button
						type="button"
						variant="outlined"
						size="small"
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							onClone?.(program.id);
						}}
					>
						Clone
					</Button>
				</Box>
			</TableCell>
		</TableRow>
	);
}

/* -------------------------------------------------------------------------- */
/* Program identity                                                           */
/* -------------------------------------------------------------------------- */

function ProgramIdentity({ program }: { program: Program }) {
	return (
		<Box sx={{ minWidth: 0 }}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					minWidth: 0,
				}}
			>
				<Typography
					variant="body2"
					sx={{
						minWidth: 0,
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						fontWeight: 600,
					}}
				>
					{program.name || "Untitled program"}
				</Typography>

				{program.hasDraft && (
					<Chip
						label="Draft revision"
						size="small"
						color="primary"
						sx={{
							flexShrink: 0,
							height: 20,
							fontSize: 11,
							fontWeight: 600,
						}}
					/>
				)}
			</Box>

			<Typography
				variant="caption"
				color="text.secondary"
				sx={{
					display: "block",
					mt: 0.25,
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
				}}
			>
				{program.identifier || "—"}
			</Typography>
		</Box>
	);
}

/* -------------------------------------------------------------------------- */
/* Revision                                                                   */
/* -------------------------------------------------------------------------- */

function RevisionInfo({ program }: { program: Program }) {
	const revision = program.revision;

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Typography
				variant="body2"
				sx={{
					fontWeight: 500,
				}}
			>
				{revision?.label ?? "—"}
			</Typography>

			{revision?.isMinorRevision && (
				<Typography variant="caption" color="text.secondary">
					Minor revision
				</Typography>
			)}

			{revision?.isSubmitted && !revision.approved && (
				<Typography
					variant="caption"
					sx={{
						color: "warning.main",
					}}
				>
					Pending approval
				</Typography>
			)}
		</Box>
	);
}

/* -------------------------------------------------------------------------- */
/* Delivery period                                                            */
/* -------------------------------------------------------------------------- */

function DeliveryPeriod({ program }: { program: Program }) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.75,
				whiteSpace: "nowrap",
			}}
		>
			<CalendarTodayIcon
				aria-hidden="true"
				sx={{
					width: 14,
					height: 14,
					flexShrink: 0,
					color: "text.secondary",
				}}
			/>

			<Typography variant="body2">
				{formatProgramDate(program.deliveryStartDate)}
				{" – "}
				{formatProgramDate(program.deliveryEndDate)}
			</Typography>
		</Box>
	);
}

/* -------------------------------------------------------------------------- */
/* Mobile                                                                     */
/* -------------------------------------------------------------------------- */

interface ProgramMobileCardProps {
	program: Program;
	onClick?: () => void;
}

function ProgramMobileCard({ program, onClick }: ProgramMobileCardProps) {
	if (!onClick) {
		return <ProgramMobileContent program={program} />;
	}

	return (
		<Box
			component="button"
			type="button"
			onClick={onClick}
			sx={{
				display: "flex",
				alignItems: "flex-start",
				width: "100%",
				gap: 2,
				p: 2,
				border: 0,
				backgroundColor: "transparent",
				color: "inherit",
				textAlign: "left",
				cursor: "pointer",
				font: "inherit",
				transition: "background-color 150ms ease",

				"&:hover": {
					backgroundColor: "action.hover",
				},

				"&:focus-visible": {
					outline: "none",
					boxShadow: (theme) => `inset 0 0 0 2px ${theme.palette.primary.main}`,
				},
			}}
		>
			<ProgramMobileContent program={program} />

			<ChevronRightIcon
				aria-hidden="true"
				sx={{
					mt: 0.5,
					width: 16,
					height: 16,
					flexShrink: 0,
					color: "text.secondary",
				}}
			/>
		</Box>
	);
}

function ProgramMobileContent({ program }: { program: Program }) {
	return (
		<Box
			sx={{
				minWidth: 0,
				flex: 1,
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
					gap: 1.5,
				}}
			>
				<Box sx={{ minWidth: 0 }}>
					<Typography
						variant="body2"
						sx={{
							fontWeight: 600,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{program.name || "Untitled program"}
					</Typography>

					<Typography
						variant="caption"
						color="text.secondary"
						sx={{
							display: "block",
							mt: 0.25,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{program.identifier || "—"}
					</Typography>
				</Box>

				<ProgramStatusBadge status={program.status} />
			</Box>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
					gap: 1.5,
					mt: 1.5,
				}}
			>
				<Box>
					<Typography variant="caption" color="text.secondary">
						Type
					</Typography>

					<Typography
						variant="body2"
						sx={{
							mt: 0.25,
							fontWeight: 500,
						}}
					>
						{getProgramTypeLabel(program.type)}
					</Typography>
				</Box>

				<Box>
					<Typography variant="caption" color="text.secondary">
						Revision
					</Typography>

					<Typography
						variant="body2"
						sx={{
							mt: 0.25,
							fontWeight: 500,
						}}
					>
						{program.revision?.label ?? "—"}
					</Typography>
				</Box>

				<Box
					sx={{
						gridColumn: "1 / -1",
					}}
				>
					<Typography variant="caption" color="text.secondary">
						Delivery period
					</Typography>

					<Typography
						variant="body2"
						sx={{
							mt: 0.25,
							fontWeight: 500,
						}}
					>
						{formatProgramDate(program.deliveryStartDate)}
						{" – "}
						{formatProgramDate(program.deliveryEndDate)}
					</Typography>
				</Box>

				{program.hasDraft && (
					<Box
						sx={{
							gridColumn: "1 / -1",
						}}
					>
						<Typography
							variant="caption"
							sx={{
								fontWeight: 500,
								color: "primary.main",
							}}
						>
							Draft revision available
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
}

/* -------------------------------------------------------------------------- */
/* Date                                                                       */
/* -------------------------------------------------------------------------- */

function formatProgramDate(value: string | null): string {
	if (!value) {
		return "—";
	}

	return formatProgramDateFromUtils(value);
}

/* -------------------------------------------------------------------------- */
/* Accessibility                                                             */
/* -------------------------------------------------------------------------- */

const visuallyHidden = {
	border: 0,
	clip: "rect(0 0 0 0)",
	height: "1px",
	margin: "-1px",
	overflow: "hidden",
	padding: 0,
	position: "absolute",
	whiteSpace: "nowrap",
	width: "1px",
} as const;

/* -------------------------------------------------------------------------- */
/* Export                                                                     */
/* -------------------------------------------------------------------------- */

export { ProgramList };
