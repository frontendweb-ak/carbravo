import type { Preview } from "@storybook/react-vite";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { carBravoTheme } from "../src/config/theme";
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
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<ThemeProvider theme={carBravoTheme}>
					<CssBaseline />
					<Story />
				</ThemeProvider>
			</LocalizationProvider>
		),
	],

	tags: ["autodocs"],
};

export default preview;