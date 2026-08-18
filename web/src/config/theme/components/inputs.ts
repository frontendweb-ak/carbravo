// src/config/theme/components/inputs.ts

import { alpha, type Components, type Theme } from "@mui/material/styles";

/**
 * CarBravo input sizes.
 *
 * MUI provides `small` and `medium`.
 * CarBravo additionally supports `lg`.
 */
declare module "@mui/material/OutlinedInput" {
	interface OutlinedInputPropsSizeOverrides {
		lg: true;
	}
}

declare module "@mui/material/InputBase" {
	interface InputBasePropsSizeOverrides {
		lg: true;
	}
}

declare module "@mui/material/TextField" {
	interface TextFieldPropsSizeOverrides {
		lg: true;
	}
}

declare module "@mui/material/Select" {
	interface SelectPropsSizeOverrides {
		lg: true;
	}
}

/**
 * OutlinedInput
 *
 * This is the foundation for:
 *
 * - TextField
 * - Select
 * - other outlined form controls
 *
 * Important:
 * Do NOT set `notched: false` globally.
 * MUI must control the notch when TextField has a floating label.
 */
export const MuiOutlinedInput: Components<Theme>["MuiOutlinedInput"] = {
	styleOverrides: {
		root: ({ theme }) => ({
			borderRadius: theme.shape.borderRadius,
			backgroundColor: theme.palette.background.paper,
			fontSize: theme.typography.pxToRem(14),
			transition: theme.transitions.create(
				["border-color", "box-shadow", "background-color"],
				{
					duration: 150,
				},
			),
			"& .MuiOutlinedInput-notchedOutline": {
				borderColor: theme.palette.surfaceInput.main,
				borderWidth: 1,
			},
			"&:hover .MuiOutlinedInput-notchedOutline": {
				borderColor: alpha(theme.palette.primary.main, 0.6),
			},

			"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
				borderColor: theme.palette.primary.main,
				borderWidth: 1,
				boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.3)}`,
			},

			"&.Mui-error .MuiOutlinedInput-notchedOutline": {
				borderColor: theme.palette.error.main,
			},

			"&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
				boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, 0.2)}`,
			},

			"&.Mui-disabled": {
				backgroundColor: theme.palette.muted.main,
				cursor: "not-allowed",
			},

			"&.Mui-readOnly": {
				backgroundColor: alpha(theme.palette.muted.main, 0.5),
			},
		}),

		input: ({ theme }) => ({
			height: "1.35em",
			padding: "8.5px 12px",
			color: theme.palette.text.primary,
			"&::placeholder": {
				color: theme.palette.text.secondary,
				opacity: 1,
			},
		}),

		sizeSmall: {
			"& .MuiOutlinedInput-input": {
				padding: "6px 10px",
			},
		},
	},

	variants: [
		{
			props: {
				size: "lg",
			},
			style: {
				"& .MuiOutlinedInput-input": {
					padding: "11px 14px",
					fontSize: "1rem",
				},
			},
		},
	],
};

/**
 * InputLabel
 *
 * Keep MUI's positioning/transform behavior intact.
 * Only customize visual properties.
 */
export const MuiInputLabel: Components<Theme>["MuiInputLabel"] = {
	styleOverrides: {
		root: ({ theme }) => ({
			color: theme.palette.text.secondary,
			fontSize: theme.typography.pxToRem(14),

			"&.Mui-focused": {
				color: theme.palette.primary.main,
			},

			"&.Mui-error": {
				color: theme.palette.error.main,
			},

			"&.Mui-disabled": {
				color: theme.palette.text.disabled,
			},
		}),
	},
};

/**
 * Form helper/error text.
 */
export const MuiFormHelperText: Components<Theme>["MuiFormHelperText"] = {
	styleOverrides: {
		root: ({ theme }) => ({
			marginLeft: 2,
			fontSize: theme.typography.pxToRem(12),
			color: theme.palette.text.secondary,

			"&.Mui-error": {
				color: theme.palette.error.main,
			},
		}),
	},
};

/**
 * TextField defaults.
 */
export const MuiTextField: Components<Theme>["MuiTextField"] = {
	defaultProps: {
		variant: "outlined",
		size: "medium",
	},
};

/**
 * Select
 *
 * Uses the same outlined input shell as TextField.
 */
export const MuiSelect: Components<Theme>["MuiSelect"] = {
	defaultProps: {
		MenuProps: {
			slotProps: {
				paper: {
					style: {
						maxHeight: 320,
					},
				},
			},
		},
	},

	styleOverrides: {
		select: {
			display: "flex",
			alignItems: "center",
			minHeight: "1.35em",
		},

		icon: ({ theme }) => ({
			color: theme.palette.text.secondary,
		}),
	},
};
