import { create } from "storybook/theming";

export default create({
	base: "light",

	brandTitle: "CarBravo Design System",
	brandUrl: "/",
	brandTarget: "_self",
	brandImage: "/logo.svg",

	fontBase: "Inter, sans-serif",
	fontCode: "ui-monospace, monospace",

	colorPrimary: "#6BAE3F",
	colorSecondary: "#24515D",

	appBg: "#F3F6F7",
	appContentBg: "#FFFFFF",
	appPreviewBg: "#FFFFFF",

	appBorderColor: "#DDE5E7",
	appBorderRadius: 12,

	textColor: "#173F4C",
	textInverseColor: "#FFFFFF",

	barTextColor: "#55717A",
	barSelectedColor: "#24515D",
	barHoverColor: "#24515D",
	barBg: "#FFFFFF",

	inputBg: "#FFFFFF",
	inputBorder: "#CBD8DC",
	inputTextColor: "#173F4C",
	inputBorderRadius: 8,
});