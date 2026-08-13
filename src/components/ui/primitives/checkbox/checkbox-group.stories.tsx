import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CheckboxGroup, type CheckboxGroupProps } from "./checkbox-group";

type ExamOption = {
	id: string;
	name: string;
	description?: string;
	disabled?: boolean;
};

const options: ExamOption[] = [
	{
		id: "upsc",
		name: "UPSC Civil Services",
		description: "Prepare for IAS, IPS, IFS and other services.",
	},
	{
		id: "ssc",
		name: "SSC CGL",
		description: "Staff Selection Commission Combined Graduate Level.",
	},
	{
		id: "banking",
		name: "Banking",
		description: "Prepare for IBPS, SBI and other banking exams.",
	},
	{
		id: "railway",
		name: "Railway",
		description: "Prepare for various Railway recruitment exams.",
	},
];

/**
 * Storybook needs a concrete component type because
 * CheckboxGroup itself is generic.
 */
function CheckboxGroupStory(props: CheckboxGroupProps<ExamOption>) {
	return <CheckboxGroup {...props} />;
}

const meta = {
	title: "Components/CheckboxGroup",
	component: CheckboxGroupStory,
	parameters: {
		layout: "centered",
	},
	argTypes: {
		orientation: {
			control: "select",
			options: ["vertical", "horizontal"],
		},
		disabled: {
			control: "boolean",
		},
		value: {
			control: "object",
		},
	},
	args: {
		options,
		orientation: "vertical",
		disabled: false,
		getValue: (option: ExamOption) => option.id,
		getLabel: (option: ExamOption) => option.name,
		getDescription: (option: ExamOption) => option.description,
		getDisabled: (option: ExamOption) => option.disabled ?? false,
	},
} satisfies Meta<typeof CheckboxGroupStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => {
		const [value, setValue] = useState<string[]>(["upsc"]);

		return (
			<div className="w-[400px]">
				<CheckboxGroupStory {...args} value={value} onValueChange={setValue} />
			</div>
		);
	},
};

export const Horizontal: Story = {
	args: {
		orientation: "horizontal",
	},
	render: (args) => {
		const [value, setValue] = useState<string[]>(["upsc"]);

		return (
			<div className="w-[600px]">
				<CheckboxGroupStory {...args} value={value} onValueChange={setValue} />
			</div>
		);
	},
};

export const WithInitialValues: Story = {
	args: {
		value: ["upsc", "ssc"],
	},
	render: (args) => {
		const [value, setValue] = useState<string[]>(args.value ?? []);

		return (
			<div className="w-[400px]">
				<CheckboxGroupStory {...args} value={value} onValueChange={setValue} />
			</div>
		);
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

export const IndividualDisabled: Story = {
	args: {
		options: [
			options[0],
			options[1],
			{
				id: "banking",
				name: "Banking",
				description: "Currently unavailable.",
				disabled: true,
			},
			options[3],
		],
	},
	render: (args) => {
		const [value, setValue] = useState<string[]>([]);

		return (
			<div className="w-[400px]">
				<CheckboxGroupStory {...args} value={value} onValueChange={setValue} />
			</div>
		);
	},
};

export const WithoutDescriptions: Story = {
	args: {
		options: [
			{
				id: "male",
				name: "Male",
			},
			{
				id: "female",
				name: "Female",
			},
			{
				id: "other",
				name: "Other",
			},
		],
		getDescription: undefined,
	},
	render: (args) => {
		const [value, setValue] = useState<string[]>([]);

		return (
			<div className="w-[400px]">
				<CheckboxGroupStory {...args} value={value} onValueChange={setValue} />
			</div>
		);
	},
};
