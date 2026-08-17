import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/utils";

export type ProgramSectionStatus = "pending" | "warning" | "completed";

export interface SidebarProgramSection {
	id: string;
	number: number;
	label: ReactNode;
	requiredForSubmission?: boolean;
	completed?: boolean;
	status?: ProgramSectionStatus;
}

export interface ProgramSectionSidebarProps {
	sections: SidebarProgramSection[];
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
				"w-full min-w-0",
				"rounded-2xl border border-border",
				"bg-card",
				"p-3",
				"shadow-sm",
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
						section.completed === true || section.status === "completed";

					const isWarning = section.status === "warning";

					return (
						<button
							key={section.id}
							type="button"
							disabled={disabled}
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
								"disabled:cursor-not-allowed",
								"disabled:opacity-50",
							)}
						>
							{/* ------------------------------------------------ */}
							{/* Section indicator                              */}
							{/* ------------------------------------------------ */}

							<span
								className={cn(
									"flex size-6 shrink-0",
									"items-center justify-center",
									"rounded-md",
									"text-[11px]",
									"font-bold",

									// Pending
									!isCompleted &&
										!isWarning && ["bg-muted", "text-muted-foreground"],

									// Warning
									isWarning &&
										!isCompleted && ["bg-warning/10", "text-warning"],

									// Completed
									isCompleted && !isActive && ["bg-success/10", "text-success"],

									// Active
									isActive && ["bg-primary", "text-primary-foreground"],
								)}
							>
								{isCompleted && !isActive ? (
									<Check aria-hidden="true" className="size-3.5 stroke-3" />
								) : (
									section.number
								)}
							</span>

							{/* Label */}
							<span className="min-w-0 flex-1 truncate">{section.label}</span>

							{/* Status dot */}
							<span
								aria-hidden="true"
								className={cn(
									"size-2 shrink-0",
									"rounded-full",

									// Default / pending
									"bg-border",

									// Warning
									isWarning && !isCompleted && "bg-warning",

									// Completed
									isCompleted && "bg-success",
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

