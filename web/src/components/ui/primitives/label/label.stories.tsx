import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "../input";
import { Label } from "./label";

const meta = {
	title: "Components/Label",
	component: Label,
	tags: ["autodocs"],

	parameters: {
		layout: "centered",

		docs: {
			description: {
				component:
					"CarBravo form label used to identify and associate form controls.",
			},
		},
	},
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Program name",
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="flex w-80 flex-col gap-2">
			<Label htmlFor="disabled-program-name" data-disabled="true">
				Program name
			</Label>

			<Input id="disabled-program-name" disabled placeholder="Disabled" />
		</div>
	),
};

export const Required: Story = {
	render: () => (
		<div className="flex w-80 flex-col gap-2">
			<Label htmlFor="required-program-name">Program name</Label>

			<Input
				id="required-program-name"
				required
				placeholder="Summer Finance Event"
			/>
		</div>
	),
};
