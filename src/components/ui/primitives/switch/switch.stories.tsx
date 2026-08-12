import type { Meta, StoryObj } from "@storybook/react-vite";

import { Switch } from "./switch";

const meta = {
	title: "Components/Switch",
	component: Switch,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A switch is a control that allows users to toggle a setting between two states.",
			},
		},
	},
	args: {
		"aria-label": "Switch",
	},
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: "The default unchecked state.",
			},
		},
	},
};

export const Checked: Story = {
	args: {
		defaultChecked: true,
		"aria-label": "Enabled",
	},
	parameters: {
		docs: {
			description: {
				story: "Use the checked state when the setting is currently enabled.",
			},
		},
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		"aria-label": "Disabled",
	},
	parameters: {
		docs: {
			description: {
				story: "A disabled switch cannot be changed by the user.",
			},
		},
	},
};

export const DisabledChecked: Story = {
	args: {
		disabled: true,
		defaultChecked: true,
		"aria-label": "Disabled enabled",
	},
	parameters: {
		docs: {
			description: {
				story: "A disabled switch can still display an enabled state.",
			},
		},
	},
};

export const Invalid: Story = {
	args: {
		"aria-invalid": true,
		"aria-label": "Invalid switch",
	},
	parameters: {
		docs: {
			description: {
				story: "Displays the switch in an invalid state for form validation.",
			},
		},
	},
};
