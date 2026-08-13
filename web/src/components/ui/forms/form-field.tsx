import { Label } from "@/components/ui/primitives/label/label";
import { cn } from "@/utils";
import type { ReactNode } from "react";

export interface FormFieldProps {
	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	error?: string;
	disabled?: boolean;
	rightElement?: ReactNode;
	className?: string;
	children: ReactNode;
}

function FormField({
	label,
	required = false,
	description,
	error,
	disabled = false,
	rightElement,
	className,
	children,
}: FormFieldProps) {
	return (
		<div
			data-slot="form-field"
			data-disabled={disabled || undefined}
			className={cn("w-full space-y-2", className)}
		>
			{(label || rightElement) && (
				<div className="flex items-center justify-between gap-3">
					{label && (
						<Label
							className={cn(
								"text-xs font-semibold uppercase tracking-wide",
								disabled && "cursor-not-allowed opacity-50",
							)}
						>
							{label}

							{required && (
								<span
									aria-hidden="true"
									className={cn(
										"ml-2",
										"inline-flex items-center",
										"rounded-sm",
										"px-1.5 py-0.5",
										"text-[10px] font-bold",
										"leading-none tracking-wide",
										"bg-amber-100 text-amber-700",
										"dark:bg-amber-950/40 dark:text-amber-400",
									)}
								>
									REQUIRED
								</span>
							)}
						</Label>
					)}

					{rightElement}
				</div>
			)}

			{children}

			{error ? (
				<p role="alert" className="text-xs font-medium text-destructive">
					{error}
				</p>
			) : description ? (
				<p className="text-xs text-muted-foreground">{description}</p>
			) : null}
		</div>
	);
}

export { FormField };
