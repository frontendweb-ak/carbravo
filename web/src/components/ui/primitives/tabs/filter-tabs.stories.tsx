import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { FilterTabs, type FilterTabsProps } from "./filter-tabs";

type FilterValue = "all" | "active" | "pending" | "completed" | "cancelled";

const items = [
	{
		value: "all",
		label: "All",
		count: 42,
	},
	{
		value: "active",
		label: "Active",
		count: 18,
	},
	{
		value: "pending",
		label: "Pending",
		count: 8,
	},
	{
		value: "completed",
		label: "Completed",
		count: 14,
	},
	{
		value: "cancelled",
		label: "Cancelled",
		count: 2,
	},
] satisfies FilterTabsProps<FilterValue>["items"];

function FilterTabsStory(props: FilterTabsProps<FilterValue>) {
	return <FilterTabs {...props} />;
}

const meta = {
	title: "Components/FilterTabs",
	component: FilterTabsStory,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	args: {
		items,
		value: "all",
		onValueChange: () => {},
	},
} satisfies Meta<typeof FilterTabsStory>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	render: (args) => {
		const [value, setValue] = useState<FilterValue>(args.value);

		return <FilterTabsStory {...args} value={value} onValueChange={setValue} />;
	},
};

/* -------------------------------------------------------------------------- */
/* Without Counts                                                             */
/* -------------------------------------------------------------------------- */

export const WithoutCounts: Story = {
	args: {
		items: [
			{
				value: "all",
				label: "All",
			},
			{
				value: "active",
				label: "Active",
			},
			{
				value: "pending",
				label: "Pending",
			},
			{
				value: "completed",
				label: "Completed",
			},
		],
	},
	render: (args) => {
		const [value, setValue] = useState<FilterValue>("all");

		return <FilterTabsStory {...args} value={value} onValueChange={setValue} />;
	},
};

/* -------------------------------------------------------------------------- */
/* Selected                                                                    */
/* -------------------------------------------------------------------------- */

export const Selected: Story = {
	args: {
		value: "active",
	},
	render: (args) => {
		const [value, setValue] = useState<FilterValue>("active");

		return <FilterTabsStory {...args} value={value} onValueChange={setValue} />;
	},
};

/* -------------------------------------------------------------------------- */
/* Disabled Item                                                              */
/* -------------------------------------------------------------------------- */

export const WithDisabledItem: Story = {
	args: {
		items: [
			{
				value: "all",
				label: "All",
				count: 42,
			},
			{
				value: "active",
				label: "Active",
				count: 18,
			},
			{
				value: "pending",
				label: "Pending",
				count: 8,
				disabled: true,
			},
			{
				value: "completed",
				label: "Completed",
				count: 14,
			},
		],
	},
	render: (args) => {
		const [value, setValue] = useState<FilterValue>("all");

		return <FilterTabsStory {...args} value={value} onValueChange={setValue} />;
	},
};

/* -------------------------------------------------------------------------- */
/* Custom Labels                                                              */
/* -------------------------------------------------------------------------- */

export const CustomLabels: Story = {
	args: {
		items: [
			{
				value: "all",
				label: (
					<span className="flex items-center gap-1">
						<span>All</span>
						<span aria-hidden="true">✦</span>
					</span>
				),
				count: 42,
			},
			{
				value: "active",
				label: (
					<span className="flex items-center gap-1">
						<span
							aria-hidden="true"
							className="size-1.5 rounded-full bg-current"
						/>
						<span>Active</span>
					</span>
				),
				count: 18,
			},
			{
				value: "pending",
				label: "Pending",
				count: 8,
			},
		],
	},
	render: (args) => {
		const [value, setValue] = useState<FilterValue>("all");

		return <FilterTabsStory {...args} value={value} onValueChange={setValue} />;
	},
};

/* -------------------------------------------------------------------------- */
/* Many Items                                                                  */
/* -------------------------------------------------------------------------- */

export const ManyItems: Story = {
	args: {
		items: [
			{ value: "all", label: "All", count: 120 },
			{ value: "active", label: "Active", count: 42 },
			{ value: "pending", label: "Pending", count: 17 },
			{ value: "completed", label: "Completed", count: 51 },
			{ value: "cancelled", label: "Cancelled", count: 10 },
		],
	},
	render: (args) => {
		const [value, setValue] = useState<FilterValue>("all");

		return (
			<div className="max-w-[700px]">
				<FilterTabsStory {...args} value={value} onValueChange={setValue} />
			</div>
		);
	},
};

/* -------------------------------------------------------------------------- */
/* CarBravo Example                                                           */
/* -------------------------------------------------------------------------- */

export const CarBravoExample: Story = {
	args: {
		items: [
			{
				value: "all",
				label: "All Vehicles",
				count: 124,
			},
			{
				value: "active",
				label: "Available",
				count: 48,
			},
			{
				value: "pending",
				label: "Reserved",
				count: 16,
			},
			{
				value: "completed",
				label: "Sold",
				count: 52,
			},
			{
				value: "cancelled",
				label: "Cancelled",
				count: 8,
			},
		],
	},
	render: (args) => {
		const [value, setValue] = useState<FilterValue>("all");

		return (
			<div className="w-[700px]">
				<FilterTabsStory {...args} value={value} onValueChange={setValue} />
			</div>
		);
	},
};
