import { Card, CardContent } from "@/components/ui";

import { cn } from "@/utils";

export type ProgramStatus =
	| "draft"
	| "review"
	| "approved"
	| "active"
	| "expired";

interface ProgramStatusCardProps {
	label: string;
	value: number;
	status: ProgramStatus;
	className?: string;
}

const statusStyles: Record<ProgramStatus, string> = {
	draft: "bg-status-draft",
	review: "bg-status-review",
	approved: "bg-status-approved",
	active: "bg-status-active",
	expired: "bg-status-expired",
};

function ProgramStatusCard({
	label,
	value,
	status,
	className,
}: ProgramStatusCardProps) {
	return (
		<Card className={cn("min-h-25.5 justify-center", className)}>
			<CardContent>
				<div className="flex items-center gap-2">
					<span
						className={cn("size-2 rounded-full", statusStyles[status])}
						aria-hidden="true"
					/>

					<span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
						{label}
					</span>
				</div>

				<div className="mt-3 text-3xl font-bold leading-none text-foreground">
					{value}
				</div>
			</CardContent>
		</Card>
	);
}

export { ProgramStatusCard };
