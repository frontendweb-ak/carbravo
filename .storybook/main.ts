import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

	staticDirs: ["../public"],

	addons: [
		"@storybook/addon-docs",
		"@storybook/addon-vitest",
		"@storybook/addon-a11y",
		"@chromatic-com/storybook",
	],

	framework: "@storybook/react-vite",
};

export default config;
