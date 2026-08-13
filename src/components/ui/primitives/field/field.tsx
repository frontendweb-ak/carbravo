import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { Label } from "@/components/ui/primitives/label/label";
import { Separator } from "@/components/ui/primitives/separator";
import { cn } from "@/utils";

/* -------------------------------------------------------------------------- */
/* Field Set                                                                  */
/* -------------------------------------------------------------------------- */

export type FieldSetProps = ComponentProps<"fieldset">;

function FieldSet({ className, ...props }: FieldSetProps) {
	return (
		<fieldset
			data-slot="field-set"
			className={cn(
				"flex flex-col gap-4",
				"has-[>[data-slot=checkbox-group]]:gap-3",
				"has-[>[data-slot=radio-group]]:gap-3",
				className,
			)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Field Legend                                                               */
/* -------------------------------------------------------------------------- */

export type FieldLegendProps = ComponentProps<"legend"> & {
	variant?: "legend" | "label";
};

function FieldLegend({
	className,
	variant = "legend",
	...props
}: FieldLegendProps) {
	return (
		<legend
			data-slot="field-legend"
			data-variant={variant}
			className={cn(
				"mb-1.5 font-medium",
				"data-[variant=legend]:text-base",
				"data-[variant=label]:text-sm",
				className,
			)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Field Group                                                                */
/* -------------------------------------------------------------------------- */

export type FieldGroupProps = ComponentProps<"div">;

function FieldGroup({ className, ...props }: FieldGroupProps) {
	return (
		<div
			data-slot="field-group"
			className={cn(
				"group/field-group",
				"@container/field-group",
				"flex w-full flex-col gap-5",
				"data-[slot=checkbox-group]:gap-3",
				"*:data-[slot=field-group]:gap-4",
				className,
			)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Field                                                                      */
/* -------------------------------------------------------------------------- */

const fieldVariants = cva(
	["group/field", "flex w-full gap-2", "data-[invalid=true]:text-destructive"],
	{
		variants: {
			orientation: {
				vertical: ["flex-col", "*:w-full", "[&>.sr-only]:w-auto"].join(" "),

				horizontal: [
					"flex-row items-center",
					"has-[>[data-slot=field-content]]:items-start",
					"*:data-[slot=field-label]:flex-auto",
					"has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
				].join(" "),

				responsive: [
					"flex-col",
					"*:w-full",
					"@md/field-group:flex-row",
					"@md/field-group:items-center",
					"@md/field-group:*:w-auto",
					"@md/field-group:has-[>[data-slot=field-content]]:items-start",
					"@md/field-group:*:data-[slot=field-label]:flex-auto",
					"[&>.sr-only]:w-auto",
					"@md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
				].join(" "),
			},
		},

		defaultVariants: {
			orientation: "vertical",
		},
	},
);

export type FieldProps = ComponentProps<"div"> &
	VariantProps<typeof fieldVariants> & {
		invalid?: boolean;
		disabled?: boolean;
	};

function Field({
	className,
	orientation = "vertical",
	invalid = false,
	disabled = false,
	...props
}: FieldProps) {
	return (
		<div
			data-slot="field"
			data-orientation={orientation}
			data-invalid={invalid || undefined}
			data-disabled={disabled || undefined}
			className={cn(fieldVariants({ orientation }), className)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Field Content                                                              */
/* -------------------------------------------------------------------------- */

export type FieldContentProps = ComponentProps<"div">;

function FieldContent({ className, ...props }: FieldContentProps) {
	return (
		<div
			data-slot="field-content"
			className={cn(
				"group/field-content",
				"flex flex-1 flex-col",
				"gap-0.5",
				"leading-snug",
				className,
			)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Field Label                                                                */
/* -------------------------------------------------------------------------- */

export type FieldLabelProps = ComponentProps<typeof Label>;

function FieldLabel({ className, ...props }: FieldLabelProps) {
	return (
		<Label
			data-slot="field-label"
			className={cn(
				"group/field-label",
				"flex w-fit gap-2",
				"text-xs font-semibold uppercase tracking-wide",
				"leading-snug",
				"group-data-[disabled=true]/field:cursor-not-allowed",
				"group-data-[disabled=true]/field:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Field Title                                                                */
/* -------------------------------------------------------------------------- */

export type FieldTitleProps = ComponentProps<"div">;

function FieldTitle({ className, ...props }: FieldTitleProps) {
	return (
		<div
			data-slot="field-title"
			className={cn(
				"flex w-fit items-center gap-2",
				"text-sm font-medium",
				"group-data-[disabled=true]/field:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Field Description                                                          */
/* -------------------------------------------------------------------------- */

export type FieldDescriptionProps = ComponentProps<"p">;

function FieldDescription({ className, ...props }: FieldDescriptionProps) {
	return (
		<p
			data-slot="field-description"
			className={cn(
				"text-left text-xs leading-normal",
				"font-normal text-muted-foreground",
				"[&>a]:underline",
				"[&>a]:underline-offset-4",
				"[&>a:hover]:text-primary",
				className,
			)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Field Separator                                                            */
/* -------------------------------------------------------------------------- */

export type FieldSeparatorProps = ComponentProps<"div"> & {
	children?: ReactNode;
};

function FieldSeparator({
	children,
	className,
	...props
}: FieldSeparatorProps) {
	return (
		<div
			data-slot="field-separator"
			data-content={Boolean(children) || undefined}
			className={cn("relative -my-2 h-5 text-sm", className)}
			{...props}
		>
			<Separator className="absolute inset-0 top-1/2" />

			{children && (
				<span
					data-slot="field-separator-content"
					className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
				>
					{children}
				</span>
			)}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Field Error                                                                */
/* -------------------------------------------------------------------------- */

export type FieldErrorItem = {
	message?: string;
};

export type FieldErrorProps = ComponentProps<"div"> & {
	errors?: Array<FieldErrorItem | undefined>;
};

function FieldError({
	className,
	children,
	errors,
	...props
}: FieldErrorProps) {
	if (children) {
		return (
			<div
				role="alert"
				data-slot="field-error"
				className={cn("text-sm font-normal text-destructive", className)}
				{...props}
			>
				{children}
			</div>
		);
	}

	const messages = [
		...new Set(errors?.map((error) => error?.message).filter(Boolean)),
	];

	if (!messages.length) {
		return null;
	}

	return (
		<div
			role="alert"
			data-slot="field-error"
			className={cn("text-sm font-normal text-destructive", className)}
			{...props}
		>
			{messages.length === 1 ? (
				messages[0]
			) : (
				<ul className="ml-4 list-disc space-y-1">
					{messages.map((message) => (
						<li key={message}>{message}</li>
					))}
				</ul>
			)}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Exports                                                                    */
/* -------------------------------------------------------------------------- */

export {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldTitle,
};

