import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";

const meta = {
	title: "Components/Checkbox",
	component: Checkbox,
	tags: ["autodocs"],

	parameters: {
		layout: "centered",

		docs: {
			description: {
				component:
					"A production-ready checkbox primitive for selecting a single boolean value.",
			},
		},
	},

	argTypes: {
		disabled: {
			control: "boolean",
		},

		checked: {
			control: "boolean",
		},

		defaultChecked: {
			control: "boolean",
		},
	},

	args: {
		"aria-label": "Checkbox",
	},
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {
		"aria-label": "Accept terms",
	},
};

/* -------------------------------------------------------------------------- */
/* Checked                                                                    */
/* -------------------------------------------------------------------------- */

export const Checked: Story = {
	args: {
		defaultChecked: true,
		"aria-label": "Accepted",
	},
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                   */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
	args: {
		disabled: true,
		"aria-label": "Disabled checkbox",
	},
};

/* -------------------------------------------------------------------------- */
/* Disabled Checked                                                           */
/* -------------------------------------------------------------------------- */

export const DisabledChecked: Story = {
	args: {
		disabled: true,
		defaultChecked: true,
		"aria-label": "Disabled checked checkbox",
	},
};

/* -------------------------------------------------------------------------- */
/* Invalid                                                                    */
/* -------------------------------------------------------------------------- */

export const Invalid: Story = {
	args: {
		"aria-label": "Invalid checkbox",
		"aria-invalid": true,
	},
};

/* -------------------------------------------------------------------------- */
/* Multiple                                                                   */
/* -------------------------------------------------------------------------- */

export const Multiple: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<label id="one" className="flex items-center gap-2 text-sm">
				<Checkbox id="one" aria-label="Customer Cash" />
				Customer Cash
			</label>

			<label className="flex items-center gap-2 text-sm">
				<Checkbox aria-label="APR" />
				APR
			</label>

			<label className="flex items-center gap-2 text-sm">
				<Checkbox aria-label="Bonus Cash" />
				Bonus Cash
			</label>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* CarBravo Example                                                           */
/* -------------------------------------------------------------------------- */

export const VehicleSelection: Story = {
	render: () => (
		<div className="w-64 space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-sm font-semibold">Model year</span>

				<span className="text-xs text-muted-foreground">0 selected</span>
			</div>

			<label className="flex items-center gap-2 text-sm">
				<Checkbox aria-label="Any model year" />

				<span>Any Model year</span>
			</label>

			<label className="flex items-center gap-2 text-sm">
				<Checkbox aria-label="2027" />

				<span>2027</span>
			</label>

			<label className="flex items-center gap-2 text-sm">
				<Checkbox aria-label="2026" />

				<span>2026</span>
			</label>

			<label className="flex items-center gap-2 text-sm">
				<Checkbox aria-label="2025" />

				<span>2025</span>
			</label>
		</div>
	),
};
