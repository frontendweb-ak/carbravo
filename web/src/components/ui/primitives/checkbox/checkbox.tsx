import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "@/utils";

export type CheckboxProps = CheckboxPrimitive.Root.Props;

function Checkbox({
	className,
	indeterminate = false,
	disabled,
	...props
}: CheckboxProps) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			indeterminate={indeterminate}
			disabled={disabled}
			className={cn(
				"peer relative flex size-3.5 shrink-0",
				"items-center justify-center",
				"rounded-xs",
				"border border-[#666]",
				"bg-transparent",
				"text-primary-foreground",
				// "shadow-xs",

				"outline-none",
				"select-none",
				"transition-colors",

				"hover:border-ring/70",

				"focus-visible:ring-3",
				"focus-visible:ring-ring/50",

				"data-checked:border-secondary",
				"data-checked:bg-secondary",
				"data-checked:text-primary-foreground",

				"data-indeterminate:border-primary",
				"data-indeterminate:bg-primary",
				"data-indeterminate:text-primary-foreground",

				"disabled:pointer-events-none",
				"disabled:cursor-not-allowed",
				"disabled:opacity-50",

				"aria-invalid:border-destructive",
				"aria-invalid:ring-3",
				"aria-invalid:ring-destructive/20",

				"dark:aria-invalid:border-destructive/50",
				"dark:aria-invalid:ring-destructive/40",

				"dark:bg-input/30",
				"dark:data-checked:bg-primary",
				"dark:data-indeterminate:bg-primary",

				"after:absolute",
				"after:-inset-x-2",
				"after:-inset-y-2",

				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="grid size-full place-items-center"
			>
				{indeterminate ? (
					<MinusIcon
						aria-hidden="true"
						className="size-2.5"
						strokeWidth={2.5}
					/>
				) : (
					<CheckIcon
						aria-hidden="true"
						className="size-2.5"
						strokeWidth={2.5}
					/>
				)}
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
