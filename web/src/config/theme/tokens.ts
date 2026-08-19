// src/config/theme/tokens.ts

export const tokens = {
	light: {
		brand: {
			primary: "#6DAE3F",
			primaryForeground: "#FFFFFF",
			primaryDark: "#5A9433",

			secondary: "#1F7DC4",
			secondaryForeground: "#FFFFFF",
			secondaryDark: "#166199",

			teal: "#2C8C9A",
		},

		background: {
			default: "#F1F4F5",
			foreground: "#22414A",
			subtle: "#E7ECEE",
		},

		surface: {
			card: "#FFFFFF",
			cardForeground: "#22414A",

			popover: "#FFFFFF",
			popoverForeground: "#22414A",

			muted: "#E7ECEE",
			mutedForeground: "#93A3A9",

			accent: "#EEF6E6",
			accentForeground: "#22414A",
		},

		text: {
			primary: "#22414A",
			secondary: "#5C7078",
			muted: "#93A3A9",
			inverse: "#FFFFFF",
		},

		control: {
			border: "#E2E8EA",
			borderStrong: "#D2DCDE",

			input: "#FFFFFF",
			inputBorder: "#D2DCDE",

			hover: "#5C7078",
			focus: "#1F7DC4",
			ring: "#1F7DC4",

			disabledBackground: "#E7ECEE",
			disabledForeground: "#93A3A9",
			disabledBorder: "#D2DCDE",

			selectedBackground: "#E9F2FB",
			selectedForeground: "#166199",
			selectedBorder: "#1F7DC4",
		},

		status: {
			draft: {
				background: "#E9F2FB",
				foreground: "#1F7DC4",
				indicator: "#1F7DC4",
			},

			review: {
				background: "#FBF0DA",
				foreground: "#B87514",
				indicator: "#B87514",
			},

			approved: {
				background: "#E3F1F3",
				foreground: "#2C8C9A",
				indicator: "#2C8C9A",
			},

			active: {
				background: "#EEF6E6",
				foreground: "#5A9433",
				indicator: "#6DAE3F",
			},

			expired: {
				background: "#E7ECEE",
				foreground: "#93A3A9",
				indicator: "#93A3A9",
			},
		},

		state: {
			success: {
				main: "#6DAE3F",
				foreground: "#FFFFFF",
				soft: "#EEF6E6",
				softForeground: "#5A9433",
				softBorder: "#BFE0A8",
			},

			warning: {
				main: "#B87514",
				foreground: "#FFFFFF",
				soft: "#FBF0DA",
				softForeground: "#B87514",
				softBorder: "#E3C07F",
			},

			error: {
				main: "#C0402F",
				foreground: "#FFFFFF",
				soft: "#F9E9E6",
				softForeground: "#C0402F",
				softBorder: "#F0C4BD",
			},

			info: {
				main: "#2C8C9A",
				foreground: "#FFFFFF",
				soft: "#E3F1F3",
				softForeground: "#2C8C9A",
				softBorder: "#E3F1F3",
			},
		},

		interaction: {
			primary: {
				main: "#6DAE3F",
				hover: "#5A9433",
				active: "#5A9433",
				soft: "#EEF6E6",
			},

			secondary: {
				main: "#1F7DC4",
				hover: "#D8E8F8",
				active: "#166199",
				soft: "#E9F2FB",
				border: "#BFD7EF",
			},

			neutral: {
				hover: "#F1F4F5",
				active: "#E7ECEE",
			},
		},

		feedback: {
			conflict: {
				background: "#FFF8F7",
				border: "#F0C4BD",
			},

			success: {
				border: "#BFE0A8",
			},

			warning: {
				border: "#E3C07F",
			},

			info: {
				border: "#E3F1F3",
			},
		},

		scrollbar: {
			thumb: "#C7D2D4",
			track: "transparent",
			border: "#F1F4F5",
		},

		shadow: {
			sm: "0 1px 3px rgba(34,65,74,.07)",
			md: "0 6px 20px rgba(34,65,74,.10)",
			lg: "0 16px 44px rgba(34,65,74,.16)",
			primary: "0 2px 8px rgba(109,174,63,.32)",
		},
	},

	dark: {
		brand: {
			primary: "rgb(108, 174, 64)",
			primaryForeground: "rgb(13, 20, 9)",
			primaryDark: "rgb(88, 145, 52)",

			secondary: "rgb(66, 164, 207)",
			secondaryForeground: "rgb(252, 252, 252)",
			secondaryDark: "rgb(44, 125, 165)",

			teal: "rgb(34, 65, 74)",
		},

		background: {
			default: "rgb(8, 19, 23)",
			foreground: "rgb(233, 240, 242)",
			subtle: "rgb(29, 41, 45)",
		},

		surface: {
			card: "rgb(18, 30, 34)",
			cardForeground: "rgb(233, 240, 242)",

			popover: "rgb(18, 30, 34)",
			popoverForeground: "rgb(233, 240, 242)",

			muted: "rgb(29, 41, 45)",
			mutedForeground: "rgb(155, 167, 171)",

			accent: "rgb(31, 52, 32)",
			accentForeground: "rgb(233, 240, 242)",
		},

		text: {
			primary: "rgb(233, 240, 242)",
			secondary: "rgb(155, 167, 171)",
			muted: "rgb(155, 167, 171)",
			inverse: "rgb(8, 19, 23)",
		},

		control: {
			border: "rgb(46, 58, 62)",
			borderStrong: "rgb(65, 78, 82)",

			input: "rgb(51, 64, 68)",
			inputBorder: "rgb(65, 78, 82)",

			hover: "rgb(155, 167, 171)",
			focus: "rgb(66, 164, 207)",
			ring: "rgb(108, 174, 64)",

			disabledBackground: "rgb(29, 41, 45)",
			disabledForeground: "rgb(110, 123, 128)",
			disabledBorder: "rgb(46, 58, 62)",

			selectedBackground: "rgb(24, 49, 60)",
			selectedForeground: "rgb(117, 203, 235)",
			selectedBorder: "rgb(66, 164, 207)",
		},

		status: {
			draft: {
				background: "rgb(24, 49, 60)",
				foreground: "rgb(63, 159, 232)",
				indicator: "rgb(63, 159, 232)",
			},

			review: {
				background: "rgb(57, 43, 23)",
				foreground: "rgb(235, 169, 65)",
				indicator: "rgb(235, 169, 65)",
			},

			approved: {
				background: "rgb(31, 52, 54)",
				foreground: "rgb(57, 171, 171)",
				indicator: "rgb(57, 171, 171)",
			},

			active: {
				background: "rgb(29, 48, 24)",
				foreground: "rgb(153, 204, 120)",
				indicator: "rgb(116, 178, 76)",
			},

			expired: {
				background: "rgb(29, 41, 45)",
				foreground: "rgb(149, 161, 165)",
				indicator: "rgb(149, 161, 165)",
			},
		},

		state: {
			success: {
				main: "rgb(116, 178, 76)",
				foreground: "rgb(8, 13, 5)",
				soft: "rgb(29, 48, 24)",
				softForeground: "rgb(153, 204, 120)",
				softBorder: "rgb(57, 87, 46)",
			},

			warning: {
				main: "rgb(235, 169, 65)",
				foreground: "rgb(30, 20, 6)",
				soft: "rgb(57, 43, 23)",
				softForeground: "rgb(246, 193, 103)",
				softBorder: "rgb(91, 70, 39)",
			},

			error: {
				main: "rgb(232, 88, 84)",
				foreground: "rgb(252, 252, 252)",
				soft: "rgb(61, 29, 30)",
				softForeground: "rgb(247, 139, 136)",
				softBorder: "rgb(99, 48, 49)",
			},

			info: {
				main: "rgb(66, 164, 207)",
				foreground: "rgb(252, 252, 252)",
				soft: "rgb(24, 49, 60)",
				softForeground: "rgb(117, 203, 235)",
				softBorder: "rgb(43, 83, 100)",
			},
		},

		interaction: {
			primary: {
				main: "rgb(108, 174, 64)",
				hover: "rgb(88, 145, 52)",
				active: "rgb(88, 145, 52)",
				soft: "rgb(29, 48, 24)",
			},

			secondary: {
				main: "rgb(66, 164, 207)",
				hover: "rgb(31, 52, 60)",
				active: "rgb(44, 125, 165)",
				soft: "rgb(24, 49, 60)",
				border: "rgb(43, 83, 100)",
			},

			neutral: {
				hover: "rgb(29, 41, 45)",
				active: "rgb(46, 58, 62)",
			},
		},

		feedback: {
			conflict: {
				background: "rgb(61, 29, 30)",
				border: "rgb(99, 48, 49)",
			},

			success: {
				border: "rgb(57, 87, 46)",
			},

			warning: {
				border: "rgb(91, 70, 39)",
			},

			info: {
				border: "rgb(43, 83, 100)",
			},
		},

		scrollbar: {
			thumb: "rgb(65, 78, 82)",
			track: "transparent",
			border: "rgb(8, 19, 23)",
		},

		shadow: {
			sm: "0 1px 3px rgba(0,0,0,.20)",
			md: "0 6px 20px rgba(0,0,0,.30)",
			lg: "0 16px 44px rgba(0,0,0,.40)",
			primary: "0 2px 8px rgba(108,174,64,.25)",
		},
	},

	radius: {
		xs: 2,
		sm: 4,
		md: 6,
		lg: 8,
		xl: 12,
		full: 9999,
	},

	spacing: 4,

	font: {
		family: '"Mulish", system-ui, sans-serif',
		headingFamily: '"Sora", system-ui, sans-serif',
		monoFamily: '"IBM Plex Mono", monospace',
	},
} as const;

export type ThemeTokens = typeof tokens;

export type ColorMode = keyof Pick<ThemeTokens, "light" | "dark">;