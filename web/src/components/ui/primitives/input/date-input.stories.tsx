// src/components/ui/date-input/date-input.stories.tsx

import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { DateInput } from "./date-input";

const meta = {
	title: "UI/Form/DateInput",
	component: DateInput,

	argTypes: {
		disabled: {
			control: "boolean",
		},

		error: {
			control: "boolean",
		},

		helperText: {
			control: "text",
		},

		fullWidth: {
			control: "boolean",
		},
	},

	args: {
		fullWidth: true,
	},
} satisfies Meta<typeof DateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Playground                                                                  */
/* -------------------------------------------------------------------------- */

export const Playground: Story = {
	render: (args) => {
		const [value, setValue] = useState("");

		return (
			<DateInput
				{...args}
				value={value}
				onChange={setValue}
			/>
		);
	},
};

/* -------------------------------------------------------------------------- */
/* Empty                                                                       */
/* -------------------------------------------------------------------------- */

export const Empty: Story = {
	args: {
		value: "",
	},
};

/* -------------------------------------------------------------------------- */
/* With Value                                                                  */
/* -------------------------------------------------------------------------- */

export const WithValue: Story = {
	args: {
		value: "01-01-2026",
	},
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                    */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
	args: {
		value: "01-01-2026",
		disabled: true,
	},
};

/* -------------------------------------------------------------------------- */
/* Error                                                                       */
/* -------------------------------------------------------------------------- */

export const Error: Story = {
	args: {
		error: true,
		helperText: "Date is required.",
	},
};

/* -------------------------------------------------------------------------- */
/* Helper Text                                                                 */
/* -------------------------------------------------------------------------- */

export const WithHelperText: Story = {
	args: {
		value: "01-01-2026",
		helperText: "Select the delivery start date.",
	},
};

/* -------------------------------------------------------------------------- */
/* Date Range                                                                  */
/* -------------------------------------------------------------------------- */

export const WithMinMaxDates: Story = {
	render: (args) => {
		const [value, setValue] = useState("");

		return (
			<DateInput
				{...args}
				value={value}
				onChange={setValue}
				minDate={new Date("2026-01-01")}
				maxDate={new Date("2026-12-31")}
			/>
		);
	},
};