import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/utils";

export interface TabItem {
	value: string;
	label: ReactNode;
	count?: number;
	content?: ReactNode;
	disabled?: boolean;
}

export interface TabsProps extends Omit<ComponentProps<"div">, "onChange"> {
	items: TabItem[];
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	showContent?: boolean;
	contentClassName?: string;
}

function Tabs({
	items,
	value,
	defaultValue,
	onValueChange,
	showContent = true,
	contentClassName,
	className,
	...props
}: TabsProps) {
	const firstValue = items[0]?.value ?? "";

	const [internalValue, setInternalValue] = useState(
		defaultValue ?? firstValue,
	);

	const activeValue = value ?? internalValue;

	const activeItem = items.find((item) => item.value === activeValue);

	const handleChange = (nextValue: string) => {
		if (value === undefined) {
			setInternalValue(nextValue);
		}

		onValueChange?.(nextValue);
	};

	return (
		<div data-slot="tabs" className={cn("w-full", className)} {...props}>
			{/* Tab List */}
			<div role="tablist" className="flex flex-wrap items-center gap-1.5">
				{items.map((item) => {
					const selected = item.value === activeValue;

					return (
						<button
							key={item.value}
							type="button"
							role="tab"
							aria-selected={selected}
							aria-controls={`tab-panel-${item.value}`}
							disabled={item.disabled}
							data-selected={selected || undefined}
							className={cn(
								"inline-flex h-8 items-center justify-center",
								"gap-1.5 rounded-full px-4",
								"border border-border",
								"bg-card text-foreground",
								"text-xs font-semibold",
								"whitespace-nowrap",
								"outline-none",
								"transition-colors",

								"hover:bg-muted",

								selected && [
									"border-brand-teal",
									"bg-brand-teal",
									"text-white",
									"hover:bg-brand-teal",
								],

								"focus-visible:ring-3",
								"focus-visible:ring-ring/30",

								"disabled:pointer-events-none",
								"disabled:cursor-not-allowed",
								"disabled:opacity-50",
							)}
							onClick={() => handleChange(item.value)}
						>
							<span>{item.label}</span>

							{item.count !== undefined && (
								<span
									className={cn(
										"text-[11px] font-medium",
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

			{/* Tab Content */}
			{showContent && activeItem?.content !== undefined && (
				<div
					id={`tab-panel-${activeItem.value}`}
					role="tabpanel"
					aria-labelledby={activeItem.value}
					className={cn("mt-6", contentClassName)}
				>
					{activeItem.content}
				</div>
			)}
		</div>
	);
}

export { Tabs };
