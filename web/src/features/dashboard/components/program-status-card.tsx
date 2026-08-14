import { Card, CardContent, StatusBadge, StatusDot } from "@/components/ui";
import { cn } from "@/utils";

import { Link } from "react-router-dom";
import type { DashboardProgramStatus } from "../model/dashboard.types";

export interface ProgramStatusCardProps {
	label: string;
	value: number;
	status: DashboardProgramStatus;
	loading?: boolean;
	className?: string;
	onClick?: () => void;
}

function ProgramStatusCard({
	label,
	value,
	status,
	loading = false,
	className,
}: ProgramStatusCardProps) {
	return (
		<Link to={`/programs?status=${status}`}>
			<Card className={cn("min-h-27", className)}>
				<CardContent className="flex flex-col justify-between gap-3 p-4">
					<div className="flex items-center justify-between gap-2">
						<span className="flex items-center gap-2">
							<StatusDot status={status} />
							<span className="text-md font-semibold">{label}</span>
						</span>
						<StatusBadge status={status} />
					</div>

					{loading ? (
						<div className="h-8 w-12 animate-pulse rounded-md bg-muted" />
					) : (
						<span className="text-2xl font-bold tracking-tight text-foreground">
							{value}
						</span>
					)}
				</CardContent>
			</Card>
		</Link>
	);
}

export { ProgramStatusCard };
