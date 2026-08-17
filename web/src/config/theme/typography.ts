// src/config/theme/typography.ts

import type { TypographyVariantsOptions } from "@mui/material";
import { tokens } from "./tokens";

export const typography: TypographyVariantsOptions = {
	fontFamily: tokens.font.family,

	h1: {
		fontSize: "2.25rem",
		fontWeight: 700,
		lineHeight: 1.2,
		letterSpacing: "-0.02em",
	},

	h2: {
		fontSize: "1.875rem",
		fontWeight: 700,
		lineHeight: 1.25,
		letterSpacing: "-0.015em",
	},

	h3: {
		fontSize: "1.5rem",
		fontWeight: 700,
		lineHeight: 1.3,
	},

	h4: {
		fontSize: "1.25rem",
		fontWeight: 600,
		lineHeight: 1.35,
	},

	h5: {
		fontSize: "1.125rem",
		fontWeight: 600,
		lineHeight: 1.4,
	},

	h6: {
		fontSize: "1rem",
		fontWeight: 600,
		lineHeight: 1.4,
	},

	body1: {
		fontSize: "0.9375rem",
		fontWeight: 400,
		lineHeight: 1.6,
	},

	body2: {
		fontSize: "0.875rem",
		fontWeight: 400,
		lineHeight: 1.5,
	},

	caption: {
		fontSize: "0.75rem",
		fontWeight: 400,
		lineHeight: 1.4,
	},

	overline: {
		fontSize: "0.6875rem",
		fontWeight: 600,
		lineHeight: 1.4,
		letterSpacing: "0.08em",
		textTransform: "uppercase",
	},

	button: {
		fontFamily: tokens.font.family,
		fontSize: "0.875rem",
		fontWeight: 600,
		lineHeight: 1.4,
		textTransform: "none",
	},
};
