import type { Preview } from "@storybook/react-vite";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { theme } from "../src/theme";

const preview: Preview = {
	parameters: {
		layout: "centered",

		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		a11y: {
			test: "todo",
		},

		docs: {
			controls: {
				sort: "requiredFirst",
			},
		},
	},

	decorators: [
		(Story) => (
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Story />
			</ThemeProvider>
		),
	],

	tags: ["autodocs"],
};

export default preview;