import { useNavigate } from "react-router-dom";

import { Container } from "@/components/ui";
import {
	DashboardHeader,
	ExpiringPrograms,
	ProgramStatusSummary,
	QuickActions,
	RecentActivity,
} from "@/features/dashboard";

function DashboardPage() {
	const navigate = useNavigate();

	return (
		<main className="min-h-[calc(100vh-60px)] bg-background">
			<Container size="2xl" className="py-7">
				<DashboardHeader
					userName="Alex Chen"
					rightContent={
						<>
							Signed in as <strong className="text-foreground">Admin</strong>
							{" · Wednesday, July 2, 2026"}
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
