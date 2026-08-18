// src/config/theme/tokens.ts

export const tokens = {
	light: {
		brand: {
			primary: "rgb(108, 174, 64)",
			primaryForeground: "rgb(252, 252, 252)",

			secondary: "rgb(0, 134, 179)",
			secondaryForeground: "rgb(252, 252, 252)",

			teal: "rgb(34, 65, 74)",
		},

		background: {
			default: "rgb(241, 244, 245)",
			foreground: "rgb(34, 65, 74)",
		},

		surface: {
			card: "rgb(255, 255, 255)",
			cardForeground: "rgb(34, 65, 74)",

			popover: "rgb(255, 255, 255)",
			popoverForeground: "rgb(34, 65, 74)",

			muted: "rgb(232, 238, 240)",
			mutedForeground: "rgb(90, 115, 123)",

			accent: "rgb(221, 235, 224)",
			accentForeground: "rgb(34, 65, 74)",
		},

		control: {
			border: "rgb(220, 229, 232)",
			input: "rgb(198, 213, 217)",
			ring: "rgb(108, 174, 64)",
		},

		status: {
			draft: "rgb(0, 128, 209)",
			review: "rgb(212, 142, 0)",
			approved: "rgb(0, 131, 132)",
			active: "rgb(108, 174, 64)",
			expired: "rgb(125, 136, 140)",
		},

		state: {
			success: "rgb(108, 174, 64)",
			successForeground: "rgb(252, 252, 252)",
			successSoft: "rgb(237, 247, 231)",
			successSoftForeground: "rgb(67, 111, 39)",
			successSoftBorder: "rgb(207, 231, 193)",

			warning: "rgb(218, 149, 11)",
			warningForeground: "rgb(45, 31, 10)",
			warningSoft: "rgb(255, 245, 218)",
			warningSoftForeground: "rgb(150, 95, 0)",
			warningSoftBorder: "rgb(246, 220, 163)",

			destructive: "rgb(215, 51, 55)",
			destructiveForeground: "rgb(252, 252, 252)",
			destructiveSoft: "rgb(253, 235, 235)",
			destructiveSoftForeground: "rgb(180, 43, 47)",
			destructiveSoftBorder: "rgb(244, 198, 199)",

			info: "rgb(0, 134, 179)",
			infoForeground: "rgb(252, 252, 252)",
			infoSoft: "rgb(231, 245, 250)",
			infoSoftForeground: "rgb(0, 105, 140)",
			infoSoftBorder: "rgb(184, 222, 235)",
		},
	},

	dark: {
		brand: {
			primary: "rgb(108, 174, 64)",
			primaryForeground: "rgb(13, 20, 9)",

			secondary: "rgb(66, 164, 207)",
			secondaryForeground: "rgb(252, 252, 252)",

			teal: "rgb(34, 65, 74)",
		},

		background: {
			default: "rgb(8, 19, 23)",
			foreground: "rgb(233, 240, 242)",
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

		control: {
			border: "rgb(46, 58, 62)",
			input: "rgb(51, 64, 68)",
			ring: "rgb(108, 174, 64)",
		},

		status: {
			draft: "rgb(63, 159, 232)",
			review: "rgb(235, 169, 65)",
			approved: "rgb(57, 171, 171)",
			active: "rgb(116, 178, 76)",
			expired: "rgb(149, 161, 165)",
		},

		state: {
			success: "rgb(116, 178, 76)",
			successForeground: "rgb(8, 13, 5)",
			successSoft: "rgb(29, 48, 24)",
			successSoftForeground: "rgb(153, 204, 120)",
			successSoftBorder: "rgb(57, 87, 46)",

			warning: "rgb(235, 169, 65)",
			warningForeground: "rgb(30, 20, 6)",
			warningSoft: "rgb(57, 43, 23)",
			warningSoftForeground: "rgb(246, 193, 103)",
			warningSoftBorder: "rgb(91, 70, 39)",

			destructive: "rgb(232, 88, 84)",
			destructiveForeground: "rgb(252, 252, 252)",
			destructiveSoft: "rgb(61, 29, 30)",
			destructiveSoftForeground: "rgb(247, 139, 136)",
			destructiveSoftBorder: "rgb(99, 48, 49)",

			info: "rgb(66, 164, 207)",
			infoForeground: "rgb(252, 252, 252)",
			infoSoft: "rgb(24, 49, 60)",
			infoSoftForeground: "rgb(117, 203, 235)",
			infoSoftBorder: "rgb(43, 83, 100)",
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
		family: '"Sora", system-ui, sans-serif',
	},
} as const;

export type ThemeTokens = typeof tokens;

export type ColorMode = keyof Pick<ThemeTokens, "light" | "dark">;