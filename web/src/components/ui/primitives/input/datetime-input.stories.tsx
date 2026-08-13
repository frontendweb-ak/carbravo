import type { Meta, StoryObj } from "@storybook/react-vite";

import { DateTimeInput } from "./datetime-input";

const meta = {
	title: "Components/Date Time Input",
	component: DateTimeInput,
	tags: ["autodocs"],

	parameters: {
		layout: "centered",

		docs: {
			description: {
				component:
					"CarBravo date and time input built on the base Input component. It provides a native date-time picker with an explicit calendar and clock action.",
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
		"aria-label": "Start date and time",
	},
} satisfies Meta<typeof DateTimeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {
		"aria-label": "Start date and time",
	},
};

/* -------------------------------------------------------------------------- */
/* With Value                                                                 */
/* -------------------------------------------------------------------------- */

export const WithValue: Story = {
	args: {
		defaultValue: "2026-08-12T10:30",
	},
};

/* -------------------------------------------------------------------------- */
/* Sizes                                                                      */
/* -------------------------------------------------------------------------- */

export const Sizes: Story = {
	render: () => (
		<div className="flex w-80 flex-col gap-3">
			<DateTimeInput size="sm" aria-label="Small date and time" />

			<DateTimeInput size="default" aria-label="Default date and time" />

			<DateTimeInput size="lg" aria-label="Large date and time" />
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Error                                                                      */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Success                                                                    */
/* -------------------------------------------------------------------------- */

export const Success: Story = {
	args: {
		success: true,
		defaultValue: "2026-08-12T10:30",
		"aria-label": "Start date and time",
	},
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                   */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
	args: {
		disabled: true,
		defaultValue: "2026-08-12T10:30",
	},
};

/* -------------------------------------------------------------------------- */
/* Read Only                                                                  */
/* -------------------------------------------------------------------------- */

export const ReadOnly: Story = {
	args: {
		readOnly: true,
		defaultValue: "2026-08-12T10:30",
	},
};

/* -------------------------------------------------------------------------- */
/* Date Constraints                                                           */
/* -------------------------------------------------------------------------- */

export const WithConstraints: Story = {
	args: {
		min: "2026-08-01T09:00",
		max: "2026-12-31T18:00",
		defaultValue: "2026-08-12T10:30",
		"aria-label": "Program start date and time",
	},
};

/* -------------------------------------------------------------------------- */
/* CarBravo Form Example                                                      */
/* -------------------------------------------------------------------------- */

export const ProgramStartDateTime: Story = {
	render: () => (
		<div className="w-96 space-y-2">
			<label htmlFor="program-start-date-time" className="text-sm font-medium">
				Program start date & time
			</label>

			<DateTimeInput
				id="program-start-date-time"
				aria-describedby="program-start-date-time-help"
				min="2026-01-01T09:00"
				aria-label="Program start date and time"
			/>

			<p
				id="program-start-date-time-help"
				className="text-xs text-muted-foreground"
			>
				Select when the incentive program becomes active.
			</p>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* CarBravo Form Error                                                        */
/* -------------------------------------------------------------------------- */

export const ProgramStartDateTimeError: Story = {
	render: () => (
		<div className="w-96 space-y-2">
			<label
				htmlFor="program-start-date-time-error"
				className="text-sm font-medium"
			>
				Program start date & time
			</label>

			<DateTimeInput
				id="program-start-date-time-error"
				error
				aria-invalid="true"
				aria-describedby="program-start-date-time-error-message"
			/>

			<p
				id="program-start-date-time-error-message"
				className="text-xs text-destructive"
			>
				Program start date and time are required.
			</p>
		</div>
	),
};
