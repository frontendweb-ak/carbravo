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
	args: {
		value: "option",
	},
	argTypes: {
		disabled: {
			control: "boolean",
		},
		"aria-invalid": {
			control: "boolean",
		},
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
		"aria-label": "Selected option",
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
/* Disabled Checked                                                           */
/* -------------------------------------------------------------------------- */

export const DisabledChecked: Story = {
	args: {
		value: "option",
		disabled: true,
		"aria-label": "Disabled selected option",
	},
	render: (args) => (
		<RadioGroup value="option">
			<Radio {...args} />
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
/* Invalid Checked                                                            */
/* -------------------------------------------------------------------------- */

export const InvalidChecked: Story = {
	args: {
		value: "option",
		"aria-label": "Invalid selected option",
		"aria-invalid": true,
	},
	render: (args) => (
		<RadioGroup value="option">
			<Radio {...args} />
		</RadioGroup>
	),
};

/* -------------------------------------------------------------------------- */
/* Group                                                                      */
/* -------------------------------------------------------------------------- */

export const Group: Story = {
	args: {
		value: "student",
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
		value: "car",
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

/* -------------------------------------------------------------------------- */
/* Group With Disabled Option                                                 */
/* -------------------------------------------------------------------------- */

export const GroupWithDisabledOption: Story = {
	args: {
		value: "student",
	},
	render: () => (
		<RadioGroup defaultValue="student">
			<label className="flex cursor-pointer items-center gap-2">
				<Radio value="student" />
				<span className="text-sm">Student</span>
			</label>

			<label className="flex cursor-not-allowed items-center gap-2 opacity-50">
				<Radio value="mentor" disabled />
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
/* Form Example                                                               */
/* -------------------------------------------------------------------------- */

export const FormExample: Story = {
	args: {
		value: "student",
	},
	render: () => (
		<div className="w-[400px]">
			<fieldset className="space-y-3">
				<legend className="mb-3 text-sm font-semibold">Account Type</legend>

				<RadioGroup defaultValue="student">
					<label className="flex cursor-pointer items-start gap-3">
						<Radio value="student" />

						<span className="flex flex-col gap-0.5">
							<span className="text-sm font-medium">Student</span>

							<span className="text-xs text-muted-foreground">
								Prepare for UPSC and other competitive examinations.
							</span>
						</span>
					</label>

					<label className="flex cursor-pointer items-start gap-3">
						<Radio value="mentor" />

						<span className="flex flex-col gap-0.5">
							<span className="text-sm font-medium">Mentor</span>

							<span className="text-xs text-muted-foreground">
								Guide and mentor students.
							</span>
						</span>
					</label>
				</RadioGroup>
			</fieldset>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Invalid Group                                                              */
/* -------------------------------------------------------------------------- */

export const InvalidGroup: Story = {
	args: {
		value: "online",
	},
	render: () => (
		<div className="w-[400px]">
			<fieldset>
				<legend className="mb-3 text-sm font-semibold">Preparation Mode</legend>

				<RadioGroup defaultValue="online">
					<label className="flex cursor-pointer items-center gap-2">
						<Radio value="online" aria-invalid />
						<span className="text-sm">Online</span>
					</label>

					<label className="flex cursor-pointer items-center gap-2">
						<Radio value="offline" aria-invalid />
						<span className="text-sm">Offline</span>
					</label>
				</RadioGroup>

				<p className="mt-2 text-sm text-destructive">
					Please select a valid preparation mode.
				</p>
			</fieldset>
		</div>
	),
};