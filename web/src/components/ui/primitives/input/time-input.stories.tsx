import type { Meta, StoryObj } from "@storybook/react-vite";

import { TimeInput } from "./time-input";

const meta = {
	title: "Components/Time Input",
	component: TimeInput,
	tags: ["autodocs"],

	parameters: {
		layout: "centered",

		docs: {
			description: {
				component:
					"A time input with a trailing calendar-style action that opens the native browser time picker.",
			},
		},
	},

	argTypes: {
		size: {
			control: "select",
			options: ["sm", "default", "lg"],
			description: "Controls the input height and typography.",
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

		placeholder: {
			control: "text",
		},
	},

	args: {
		"aria-label": "Time",
	},
} satisfies Meta<typeof TimeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {
		"aria-label": "Start time",
	},
};

/* -------------------------------------------------------------------------- */
/* With Value                                                                 */
/* -------------------------------------------------------------------------- */

export const WithValue: Story = {
	args: {
		value: "09:30",
		"aria-label": "Start time",
	},
};

/* -------------------------------------------------------------------------- */
/* Sizes                                                                      */
/* -------------------------------------------------------------------------- */

export const Sizes: Story = {
	render: () => (
		<div className="flex w-96 flex-col gap-3">
			<TimeInput size="sm" aria-label="Small time input" />

			<TimeInput size="default" aria-label="Default time input" />

			<TimeInput size="lg" aria-label="Large time input" />
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                   */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
	args: {
		disabled: true,
		value: "10:30",
		"aria-label": "Disabled time",
	},
};

/* -------------------------------------------------------------------------- */
/* Invalid                                                                    */
/* -------------------------------------------------------------------------- */

export const Invalid: Story = {
	render: () => (
		<div className="w-96 space-y-2">
			<TimeInput
				error
				aria-label="Start time"
				aria-invalid="true"
				aria-describedby="start-time-error"
			/>

			<p id="start-time-error" className="text-xs text-destructive">
				Start time is required.
			</p>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Success                                                                    */
/* -------------------------------------------------------------------------- */

export const Success: Story = {
	args: {
		value: "14:30",
		success: true,
		"aria-label": "Start time",
	},
};

/* -------------------------------------------------------------------------- */
/* Min / Max                                                                  */
/* -------------------------------------------------------------------------- */

export const RestrictedTime: Story = {
	args: {
		min: "09:00",
		max: "18:00",
		step: 900,
		"aria-label": "Business hours",
	},
};

/* -------------------------------------------------------------------------- */
/* CarBravo Example                                                           */
/* -------------------------------------------------------------------------- */

export const ProgramStartTime: Story = {
	render: () => (
		<div className="w-96 space-y-2">
			<label htmlFor="program-start-time" className="text-sm font-medium">
				Start time
			</label>

			<TimeInput
				id="program-start-time"
				min="09:00"
				max="18:00"
				step={900}
				aria-describedby="program-start-time-help"
			/>

			<p id="program-start-time-help" className="text-xs text-muted-foreground">
				Select a start time between 9:00 AM and 6:00 PM.
			</p>
		</div>
	),
};
