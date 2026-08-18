import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";

import { AppCardHeader, Card, StatusDot, Typography } from "@/components/ui";
import { formatRelativeTime } from "@/utils";

import type { ActivityItem } from "../model/dashboard.types";
import { RecentActivitySkeleton } from "./recent-activity-skeleton";

export interface RecentActivityProps {
	items?: ActivityItem[];
	loading?: boolean;
}

const INITIAL_ITEMS = 5;

function RecentActivity({ items = [], loading = false }: RecentActivityProps) {
	const [expanded, setExpanded] = useState(false);

	const visibleItems = expanded ? items : items.slice(0, INITIAL_ITEMS);

	return (
		<Card variant="outlined" sx={{ minWidth: 0, p: 0 }}>
			<AppCardHeader
				title="Recent activity"
				divider={false}
				paddingX={4}
				paddingY={4}
				titleVariant="h6"
				titleSx={{
					fontSize: "0.9375rem",
					lineHeight: 1.2,
					fontWeight: 700,
				}}
			/>

			{loading ? (
				<Box sx={{ px: 2.5, pb: 2.5 }}>
					<RecentActivitySkeleton />
				</Box>
			) : (
				<Box sx={{ px: 4, pb: 2.5 }}>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
						{visibleItems.map((item) => (
							<ActivityRow key={item.id} item={item} />
						))}
					</Box>

					{items.length > INITIAL_ITEMS && (
						<Button
							fullWidth
							variant="text"
							size="small"
							onClick={() => setExpanded((value) => !value)}
							sx={{ mt: 1.5 }}
						>
							{expanded
								? "Show less"
								: `View ${items.length - INITIAL_ITEMS} more`}
						</Button>
					)}
				</Box>
			)}
		</Card>
	);
}

interface ActivityRowProps {
	item: ActivityItem;
}
const activityToneMap = {
	submitted: "REVIEW",
	approved: "APPROVED",
	published: "ACTIVE",
	created: "DRAFT",
	updated: "DRAFT",
} as const;
function ActivityRow({ item }: ActivityRowProps) {
	const tone =
		item.color ??
		activityToneMap[
			item.operationLabel.toLowerCase() as keyof typeof activityToneMap
		] ??
		"DRAFT";
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "flex-start",
				gap: 1.5,
				minWidth: 0,
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: 8,
					height: 20,
					flexShrink: 0,
				}}
			>
				<StatusDot status={tone} />
			</Box>

			<Box
				sx={{
					flex: 1,
					minWidth: 0,
				}}
			>
				<Typography
					variant="bodyMedium"
					color="default"
					sx={{
						fontSize: "0.8125rem",
						lineHeight: 1.35,
					}}
				>
					<Box component="span" sx={{ fontWeight: 700 }}>
						{item.actor}
					</Box>{" "}
					{item.operationLabel}{" "}
					<Box
						component="span"
						sx={{
							fontWeight: 600,
						}}
					>
						“{item.programName}”
					</Box>
				</Typography>

				<Typography
					variant="caption"
					color="secondary"
					sx={{
						display: "block",
						mt: 0.25,
						fontSize: "0.6875rem",
						lineHeight: 1.35,
					}}
				>
					{formatRelativeTime(item.changedAt)}
				</Typography>
			</Box>
		</Box>
	);
}

export { RecentActivity };

