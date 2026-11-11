import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";

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
import { useMockUserRole } from "@/infra/api/use-mock-user-role";

function DashboardPage() {
	const navigate = useNavigate();
	const { role } = useMockUserRole();
	const roleLabel = role === "AUTHOR" ? "Author" : role === "APPROVER" ? "Approver" : "Admin";

	const summaryQuery = useDashboardSummary();
	const activityQuery = useDashboardActivity();
	const expiringQuery = useExpiringPrograms();

	const statusCounts = getStatusCounts(summaryQuery.data?.counts ?? []);
	const formattedDate = formatLongDate(new Date());

	return (
		<Box sx={{ backgroundColor: "background.default" }}>
			<DashboardHeader
				userName={roleLabel}
				rightContent={
					<>
						Signed in as{" "}
						<Box
							component="strong"
							sx={{ color: "text.primary", fontWeight: 600 }}
						>
							{roleLabel}
						</Box>
						{` · ${formattedDate}`}
					</>
				}
			/>

			<Box sx={{ mt: 6 }}>
				<ProgramStatusSummary
					{...statusCounts}
					loading={summaryQuery.isLoading}
				/>
			</Box>

			<Box
				sx={{
					mt: 6,
					display: "grid",
					gap: 4,
					alignItems: "start",
					gridTemplateColumns: { xs: "1fr", lg: "1.52fr 1fr" },
				}}
			>
				<ExpiringPrograms programs={expiringQuery.data?.items ?? []} />
				<Stack spacing={4}>
					<RecentActivity
						loading={activityQuery.isLoading}
						items={activityQuery.data?.items ?? []}
					/>
					<QuickActions
						reviewCount={statusCounts.review}
						onNewProgram={() => navigate("/programs/new")}
						onBrowsePrograms={() => navigate("/programs")}
						onReviewQueue={() => navigate("/programs?pendingApproval=true")}
					/>
				</Stack>
			</Box>
		</Box>
	);
}

export default DashboardPage;
