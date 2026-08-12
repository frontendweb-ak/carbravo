import type { ReactNode } from "react";

import { cn } from "@/utils";

export interface ProgramSection {
	id: string;
	number: number;
	label: ReactNode;
	completed?: boolean;
	status?: "pending" | "active" | "completed" | "warning";
}

export interface ProgramSectionSidebarProps {
	sections: ProgramSection[];
	activeSection?: string;
	onSectionChange?: (sectionId: string) => void;
	completion?: number;
	title?: ReactNode;
	disabled?: boolean;
	className?: string;
}

function ProgramSectionSidebar({
	sections,
	activeSection,
	onSectionChange,
	completion = 0,
	title = "Sections · Edit in any order",
	disabled = false,

	className,
}: ProgramSectionSidebarProps) {
	const normalizedCompletion = Math.min(100, Math.max(0, completion));

	return (
		<aside
			className={cn(
				"w-full",
				"rounded-2xl border border-border",
				"bg-card",
				"p-3",
				"shadow-sm",

				"lg:w-64",
				"xl:w-66",

				className,
			)}
		>
			{/* Header */}
			<div className="px-2 pb-3">
				<h2
					className={cn(
						"text-[11px]",
						"font-bold",
						"uppercase",
						"tracking-wide",
						"text-muted-foreground",
					)}
				>
					{title}
				</h2>
			</div>

			{/* Sections */}
			<nav aria-label="Program sections" className="space-y-1">
				{sections.map((section) => {
					const isActive = activeSection === section.id;

					const isCompleted =
						section.completed || section.status === "completed";

					const isDisabled = disabled;

					return (
						<button
							key={section.id}
							type="button"
							disabled={isDisabled}
							onClick={() => onSectionChange?.(section.id)}
							aria-current={isActive ? "step" : undefined}
							className={cn(
								"group",
								"flex w-full",
								"items-center",
								"gap-2",
								"rounded-lg",
								"px-2",
								"py-1.5",

								"text-left",
								"text-sm",
								"font-semibold",

								"transition-colors",

								// Default
								"text-foreground",

								// Hover
								"hover:bg-muted/70",

								// Active
								isActive && [
									"bg-primary/10",
									"text-primary",
									"ring-1",
									"ring-primary/20",
								],

								// Disabled
								"disabled:pointer-events-none",
								"disabled:opacity-50",
							)}
						>
							{/* Number */}
							<span
								className={cn(
									"flex size-6 shrink-0",
									"items-center justify-center",
									"rounded-md",
									"bg-muted",
									"text-[11px]",
									"font-bold",
									"text-muted-foreground",

									isActive && ["bg-primary", "text-primary-foreground"],

									isCompleted && !isActive && ["bg-primary/10", "text-primary"],
								)}
							>
								{section.number}
							</span>

							{/* Label */}
							<span className="min-w-0 flex-1 truncate">{section.label}</span>

							{/* Status */}
							<span
								aria-hidden="true"
								className={cn(
									"size-2 shrink-0",
									"rounded-full",
									"bg-border",

									isActive && "bg-primary",

									isCompleted && !isActive && "bg-success",

									section.status === "warning" && "bg-warning",
								)}
							/>
						</button>
					);
				})}
			</nav>

			{/* Divider */}
			<div className="my-3 border-t border-border" />

			{/* Completion */}
			<div className="px-2">
				<div className="mb-1 flex items-center justify-between">
					<span className="text-xs text-muted-foreground">Completeness</span>

					<span className="text-xs font-bold text-foreground">
						{normalizedCompletion}%
					</span>
				</div>

				<div
					className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
					role="progressbar"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={normalizedCompletion}
					aria-label="Program completeness"
				>
					<div
						className={cn(
							"h-full rounded-full",
							"bg-primary",
							"transition-[width]",
							"duration-300",
						)}
						style={{
							width: `${normalizedCompletion}%`,
						}}
					/>
				</div>
			</div>
		</aside>
	);
}

export { ProgramSectionSidebar };
