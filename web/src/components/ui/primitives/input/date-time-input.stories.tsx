// src/components/ui/date-time-input/date-time-input.stories.tsx

import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { DateTimeInput } from "./date-time-input";

const meta: Meta<typeof DateTimeInput> = {
	title: "UI/Form/DateTimeInput",
	component: DateTimeInput,

	args: {
		fullWidth: true,
	},

	argTypes: {
		disabled: { control: "boolean" },
		error: { control: "boolean" },
		helperText: { control: "text" },
		fullWidth: { control: "boolean" },
	},
};

export default meta;

type Story = StoryObj<typeof DateTimeInput>;

function PlaygroundComponent(args: React.ComponentProps<typeof DateTimeInput>) {
	const [value, setValue] = useState<Date | null>(new Date());

	return <DateTimeInput {...args} value={value} onChange={setValue} />;
}

export const Playground: Story = {
	render: (args) => <PlaygroundComponent {...args} />,
};

export const Empty: Story = {
	args: {
		value: null,
	},
};

export const Disabled: Story = {
	args: {
		value: new Date(),
		disabled: true,
	},
};

export const Error: Story = {
	args: {
		error: true,
		helperText: "Date and time are required.",
	},
};

export const WithHelperText: Story = {
	args: {
		helperText: "Select the program start date and time.",
	},
};
