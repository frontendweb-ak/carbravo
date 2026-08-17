import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { StatusDot } from "@/components/ui";
import { formatRelativeTime } from "@/utils";

import type { ActivityItem } from "../model/dashboard.types";
import { RecentActivitySkeleton } from "./recent-activity-skeleton";

export interface RecentActivityProps {
	items?: ActivityItem[];
	loading?: boolean;
}

function RecentActivity({ items = [], loading = false }: RecentActivityProps) {
	const INITIAL_ITEMS = 5;

	const [expanded, setExpanded] = useState(false);

	const visibleItems = expanded ? items : items.slice(0, INITIAL_ITEMS);

	return (
		<Card>
			<CardHeader
				title="Recent activity"
				slotProps={{
					title: {
						variant: "subtitle1",
						fontWeight: 700,
					},
				}}
				sx={{
					px: 2.5,
					pb: 1,
				}}
			/>

			<CardContent
				sx={{
					px: 2.5,
					pb: 2.5,
				}}
			>
				{loading ? (
					<RecentActivitySkeleton />
				) : (
					<>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: 1,
							}}
						>
							{visibleItems.map((item) => (
								<ActivityRow key={item.id} item={item} />
							))}
						</Box>

						{items.length > INITIAL_ITEMS && (
							<Button
								fullWidth
								variant="text"
								size="small"
								sx={{ mt: 2 }}
								onClick={() => setExpanded((value) => !value)}
							>
								{expanded
									? "Show less"
									: `View ${items.length - INITIAL_ITEMS} more`}
							</Button>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}

interface ActivityRowProps {
	item: ActivityItem;
}

function ActivityRow({ item }: ActivityRowProps) {
	return (
		<Box
			sx={{
				display: "flex",
				gap: 1.5,
			}}
		>
			<Box
				sx={{
					mt: 1,
					flexShrink: 0,
				}}
			>
				<StatusDot status={item.color ?? "DRAFT"} />
			</Box>

			<Box
				sx={{
					minWidth: 0,
					flex: 1,
				}}
			>
				<Typography
					variant="body2"
					sx={{
						lineHeight: 1.5,
					}}
				>
					<Box component="span" sx={{ fontWeight: 700 }}>
						{item.actor}
					</Box>{" "}
					{item.operationLabel}{" "}
					<Box component="span" sx={{ fontWeight: 600 }}>
						“{item.programName}”
					</Box>
				</Typography>

				<Typography variant="caption" color="text.secondary">
					{formatRelativeTime(item.changedAt)}
				</Typography>
			</Box>
		</Box>
	);
}

export { RecentActivity };
