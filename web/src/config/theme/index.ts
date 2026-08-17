// src/config/theme/index.ts

import { createTheme } from "@mui/material/styles";

import { MuiButton } from "./components/button";
import { MuiChip } from "./components/chip";
import {
	MuiAvatar,
	MuiCircularProgress,
	MuiSkeleton,
	MuiTab,
	MuiTabs,
	MuiToggleButton,
	MuiToggleButtonGroup,
	MuiTooltip,
} from "./components/feedback";
import {
	MuiFormHelperText,
	MuiInputLabel,
	MuiOutlinedInput,
	MuiSelect,
	MuiTextField,
} from "./components/inputs";

import {
	MuiCard,
	MuiCardActions,
	MuiCardContent,
	MuiCardHeader,
	MuiCssBaseline,
	MuiDialog,
	MuiDivider,
	MuiMenu,
	MuiMenuItem,
	MuiPaper,
	MuiPopover,
} from "./components/surfaces";
import { MuiCheckbox, MuiRadio, MuiSwitch } from "./components/toggles";
import { darkPalette, lightPalette } from "./palette";
import { buildShadows } from "./shadows";
import { shape } from "./shape";
import { typography } from "./typography";

/**
 * `carBravoTheme` — the one theme object the whole app imports.
 *
 * KEY DECISION: `cssVariables` + `colorSchemes` (MUI v6's built-in CSS
 * variables theming), rather than the older single-palette `createTheme()`.
 * Two reasons:
 *
 *   1. It generates a `--mui-palette-*` custom property for every palette
 *      value, so anything still using a raw Tailwind utility class (during
 *      the migration, or intentionally afterward) can read
 *      `var(--mui-palette-primary-main)` and stay perfectly in sync with
 *      whatever MUI is doing — one source of truth, zero drift.
 *   2. `colorSchemeSelector: "class"` tells MUI to pick light vs. dark by
 *      checking for a `.dark` class on `<html>` — which is EXACTLY what the
 *      existing `ThemeProvider` (`providers/ThemeProvider.tsx`) already
 *      does (`root.classList.toggle("dark", resolvedMode === "dark")`).
 *      That means the custom light/dark/system toggle logic in
 *      `useTheme()` does not need to change AT ALL — MUI just starts
 *      listening to the same class the app was already setting.
 */
export const carBravoTheme = createTheme({
	cssVariables: {
		colorSchemeSelector: "class",
		cssVarPrefix: "mui",
	},
	colorSchemes: {
		light: { palette: lightPalette },
		dark: { palette: darkPalette },
	},
	shape,
	typography,
	spacing: 4, // theme.spacing(1) === 4px, matches Tailwind's spacing scale
	shadows: buildShadows(),
	components: {
		MuiCssBaseline,
		MuiPaper,
		MuiCard,
		MuiCardHeader,
		MuiCardContent,
		MuiCardActions,
		MuiButton,
		MuiChip,
		MuiOutlinedInput,
		MuiInputLabel,
		MuiFormHelperText,
		MuiTextField,
		MuiSelect,
		MuiCheckbox,
		MuiRadio,
		MuiSwitch,
		MuiTabs,
		MuiTab,
		MuiToggleButtonGroup,
		MuiToggleButton,
		MuiTooltip,
		MuiAvatar,
		MuiSkeleton,
		MuiCircularProgress,
		MuiDialog,
		MuiPopover,
		MuiMenu,
		MuiMenuItem,
		MuiDivider,
	},
});
