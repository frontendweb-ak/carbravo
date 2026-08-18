// src/components/ui/time-input/time-input.stories.tsx

import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { TimeInput } from "./time-input";

const meta = {
	title: "UI/Form/TimeInput",
	component: TimeInput,

	argTypes: {
		label: {
			control: "text",
		},

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
		label: "Start time",
		fullWidth: true,
	},
} satisfies Meta<typeof TimeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Playground                                                                  */
/* -------------------------------------------------------------------------- */

export const Playground: Story = {
	render: (args) => {
		const [value, setValue] = useState<Date | null>(new Date());

		return (
			<TimeInput
				{...args}
				value={value}
				onChange={(newValue) => setValue(newValue)}
			/>
		);
	},
};

/* -------------------------------------------------------------------------- */
/* States                                                                      */
/* -------------------------------------------------------------------------- */

export const Empty: Story = {
	render: (args) => {
		const [value, setValue] = useState<Date | null>(null);

		return (
			<TimeInput
				{...args}
				value={value}
				onChange={(newValue) => setValue(newValue)}
			/>
		);
	},
};

export const WithValue: Story = {
	render: (args) => (
		<TimeInput {...args} value={new Date("2026-01-01T09:30:00")} />
	),
};

export const Disabled: Story = {
	render: (args) => (
		<TimeInput {...args} disabled value={new Date("2026-01-01T09:30:00")} />
	),
};

export const Error: Story = {
	args: {
		label: "Start time",
		error: true,
		helperText: "Start time is required.",
	},

	render: (args) => {
		const [value, setValue] = useState<Date | null>(null);

		return (
			<TimeInput
				{...args}
				value={value}
				onChange={(newValue) => setValue(newValue)}
			/>
		);
	},
};

export const WithHelperText: Story = {
	args: {
		label: "Start time",
		helperText: "Select the time the program begins.",
	},

	render: (args) => {
		const [value, setValue] = useState<Date | null>(new Date());

		return (
			<TimeInput
				{...args}
				value={value}
				onChange={(newValue) => setValue(newValue)}
			/>
		);
	},
};
