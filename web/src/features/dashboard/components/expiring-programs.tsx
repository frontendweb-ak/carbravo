import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import { AppCardHeader, Card, StatusBadge, Typography } from "@/components/ui";
import type { ExpiringProgram } from "../model/dashboard.types";
import { mapStatus } from "../utils";
import { ExpiringProgramsSkeleton } from "./expiring-programs-skeleton";

export interface ExpiringProgramsProps {
	programs?: ExpiringProgram[];
	days?: number;
	loading?: boolean;
}

const gridTemplateColumns =
	"minmax(180px, 1.4fr) 80px 120px minmax(150px, 1fr) 100px";

function ExpiringPrograms({
	programs = [],
	days = 14,
	loading = false,
}: ExpiringProgramsProps) {
	const showRows = !loading && programs.length > 0;

	return (
		<Card
			variant="outlined"
			sx={{
				height: "100%",
				minWidth: 0,
				p: 0,
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Header */}
			<AppCardHeader
				title="Expiring soon"
				divider
				sx={{ p: 4 }}
				action={
					<Chip
						label={`Next ${days} days`}
						size="small"
						sx={{
							height: 22,
							border: 0,
							borderRadius: 999,
							backgroundColor: "warning.soft",
							color: "warning.softForeground",
							fontSize: 11,
							fontWeight: 700,
							"& .MuiChip-label": {
								px: 1.25,
							},
						}}
					/>
				}
			/>

			{/* Column header */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns,
					alignItems: "center",
					minHeight: 34,
					py: 3,
					px: 4,
					backgroundColor: "action.hover",
					borderBottom: 1,
					borderColor: "divider",
				}}
			>
				<ColumnHeader>PROGRAM</ColumnHeader>
				<ColumnHeader>REV</ColumnHeader>
				<ColumnHeader>EXPIRES</ColumnHeader>
				<ColumnHeader>VEHICLES</ColumnHeader>
				<ColumnHeader>STATUS</ColumnHeader>
			</Box>

			{/* Content */}
			{loading ? (
				<ExpiringProgramsSkeleton />
			) : programs.length === 0 ? (
				<Box
					sx={{
						minHeight: 180,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						px: 4,
					}}
				>
					<Typography variant="body" color="secondary">
						No programs expiring soon.
					</Typography>
				</Box>
			) : (
				<Box>
					{programs.map((program, index) => (
						<ExpiringProgramRow
							key={program.id}
							program={program}
							last={index === programs.length - 1}
						/>
					))}
				</Box>
			)}

			{/* Keep empty space like the screenshot when there are only a few rows */}
			{showRows && (
				<Box
					sx={{
						minHeight: 300,
					}}
				/>
			)}
		</Card>
	);
}

interface ColumnHeaderProps {
	children: React.ReactNode;
}

function ColumnHeader({ children }: ColumnHeaderProps) {
	return (
		<Typography
			variant="caption"
			sx={{
				color: "text.secondary",
				fontSize: "0.6875rem",
				fontWeight: 700,
				lineHeight: 1,
				letterSpacing: "0.02em",
			}}
		>
			{children}
		</Typography>
	);
}

interface ExpiringProgramRowProps {
	program: ExpiringProgram;
	last: boolean;
}

function ExpiringProgramRow({ program, last }: ExpiringProgramRowProps) {
	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns,
				alignItems: "center",
				minHeight: 44,
				px: 4,
				py: 1,
				borderBottom: last ? 0 : 1,
				borderColor: "divider",
				transition: "background-color 150ms ease",

				"&:hover": {
					backgroundColor: "action.hover",
				},
			}}
		>
			<Typography
				variant="body"
				noWrap
				sx={{
					color: "text.primary",
					fontSize: "0.8125rem",
					fontWeight: 700,
				}}
			>
				{program.name}
			</Typography>

			<Box>
				<Chip
					label={program.revision}
					size="small"
					sx={{
						height: 22,
						border: 0,
						borderRadius: 1,
						backgroundColor: "action.hover",
						color: "text.primary",
						fontSize: 11,
						fontWeight: 700,
						"& .MuiChip-label": {
							px: 1,
						},
					}}
				/>
			</Box>

			<Typography
				variant="body"
				noWrap
				sx={{
					color: "text.secondary",
					fontSize: "0.8125rem",
				}}
			>
				{program.expiresAt}
			</Typography>

			<Typography
				variant="body"
				noWrap
				sx={{
					color: "text.secondary",
					fontSize: "0.8125rem",
				}}
			>
				{program.vehicles}
			</Typography>

			<Box>
				<StatusBadge status={mapStatus(program.status)} />
			</Box>
		</Box>
	);
}

export { ExpiringPrograms };
