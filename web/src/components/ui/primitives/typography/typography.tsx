import { cn } from "@/utils";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type TypographyVariant =
	| "display"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "bodyLarge"
	| "bodyMedium"
	| "bodySmall"
	| "labelLarge"
	| "labelMedium"
	| "labelSmall"
	| "caption";

export type TypographyColor =
	| "primary"
	| "secondary"
	| "muted"
	| "disabled"
	| "inverse"
	| "brand"
	| "success"
	| "warning"
	| "danger"
	| "info";

export type TypographyWeight =
	| "regular"
	| "medium"
	| "semibold"
	| "bold"
	| "extrabold";

export type TypographyAlign = "left" | "center" | "right" | "justify";

export type TypographyTransform =
	| "none"
	| "uppercase"
	| "lowercase"
	| "capitalize";

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
	variant?: TypographyVariant;
	color?: TypographyColor;

	/**
	 * Allows an explicit Tailwind/text color class
	 * or CSS color value when semantic color is not enough.
	 */
	textColor?: string;
	weight?: TypographyWeight;
	align?: TypographyAlign;
	transform?: TypographyTransform;
	left?: ReactNode;
	right?: ReactNode;
	as?: ElementType;
}

const variantClasses: Record<TypographyVariant, string> = {
	display: "text-4xl leading-tight tracking-tight",
	h1: "text-3xl leading-tight tracking-tight",
	h2: "text-2xl leading-tight tracking-tight",
	h3: "text-xl leading-7",
	h4: "text-lg leading-6",
	bodyLarge: "text-base leading-6",
	bodyMedium: "text-sm leading-5",
	bodySmall: "text-xs leading-4",
	labelLarge: "text-sm leading-5",
	labelMedium: "text-xs leading-4",
	labelSmall: "text-[11px] leading-4",
	caption: "text-[11px] leading-4",
};

const colorClasses: Record<TypographyColor, string> = {
	primary: "text-foreground",
	secondary: "text-secondary-foreground",
	muted: "text-muted-foreground",
	disabled: "text-muted-foreground",
	inverse: "text-primary-foreground",
	brand: "text-primary",
	success: "text-success",
	warning: "text-warning",
	danger: "text-destructive",
	info: "text-info",
};

const weightClasses: Record<TypographyWeight, string> = {
	regular: "font-normal",
	medium: "font-medium",
	semibold: "font-semibold",
	bold: "font-bold",
	extrabold: "font-extrabold",
};

const alignClasses: Record<TypographyAlign, string> = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
	justify: "text-justify",
};

const transformClasses: Record<TypographyTransform, string> = {
	none: "normal-case",
	uppercase: "uppercase",
	lowercase: "lowercase",
	capitalize: "capitalize",
};

const defaultElements: Record<TypographyVariant, ElementType> = {
	display: "h1",
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",

	bodyLarge: "p",
	bodyMedium: "p",
	bodySmall: "p",

	labelLarge: "span",
	labelMedium: "span",
	labelSmall: "span",

	caption: "span",
};

export function Typography({
	variant = "bodyMedium",
	color = "primary",
	textColor,
	weight,
	align,
	transform,
	left,
	right,
	as,
	className,
	children,
	...props
}: TypographyProps) {
	const Component = as ?? defaultElements[variant];
	const colorClass = textColor ? undefined : colorClasses[color];
	const style = textColor ? { color: textColor } : undefined;

	const content = (
		<Component
			{...props}
			style={{ ...style, ...props.style }}
			className={cn(
				"m-0",
				variantClasses[variant],
				colorClass,
				weight && weightClasses[weight],
				align && alignClasses[align],
				transform && transformClasses[transform],
				className,
			)}
		>
			{children}
		</Component>
	);

	if (!left && !right) {
		return content;
	}

	return (
		<span className={cn("inline-flex items-center", left && "gap-1.5")}>
			{left}
			{content}
			{right && <span className="ml-1.5">{right}</span>}
		</span>
	);
}
