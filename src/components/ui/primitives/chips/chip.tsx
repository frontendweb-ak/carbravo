import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/utils";

const chipVariants = cva(
	[
		"inline-flex shrink-0 items-center justify-center",
		"gap-1.5",
		"font-semibold",
		"outline-none",
		"select-none",
		"whitespace-nowrap",
		"border",
		"transition-colors",

		"focus-visible:ring-3",
		"focus-visible:ring-ring/30",

		"disabled:pointer-events-none",
		"disabled:cursor-not-allowed",
		"disabled:opacity-50",

		// --------------------------------------------------------------
		// Default / unselected
		// --------------------------------------------------------------

		"border-input",
		"bg-background",
		"text-foreground",

		"hover:bg-accent/50",
	],
	{
		variants: {
			color: {
				default: [
					"data-[selected=true]:border-foreground/40",
					"data-[selected=true]:bg-accent",
					"data-[selected=true]:text-foreground",
				],

				primary: [
					"data-[selected=true]:border-primary",
					"data-[selected=true]:bg-primary/10",
					"data-[selected=true]:text-primary",
				],

				success: [
					"data-[selected=true]:border-green-600",
					"data-[selected=true]:bg-green-50",
					"data-[selected=true]:text-green-700",

					"dark:data-[selected=true]:border-green-500",
					"dark:data-[selected=true]:bg-green-950/40",
					"dark:data-[selected=true]:text-green-400",
				],

				warning: [
					"data-[selected=true]:border-amber-500",
					"data-[selected=true]:bg-amber-50",
					"data-[selected=true]:text-amber-700",

					"dark:data-[selected=true]:border-amber-500",
					"dark:data-[selected=true]:bg-amber-950/40",
					"dark:data-[selected=true]:text-amber-400",
				],

				destructive: [
					"data-[selected=true]:border-destructive",
					"data-[selected=true]:bg-destructive/10",
					"data-[selected=true]:text-destructive",
				],
				secondary: [
					"data-[selected=true]:border-secondary",
					"data-[selected=true]:bg-secondary/10",
					"data-[selected=true]:text-secondary",
				],
				purple: [
					"data-[selected=true]:border-purple-500",
					"data-[selected=true]:bg-purple-50",
					"data-[selected=true]:text-purple-700",

					"dark:data-[selected=true]:border-purple-500",
					"dark:data-[selected=true]:bg-purple-950/40",
					"dark:data-[selected=true]:text-purple-400",
				],

				neutral: [
					"data-[selected=true]:border-muted-foreground/50",
					"data-[selected=true]:bg-muted",
					"data-[selected=true]:text-foreground",
				],
			},

			variant: {
				outline: "",

				solid: [
					"data-[selected=true]:text-primary-foreground",
					"data-[selected=true]:bg-primary",
					"data-[selected=true]:border-primary",
				],

				soft: ["border-transparent", "data-[selected=true]:border-transparent"],

				ghost: [
					"border-transparent",
					"bg-transparent",

					"data-[selected=true]:bg-accent",
				],
			},

			radius: {
				sm: "rounded-md",
				md: "rounded-lg",
				lg: "rounded-xl",
				xl: "rounded-2xl",
				full: "rounded-full",
			},

			size: {
				sm: "h-8 px-3 text-xs",
				md: "h-9 px-4 text-sm",
				lg: "h-10 px-5 text-sm",
			},
		},

		defaultVariants: {
			color: "default",
			variant: "outline",
			radius: "md",
			size: "md",
		},
	},
);
export type ChipColor = NonNullable<VariantProps<typeof chipVariants>["color"]>;

export type ChipVariant = NonNullable<
	VariantProps<typeof chipVariants>["variant"]
>;

export type ChipRadius = NonNullable<
	VariantProps<typeof chipVariants>["radius"]
>;

export type ChipSize = NonNullable<VariantProps<typeof chipVariants>["size"]>;

export type ChipProps = ComponentProps<"button"> &
	VariantProps<typeof chipVariants> & {
		selected?: boolean;
	};

function Chip({
	className,
	selected = false,
	color,
	variant,
	radius,
	size,
	disabled,
	type = "button",
	...props
}: ChipProps) {
	return (
		<button
			type={type}
			data-slot="choice-chip"
			data-selected={selected || undefined}
			aria-pressed={selected}
			disabled={disabled}
			className={cn(
				chipVariants({
					color,
					variant,
					radius,
					size,
				}),
				className,
			)}
			{...props}
		/>
	);
}

export { Chip, chipVariants };
