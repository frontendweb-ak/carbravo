import MuiTypography, {
	type TypographyProps as MuiTypographyProps,
} from "@mui/material/Typography";
import type { ElementType, ReactNode } from "react";

export type AppTypographyVariant =
	| "display"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "bodyLarge"
	| "body"
	| "bodyMedium"
	| "bodySmall"
	| "label"
	| "labelSmall"
	| "caption"
	| "overline"
	| "stat";

export type AppTypographyWeight = "regular" | "medium" | "semibold" | "bold";

export type AppTypographyColor =
	| "default"
	| "primary"
	| "secondary"
	| "muted"
	| "inverse"
	| "success"
	| "warning"
	| "error"
	| "info"
	| "inherit";

export interface TypographyProps extends Omit<
	MuiTypographyProps,
	"variant" | "color"
> {
	children?: ReactNode;

	variant?: AppTypographyVariant;

	weight?: AppTypographyWeight;

	color?: AppTypographyColor;
}

type TypographyConfig = {
	variant: MuiTypographyProps["variant"];
	component: ElementType;
};

const variantMap: Record<AppTypographyVariant, TypographyConfig> = {
	display: {
		variant: "h1",
		component: "h1",
	},

	h1: {
		variant: "h1",
		component: "h1",
	},

	h2: {
		variant: "h2",
		component: "h2",
	},

	h3: {
		variant: "h3",
		component: "h3",
	},

	h4: {
		variant: "h4",
		component: "h4",
	},

	h5: {
		variant: "h5",
		component: "h5",
	},

	h6: {
		variant: "h6",
		component: "h6",
	},

	bodyLarge: {
		variant: "body1",
		component: "p",
	},

	body: {
		variant: "body1",
		component: "p",
	},

	bodyMedium: {
		variant: "body2",
		component: "p",
	},

	bodySmall: {
		variant: "body2",
		component: "p",
	},

	label: {
		variant: "body2",
		component: "span",
	},

	labelSmall: {
		variant: "caption",
		component: "span",
	},

	caption: {
		variant: "caption",
		component: "span",
	},

	overline: {
		variant: "overline",
		component: "span",
	},

	stat: {
		variant: "h4",
		component: "div",
	},
};

const weightMap: Record<AppTypographyWeight, number> = {
	regular: 400,
	medium: 500,
	semibold: 600,
	bold: 700,
};

const colorMap: Record<AppTypographyColor, MuiTypographyProps["color"]> = {
	default: "text.primary",
	primary: "primary.main",
	secondary: "text.secondary",
	muted: "text.muted",
	inverse: "text.inverse",
	success: "success.main",
	warning: "warning.main",
	error: "error.main",
	info: "info.main",
	inherit: "inherit",
};

function Typography({
	variant = "body",
	weight,
	color = "default",
	component,
	sx,
	...props
}: TypographyProps) {
	const config = variantMap[variant];

	return (
		<MuiTypography
			{...props}
			variant={config.variant}
			component={component ?? config.component}
			color={colorMap[color]}
			sx={[
				{
					fontFamily: "font.family",

					...(weight && {
						fontWeight: weightMap[weight],
					}),

					...(variant === "display" && {
						fontSize: "2rem",
						lineHeight: 1.15,
						letterSpacing: "-0.025em",
						fontWeight: 700,
					}),

					...(variant === "h1" && {
						fontSize: "2rem",
						lineHeight: 1.2,
						letterSpacing: "-0.02em",
					}),

					...(variant === "h2" && {
						fontSize: "1.5rem",
						lineHeight: 1.25,
						letterSpacing: "-0.015em",
					}),

					...(variant === "h3" && {
						fontSize: "1.25rem",
						lineHeight: 1.3,
					}),

					...(variant === "h4" && {
						fontSize: "1.125rem",
						lineHeight: 1.35,
					}),

					...(variant === "h5" && {
						fontSize: "1rem",
						lineHeight: 1.4,
					}),

					...(variant === "h6" && {
						fontSize: "0.9375rem",
						lineHeight: 1.4,
					}),

					...(variant === "bodyLarge" && {
						fontSize: "1rem",
						lineHeight: 1.6,
					}),

					...(variant === "body" && {
						fontSize: "0.875rem",
						lineHeight: 1.5,
					}),

					...(variant === "bodyMedium" && {
						fontSize: "0.8125rem",
						lineHeight: 1.5,
					}),

					...(variant === "bodySmall" && {
						fontSize: "0.75rem",
						lineHeight: 1.5,
					}),

					...(variant === "label" && {
						fontSize: "0.75rem",
						lineHeight: 1.4,
						fontWeight: 600,
					}),

					...(variant === "labelSmall" && {
						fontSize: "0.6875rem",
						lineHeight: 1.4,
						fontWeight: 600,
					}),

					...(variant === "caption" && {
						fontSize: "0.6875rem",
						lineHeight: 1.4,
					}),

					...(variant === "overline" && {
						fontSize: "0.6875rem",
						lineHeight: 1.4,
						fontWeight: 700,
						letterSpacing: "0.06em",
						textTransform: "uppercase",
					}),

					...(variant === "stat" && {
						fontSize: "2rem",
						lineHeight: 1,
						fontWeight: 700,
						letterSpacing: "-0.02em",
					}),
				},

				...(Array.isArray(sx) ? sx : [sx]),
			]}
		/>
	);
}

export { Typography };

