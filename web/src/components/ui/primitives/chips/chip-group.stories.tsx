import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ChipGroup, type ChipGroupProps } from "./chip-group";

type ExamOption = {
	id: string;
	name: string;
	description?: string;
	disabled?: boolean;
};

const options: ExamOption[] = [
	{
		id: "upsc",
		name: "UPSC",
		description: "Civil Services Examination",
	},
	{
		id: "ssc",
		name: "SSC",
		description: "Staff Selection Commission",
	},
	{
		id: "banking",
		name: "Banking",
		description: "Banking examinations",
	},
	{
		id: "railway",
		name: "Railway",
		description: "Railway recruitment examinations",
	},
];

function ChipGroupStory(props: ChipGroupProps<ExamOption>) {
	return <ChipGroup {...props} />;
}

const meta = {
	title: "Components/ChipGroup",
	component: ChipGroupStory,
	parameters: {
		layout: "centered",
	},
	argTypes: {
		selectionMode: {
			control: "select",
			options: ["single", "multiple"],
		},
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
		color: {
			control: "select",
			options: [
				"default",
				"primary",
				"success",
				"warning",
				"destructive",
				"secondary",
				"neutral",
			],
		},
		variant: {
			control: "select",
			options: ["outline", "solid", "soft", "ghost"],
		},
		radius: {
			control: "select",
			options: ["sm", "md", "lg", "xl", "full"],
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
		disabled: {
			control: "boolean",
		},
	},
	args: {
		options,
		selectionMode: "single",
		orientation: "horizontal",
		color: "default",
		variant: "outline",
		radius: "md",
		size: "md",
		disabled: false,
		getValue: (option: ExamOption) => option.id,
		getLabel: (option: ExamOption) => option.name,
		getDescription: (option: ExamOption) => option.description,
		getDisabled: (option: ExamOption) => option.disabled ?? false,
	},
} satisfies Meta<typeof ChipGroupStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => {
		const [value, setValue] = useState<string>("upsc");

		return (
			<div className="w-[500px]">
				<ChipGroupStory
					{...args}
					value={value}
					onValueChange={(nextValue) => setValue(nextValue as string)}
				/>
			</div>
		);
	},
};

export const Multiple: Story = {
	args: {
		selectionMode: "multiple",
	},
	render: (args) => {
		const [value, setValue] = useState<string[]>(["upsc", "banking"]);

		return (
			<div className="w-[500px]">
				<ChipGroupStory
					{...args}
					value={value}
					onValueChange={(nextValue) => setValue(nextValue as string[])}
				/>
			</div>
		);
	},
};

export const Vertical: Story = {
	args: {
		orientation: "vertical",
	},
	render: (args) => {
		const [value, setValue] = useState<string>("upsc");

		return (
			<div className="w-[300px]">
				<ChipGroupStory
					{...args}
					value={value}
					onValueChange={(nextValue) => setValue(nextValue as string)}
				/>
			</div>
		);
	},
};

export const WithInitialValue: Story = {
	args: {
		value: "banking",
	},
	render: (args) => {
		const [value, setValue] = useState<string>(
			(args.value as string) ?? "upsc",
		);

		return (
			<div className="w-[500px]">
				<ChipGroupStory
					{...args}
					value={value}
					onValueChange={(nextValue) => setValue(nextValue as string)}
				/>
			</div>
		);
	},
};

export const MultipleInitialValues: Story = {
	args: {
		selectionMode: "multiple",
		value: ["upsc", "ssc"],
	},
	render: (args) => {
		const [value, setValue] = useState<string[]>(
			(args.value as string[]) ?? [],
		);

		return (
			<div className="w-[500px]">
				<ChipGroupStory
					{...args}
					value={value}
					onValueChange={(nextValue) => setValue(nextValue as string[])}
				/>
			</div>
		);
	},
};

export const Colors: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			{(
				[
					"default",
					"primary",
					"success",
					"warning",
					"destructive",
					"secondary",
					"neutral",
				] as const
			).map((color) => (
				<div key={color}>
					<p className="mb-2 text-sm font-medium capitalize">{color}</p>

					<ChipGroupStory
						options={options}
						color={color}
						value="upsc"
						getValue={(option) => option.id}
						getLabel={(option) => option.name}
					/>
				</div>
			))}
		</div>
	),
};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			{(["outline", "solid", "soft", "ghost"] as const).map((variant) => (
				<div key={variant}>
					<p className="mb-2 text-sm font-medium capitalize">{variant}</p>

					<ChipGroupStory
						options={options}
						variant={variant}
						color="primary"
						value="upsc"
						getValue={(option) => option.id}
						getLabel={(option) => option.name}
					/>
				</div>
			))}
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<ChipGroupStory
				options={options}
				size="sm"
				value="upsc"
				getValue={(option) => option.id}
				getLabel={(option) => option.name}
			/>

			<ChipGroupStory
				options={options}
				size="md"
				value="upsc"
				getValue={(option) => option.id}
				getLabel={(option) => option.name}
			/>

			<ChipGroupStory
				options={options}
				size="lg"
				value="upsc"
				getValue={(option) => option.id}
				getLabel={(option) => option.name}
			/>
		</div>
	),
};

export const IndividualDisabled: Story = {
	args: {
		options: [
			options[0],
			options[1],
			{
				id: "banking",
				name: "Banking",
				disabled: true,
			},
			options[3],
		],
	},
	render: (args) => {
		const [value, setValue] = useState<string>("upsc");

		return (
			<div className="w-[500px]">
				<ChipGroupStory
					{...args}
					value={value}
					onValueChange={(nextValue) => setValue(nextValue as string)}
				/>
			</div>
		);
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		value: "upsc",
	},
};

export const ArbitraryObjects: Story = {
	render: () => {
		type Subject = {
			code: string;
			title: string;
			category: string;
		};

		const subjects: Subject[] = [
			{
				code: "gs1",
				title: "GS Paper I",
				category: "General Studies",
			},
			{
				code: "gs2",
				title: "GS Paper II",
				category: "General Studies",
			},
			{
				code: "gs3",
				title: "GS Paper III",
				category: "General Studies",
			},
			{
				code: "gs4",
				title: "GS Paper IV",
				category: "General Studies",
			},
		];

		const [value, setValue] = useState<string>("gs1");

		return (
			<div className="w-[500px]">
				<ChipGroup
					options={subjects}
					value={value}
					onValueChange={(nextValue) => setValue(nextValue as string)}
					color="primary"
					getValue={(subject) => subject.code}
					getLabel={(subject) => subject.title}
				/>
			</div>
		);
	},
};
