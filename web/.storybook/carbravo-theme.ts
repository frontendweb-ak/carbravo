import { create } from "storybook/theming";

const carbravoTheme = create({
	base: "light",

	brandTitle: "CarBravo Design System",
	brandUrl: "/",
	brandTarget: "_self",
	brandImage: "/logo.svg",

	fontBase: "Inter, ui-sans-serif, system-ui, sans-serif",
	fontCode: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",

	/* CarBravo */
	colorPrimary: "#6BAE3F",
	colorSecondary: "#24515D",

	/* Application */
	appBg: "#F3F6F7",
	appContentBg: "#FFFFFF",
	appPreviewBg: "#FFFFFF",

	appBorderColor: "#DDE5E7",
	appBorderRadius: 8,

	/* Typography */
	textColor: "#173F4C",
	textInverseColor: "#FFFFFF",

	/* Toolbar */
	barTextColor: "#55717A",
	barSelectedColor: "#24515D",
	barHoverColor: "#24515D",
	barBg: "#FFFFFF",

	/* Inputs */
	inputBg: "#FFFFFF",
	inputBorder: "#CBD8DC",
	inputTextColor: "#173F4C",
	inputBorderRadius: 6,
});

export default carbravoTheme;
