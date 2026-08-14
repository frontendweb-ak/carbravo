import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	StatusDot,
} from "@/components/ui";
import { cn, formatRelativeTime } from "@/utils";
import { useState } from "react";
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
	const INITIAL_ITEMS = 5;

	const [expanded, setExpanded] = useState(false);
	const visibleItems = expanded ? items : items.slice(0, INITIAL_ITEMS);

	return (
		<Card className={cn("min-h-0", className)}>
			<CardHeader className="px-5 pb-2">
				<CardTitle className="text-base font-bold">Recent activity</CardTitle>
			</CardHeader>
			<CardContent className="px-5 pb-5">
				{loading ? (
					<RecentActivitySkeleton />
				) : (
					<>
						<div className="space-y-2">
							{visibleItems.map((item) => (
								<ActivityRow key={item.id} item={item} />
							))}
						</div>

						{items.length > INITIAL_ITEMS && (
							<Button
								variant="ghost"
								size="sm"
								className="mt-4 w-full"
								onClick={() => setExpanded((v) => !v)}
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

function ActivityRow({ item }: { item: ActivityItem }) {
	return (
		<div className="flex gap-3">
			<StatusDot
				className="mt-2 size-2 shrink-0 rounded-full"
				status={item.color ?? "draft"}
			/>
			<div className="min-w-0 flex-1">
				<p className="text-sm leading-5">
					<span className="font-semibold text-foreground">{item.actor}</span>{" "}
					<span className="text-foreground">{item.operationLabel}</span>{" "}
					<span className="font-medium text-foreground">
						“{item.programName}”
					</span>
				</p>
				<p className="text-xs text-muted-foreground">
					{formatRelativeTime(item.changedAt)}
				</p>
			</div>
		</div>
	);
}

export { RecentActivity };
