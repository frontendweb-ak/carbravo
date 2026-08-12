import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import { cn } from "@/utils";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export type ExpiringProgramStatus =
	| "active"
	| "approved"
	| "review"
	| "draft"
	| "expired";

export interface ExpiringProgram {
	id: string;
	name: string;
	revision: string;
	expiresAt: string;
	vehicles: string;
	status: ExpiringProgramStatus;
}

export interface ExpiringProgramsProps {
	programs?: ExpiringProgram[];

	/**
	 * Number of days represented by the expiry window.
	 */
	days?: number;

	/**
	 * Optional link for viewing all programs.
	 */
	viewAllHref?: string;

	className?: string;
}

const DEFAULT_PROGRAMS: ExpiringProgram[] = [
	{
		id: "summer-finance-event",
		name: "Summer Finance Event",
		revision: "2.0",
		expiresAt: "Jul 31, 2026",
		vehicles: "GM Trucks & SUVs",
		status: "active",
	},
	{
		id: "ev-bonus-cash",
		name: "EV Bonus Cash",
		revision: "1.0",
		expiresAt: "Aug 8, 2026",
		vehicles: "Electric · all divisions",
		status: "approved",
	},
	{
		id: "cadillac-loyalty-apr",
		name: "Cadillac Loyalty APR",
		revision: "1.0",
		expiresAt: "Jul 15, 2026",
		vehicles: "Cadillac CT5, XT5",
		status: "active",
	},
];

const STATUS_LABEL: Record<ExpiringProgramStatus, string> = {
	active: "Active",
	approved: "Approved",
	review: "Review",
	draft: "Draft",
	expired: "Expired",
};

const STATUS_CLASS: Record<ExpiringProgramStatus, string> = {
	active: "bg-success/10 text-success",
	approved: "bg-info/10 text-info",
	review: "bg-warning/10 text-warning",
	draft: "bg-status-draft/10 text-status-draft",
	expired: "bg-muted text-muted-foreground",
};

function ExpiringPrograms({
	programs = DEFAULT_PROGRAMS,
	days = 14,
	viewAllHref = "/programs",
	className,
}: ExpiringProgramsProps) {
	return (
		<Card className={cn("h-full min-h-0", className)}>
			<CardHeader className="border-b px-5 py-4">
				<CardTitle className="text-base font-bold">Expiring soon</CardTitle>

				<CardAction>
					<span className="inline-flex rounded-full bg-warning/10 px-3 py-1 text-xs font-bold text-warning">
						Next {days} days
					</span>
				</CardAction>
			</CardHeader>

			<CardContent className="p-0">
				{/* Table header */}
				<div
					className={cn(
						"grid",
						"grid-cols-[minmax(180px,1.4fr)_80px_120px_minmax(150px,1fr)_100px]",
						"items-center",
						"border-b border-border",
						"bg-muted/50",
						"px-5 py-2.5",
						"text-[11px] font-bold uppercase tracking-wide",
						"text-muted-foreground",
					)}
				>
					<span>Program</span>
					<span>Rev</span>
					<span>Expires</span>
					<span>Vehicles</span>
					<span>Status</span>
				</div>

				{/* Rows */}
				<div>
					{programs.length === 0 ? (
						<div className="flex min-h-40 items-center justify-center px-5 text-sm text-muted-foreground">
							No programs expiring soon.
						</div>
					) : (
						programs.map((program) => (
							<Link
								key={program.id}
								to={`/programs/${program.id}`}
								className={cn(
									"group grid",
									"grid-cols-[minmax(180px,1.4fr)_80px_120px_minmax(150px,1fr)_100px]",
									"items-center",
									"border-b border-border last:border-b-0",
									"px-5 py-3",
									"transition-colors",
									"hover:bg-muted/40",
								)}
							>
								<span className="min-w-0 truncate text-sm font-semibold text-foreground">
									{program.name}
								</span>

								<span>
									<span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-semibold text-foreground">
										{program.revision}
									</span>
								</span>

								<span className="text-sm text-muted-foreground">
									{program.expiresAt}
								</span>

								<span className="min-w-0 truncate text-sm text-muted-foreground">
									{program.vehicles}
								</span>

								<span>
									<span
										className={cn(
											"inline-flex rounded-full px-2.5 py-1",
											"text-xs font-bold",
											STATUS_CLASS[program.status],
										)}
									>
										{STATUS_LABEL[program.status]}
									</span>
								</span>

								<ChevronRight
									className={cn(
										"absolute right-2 size-4",
										"text-muted-foreground",
										"opacity-0 transition-opacity",
										"group-hover:opacity-100",
									)}
								/>
							</Link>
						))
					)}
				</div>
			</CardContent>

			{programs.length > 0 && (
				<div className="flex items-center justify-end border-t border-border px-5 py-3">
					<Link
						to={viewAllHref}
						className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
					>
						View all programs
					</Link>
				</div>
			)}
		</Card>
	);
}

export { ExpiringPrograms };
