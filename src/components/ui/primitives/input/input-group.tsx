import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";

import { Button } from "@/components/ui";

import { cn } from "@/utils";
import { Textarea } from "../textarea";
import { Input, type InputProps } from "./input";

export type InputGroupProps = ComponentProps<"div">;

function InputGroup({ className, ...props }: InputGroupProps) {
	return (
		<div
			data-slot="input-group"
			className={cn(
				"group/input-group",
				"relative flex w-full min-w-0 items-center",

				"rounded-lg border border-input",
				"bg-transparent",
				"transition-[border-color,box-shadow,background-color]",
				"outline-none",

				/* Focus */
				"has-[[data-slot=input-group-control]:focus-visible]:border-ring",
				"has-[[data-slot=input-group-control]:focus-visible]:ring-3",
				"has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50",

				/* Invalid */
				"has-[[data-slot][aria-invalid=true]]:border-destructive",
				"has-[[data-slot][aria-invalid=true]]:ring-3",
				"has-[[data-slot][aria-invalid=true]]:ring-destructive/20",
				"dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

				/* Disabled */
				"has-disabled:bg-input/50",
				"has-disabled:opacity-50",
				"dark:has-disabled:bg-input/80",

				/* Textarea */
				"has-[>textarea]:h-auto",

				/* Block addons */
				"has-[>[data-align=block-start]]:h-auto",
				"has-[>[data-align=block-start]]:flex-col",

				"has-[>[data-align=block-end]]:h-auto",
				"has-[>[data-align=block-end]]:flex-col",

				/* Dark */
				"dark:bg-input/30",

				className,
			)}
			{...props}
		/>
	);
}

const inputGroupAddonVariants = cva(
	[
		"flex h-auto shrink-0",
		"items-center justify-center",
		"gap-2",

		"text-sm font-medium",
		"text-muted-foreground",
		"select-none",

		"[&>kbd]:rounded-[calc(var(--radius)-5px)]",
		"[&>svg:not([class*='size-'])]:size-4",

		"group-has-disabled/input-group:opacity-50",
	],
	{
		variants: {
			align: {
				"inline-start": [
					"order-first",
					"pl-2",
					"has-[>button]:ml-[-0.3rem]",
					"has-[>kbd]:ml-[-0.15rem]",
				].join(" "),

				"inline-end": [
					"order-last",
					"pr-2",
					"has-[>button]:mr-[-0.3rem]",
					"has-[>kbd]:mr-[-0.15rem]",
				].join(" "),

				"block-start": [
					"order-first",
					"w-full",
					"justify-start",
					"px-2.5",
					"pt-2",
					"[.border-b]:pb-2",
				].join(" "),

				"block-end": [
					"order-last",
					"w-full",
					"justify-start",
					"px-2.5",
					"pb-2",
					"[.border-t]:pt-2",
				].join(" "),
			},
		},

		defaultVariants: {
			align: "inline-start",
		},
	},
);

export type InputGroupAddonProps = ComponentProps<"div"> &
	VariantProps<typeof inputGroupAddonVariants>;

function InputGroupAddon({
	className,
	align = "inline-start",
	...props
}: InputGroupAddonProps) {
	return (
		<div
			data-slot="input-group-addon"
			data-align={align}
			className={cn(inputGroupAddonVariants({ align }), className)}
			{...props}
		/>
	);
}

const inputGroupButtonVariants = cva(
	"flex items-center gap-2 text-sm shadow-none",
	{
		variants: {
			size: {
				xs: [
					"h-6",
					"gap-1",
					"rounded-[calc(var(--radius)-3px)]",
					"px-1.5",
					"[&>svg:not([class*='size-'])]:size-3.5",
				].join(" "),

				sm: "",

				"icon-xs": [
					"size-6",
					"rounded-[calc(var(--radius)-3px)]",
					"p-0",
					"has-[>svg]:p-0",
				].join(" "),

				"icon-sm": ["size-8", "p-0", "has-[>svg]:p-0"].join(" "),
			},
		},

		defaultVariants: {
			size: "xs",
		},
	},
);

export type InputGroupButtonProps = Omit<
	ComponentProps<typeof Button>,
	"size" | "type"
> &
	VariantProps<typeof inputGroupButtonVariants> & {
		type?: "button" | "submit" | "reset";
	};

function InputGroupButton({
	className,
	type = "button",
	variant = "ghost",
	size = "xs",
	...props
}: InputGroupButtonProps) {
	return (
		<Button
			type={type}
			variant={variant}
			data-size={size}
			className={cn(inputGroupButtonVariants({ size }), className)}
			{...props}
		/>
	);
}

export type InputGroupTextProps = ComponentProps<"span">;

function InputGroupText({ className, ...props }: InputGroupTextProps) {
	return (
		<span
			data-slot="input-group-text"
			className={cn(
				"flex items-center gap-2",
				"text-sm text-muted-foreground",
				"select-none",

				"[&_svg]:pointer-events-none",
				"[&_svg:not([class*='size-'])]:size-4",

				className,
			)}
			{...props}
		/>
	);
}

export type InputGroupInputProps = InputProps;

const InputGroupInput = forwardRef<HTMLInputElement, InputGroupInputProps>(
	({ className, ...props }, ref) => {
		return (
			<Input
				ref={ref}
				data-slot="input-group-control"
				className={cn(
					"min-w-0",
					"flex-1",
					"w-auto",

					"rounded-none",
					"border-0",
					"bg-transparent",
					"shadow-none",
					"ring-0",

					"focus-visible:ring-0",
					"aria-invalid:ring-0",

					"disabled:bg-transparent",

					"dark:bg-transparent",
					"dark:disabled:bg-transparent",

					className,
				)}
				{...props}
			/>
		);
	},
);

InputGroupInput.displayName = "InputGroupInput";

/* -------------------------------------------------------------------------- */
/* Input Group Textarea                                                       */
/* -------------------------------------------------------------------------- */

export type InputGroupTextareaProps = ComponentProps<typeof Textarea>;

const InputGroupTextarea = forwardRef<
	HTMLTextAreaElement,
	InputGroupTextareaProps
>(({ className, ...props }, ref) => {
	return (
		<Textarea
			ref={ref}
			data-slot="input-group-control"
			className={cn(
				"min-w-0",
				"flex-1",
				"resize-none",

				"rounded-none",
				"border-0",
				"bg-transparent",
				"py-2",
				"shadow-none",
				"ring-0",

				"focus-visible:ring-0",
				"aria-invalid:ring-0",

				"disabled:bg-transparent",

				"dark:bg-transparent",
				"dark:disabled:bg-transparent",

				className,
			)}
			{...props}
		/>
	);
});

InputGroupTextarea.displayName = "InputGroupTextarea";

export {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
};

