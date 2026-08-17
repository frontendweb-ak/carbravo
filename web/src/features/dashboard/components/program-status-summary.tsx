import Grid from "@mui/material/Grid";

import { ProgramStatusCard } from "./program-status-card";

export interface ProgramStatusSummaryProps {
	draft: number;
	review: number;
	approved: number;
	active: number;
	expired: number;
	loading?: boolean;
}

function ProgramStatusSummary({
	draft,
	review,
	approved,
	active,
	expired,
	loading = false,
}: ProgramStatusSummaryProps) {
	return (
		<Grid container spacing={2}>
			<Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
				<ProgramStatusCard
					label="Draft"
					value={draft}
					status="DRAFT"
					loading={loading}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
				<ProgramStatusCard
					label="Review"
					value={review}
					status="REVIEW"
					loading={loading}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
				<ProgramStatusCard
					label="Approved"
					value={approved}
					status="APPROVED"
					loading={loading}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
				<ProgramStatusCard
					label="Active"
					value={active}
					status="ACTIVE"
					loading={loading}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
				<ProgramStatusCard
					label="Expired"
					value={expired}
					status="EXPIRED"
					loading={loading}
				/>
			</Grid>
		</Grid>
	);
}

export { ProgramStatusSummary };
