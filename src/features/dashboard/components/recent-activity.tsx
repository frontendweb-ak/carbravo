import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/utils";

export interface RecentActivityItem {
	id: string;
	actor: string;
	action: string;
	target: string;
	time: string;
	color?: "draft" | "review" | "approved" | "active";
}

interface RecentActivityProps {
	items?: RecentActivityItem[];
	className?: string;
}

const activityColor: Record<
	NonNullable<RecentActivityItem["color"]>,
	string
> = {
	draft: "bg-status-draft",
	review: "bg-status-review",
	approved: "bg-status-approved",
	active: "bg-status-active",
};

const defaultItems: RecentActivityItem[] = [
	{
		id: "1",
		actor: "jsmith",
		action: "submitted",
		target: "Q3 Customer Cash — Sedans",
		time: "12 minutes ago",
		color: "review",
	},
	{
		id: "2",
		actor: "mreviewer",
		action: "approved",
		target: "EV Bonus Cash",
		time: "1 hour ago",
		color: "approved",
	},
	{
		id: "3",
		actor: "admin",
		action: "published",
		target: "Summer Finance Event",
		time: "3 hours ago",
		color: "active",
	},
	{
		id: "4",
		actor: "jsmith",
		action: "created draft",
		target: "Non-GM Certified Cash",
		time: "Yesterday",
		color: "draft",
	},
];

function RecentActivity({
	items = defaultItems,
	className,
}: RecentActivityProps) {
	return (
		<Card className={cn("min-h-0", className)}>
			<CardHeader className="px-5 pb-2">
				<CardTitle className="text-base font-bold">Recent activity</CardTitle>
			</CardHeader>

			<CardContent className="px-5 pb-5">
				<div className="space-y-3.5">
					{items.map((item) => (
						<div key={item.id} className="flex gap-3">
							<span
								aria-hidden="true"
								className={cn(
									"mt-1.5 size-2 shrink-0 rounded-full",
									item.color
										? activityColor[item.color]
										: "bg-muted-foreground",
								)}
							/>

							<div className="min-w-0">
								<p className="text-sm leading-5 text-foreground">
									<span className="font-bold">{item.actor}</span>{" "}
									<span>{item.action}</span>{" "}
									<span className="font-medium">“{item.target}”</span>
								</p>

								<p className="mt-0.5 text-xs text-muted-foreground">
									{item.time}
								</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export { RecentActivity };
