import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

import { StatusBadge, StatusDot } from "@/components/ui";
import type { DashboardProgramStatus } from "../model/dashboard.types";

export interface ProgramStatusCardProps {
	label: string;
	value: number;
	status: DashboardProgramStatus;
	loading?: boolean;
	className?: string;
	onClick?: () => void;
}

function ProgramStatusCard({
	label,
	value,
	status,
	loading = false,
}: ProgramStatusCardProps) {
	return (
		<Link to={`/programs?status=${status}`} style={{ textDecoration: "none" }}>
			<Card
				sx={{
					minHeight: 108,
					borderRadius: 2,
					p: 2,
				}}
			>
				<CardContent
					sx={{
						p: 2,
						height: "100%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						gap: 1.5,
						"&:last-child": {
							pb: 2,
						},
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
							<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
								{label}
							</Typography>
						</Box>
						<StatusBadge status={status} />
					</Box>

					{loading ? (
						<Skeleton variant="rounded" width={48} height={32} />
					) : (
						<Typography
							variant="h4"
							sx={{
								lineHeight: 1,
								fontWeight: 700,
							}}
						>
							{value}
						</Typography>
					)}
				</CardContent>
			</Card>
		</Link>
	);
}
export { ProgramStatusCard };
