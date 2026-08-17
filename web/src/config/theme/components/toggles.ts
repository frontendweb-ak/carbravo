// src/config/theme/components/toggles.ts

import { alpha, type Components, type Theme } from "@mui/material/styles";
import { radii } from "../shape";

export const MuiCheckbox: Components<Theme>["MuiCheckbox"] = {
	defaultProps: {
		disableRipple: true,
		size: "small",
	},
	styleOverrides: {
		root: ({ theme }) => ({
			padding: 4,
			color: theme.palette.surfaceInput.main,
			borderRadius: radii.sm,
			"&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
			"&.Mui-checked": { color: theme.palette.primary.main },
			"&.Mui-disabled": { opacity: 0.5 },
			"&.Mui-focusVisible": {
				outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
				outlineOffset: 1,
			},
		}),
	},
};

export const MuiRadio: Components<Theme>["MuiRadio"] = {
	defaultProps: {
		disableRipple: true,
		size: "small",
	},
	styleOverrides: {
		root: ({ theme }) => ({
			padding: 4,
			color: theme.palette.surfaceInput.main,
			"&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
			"&.Mui-checked": { color: theme.palette.primary.main },
			"&.Mui-disabled": { opacity: 0.5 },
			"&.Mui-focusVisible": {
				outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
				outlineOffset: 1,
			},
		}),
	},
};

export const MuiSwitch: Components<Theme>["MuiSwitch"] = {
	defaultProps: {
		disableRipple: true,
	},
	styleOverrides: {
		root: {
			width: 36,
			height: 20,
			padding: 0,
		},
		switchBase: ({ theme }) => ({
			padding: 2,
			"&.Mui-checked": {
				transform: "translateX(16px)",
				color: "#FFFFFF",
				"& + .MuiSwitch-track": {
					backgroundColor: theme.palette.primary.main,
					opacity: 1,
				},
			},
			"&.Mui-disabled": { opacity: 0.5 },
			"&.Mui-focusVisible .MuiSwitch-thumb": {
				outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
			},
		}),
		thumb: {
			width: 16,
			height: 16,
			boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
		},
		track: ({ theme }) => ({
			borderRadius: 9999,
			backgroundColor: theme.palette.surfaceInput.main,
			opacity: 1,
		}),
	},
};
