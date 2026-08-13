import { Select as SelectPrimitive } from "@base-ui/react/select";
import { ChevronDown } from "lucide-react";
import { type ComponentProps } from "react";

import { cn } from "@/utils";

export type SelectTriggerProps = ComponentProps<typeof SelectPrimitive.Trigger>;

export function SelectTrigger({
	className,
	children,
	...props
}: SelectTriggerProps) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			className={cn(
				"flex h-9 w-full items-center justify-between gap-2",
				"rounded-md border border-input",
				"bg-white px-3",
				"text-sm text-foreground",
				"shadow-xs",
				"outline-none",

				"hover:border-ring/60",

				"focus-visible:border-ring",
				"focus-visible:ring-3",
				"focus-visible:ring-ring/30",

				"disabled:pointer-events-none",
				"disabled:cursor-not-allowed",
				"disabled:opacity-50",

				"aria-invalid:border-destructive",
				"aria-invalid:ring-3",
				"aria-invalid:ring-destructive/20",

				"dark:bg-input/30",

				className,
			)}
			{...props}
		>
			<span className="min-w-0 flex-1 truncate text-left">{children}</span>

			<ChevronDown
				aria-hidden="true"
				className="size-4 shrink-0 text-muted-foreground"
			/>
		</SelectPrimitive.Trigger>
	);
}
