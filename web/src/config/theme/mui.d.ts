// src/config/theme/mui.d.ts

import "@mui/material/styles";

declare module "@mui/material/styles" {
	interface PaletteColor {
		soft: string;
		softForeground: string;
		softBorder: string;
	}

	interface SimplePaletteColorOptions {
		soft?: string;
		softForeground?: string;
		softBorder?: string;
	}

	interface Palette {
		muted: {
			main: string;
			foreground: string;
		};

		brandTeal: {
			main: string;
		};

		status: {
			draft: string;
			review: string;
			approved: string;
			active: string;
			expired: string;
		};

		accent: PaletteColor;

		popover: PaletteColor;

		surfaceInput: {
			main: string;
		};
	}

	interface PaletteOptions {
		muted?: {
			main: string;
			foreground: string;
		};

		brandTeal?: {
			main: string;
		};

		status?: {
			draft: string;
			review: string;
			approved: string;
			active: string;
			expired: string;
		};

		accent?: SimplePaletteColorOptions;

		popover?: SimplePaletteColorOptions;

		surfaceInput?: {
			main: string;
		};
	}
}
