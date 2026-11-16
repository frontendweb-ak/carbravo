import Box from "@mui/material/Box";

import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

import { Card, StatusDot } from "@/components/ui";

import type { DashboardProgramStatus } from "../model/dashboard.types";

export interface ProgramStatusCardProps {
	label: string;
	value: number | null;
	href?: string;
	status: DashboardProgramStatus;
	loading?: boolean;
	className?: string;
	onClick?: () => void;
}

function ProgramStatusCard({
	label,
	value,
	href,
	status,
	loading = false,
}: ProgramStatusCardProps) {
	return (
		<Link to={href ?? `/programs?status=${status}`} style={{ textDecoration: "none" }}>
			<Card sx={{ p: 0, minHeight: 103, borderRadius: "16px" }}>
				<CardContent
					sx={{
						p: "16px 18px",
						height: "100%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						gap: 1.5,
						"&:last-child": { pb: "16px" },
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 1,
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<StatusDot status={status} />
							<Typography
								variant="caption"
								color="textSecondary"
								sx={{ fontWeight: 700, textTransform: "uppercase" }}
							>
								{label}
							</Typography>
						</Box>
					</Box>

					{loading ? (
						<Skeleton variant="rounded" width={48} height={32} />
					) : (
						<Typography variant="h3" sx={{ lineHeight: 1, fontWeight: 700 }}>
							{value ?? "—"}
						</Typography>
					)}
				</CardContent>
			</Card>
		</Link>
	);
}
export { ProgramStatusCard };

