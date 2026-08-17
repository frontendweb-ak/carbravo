import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";

const meta = {
	title: "Primitives/Button",
	component: Button,

	argTypes: {
		variant: {
			control: "select",
			options: [
				"contained",
				"outlined",
				"text",
			],
		},

		color: {
			control: "select",
			options: [
				"primary",
				"secondary",
				"success",
				"warning",
				"error",
				"info",
			],
		},

		size: {
			control: "select",
			options: [
				"small",
				"medium",
				"large",
			],
		},
	},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		children: "Button",
		variant: "contained",
		color: "primary",
	},
};

export const Contained: Story = {
	args: {
		children: "Save",
		variant: "contained",
		color: "primary",
	},
};

export const Outlined: Story = {
	args: {
		children: "Cancel",
		variant: "outlined",
		color: "primary",
	},
};

export const Text: Story = {
	args: {
		children: "Learn More",
		variant: "text",
		color: "primary",
	},
};

export const Error: Story = {
	args: {
		children: "Delete",
		variant: "contained",
		color: "error",
	},
};

export const Success: Story = {
	args: {
		children: "Approved",
		variant: "contained",
		color: "success",
	},
};

export const Loading: Story = {
	args: {
		children: "Saving...",
		loading: true,
		variant: "contained",
		color: "primary",
	},
};