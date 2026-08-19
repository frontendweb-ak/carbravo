import type { PaletteOptions } from "@mui/material/styles";

import { tokens, type ColorMode } from "./tokens";

function createPalette(mode: ColorMode): PaletteOptions {
	const t = tokens[mode];

	return {
		mode,

		primary: {
			main: t.brand.primary,
			dark: t.brand.primaryDark,
			contrastText: t.brand.primaryForeground,
		},

		secondary: {
			main: t.brand.secondary,
			dark: t.brand.secondaryDark,
			contrastText: t.brand.secondaryForeground,
		},

		success: {
			main: t.state.success.main,
			dark: t.brand.primaryDark,
			contrastText: t.state.success.foreground,

			soft: t.state.success.soft,
			softForeground: t.state.success.softForeground,
			softBorder: t.state.success.softBorder,
		},

		warning: {
			main: t.state.warning.main,
			contrastText: t.state.warning.foreground,

			soft: t.state.warning.soft,
			softForeground: t.state.warning.softForeground,
			softBorder: t.state.warning.softBorder,
		},

		error: {
			main: t.state.error.main,
			contrastText: t.state.error.foreground,

			soft: t.state.error.soft,
			softForeground: t.state.error.softForeground,
			softBorder: t.state.error.softBorder,
		},

		info: {
			main: t.state.info.main,
			contrastText: t.state.info.foreground,

			soft: t.state.info.soft,
			softForeground: t.state.info.softForeground,
			softBorder: t.state.info.softBorder,
		},

		/*
		 * Semantic surfaces
		 */
		muted: {
			main: t.surface.muted,
			foreground: t.surface.mutedForeground,
		},

		brandTeal: {
			main: t.brand.teal,
		},

		status: {
			draft: t.status.draft.foreground,
			review: t.status.review.foreground,
			approved: t.status.approved.foreground,
			active: t.status.active.foreground,
			expired: t.status.expired.foreground,
		},

		accent: {
			main: t.surface.accent,
			contrastText: t.surface.accentForeground,
		},

		popover: {
			main: t.surface.popover,
			contrastText: t.surface.popoverForeground,
		},

		/*
		 * Keep this for existing components.
		 *
		 * Checkbox, Switch, old inputs, etc.
		 * may already use:
		 *
		 * theme.palette.surfaceInput.main
		 */
		surfaceInput: {
			main: t.control.inputBorder,
		},

		background: {
			default: t.background.default,
			paper: t.surface.card,
		},

		/*
		 * Complete text palette.
		 */
		text: {
			primary: t.text.primary,
			secondary: t.text.secondary,
			muted: t.text.muted,
			inverse: t.text.inverse,
			disabled: t.control.disabledForeground,
		},

		divider: t.control.border,

		/*
		 * Full control palette.
		 */
		control: {
			border: t.control.border,
			borderStrong: t.control.borderStrong,

			input: t.control.input,
			inputBorder: t.control.inputBorder,

			hover: t.control.hover,
			focus: t.control.focus,
			ring: t.control.ring,

			disabledBackground: t.control.disabledBackground,
			disabledForeground: t.control.disabledForeground,
			disabledBorder: t.control.disabledBorder,

			selectedBackground: t.control.selectedBackground,
			selectedForeground: t.control.selectedForeground,
			selectedBorder: t.control.selectedBorder,
		},
	};
}

export const lightPalette = createPalette("light");

export const darkPalette = createPalette("dark");
