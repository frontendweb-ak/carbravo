import { Input as InputPrimitive } from "@base-ui/react/input";
import {
	type ComponentPropsWithoutRef,
	forwardRef,
	type ReactNode,
} from "react";

import { cn, type InputParseMode } from "@/utils";

const inputVariants = {
	sm: "h-8 rounded-md px-2.5 py-0 text-sm",
	default: "h-9 rounded-md px-3 py-0 text-sm",
	lg: "h-10 rounded-lg px-3.5 py-0 text-base",
} as const;

export type InputSize = keyof typeof inputVariants;

export type InputProps = Omit<
	ComponentPropsWithoutRef<typeof InputPrimitive>,
	"size"
> & {
	size?: InputSize;
	error?: boolean;
	success?: boolean;
	parseMode?: InputParseMode;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			size = "default",
			error = false,
			success = false,
			disabled,
			readOnly,
			"aria-invalid": ariaInvalid,
			leftIcon,
			rightIcon,
			...props
		},
		ref,
	) => {
		const hasError = error || ariaInvalid === true || ariaInvalid === "true";
		const hasSuccess = success && !hasError;

		const input = (
			<InputPrimitive
				ref={ref}
				data-slot="input"
				data-size={size}
				data-error={hasError || undefined}
				data-success={hasSuccess || undefined}
				disabled={disabled}
				readOnly={readOnly}
				aria-invalid={hasError ? true : undefined}
				className={cn(
					"flex w-full min-w-0",
					"appearance-none",
					"border border-input",
					"bg-background",
					"text-foreground",
					"leading-none",
					"shadow-xs",
					"outline-none",

					"placeholder:text-muted-foreground",

					"selection:bg-primary",
					"selection:text-primary-foreground",

					"transition-[border-color,box-shadow,background-color]",
					"duration-150",

					"hover:border-ring/60",

					"focus-visible:border-ring",
					"focus-visible:ring-3",
					"focus-visible:ring-ring/30",

					"aria-invalid:border-destructive",
					"aria-invalid:ring-3",
					"aria-invalid:ring-destructive/20",
					"dark:aria-invalid:ring-destructive/40",

					"data-[success=true]:border-success",
					"data-[success=true]:ring-3",
					"data-[success=true]:ring-success/20",

					"disabled:pointer-events-none",
					"disabled:cursor-not-allowed",
					"disabled:opacity-50",
					"disabled:bg-muted",

					"read-only:cursor-default",
					"read-only:bg-muted/50",

					inputVariants[size],

					leftIcon && "pl-9",
					rightIcon && "pr-9",

					className,
				)}
				{...props}
			/>
		);

		if (!leftIcon && !rightIcon) {
			return input;
		}

		return (
			<div className="relative w-full">
				{leftIcon && (
					<span
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 left-3 z-10 flex size-4 -translate-y-1/2 items-center justify-center text-muted-foreground"
					>
						{leftIcon}
					</span>
				)}

				{input}

				{rightIcon && (
					<span
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 right-3 z-10 flex size-4 -translate-y-1/2 items-center justify-center text-muted-foreground"
					>
						{rightIcon}
					</span>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";

export { Input };
