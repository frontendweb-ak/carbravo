import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";

const badgeVariants = cva(
	[
		"group/badge",
		"inline-flex",
		"w-fit",
		"shrink-0",
		"items-center",
		"justify-center",
		"gap-1",
		"overflow-hidden",
		"rounded-full",
		"border",
		"border-transparent",
		"px-2",
		"py-0.5",
		"text-xs",
		"font-medium",
		"leading-none",
		"whitespace-nowrap",
		"transition-colors",
		"select-none",

		// ----------------------------------------------------------
		// Focus
		// ----------------------------------------------------------

		"focus-visible:border-ring",
		"focus-visible:ring-3",
		"focus-visible:ring-ring/50",
		"focus-visible:outline-none",

		// ----------------------------------------------------------
		// Invalid
		// ----------------------------------------------------------

		"aria-invalid:border-destructive",
		"aria-invalid:ring-3",
		"aria-invalid:ring-destructive/20",
		"dark:aria-invalid:ring-destructive/40",

		// ----------------------------------------------------------
		// Icons
		// ----------------------------------------------------------

		"[&>svg]:pointer-events-none",
		"[&>svg]:shrink-0",
		"[&>svg:not([class*='size-'])]:size-3",

		// ----------------------------------------------------------
		// Icon spacing
		// ----------------------------------------------------------

		"has-data-[icon=inline-start]:pl-1.5",
		"has-data-[icon=inline-end]:pr-1.5",

		// ----------------------------------------------------------
		// Links rendered through Badge
		// ----------------------------------------------------------

		"[a]:hover:no-underline",
	],
	{
		variants: {
			variant: {
				// ----------------------------------------------------
				// Generic
				// ----------------------------------------------------

				default: [
					"bg-primary",
					"text-primary-foreground",
					"[a]:hover:bg-primary/90",
				],

				brand: ["bg-brand-teal", "text-white", "[a]:hover:bg-brand-teal/90"],

				success: [
					"bg-success",
					"text-success-foreground",
					"[a]:hover:bg-success/90",
				],

				warning: [
					"bg-warning",
					"text-warning-foreground",
					"[a]:hover:bg-warning/90",
				],

				info: ["bg-info", "text-info-foreground", "[a]:hover:bg-info/90"],

				destructive: [
					"bg-destructive/10",
					"text-destructive",
					"[a]:hover:bg-destructive/20",
					"dark:bg-destructive/20",
					"dark:[a]:hover:bg-destructive/30",
				],

				outline: [
					"border-border",
					"bg-background",
					"text-foreground",
					"[a]:hover:bg-muted",
				],

				ghost: [
					"text-foreground",
					"hover:bg-muted",
					"hover:text-foreground",
					"dark:hover:bg-muted/50",
				],

				link: ["text-primary", "underline-offset-4", "hover:underline"],

				// ----------------------------------------------------
				// CarBravo program statuses
				// ----------------------------------------------------

				statusDraft: ["bg-status-draft/10", "text-status-draft"],

				statusReview: ["bg-status-review/10", "text-status-review"],

				statusApproved: ["bg-status-approved/10", "text-status-approved"],

				statusActive: ["bg-status-active/10", "text-status-active"],

				statusExpired: ["bg-status-expired/10", "text-status-expired"],
			},

			size: {
				sm: "h-5 px-1.5 text-[0.6875rem]",
				default: "h-6 px-2 text-xs",
				lg: "h-7 px-2.5 text-sm",
			},
		},

		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export type BadgeVariant = NonNullable<
	VariantProps<typeof badgeVariants>["variant"]
>;

export type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>["size"]>;

export type BadgeProps = useRender.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants>;

function Badge({
	className,
	variant = "default",
	size = "default",
	render,
	...props
}: BadgeProps) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(badgeVariants({ variant, size }), className),
			},
			props,
		),
		render,
		state: {
			slot: "badge",
			variant,
			size,
		},
	});
}

export { Badge, badgeVariants };
