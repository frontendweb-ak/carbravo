// src/components/ui/primitives/input/input.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input";

const meta = {
	title: "UI/Form/Input",
	component: Input,

	argTypes: {
		size: {
			control: "select",
			options: ["sm", "default", "lg"],
		},

		disabled: {
			control: "boolean",
		},

		error: {
			control: "boolean",
		},

		success: {
			control: "boolean",
		},

		fullWidth: {
			control: "boolean",
		},

		placeholder: {
			control: "text",
		},
	},

	args: {
		placeholder: "Enter value",
		fullWidth: true,
	},
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Playground                                                                  */
/* -------------------------------------------------------------------------- */

export const Playground: Story = {
	args: {
		value: "",
	},
};

/* -------------------------------------------------------------------------- */
/* Sizes                                                                       */
/* -------------------------------------------------------------------------- */

export const Small: Story = {
	args: {
		size: "sm",
		placeholder: "Small input",
	},
};

export const Default: Story = {
	args: {
		size: "default",
		placeholder: "Default input",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		placeholder: "Large input",
	},
};

/* -------------------------------------------------------------------------- */
/* States                                                                      */
/* -------------------------------------------------------------------------- */

export const WithValue: Story = {
	args: {
		value: "Summer Finance Event",
	},
};

export const Disabled: Story = {
	args: {
		value: "Disabled value",
		disabled: true,
	},
};

export const Error: Story = {
	args: {
		value: "Invalid value",
		error: true,
	},
};

export const Success: Story = {
	args: {
		value: "Valid value",
		success: true,
	},
};

export const ReadOnly: Story = {
	args: {
		value: "Read only value",
		readOnly: true,
	},
};

/* -------------------------------------------------------------------------- */
/* Full Width                                                                  */
/* -------------------------------------------------------------------------- */

export const FullWidth: Story = {
	args: {
		fullWidth: true,
		placeholder: "Full width input",
	},
};

export const FixedWidth: Story = {
	render: (args) => (
		<div style={{ width: 320 }}>
			<Input {...args} />
		</div>
	),

	args: {
		placeholder: "320px wide",
	},
};
