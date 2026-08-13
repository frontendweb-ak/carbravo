import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toggle } from "./toggle";

const meta = {
	title: "Components/Toggle",
	component: Toggle,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "outline"],
		},
		size: {
			control: "select",
			options: ["default", "sm", "lg"],
		},
		disabled: {
			control: "boolean",
		},
		pressed: {
			control: "boolean",
		},
	},
	args: {
		children: "Toggle",
		variant: "default",
		size: "default",
		disabled: false,
		pressed: false,
	},
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {};

/* -------------------------------------------------------------------------- */
/* Pressed                                                                    */
/* -------------------------------------------------------------------------- */

export const Pressed: Story = {
	args: {
		pressed: true,
	},
};

/* -------------------------------------------------------------------------- */
/* Outline                                                                    */
/* -------------------------------------------------------------------------- */

export const Outline: Story = {
	args: {
		variant: "outline",
	},
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                   */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

/* -------------------------------------------------------------------------- */
/* Disabled Pressed                                                           */
/* -------------------------------------------------------------------------- */

export const DisabledPressed: Story = {
	args: {
		disabled: true,
		pressed: true,
	},
};

/* -------------------------------------------------------------------------- */
/* Sizes                                                                      */
/* -------------------------------------------------------------------------- */

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Toggle size="sm">Small</Toggle>
			<Toggle size="default">Default</Toggle>
			<Toggle size="lg">Large</Toggle>
		</div>
	),
	args: {
		children: "Toggle",
	},
};

/* -------------------------------------------------------------------------- */
/* Variants                                                                   */
/* -------------------------------------------------------------------------- */

export const Variants: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Toggle variant="default">Default</Toggle>
			<Toggle variant="outline">Outline</Toggle>
		</div>
	),
	args: {
		children: "Toggle",
	},
};

/* -------------------------------------------------------------------------- */
/* With Icon                                                                  */
/* -------------------------------------------------------------------------- */

export const WithIcon: Story = {
	render: () => (
		<Toggle aria-label="Favorite">
			<span aria-hidden="true">♥</span>
		</Toggle>
	),
	args: {
		children: "♥",
	},
};

/* -------------------------------------------------------------------------- */
/* Icon and Text                                                              */
/* -------------------------------------------------------------------------- */

export const IconAndText: Story = {
	render: () => (
		<Toggle>
			<span aria-hidden="true">✓</span>
			<span>Selected</span>
		</Toggle>
	),
	args: {
		children: "Selected",
	},
};

/* -------------------------------------------------------------------------- */
/* Text Formatting                                                            */
/* -------------------------------------------------------------------------- */

export const Formatting: Story = {
	render: () => (
		<div className="flex items-center gap-1">
			<Toggle aria-label="Bold">
				<strong>B</strong>
			</Toggle>

			<Toggle aria-label="Italic">
				<em>I</em>
			</Toggle>

			<Toggle aria-label="Underline">
				<span className="underline">U</span>
			</Toggle>
		</div>
	),
	args: {
		children: "Toggle",
	},
};

/* -------------------------------------------------------------------------- */
/* Controlled                                                                  */
/* -------------------------------------------------------------------------- */

export const Controlled: Story = {
	render: () => (
		<Toggle
			defaultPressed={false}
			onPressedChange={(pressed) => {
				console.log("Pressed:", pressed);
			}}
		>
			Toggle me
		</Toggle>
	),
	args: {
		children: "Toggle me",
	},
};

/* -------------------------------------------------------------------------- */
/* Button Group                                                                */
/* -------------------------------------------------------------------------- */

export const Group: Story = {
	render: () => (
		<div className="flex items-center gap-1">
			<Toggle aria-label="Bold">
				<strong>B</strong>
			</Toggle>

			<Toggle aria-label="Italic">
				<em>I</em>
			</Toggle>

			<Toggle aria-label="Underline">
				<span className="underline">U</span>
			</Toggle>
		</div>
	),
	args: {
		children: "Toggle",
	},
};