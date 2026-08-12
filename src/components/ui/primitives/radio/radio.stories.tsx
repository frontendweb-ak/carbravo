import type { Meta, StoryObj } from "@storybook/react-vite";

import { Radio } from "./radio";
import { RadioGroup } from "./radio-group";

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

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {
		value: "option",
		"aria-label": "Option",
	},
};

/* -------------------------------------------------------------------------- */
/* Checked                                                                    */
/* -------------------------------------------------------------------------- */

export const Checked: Story = {
	args: {
		value: "option",
	},
	render: (args) => (
		<RadioGroup value="option">
			<Radio {...args} />
		</RadioGroup>
	),
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                   */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
	args: {
		value: "option",
		disabled: true,
		"aria-label": "Disabled option",
	},
};

/* -------------------------------------------------------------------------- */
/* Disabled Checked                                                          */
/* -------------------------------------------------------------------------- */

export const DisabledChecked: Story = {
	args: {
		value: "option",
	},
	render: () => (
		<RadioGroup value="option">
			<Radio value="option" disabled aria-label="Disabled selected option" />
		</RadioGroup>
	),
};

/* -------------------------------------------------------------------------- */
/* Invalid                                                                    */
/* -------------------------------------------------------------------------- */

export const Invalid: Story = {
	args: {
		value: "option",
		"aria-label": "Invalid option",
		"aria-invalid": true,
	},
};

/* -------------------------------------------------------------------------- */
/* Group                                                                      */
/* -------------------------------------------------------------------------- */

export const Group: Story = {
	args: {
		value: "option",
	},
	render: () => (
		<RadioGroup defaultValue="student">
			<label className="flex cursor-pointer items-center gap-2">
				<Radio value="student" />
				<span className="text-sm">Student</span>
			</label>

			<label className="flex cursor-pointer items-center gap-2">
				<Radio value="mentor" />
				<span className="text-sm">Mentor</span>
			</label>

			<label className="flex cursor-pointer items-center gap-2">
				<Radio value="admin" />
				<span className="text-sm">Admin</span>
			</label>
		</RadioGroup>
	),
};

/* -------------------------------------------------------------------------- */
/* Horizontal Group                                                           */
/* -------------------------------------------------------------------------- */

export const HorizontalGroup: Story = {
	args: {
		value: "option",
	},
	render: () => (
		<RadioGroup defaultValue="car" orientation="horizontal">
			<label className="flex cursor-pointer items-center gap-2">
				<Radio value="car" />
				<span className="text-sm">Car</span>
			</label>

			<label className="flex cursor-pointer items-center gap-2">
				<Radio value="bike" />
				<span className="text-sm">Bike</span>
			</label>

			<label className="flex cursor-pointer items-center gap-2">
				<Radio value="truck" />
				<span className="text-sm">Truck</span>
			</label>
		</RadioGroup>
	),
};