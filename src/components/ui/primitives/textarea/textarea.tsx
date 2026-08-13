import type { ComponentProps } from "react";

import { cn } from "@/utils";

const textareaVariants = {
	sm: "min-h-20 rounded-md px-2.5 py-2 text-sm",
	default: "min-h-24 rounded-md px-3 py-2.5 text-sm",
	lg: "min-h-28 rounded-lg px-3.5 py-3 text-base",
} as const;

type TextareaSize = keyof typeof textareaVariants;

export type TextareaProps = ComponentProps<"textarea"> & {
	size?: TextareaSize;
	error?: boolean;
	success?: boolean;
};

function Textarea({
	className,
	size = "default",
	error = false,
	success = false,
	disabled,
	...props
}: TextareaProps) {
	return (
		<textarea
			{...props}
			data-slot="textarea"
			data-size={size}
			data-error={error || undefined}
			data-success={success || undefined}
			disabled={disabled}
			aria-invalid={error || undefined}
			className={cn(
				/* Layout */
				"flex w-full min-w-0 resize-y",

				/* Appearance */
				"border border-input",

				"bg-transparent",
				"text-foreground",
				"shadow-xs",
				"outline-none",

				/* Typography */
				"leading-normal",

				/* Placeholder */
				"placeholder:text-muted-foreground",

				/* Selection */
				"selection:bg-primary",
				"selection:text-primary-foreground",

				/* Focus */
				"focus-visible:border-ring",
				"focus-visible:ring-3",
				"focus-visible:ring-ring/30",

				/* Hover */
				"hover:border-ring/60",

				/* Disabled */
				"disabled:pointer-events-none",
				"disabled:cursor-not-allowed",
				"disabled:opacity-50",

				/* Invalid */
				"aria-invalid:border-destructive",
				"aria-invalid:ring-3",
				"aria-invalid:ring-destructive/20",

				/* Success */
				"data-[success=true]:border-success",
				"data-[success=true]:ring-3",
				"data-[success=true]:ring-success/20",

				/* Size */
				textareaVariants[size],

				className,
			)}
		/>
	);
}

export { Textarea };

