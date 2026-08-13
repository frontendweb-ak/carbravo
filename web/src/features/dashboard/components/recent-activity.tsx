import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn, formatRelativeTime } from "@/utils";
import type { ActivityItem } from "../model/dashboard.types";
import { RecentActivitySkeleton } from "./recent-activity-skeleton";

export interface RecentActivityProps {
	items?: ActivityItem[];
	className?: string;
	loading?: boolean;
}

function RecentActivity({
	items = [],
	className,
	loading = false,
}: RecentActivityProps) {
	return (
		<Card className={cn("min-h-0", className)}>
			<CardHeader className="px-5 pb-2">
				<CardTitle className="text-base font-bold">Recent activity</CardTitle>
			</CardHeader>

			<CardContent className="px-5 pb-5">
				{loading ? (
					<RecentActivitySkeleton />
				) : items.length === 0 ? (
					<div className="py-8 text-center text-sm text-muted-foreground">
						No recent activity.
					</div>
				) : (
					<div className="space-y-4">
						{items.map((item) => (
							<ActivityRow key={item.id} item={item} />
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function ActivityRow({ item }: { item: ActivityItem }) {
	return (
		<div className="flex gap-3">
			<ActivityDot color={item.color} />
			<div className="min-w-0 flex-1">
				<p className="text-sm leading-5 text-foreground">
					<span className="font-bold">{item.actor}</span>{" "}
					<span>{item.operation}</span>{" "}
					<span className="font-medium">“{item.programName}”</span>
				</p>
				<p className="mt-0.5 text-xs text-muted-foreground">
					{formatRelativeTime(item.changedAt)}
				</p>
			</div>
		</div>
	);
}

function ActivityDot({ color }: { color?: ActivityItem["color"] }) {
	const className =
		color === "review"
			? "bg-status-review"
			: color === "approved"
				? "bg-status-approved"
				: color === "active"
					? "bg-status-active"
					: color === "draft"
						? "bg-status-draft"
						: "bg-muted-foreground";

	return (
		<span
			aria-hidden="true"
			className={cn("mt-1.5 size-2 shrink-0 rounded-full", className)}
		/>
	);
}


export { RecentActivity };
