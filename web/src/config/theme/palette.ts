// src/config/theme/palette.ts

import type { PaletteOptions } from "@mui/material/styles";
import { tokens, type ColorMode } from "./tokens";

function createPalette(mode: ColorMode): PaletteOptions {
	const t = tokens[mode];

	return {
		primary: {
			main: t.brand.primary,
			contrastText: t.brand.primaryForeground,
		},

		secondary: {
			main: t.brand.secondary,
			contrastText: t.brand.secondaryForeground,
		},

		success: {
			main: t.state.success,
			contrastText: t.state.successForeground,
		},

		warning: {
			main: t.state.warning,
			contrastText: t.state.warningForeground,
		},

		error: {
			main: t.state.destructive,
			contrastText: t.state.destructiveForeground,
		},

		info: {
			main: t.state.info,
			contrastText: t.state.infoForeground,
		},

		muted: {
			main: t.surface.muted,
			foreground: t.surface.mutedForeground,
		},

		brandTeal: {
			main: t.brand.teal,
		},

		status: t.status,

		accent: {
			main: t.surface.accent,
			contrastText: t.surface.accentForeground,
		},

		popover: {
			main: t.surface.popover,
			contrastText: t.surface.popoverForeground,
		},

		surfaceInput: {
			main: t.control.input,
		},

		background: {
			default: t.background.default,
			paper: t.surface.card,
		},

		text: {
			primary: t.background.foreground,
			secondary: t.surface.mutedForeground,
		},

		divider: t.control.border,
	};
}

export const lightPalette = createPalette("light");
export const darkPalette = createPalette("dark");
