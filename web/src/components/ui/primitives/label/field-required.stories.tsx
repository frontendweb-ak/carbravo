import type { Meta, StoryObj } from "@storybook/react-vite";

import { FieldRequired } from "./field-required";

const meta = {
	title: "Components/FieldRequired",
	component: FieldRequired,
	parameters: {
		layout: "centered",
	},
	argTypes: {
		children: {
			control: "text",
		},
		className: {
			control: "text",
		},
	},
	args: {
		children: "REQUIRED",
	},
} satisfies Meta<typeof FieldRequired>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
	args: {
		children: "MANDATORY",
	},
};

export const ShortLabel: Story = {
	args: {
		children: "REQ",
	},
};

export const WithFieldLabel: Story = {
	render: () => (
		<div className="flex items-center text-sm font-semibold">
			<label htmlFor="email">Email</label>
			<FieldRequired />
		</div>
	),
};

export const WithLongLabel: Story = {
	render: () => (
		<div className="flex items-center text-sm font-semibold">
			<label htmlFor="phone">Phone number for account verification</label>
			<FieldRequired />
		</div>
	),
};

export const CustomClassName: Story = {
	args: {
		children: "REQUIRED",
		className: "bg-primary text-primary-foreground",
	},
};

export const InForm: Story = {
	render: () => (
		<div className="w-[400px] space-y-2">
			<div className="flex items-center text-sm font-semibold">
				<label htmlFor="name">Full Name</label>
				<FieldRequired />
			</div>

			<input
				id="name"
				type="text"
				placeholder="Enter your full name"
				className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
			/>
		</div>
	),
};
