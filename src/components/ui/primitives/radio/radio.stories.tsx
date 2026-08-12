import type { Meta, StoryObj } from "@storybook/react-vite";

import { Radio } from "./radio";

const meta = {
	title: "Components/Radio",
	component: Radio,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		"aria-label": "Option",
	},
};

export const Checked: Story = {
	args: {
		checked: true,
		"aria-label": "Selected option",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		"aria-label": "Disabled option",
	},
};

export const DisabledChecked: Story = {
	args: {
		disabled: true,
		checked: true,
		"aria-label": "Disabled selected option",
	},
};

export const Invalid: Story = {
	args: {
		"aria-label": "Invalid option",
		"aria-invalid": true,
	},
};
