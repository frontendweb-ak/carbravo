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
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
			<ProgramStatusCard
				label="Draft"
				value={draft}
				status="DRAFT"
				loading={loading}
			/>

			<ProgramStatusCard
				label="Review"
				value={review}
				status="REVIEW"
				loading={loading}
			/>

			<ProgramStatusCard
				label="Approved"
				value={approved}
				status="APPROVED"
				loading={loading}
			/>

			<ProgramStatusCard
				label="Active"
				value={active}
				status="ACTIVE"
				loading={loading}
			/>

			<ProgramStatusCard
				label="Expired"
				value={expired}
				status="EXPIRED"
				loading={loading}
			/>
		</div>
	);
}

export { ProgramStatusSummary };

