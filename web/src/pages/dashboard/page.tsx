import { useNavigate } from "react-router-dom";

import { Container } from "@/components/ui";
import {
	DashboardHeader,
	ExpiringPrograms,
	ProgramStatusSummary,
	QuickActions,
	RecentActivity,
	useDashboardActivity,
	useDashboardSummary,
	useExpiringPrograms,
} from "@/features/dashboard";
import { getStatusCounts } from "@/features/dashboard/utils";
import { formatLongDate } from "@/utils";

function DashboardPage() {
	const navigate = useNavigate();

	const summaryQuery = useDashboardSummary();
	const activityQuery = useDashboardActivity();
	const expiringQuery = useExpiringPrograms();

	const statusCounts = getStatusCounts(summaryQuery.data?.counts ?? []);

	const formattedDate = formatLongDate(new Date());

	console.log(
		"data",
		summaryQuery.data,
		activityQuery.data,
		expiringQuery.data,
		JSON.stringify(summaryQuery.data, null, 2),
	);
	return (
		<main className="min-h-[calc(100vh-60px)] bg-background">
			<Container size="2xl" className="py-7">
				<DashboardHeader
					userName="Alex Chen"
					rightContent={
						<>
							Signed in as <strong className="text-foreground">Admin</strong>
							{` · ${formattedDate}`}
						</>
					}
				/>

				{/* Program status */}
				<div className="mt-6">
					<ProgramStatusSummary
						{...statusCounts}
						loading={summaryQuery.isLoading}
					/>
				</div>

				{/* Dashboard content */}
				<div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
					<div>
						<ExpiringPrograms programs={expiringQuery.data?.items ?? []} />
					</div>

					{/* Right column */}
					<div className="space-y-5">
						<RecentActivity items={activityQuery.data?.items ?? []} />

						<QuickActions
							reviewCount={statusCounts.review}
							onNewProgram={() => {
								navigate("/programs/new");
							}}
							onBrowsePrograms={() => {
								navigate("/programs");
							}}
							onReviewQueue={() => {
								// TODO: navigate to review queue
							}}
						/>
					</div>
				</div>
			</Container>
		</main>
	);
}

export default DashboardPage;