// src/config/theme/components/button.ts

import { alpha, type Components, type Theme } from "@mui/material/styles";
import { radii } from "../shape";

export const MuiButton: Components<Theme>["MuiButton"] = {
	defaultProps: {
		variant: "contained",
		size: "medium",
		disableElevation: true,
	},

	styleOverrides: {
		root: ({ theme }) => ({
			minWidth: 0,
			borderRadius: radii.md,
			fontFamily: theme.typography.fontFamily,
			fontWeight: 600,
			textTransform: "none",
			whiteSpace: "nowrap",

			transition: theme.transitions.create(
				["background-color", "border-color", "box-shadow", "color"],
				{
					duration: 150,
				},
			),

			"&:active": {
				transform: "translateY(1px)",
			},

			"&.Mui-disabled": {
				opacity: 0.5,
			},

			"&.Mui-focusVisible": {
				outline: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
				outlineOffset: 1,
			},
		}),

		contained: {
			boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.04)",

			"&:hover": {
				boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.08)",
			},
		},

		outlined: ({ theme }) => ({
			borderColor: theme.palette.divider,
			backgroundColor: theme.palette.background.default,
			color: theme.palette.text.primary,

			"&:hover": {
				borderColor: theme.palette.divider,
				backgroundColor: theme.palette.muted.main,
			},
		}),

		text: ({ theme }) => ({
			color: theme.palette.text.primary,

			"&:hover": {
				backgroundColor: theme.palette.muted.main,
			},
		}),

		sizeSmall: {
			minHeight: 32,
			paddingInline: 10,
			borderRadius: radii.sm,
			fontSize: "0.875rem",
		},

		sizeMedium: {
			minHeight: 36,
			paddingInline: 12,
		},

		sizeLarge: {
			minHeight: 40,
			paddingInline: 16,
		},
	},

	variants: [
		{
			props: {
				variant: "contained",
				color: "success",
			},
			style: ({ theme }) => ({
				backgroundColor: theme.palette.success.main,
				color: theme.palette.success.contrastText,

				"&:hover": {
					backgroundColor: alpha(theme.palette.success.main, 0.9),
				},
			}),
		},

		{
			props: {
				variant: "contained",
				color: "warning",
			},
			style: ({ theme }) => ({
				backgroundColor: theme.palette.warning.main,
				color: theme.palette.warning.contrastText,

				"&:hover": {
					backgroundColor: alpha(theme.palette.warning.main, 0.9),
				},
			}),
		},
	],
};
