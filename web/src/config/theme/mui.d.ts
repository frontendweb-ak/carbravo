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

	interface TypeText {
		muted: string;
		inverse: string;
	}

	interface Palette {
		control: {
			border: string;
			borderStrong: string;

			input: string;
			inputBorder: string;

			hover: string;
			focus: string;
			ring: string;

			disabledBackground: string;
			disabledForeground: string;
			disabledBorder: string;

			selectedBackground: string;
			selectedForeground: string;
			selectedBorder: string;
		};

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
		control?: {
			border: string;
			borderStrong: string;

			input: string;
			inputBorder: string;

			hover: string;
			focus: string;
			ring: string;

			disabledBackground: string;
			disabledForeground: string;
			disabledBorder: string;

			selectedBackground: string;
			selectedForeground: string;
			selectedBorder: string;
		};

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
