import "@mui/material/styles";

declare module "@mui/material/styles" {
	interface Palette {
		brandTeal: {
			main: string;
		};

		muted: {
			main: string;
			foreground: string;
		};

		status: {
			draft: string;
			review: string;
			approved: string;
			active: string;
			expired: string;
		};

		accent: {
			main: string;
			contrastText: string;
		};

		popover: {
			main: string;
			contrastText: string;
		};

		surfaceInput: {
			main: string;
		};
	}

	interface PaletteOptions {
		brandTeal?: {
			main?: string;
		};

		muted?: {
			main?: string;
			foreground?: string;
		};

		status?: {
			draft?: string;
			review?: string;
			approved?: string;
			active?: string;
			expired?: string;
		};
		accent?: {
			main?: string;
			contrastText?: string;
		};

		popover?: {
			main?: string;
			contrastText?: string;
		};

		surfaceInput?: {
			main?: string;
		};
	}
}
