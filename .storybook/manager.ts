import { addons } from "storybook/manager-api";

import carbravoTheme from "./carbravo-theme";

addons.setConfig({
	theme: carbravoTheme,

	navSize: 260,

	sidebar: {
		showRoots: true,
	},

	showToolbar: true,
	enableShortcuts: true,
});
