import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/utils";

export type SwitchProps = SwitchPrimitive.Root.Props;

function Switch({ className, disabled, ...props }: SwitchProps) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			disabled={disabled}
			className={cn(
				// Layout
				"peer inline-flex h-5 w-9 shrink-0",
				"items-center",

				// Shape
				"rounded-full",

				// Base
				"border border-transparent",
				"bg-input",
				"shadow-xs",

				// Interaction
				"outline-none",
				"transition-colors",

				// Hover
				"hover:bg-input/80",

				// Focus
				"focus-visible:border-ring",
				"focus-visible:ring-3",
				"focus-visible:ring-ring/50",

				// Checked
				"data-checked:bg-primary",

				// Disabled
				"disabled:pointer-events-none",
				"disabled:cursor-not-allowed",
				"disabled:opacity-50",

				// Invalid
				"aria-invalid:border-destructive",
				"aria-invalid:ring-3",
				"aria-invalid:ring-destructive/20",

				"dark:aria-invalid:border-destructive/50",
				"dark:aria-invalid:ring-destructive/40",

				// Dark mode
				"dark:bg-input/80",
				"dark:data-checked:bg-primary",

				className,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					"pointer-events-none block size-4",
					"rounded-full",
					"bg-background",
					"shadow-sm",
					"ring-0",
					"transition-transform",

					"data-checked:translate-x-4",

					"data-unchecked:translate-x-0",

					"dark:bg-foreground",
					"dark:data-checked:bg-primary-foreground",
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
