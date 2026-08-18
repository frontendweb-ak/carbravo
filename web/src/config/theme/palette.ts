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
			soft: t.state.successSoft,
			softForeground: t.state.successSoftForeground,
			softBorder: t.state.successSoftBorder,
		},

		warning: {
			main: t.state.warning,
			contrastText: t.state.warningForeground,
			soft: t.state.warningSoft,
			softForeground: t.state.warningSoftForeground,
			softBorder: t.state.warningSoftBorder,
		},

		error: {
			main: t.state.destructive,
			contrastText: t.state.destructiveForeground,
			soft: t.state.destructiveSoft,
			softForeground: t.state.destructiveSoftForeground,
			softBorder: t.state.destructiveSoftBorder,
		},

		info: {
			main: t.state.info,
			contrastText: t.state.infoForeground,
			soft: t.state.infoSoft,
			softForeground: t.state.infoSoftForeground,
			softBorder: t.state.infoSoftBorder,
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