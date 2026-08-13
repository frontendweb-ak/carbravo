import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
	StatusBadge,
} from "@/components/ui";
import { cn } from "@/utils";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ExpiringProgram } from "../model/dashboard.types";
import { mapStatus } from "../utils";
import { ExpiringProgramsSkeleton } from "./expiring-programs-skeleton";

export interface ExpiringProgramsProps {
	programs?: ExpiringProgram[];
	days?: number;
	viewAllHref?: string;
	className?: string;
	loading?: boolean;
}

function ExpiringPrograms({
	programs = [],
	days = 14,
	viewAllHref = "/programs",
	className,
	loading = false,
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
				{/* Header */}
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

				{loading ? (
					<ExpiringProgramsSkeleton />
				) : programs.length === 0 ? (
					<div className="flex min-h-40 items-center justify-center px-5 text-sm text-muted-foreground">
						No programs expiring soon.
					</div>
				) : (
					programs.map((program) => (
						<Link
							key={program.id}
							to={`/programs/${program.id}`}
							className={cn(
								"group relative grid",
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
								<StatusBadge status={mapStatus(program.status)} />
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
			</CardContent>

			{!loading && programs.length > 0 && (
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

