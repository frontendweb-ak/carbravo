import MuiCard, { type CardProps as MuiCardProps } from "@mui/material/Card";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

export type AppCardVariant = "outlined" | "elevation" | "flat";

export interface CardProps extends Omit<MuiCardProps, "variant"> {
	variant?: AppCardVariant;
	clickable?: boolean;
	selected?: boolean;
	disabled?: boolean;
	children?: ReactNode;
	sx?: SxProps<Theme>;
}

function Card({
	variant = "outlined",
	clickable = false,
	selected = false,
	disabled = false,
	children,
	onClick,
	sx,
	...props
}: CardProps) {
	const interactive = clickable && !disabled;

	const cardSx: SxProps<Theme> = [
		{
			p: 4,
			borderRadius: 2,
			overflow: "hidden",
			backgroundColor: "background.paper",
			transition: "border-color 150ms ease, box-shadow 150ms ease",
		},

		...(variant === "flat" ? [{ border: 0, boxShadow: "none" }] : []),

		...(interactive
			? [
					{
						cursor: "pointer",

						"&:hover": {
							boxShadow: 2,
						},

						"&:focus-visible": {
							outline: "2px solid",
							outlineColor: "primary.main",
							outlineOffset: 2,
						},
					},
				]
			: []),

		...(selected
			? [
					{
						borderColor: "primary.main",
						boxShadow: (theme: Theme) =>
							`0 0 0 1px ${theme.palette.primary.main}`,
					},
				]
			: []),

		...(disabled
			? [
					{
						opacity: 0.5,
						pointerEvents: "none",
					},
				]
			: []),

		...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
	];

	return (
		<MuiCard
			{...props}
			onClick={interactive ? onClick : undefined}
			variant={variant === "outlined" ? "outlined" : undefined}
			elevation={variant === "elevation" ? 1 : 0}
			aria-disabled={disabled || undefined}
			sx={cardSx}
		>
			{children}
		</MuiCard>
	);
}

export { Card };

