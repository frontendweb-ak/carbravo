import type { ReactNode } from "react";

export interface DashboardHeaderProps {
	userName?: ReactNode;
	title?: ReactNode;
	rightContent?: ReactNode;
}

function DashboardHeader({
	userName = "Alex Chen",
	title = "Incentive authoring dashboard",
	rightContent,
}: DashboardHeaderProps) {
	return (
		<div className="flex items-end justify-between gap-6">
			<div>
				<div className="text-xs font-bold uppercase tracking-wide text-primary">
					Welcome back, {userName}
				</div>
				<h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
					{title}
				</h1>
			</div>
			{rightContent && (
				<div className="shrink-0 text-sm text-muted-foreground">
					{rightContent}
				</div>
			)}
		</div>
	);
}

export { DashboardHeader };

