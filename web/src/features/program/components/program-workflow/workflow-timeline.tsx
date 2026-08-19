import { Typography } from "@/components/ui";
import type { ProgramWorkflowStatus } from "@/config/constants";
import { Box, Stack } from "@mui/material";

function WorkflowTimeline({ status }: { status: ProgramWorkflowStatus }) {
	const events = [
		{
			status: "DRAFT" as const,
			title: "Created revision",
			actor: "admin@carbravo.com",
			date: "Jul 2, 2026 · 10:30",
		},
	];

	if (
		status === "SUBMITTED" ||
		status === "APPROVED" ||
		status === "ACTIVE" ||
		status === "EXPIRED"
	) {
		events.push({
			status: "SUBMITTED",
			title: "Submitted for review",
			actor: "admin@carbravo.com",
			date: "Jul 2, 2026 · 11:10",
		});
	}

	if (status === "APPROVED" || status === "ACTIVE" || status === "EXPIRED") {
		events.push({
			status: "APPROVED",
			title: "Approved",
			actor: "mentor@carbravo.com",
			date: "Jul 2, 2026 · 12:30",
		});
	}

	if (status === "ACTIVE" || status === "EXPIRED") {
		events.push({
			status: "ACTIVE",
			title: "Posted to production",
			actor: "admin@carbravo.com",
			date: "Jul 2, 2026 · 13:00",
		});
	}

	if (status === "EXPIRED") {
		events.push({
			status: "EXPIRED",
			title: "Program expired",
			actor: "admin@carbravo.com",
			date: "Aug 19, 2026 · 09:00",
		});
	}

	return (
		<Box
			sx={{
				border: "1px solid",
				borderColor: "control.border",
				borderRadius: 2,
				backgroundColor: "background.paper",
				p: 2.5,
			}}
		>
			<Typography variant="body" weight="bold">
				Audit timeline
			</Typography>

			<Typography variant="bodyMedium" color="secondary" sx={{ mt: 0.25 }}>
				Every state transition, actor and time.
			</Typography>

			<Stack spacing={2} sx={{ mt: 2 }}>
				{events.map((event) => (
					<Box
						key={`${event.status}-${event.date}`}
						sx={{
							display: "flex",
							gap: 1.5,
						}}
					>
						<Box
							sx={{
								width: 10,
								height: 10,
								mt: 0.6,
								borderRadius: "50%",
								backgroundColor: "success.main",
								flexShrink: 0,
							}}
						/>

						<Box>
							<Typography variant="body" weight="bold">
								{event.title}
							</Typography>

							<Typography
								variant="bodySmall"
								color="secondary"
								sx={{ mt: 0.25 }}
							>
								{event.actor} · {event.date}
							</Typography>
						</Box>
					</Box>
				))}
			</Stack>
		</Box>
	);
}

export { WorkflowTimeline };
