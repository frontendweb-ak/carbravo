import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/utils";

export interface FilterTab<T extends string = string> {
	value: T;
	label: ReactNode;
	count?: number;
	disabled?: boolean;
}

export interface FilterTabsProps<T extends string = string> extends Omit<
	ComponentProps<"div">,
	"onChange"
> {
	items: FilterTab<T>[];

	value: T;

	onValueChange: (value: T) => void;

	className?: string;
}

function FilterTabs<T extends string>({
	items,
	value,
	onValueChange,
	className,
	...props
}: FilterTabsProps<T>) {
	return (
		<div
			{...props}
			data-slot="filter-tabs"
			role="tablist"
			className={cn("flex flex-wrap items-center gap-1.5", className)}
		>
			{items.map((item) => {
				const selected = item.value === value;

				return (
					<button
						key={item.value}
						type="button"
						role="tab"
						aria-selected={selected}
						disabled={item.disabled}
						data-selected={selected || undefined}
						className={cn(
							"inline-flex h-8 items-center justify-center",
							"gap-1.5 rounded-full px-4",
							"border",
							"text-xs font-semibold",
							"whitespace-nowrap",
							"outline-none",
							"transition-colors",

							// Unselected
							"border-border",
							"bg-card",
							"text-foreground",
							"hover:bg-muted",

							// Selected — CarBravo teal
							selected && [
								"border-brand-teal",
								"bg-brand-teal",
								"text-white",
								"hover:bg-brand-teal",
							],

							// Focus
							"focus-visible:ring-3",
							"focus-visible:ring-ring/30",

							// Disabled
							"disabled:pointer-events-none",
							"disabled:cursor-not-allowed",
							"disabled:opacity-50",
						)}
						onClick={() => {
							if (!selected) {
								onValueChange(item.value);
							}
						}}
					>
						<span>{item.label}</span>

						{item.count !== undefined && (
							<span
								className={cn(
									"font-mono text-[11px]",
									selected ? "text-white/80" : "text-muted-foreground",
								)}
							>
								{item.count}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}

export { FilterTabs };
