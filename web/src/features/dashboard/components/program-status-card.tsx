import { Card, CardContent, StatusBadge } from "@/components/ui";
import { cn } from "@/utils";

import type { DashboardProgramStatus } from "../model/dashboard.types";

export interface ProgramStatusCardProps {
	label: string;
	value: number;
	status: DashboardProgramStatus;
	loading?: boolean;
	className?: string;
}

function ProgramStatusCard({
	label,
	value,
	status,
	loading = false,
	className,
}: ProgramStatusCardProps) {
	return (
		<Card className={cn("min-h-[108px]", className)}>
			<CardContent className="flex flex-col justify-between gap-3 p-4">
				<div className="flex items-center justify-between gap-2">
					<span className="text-sm font-semibold text-muted-foreground">
						{label}
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
	);
}

export { ProgramStatusCard };
