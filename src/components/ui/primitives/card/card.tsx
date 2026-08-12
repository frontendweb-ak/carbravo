import type { ComponentProps } from "react";

import { cn } from "@/utils";

export type CardSize = "default" | "sm";

export interface CardProps extends ComponentProps<"div"> {
	size?: CardSize;
}

function Card({ className, size = "default", ...props }: CardProps) {
	return (
		<div
			data-slot="card"
			data-size={size}
			className={cn(
				"group/card flex flex-col",
				"overflow-hidden",
				"rounded-xl",
				"border border-border",
				"bg-card",
				"text-sm text-card-foreground",
				"shadow-sm",

				"[--card-spacing:--spacing(4)]",

				"data-[size=sm]:[--card-spacing:--spacing(3)]",

				className,
			)}
			{...props}
		/>
	);
}

export type CardHeaderProps = ComponentProps<"div">;

function CardHeader({ className, ...props }: CardHeaderProps) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"grid auto-rows-min items-start gap-1",
				"px-(--card-spacing)",
				"pt-(--card-spacing)",

				// When a header has a bottom border.
				"[.border-b]:pb-(--card-spacing)",

				// Header with CardAction.
				"has-data-[slot=card-action]:grid-cols-[1fr_auto]",
				"has-data-[slot=card-action]:gap-x-4",

				// Header with description.
				"has-data-[slot=card-description]:grid-rows-[auto_auto]",

				className,
			)}
			{...props}
		/>
	);
}

export type CardTitleProps = ComponentProps<"div">;

function CardTitle({ className, ...props }: CardTitleProps) {
	return (
		<div
			data-slot="card-title"
			className={cn(
				"text-base font-semibold leading-snug",
				"text-card-foreground",
				"group-data-[size=sm]/card:text-sm",
				className,
			)}
			{...props}
		/>
	);
}

export type CardDescriptionProps = ComponentProps<"div">;

function CardDescription({ className, ...props }: CardDescriptionProps) {
	return (
		<div
			data-slot="card-description"
			className={cn(
				"text-sm leading-relaxed",
				"text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

export type CardActionProps = ComponentProps<"div">;

function CardAction({ className, ...props }: CardActionProps) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				"col-start-2 row-start-1",
				"row-span-2",
				"self-start",
				"justify-self-end",
				className,
			)}
			{...props}
		/>
	);
}

export type CardContentProps = ComponentProps<"div">;

function CardContent({ className, ...props }: CardContentProps) {
	return (
		<div
			data-slot="card-content"
			className={cn("px-(--card-spacing)", className)}
			{...props}
		/>
	);
}

export type CardFooterProps = ComponentProps<"div">;

function CardFooter({ className, ...props }: CardFooterProps) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				"mt-(--card-spacing)",
				"flex items-center",
				"border-t border-border",
				"bg-muted/40",
				"px-(--card-spacing)",
				"py-3",

				className,
			)}
			{...props}
		/>
	);
}

export {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
};
