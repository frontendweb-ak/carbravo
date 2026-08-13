import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";


import { cn } from "@/utils/index";

const buttonVariants = cva(
	[
		"group/button",
		"inline-flex",
		"shrink-0",
		"items-center",
		"justify-center",
		"gap-1.5",
		"rounded-lg",
		"border",
		"border-transparent",
		"bg-clip-padding",
		"text-sm",
		"font-medium",
		"whitespace-nowrap",
		"transition-colors",
		"outline-none",
		"select-none",
		"focus-visible:border-ring",
		"focus-visible:ring-3",
		"focus-visible:ring-ring/50",
		"active:not-aria-[haspopup]:translate-y-px",
		"disabled:pointer-events-none",
		"disabled:opacity-50",
		"aria-invalid:border-destructive",
		"aria-invalid:ring-3",
		"aria-invalid:ring-destructive/20",
		"dark:aria-invalid:border-destructive/50",
		"dark:aria-invalid:ring-destructive/40",
		"[&_svg]:pointer-events-none",
		"[&_svg]:shrink-0",
		"[&_svg:not([class*='size-'])]:size-4",
	].join(" "),
	{
		variants: {
			variant: {
				default: [
					"bg-primary",
					"text-primary-foreground",
					"shadow-xs",
					"hover:bg-primary/90",
				].join(" "),

				secondary: [
					"bg-brand-teal",
					"text-white",
					"shadow-xs",
					"hover:bg-brand-teal/90",
				].join(" "),

				outline: [
					"border-border",
					"bg-background",
					"text-foreground",
					"shadow-xs",
					"hover:bg-muted",
					"hover:text-foreground",
				].join(" "),

				ghost: [
					"text-foreground",
					"hover:bg-muted",
					"hover:text-foreground",
				].join(" "),

				destructive: [
					"bg-destructive/10",
					"text-destructive",
					"hover:bg-destructive/20",
					"focus-visible:border-destructive/40",
					"focus-visible:ring-destructive/20",
					"dark:bg-destructive/20",
					"dark:hover:bg-destructive/30",
					"dark:focus-visible:ring-destructive/40",
				].join(" "),

				success: [
					"bg-success",
					"text-success-foreground",
					"shadow-xs",
					"hover:bg-success/90",
				].join(" "),

				warning: [
					"bg-warning",
					"text-warning-foreground",
					"shadow-xs",
					"hover:bg-warning/90",
				].join(" "),

				link: ["text-primary", "underline-offset-4", "hover:underline"].join(
					" ",
				),
			},

			size: {
				xs: [
					"h-7",
					"min-w-7",
					"gap-1",
					"rounded-md",
					"px-2",
					"text-xs",
					"[&_svg:not([class*='size-'])]:size-3",
				].join(" "),

				sm: [
					"h-8",
					"min-w-8",
					"gap-1",
					"rounded-md",
					"px-2.5",
					"text-sm",
					"[&_svg:not([class*='size-'])]:size-3.5",
				].join(" "),

				default: ["h-9", "min-w-9", "px-3"].join(" "),

				lg: ["h-10", "min-w-10", "px-4"].join(" "),

				xl: ["h-11", "min-w-11", "px-5"].join(" "),

				icon: "size-9",

				"icon-xs": [
					"size-7",
					"rounded-md",
					"[&_svg:not([class*='size-'])]:size-3",
				].join(" "),

				"icon-sm": [
					"size-8",
					"rounded-md",
					"[&_svg:not([class*='size-'])]:size-3.5",
				].join(" "),

				"icon-lg": "size-10",
			},

			fullWidth: {
				true: "w-full",
			},
		},

		defaultVariants: {
			variant: "default",
			size: "default",
			fullWidth: false,
		},
	},
);

type ButtonProps = ButtonPrimitive.Props &
	VariantProps<typeof buttonVariants> & {
		loading?: boolean;
		loadingText?: React.ReactNode;
	};

function Button({
	className,
	variant = "default",
	size = "default",
	fullWidth = false,
	loading = false,
	loadingText,
	children,
	disabled,
	...props
}: ButtonProps) {
	const isDisabled = disabled || loading;

	return (
		<ButtonPrimitive
			data-slot="button"
			data-loading={loading || undefined}
			disabled={isDisabled}
			focusableWhenDisabled={loading}
			className={cn(
				buttonVariants({
					variant,
					size,
					fullWidth,
					className,
				}),
			)}
			{...props}
		>
			{loading ? (
				<>
					<span
						aria-hidden="true"
						className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
					/>
					{loadingText ?? children}
				</>
			) : (
				children
			)}
		</ButtonPrimitive>
	);
}


export { Button, buttonVariants };
export type { ButtonProps };

