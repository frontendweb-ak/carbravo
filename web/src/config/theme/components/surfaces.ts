// src/config/theme/components/surfaces.ts

import type { Components, Theme } from "@mui/material/styles";
import { radii } from "../shape";

export const MuiCssBaseline: Components<Theme>["MuiCssBaseline"] = {
	styleOverrides: (theme) => ({
		"html, body": {
			fontFamily: theme.typography.fontFamily,
		},
		body: {
			backgroundColor: theme.palette.background.default,
			color: theme.palette.text.primary,
			WebkitFontSmoothing: "antialiased",
			MozOsxFontSmoothing: "grayscale",
		},
		"button:not(:disabled), [role='button']:not(:disabled)": {
			cursor: "pointer",
		},
	}),
};

export const MuiPaper: Components<Theme>["MuiPaper"] = {
	defaultProps: {
		elevation: 0,
	},
	styleOverrides: {
		root: {
			backgroundImage: "none",
		},
	},
};

/* -------------------------------------------------------------------------- */
/* Card family — mirrors Card/CardHeader/CardTitle/CardDescription/           */
/* CardAction/CardContent/CardFooter 1:1                                     */
/* -------------------------------------------------------------------------- */

export const MuiCard: Components<Theme>["MuiCard"] = {
	defaultProps: {
		elevation: 0,
	},
	styleOverrides: {
		root: ({ theme }) => ({
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
			borderRadius: radii.xl,
			border: `1px solid ${theme.palette.divider}`,
			backgroundColor: theme.palette.background.paper,
			color: theme.palette.text.primary,
			boxShadow: theme.shadows[1],
		}),
	},
};

export const MuiCardHeader: Components<Theme>["MuiCardHeader"] = {
	styleOverrides: {
		root: ({ theme }) => ({
			padding: theme.spacing(2),
			paddingBottom: theme.spacing(1),
		}),
		title: ({ theme }) => ({
			fontSize: theme.typography.pxToRem(16),
			fontWeight: 600,
			lineHeight: 1.35,
		}),
		subheader: ({ theme }) => ({
			fontSize: theme.typography.pxToRem(14),
			color: theme.palette.text.secondary,
		}),
	},
};

export const MuiCardContent: Components<Theme>["MuiCardContent"] = {
	styleOverrides: {
		root: ({ theme }) => ({
			padding: theme.spacing(2),
			"&:last-child": { paddingBottom: theme.spacing(2) },
		}),
	},
};

export const MuiCardActions: Components<Theme>["MuiCardActions"] = {
	// Stand-in for shadcn's `CardFooter` (bordered, muted background footer).
	styleOverrides: {
		root: ({ theme }) => ({
			marginTop: "auto",
			padding: theme.spacing(1.5, 2),
			borderTop: `1px solid ${theme.palette.divider}`,
			backgroundColor: theme.palette.muted.main,
		}),
	},
};

/* -------------------------------------------------------------------------- */
/* Dialog / Popover / Menu — all render on the `popover` surface              */
/* -------------------------------------------------------------------------- */

export const MuiDialog: Components<Theme>["MuiDialog"] = {
	styleOverrides: {
		paper: ({ theme }) => ({
			backgroundColor: theme.palette.popover.main,
			color: theme.palette.popover.contrastText,
			borderRadius: radii.xl,
			backgroundImage: "none",
			boxShadow: theme.shadows[8],
		}),
	},
};

export const MuiPopover: Components<Theme>["MuiPopover"] = {
	styleOverrides: {
		paper: ({ theme }) => ({
			backgroundColor: theme.palette.popover.main,
			color: theme.palette.popover.contrastText,
			border: `1px solid ${theme.palette.divider}`,
			borderRadius: radii.md,
			boxShadow: theme.shadows[4],
			backgroundImage: "none",
		}),
	},
};

export const MuiMenu: Components<Theme>["MuiMenu"] = {
	styleOverrides: {
		paper: ({ theme }) => ({
			backgroundColor: theme.palette.popover.main,
			border: `1px solid ${theme.palette.divider}`,
			borderRadius: radii.md,
			boxShadow: theme.shadows[4],
		}),
		list: { padding: 4 },
	},
};

export const MuiMenuItem: Components<Theme>["MuiMenuItem"] = {
	styleOverrides: {
		root: ({ theme }) => ({
			borderRadius: radii.sm,
			fontSize: theme.typography.pxToRem(14),
			paddingBlock: theme.spacing(1),
			"&:hover, &.Mui-focusVisible": {
				backgroundColor: theme.palette.accent.main,
				color: theme.palette.accent.contrastText,
			},
			"&.Mui-selected": {
				backgroundColor: theme.palette.accent.main,
				"&:hover": { backgroundColor: theme.palette.accent.main },
			},
		}),
	},
};

export const MuiDivider: Components<Theme>["MuiDivider"] = {
	styleOverrides: {
		root: ({ theme }) => ({
			borderColor: theme.palette.divider,
		}),
	},
};
