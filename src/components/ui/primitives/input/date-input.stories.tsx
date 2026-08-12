import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateInput } from "./date-input";

const meta = {
	title: "Components/Date Input",
	component: DateInput,
	tags: ["autodocs"],

	parameters: {
		layout: "centered",

		docs: {
			description: {
				component:
					"CarBravo date input built on the base Input component. It provides a native date picker with an explicit calendar action.",
			},
		},
	},

	argTypes: {
		size: {
			control: "select",
			options: ["sm", "default", "lg"],
		},

		error: {
			control: "boolean",
		},

		success: {
			control: "boolean",
		},

		disabled: {
			control: "boolean",
		},

		readOnly: {
			control: "boolean",
		},
	},

	args: {
		"aria-label": "Start date",
	},
} satisfies Meta<typeof DateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {
		placeholder: "Select start date",
	},
};

/* -------------------------------------------------------------------------- */
/* With Value                                                                 */
/* -------------------------------------------------------------------------- */

export const WithValue: Story = {
	args: {
		defaultValue: "2026-08-12",
	},
};

/* -------------------------------------------------------------------------- */
/* Sizes                                                                      */
/* -------------------------------------------------------------------------- */

export const Sizes: Story = {
	render: () => (
		<div className="flex w-80 flex-col gap-3">
			<DateInput size="sm" aria-label="Small date" />

			<DateInput size="default" aria-label="Default date" />

			<DateInput size="lg" aria-label="Large date" />
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Success                                                                    */
/* -------------------------------------------------------------------------- */

export const Success: Story = {
	args: {
		success: true,
		defaultValue: "2026-08-12",
		"aria-label": "Start date",
	},
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                   */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
	args: {
		disabled: true,
		defaultValue: "2026-08-12",
	},
};

/* -------------------------------------------------------------------------- */
/* Read Only                                                                  */
/* -------------------------------------------------------------------------- */

export const ReadOnly: Story = {
	args: {
		readOnly: true,
		defaultValue: "2026-08-12",
	},
};

/* -------------------------------------------------------------------------- */
/* Date Constraints                                                           */
/* -------------------------------------------------------------------------- */

export const WithConstraints: Story = {
	args: {
		min: "2026-01-01",
		max: "2026-12-31",
		defaultValue: "2026-08-12",
		"aria-label": "Program start date",
	},
};

/* -------------------------------------------------------------------------- */
/* CarBravo Form Example                                                      */
/* -------------------------------------------------------------------------- */

export const ProgramStartDate: Story = {
	render: () => (
		<div className="w-96 space-y-2">
			<label htmlFor="program-start-date" className="text-sm font-medium">
				Program start date
			</label>

			<DateInput
				id="program-start-date"
				aria-describedby="program-start-date-help"
				min="2026-01-01"
				aria-label="Program start date"
			/>

			<p id="program-start-date-help" className="text-xs text-muted-foreground">
				Select the date when the incentive program becomes active.
			</p>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* CarBravo Form Error                                                        */
/* -------------------------------------------------------------------------- */

export const ProgramStartDateError: Story = {
	render: () => (
		<div className="w-96 space-y-2">
			<label htmlFor="program-start-date-error" className="text-sm font-medium">
				Program start date
			</label>

			<DateInput
				id="program-start-date-error"
				error
				aria-invalid="true"
				aria-describedby="program-start-date-error-message"
			/>

			<p
				id="program-start-date-error-message"
				className="text-xs text-destructive"
			>
				Program start date is required.
			</p>
		</div>
	),
};
