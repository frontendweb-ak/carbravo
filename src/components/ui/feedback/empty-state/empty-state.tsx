import type { ReactNode } from "react";

import { cn } from "@/utils";

export interface EmptyStateProps {
	icon?: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
	className?: string;
}

function EmptyState({
	icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			data-slot="empty-state"
			className={cn(
				"flex min-h-40 flex-col items-center justify-center",
				"px-6 py-8 text-center",
				className,
			)}
		>
			{icon && (
				<div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
					{icon}
				</div>
			)}

			<h3 className="text-sm font-semibold text-foreground">{title}</h3>

			{description && (
				<p className="mt-1 max-w-md text-sm text-muted-foreground">
					{description}
				</p>
			)}

			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}

export { EmptyState };
