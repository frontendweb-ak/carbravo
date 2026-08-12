import { useNavigate } from "react-router-dom";

import { Container } from "@/components/ui";
import {
	DashboardHeader,
	ExpiringPrograms,
	ProgramStatusSummary,
	QuickActions,
	RecentActivity,
} from "@/features/dashboard";
import {
	useDashboardActivity,
	useDashboardSummary,
	useExpiringPrograms,
} from "@/features/dashboard/hoosk/useDashboard";

function DashboardPage() {
	const navigate = useNavigate();

	// Call all dashboard hooks
	const {
		data: summaryData,
		isLoading: isSummaryLoading,
		isError: isSummaryError,
	} = useDashboardSummary();

	const {
		data: activityData,
		isLoading: isActivityLoading,
		isError: isActivityError,
	} = useDashboardActivity();

	const {
		data: expiringData,
		isLoading: isExpiringLoading,
		isError: isExpiringError,
	} = useExpiringPrograms();

	// Derive status counts from summary API response
	const statusCounts = summaryData?.counts.reduce(
		(acc, item) => {
			acc[item.status.toLowerCase()] = item.total;
			acc.review += item.pendingApproval;
			return acc;
		},
		{ draft: 0, review: 0, approved: 0, active: 0, expired: 0 },
	) ?? { draft: 0, review: 0, approved: 0, active: 0, expired: 0 };

	const formattedDate = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date());

	console.log(
		"---",
		isSummaryError,
		isSummaryLoading,
		summaryData,
		activityData,
		expiringData,
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

				<div className="mt-6">
					<ProgramStatusSummary
						draft={2}
						review={1}
						approved={1}
						active={2}
						expired={1}
					/>
				</div>

				<div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
					{/* Expiring programs */}
					<div>
						<ExpiringPrograms />
					</div>

					{/* Right column */}
					<div className="space-y-5">
						<RecentActivity />
						<QuickActions
							reviewCount={1}
							onNewProgram={() => navigate("/programs/new")}
							onBrowsePrograms={() => navigate("/programs")}
							onReviewQueue={() => {
								console.log("Review queue");
							}}
						/>
					</div>
				</div>
			</Container>
		</main>
	);
}

export default DashboardPage;
