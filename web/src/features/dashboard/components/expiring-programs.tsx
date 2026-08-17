import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import ChevronRight from "@mui/icons-material/ChevronRight";
import { Link as RouterLink } from "react-router-dom";

import { StatusBadge } from "@/components/ui";
import type { ExpiringProgram } from "../model/dashboard.types";
import { mapStatus } from "../utils";
import { ExpiringProgramsSkeleton } from "./expiring-programs-skeleton";

export interface ExpiringProgramsProps {
	programs?: ExpiringProgram[];
	days?: number;
	viewAllHref?: string;
	loading?: boolean;
}

function ExpiringPrograms({
	programs = [],
	days = 14,
	viewAllHref = "/programs",
	loading = false,
}: ExpiringProgramsProps) {
	return (
		<Card sx={{ height: "100%" }}>
			{/* Header */}
			<Box
				sx={{
					px: 3,
					py: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					borderBottom: 1,
					borderColor: "divider",
				}}
			>
				<Typography variant="h6" sx={{ fontWeight: 700 }}>
					Expiring soon
				</Typography>

				<Chip
					label={`Next ${days} days`}
					size="small"
					color="warning"
					variant="outlined"
				/>
			</Box>

			{/* Table Header */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns:
						"minmax(180px,1.4fr) 80px 120px minmax(150px,1fr) 100px",
					alignItems: "center",
					px: 3,
					py: 1.5,
					bgcolor: "action.hover",
					borderBottom: 1,
					borderColor: "divider",
				}}
			>
				<Typography variant="caption" sx={{ fontWeight: 700 }}>
					PROGRAM
				</Typography>

				<Typography variant="caption" sx={{ fontWeight: 700 }}>
					REV
				</Typography>

				<Typography variant="caption" sx={{ fontWeight: 700 }}>
					EXPIRES
				</Typography>

				<Typography variant="caption" sx={{ fontWeight: 700 }}>
					VEHICLES
				</Typography>

				<Typography variant="caption" sx={{ fontWeight: 700 }}>
					STATUS
				</Typography>
			</Box>

			<CardContent sx={{ p: 0 }}>
				{loading ? (
					<ExpiringProgramsSkeleton />
				) : programs.length === 0 ? (
					<Box
						sx={{
							minHeight: 160,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							px: 3,
						}}
					>
						<Typography color="text.secondary">
							No programs expiring soon.
						</Typography>
					</Box>
				) : (
					programs.map((program, index) => (
						<Box
							key={program.id}
							component={RouterLink}
							to={`/programs/${program.id}`}
							sx={{
								display: "grid",
								gridTemplateColumns:
									"minmax(180px,1.4fr) 80px 120px minmax(150px,1fr) 100px",
								alignItems: "center",
								px: 3,
								py: 2,
								textDecoration: "none",
								color: "inherit",
								position: "relative",

								"&:hover": {
									bgcolor: "action.hover",
								},

								...(index !== programs.length - 1 && {
									borderBottom: 1,
									borderColor: "divider",
								}),
							}}
						>
							<Typography variant="body2" noWrap>
								{program.name}
							</Typography>

							<Box>
								<Chip
									label={program.revision}
									size="small"
									variant="outlined"
								/>
							</Box>

							<Typography variant="body2" color="text.secondary">
								{program.expiresAt}
							</Typography>

							<Typography variant="body2" color="text.secondary" noWrap>
								{program.vehicles}
							</Typography>

							<StatusBadge status={mapStatus(program.status)} />

							<ChevronRight
								size={16}
								style={{
									position: "absolute",
									right: 12,
									opacity: 0.4,
								}}
							/>
						</Box>
					))
				)}
			</CardContent>

			{!loading && programs.length > 0 && (
				<>
					<Divider />

					<Box
						sx={{
							px: 3,
							py: 2,
							display: "flex",
							justifyContent: "flex-end",
						}}
					>
						<Link
							component={RouterLink}
							to={viewAllHref}
							underline="hover"
							color="text.secondary"
							sx={{
								fontSize: 12,
								fontWeight: 600,
							}}
						>
							View all programs
						</Link>
					</Box>
				</>
			)}
		</Card>
	);
}

export { ExpiringPrograms };

