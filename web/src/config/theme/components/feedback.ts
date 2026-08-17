// src/config/theme/components/feedback.ts

import type { Components, Theme } from "@mui/material/styles";
import { radii } from "../shape";

/* -------------------------------------------------------------------------- */
/* Tabs — CarBravo's FilterTabs (pill-style segmented control) + plain Tabs   */
/* -------------------------------------------------------------------------- */

export const MuiTabs: Components<Theme>["MuiTabs"] = {
	styleOverrides: {
		root: { minHeight: 36 },
		indicator: ({ theme }) => ({
			backgroundColor: theme.palette.primary.main,
			height: 2,
		}),
	},
};

export const MuiTab: Components<Theme>["MuiTab"] = {
	styleOverrides: {
		root: ({ theme }) => ({
			textTransform: "none",
			fontWeight: 600,
			fontSize: theme.typography.pxToRem(13),
			minHeight: 36,
			minWidth: 0,
			paddingInline: theme.spacing(2),
			color: theme.palette.text.secondary,
			"&.Mui-selected": { color: theme.palette.text.primary },
		}),
	},
};

/**
 * `FilterTabs` (the rounded-pill segmented control used on the Programs
 * list — see `program-context-header.tsx`'s revision tabs for the same
 * visual pattern) isn't a stock MUI concept; it's rebuilt as a small
 * standalone component using `ToggleButtonGroup`
 * (`components/ui/primitives/tabs/filter-tabs.tsx`) rather than a Tabs
 * override, since the underlying interaction (one active choice among
 * peers, no associated panel) maps far more directly onto
 * ToggleButtonGroup than onto Tabs/TabPanel.
 */
export const MuiToggleButtonGroup: Components<Theme>["MuiToggleButtonGroup"] = {
	styleOverrides: {
		root: {
			gap: 8,
			backgroundColor: "transparent",
		},
	},
};

export const MuiToggleButton: Components<Theme>["MuiToggleButton"] = {
	styleOverrides: {
		root: ({ theme }) => ({
			textTransform: "none",
			fontWeight: 700,
			fontSize: theme.typography.pxToRem(12),
			borderRadius: 9999,
			border: `1px solid ${theme.palette.divider}`,
			paddingInline: theme.spacing(2),
			paddingBlock: theme.spacing(1),
			color: theme.palette.text.secondary,
			backgroundColor: theme.palette.background.paper,
			"&:hover": {
				backgroundColor: theme.palette.muted.main,
				color: theme.palette.text.primary,
			},
			"&.Mui-selected": {
				backgroundColor: theme.palette.text.primary,
				color: theme.palette.background.paper,
				borderColor: theme.palette.text.primary,
				"&:hover": { backgroundColor: theme.palette.text.primary },
			},
			"&:not(:first-of-type)": {
				borderRadius: 9999,
				borderLeft: `1px solid ${theme.palette.divider}`,
			},
			"&:first-of-type": { borderRadius: 9999 },
		}),
	},
};

/* -------------------------------------------------------------------------- */
/* Tooltip                                                                    */
/* -------------------------------------------------------------------------- */

export const MuiTooltip: Components<Theme>["MuiTooltip"] = {
	styleOverrides: {
		tooltip: ({ theme }) => ({
			backgroundColor: theme.palette.brandTeal.main,
			color: "#FFFFFF",
			fontFamily: theme.typography.fontFamily,
			fontSize: theme.typography.pxToRem(12),
			borderRadius: radii.sm,
			padding: "6px 10px",
		}),
		arrow: ({ theme }) => ({ color: theme.palette.brandTeal.main }),
	},
	defaultProps: {
		arrow: true,
	},
};

/* -------------------------------------------------------------------------- */
/* Avatar                                                                     */
/* -------------------------------------------------------------------------- */

export const MuiAvatar: Components<Theme>["MuiAvatar"] = {
	styleOverrides: {
		root: ({ theme }) => ({
			backgroundColor: theme.palette.muted.main,
			color: theme.palette.text.secondary,
			fontSize: theme.typography.pxToRem(14),
			fontWeight: 600,
		}),
	},
};

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

export const MuiSkeleton: Components<Theme>["MuiSkeleton"] = {
	defaultProps: {
		animation: "pulse",
	},
	styleOverrides: {
		root: ({ theme }) => ({
			backgroundColor: theme.palette.muted.main,
			borderRadius: radii.md,
			transform: "none", // shadcn's skeleton doesn't scale-transform, just pulses opacity
		}),
	},
};

/* -------------------------------------------------------------------------- */
/* CircularProgress — backs the `Spinner` primitive                           */
/* -------------------------------------------------------------------------- */

export const MuiCircularProgress: Components<Theme>["MuiCircularProgress"] = {
	defaultProps: {
		thickness: 3,
	},
	styleOverrides: {
		root: { color: "currentColor" },
	},
};
