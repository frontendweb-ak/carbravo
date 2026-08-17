// src/config/theme/components/chip.ts

import { alpha, type Components, type Theme } from "@mui/material/styles";

/**
 * IMPORTANT SEMANTIC MAPPING — read this before reaching for MUI's `Badge`:
 *
 * shadcn's `Badge` is a standalone, always-visible pill of text/icon+text
 * ("Draft", "Active", a count chip, etc). MUI has a component with the same
 * *name* — `<Badge>` — but it means something completely different: a small
 * dot/counter that floats in the corner of ANOTHER element (like a
 * notification-count on a bell icon). They are not interchangeable.
 *
 * The MUI component that actually matches shadcn's Badge is **`Chip`**
 * (specifically `<Chip size="small" />` with `pointerEvents: "none"` for the
 * non-interactive read-only cases). So: `components/ui/primitives/badge`
 * wraps MUI's `Chip`, not MUI's `Badge`. `components/ui/primitives/status`
 * (StatusDot) also uses this same chip variant machinery for the five
 * workflow-status colors.
 */
declare module "@mui/material/Chip" {
	interface ChipPropsVariantOverrides {
		brand: true;
		soft: true; // shadcn's "outline"-style pill (bordered, background surface)
		statusDraft: true;
		statusReview: true;
		statusApproved: true;
		statusActive: true;
		statusExpired: true;
	}
	interface ChipPropsSizeOverrides {
		xs: true;
	}
}

function statusChipStyle(_theme: Theme, colorMain: string) {
	return {
		backgroundColor: alpha(colorMain, 0.1),
		color: colorMain,
		border: "none",
	};
}

export const MuiChip: Components<Theme>["MuiChip"] = {
	defaultProps: {
		size: "small",
	},
	styleOverrides: {
		root: ({ theme }) => ({
			borderRadius: 9999,
			fontWeight: 500,
			height: 24, // h-6, badge default size
			fontSize: theme.typography.pxToRem(12),
		}),
		sizeSmall: () => ({
			height: 20, // h-5
			fontSize: "0.6875rem",
			paddingInline: 2,
		}),
		label: {
			paddingInline: 8,
		},
		filled: ({ theme }) => ({
			backgroundColor: theme.palette.primary.main,
			color: theme.palette.primary.contrastText,
		}),
		outlined: ({ theme }) => ({
			borderColor: theme.palette.divider,
			backgroundColor: theme.palette.background.default,
			color: theme.palette.text.primary,
		}),
	},
	variants: [
		{
			props: { size: "xs" },
			style: { height: 20, fontSize: "0.6875rem", paddingInline: 2 },
		},

		{
			props: { variant: "brand" },
			style: ({ theme }) => ({
				backgroundColor: theme.palette.brandTeal.main,
				color: "#FFFFFF",
			}),
		},
		{
			props: { color: "success" },
			style: ({ theme }) => statusChipStyle(theme, theme.palette.success.main),
		},
		{
			props: { color: "warning" },
			style: ({ theme }) => statusChipStyle(theme, theme.palette.warning.main),
		},
		{
			props: { color: "error" },
			style: ({ theme }) => statusChipStyle(theme, theme.palette.error.main),
		},
		{
			props: { color: "info" },
			style: ({ theme }) => statusChipStyle(theme, theme.palette.info.main),
		},
		{
			props: { variant: "soft" },
			style: ({ theme }) => ({
				backgroundColor: theme.palette.background.default,
				color: theme.palette.text.primary,
				border: `1px solid ${theme.palette.divider}`,
			}),
		},

		/* CarBravo program/revision workflow status chips */
		{
			props: { variant: "statusDraft" },
			style: ({ theme }) => statusChipStyle(theme, theme.palette.status.draft),
		},
		{
			props: { variant: "statusReview" },
			style: ({ theme }) => statusChipStyle(theme, theme.palette.status.review),
		},
		{
			props: { variant: "statusApproved" },
			style: ({ theme }) =>
				statusChipStyle(theme, theme.palette.status.approved),
		},
		{
			props: { variant: "statusActive" },
			style: ({ theme }) => statusChipStyle(theme, theme.palette.status.active),
		},
		{
			props: { variant: "statusExpired" },
			style: ({ theme }) =>
				statusChipStyle(theme, theme.palette.status.expired),
		},
	],
};
