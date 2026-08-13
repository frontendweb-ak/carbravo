import type { Meta, StoryObj } from "@storybook/react-vite";

import { Chip } from "./chip";

const meta = {
	title: "Components/Chip",
	component: Chip,
	parameters: {
		layout: "centered",
	},
	argTypes: {
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
		selected: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},
		children: {
			control: "text",
		},
	},
	args: {
		children: "Choice",
		color: "default",
		variant: "outline",
		radius: "md",
		size: "md",
		selected: false,
		disabled: false,
	},
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
	args: {
		children: "Selected",
		selected: true,
	},
};

export const Disabled: Story = {
	args: {
		children: "Disabled",
		disabled: true,
	},
};

export const Colors: Story = {
	render: () => (
		<div className="flex flex-wrap gap-3">
			<Chip color="default">Default</Chip>
			<Chip color="primary">Primary</Chip>
			<Chip color="success">Success</Chip>
			<Chip color="warning">Warning</Chip>
			<Chip color="destructive">Destructive</Chip>
			<Chip color="secondary">Secondary</Chip>
			<Chip color="neutral">Neutral</Chip>
		</div>
	),
};

export const SelectedColors: Story = {
	render: () => (
		<div className="flex flex-wrap gap-3">
			<Chip color="default" selected>
				Default
			</Chip>
			<Chip color="primary" selected>
				Primary
			</Chip>
			<Chip color="success" selected>
				Success
			</Chip>
			<Chip color="warning" selected>
				Warning
			</Chip>
			<Chip color="destructive" selected>
				Destructive
			</Chip>
			<Chip color="secondary" selected>
				Secondary
			</Chip>
			<Chip color="neutral" selected>
				Neutral
			</Chip>
		</div>
	),
};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap gap-3">
			<Chip variant="outline">Outline</Chip>
			<Chip variant="solid">Solid</Chip>
			<Chip variant="soft">Soft</Chip>
			<Chip variant="ghost">Ghost</Chip>
		</div>
	),
};

export const SelectedVariants: Story = {
	render: () => (
		<div className="flex flex-wrap gap-3">
			<Chip variant="outline" color="primary" selected>
				Outline
			</Chip>

			<Chip variant="solid" color="primary" selected>
				Solid
			</Chip>

			<Chip variant="soft" color="primary" selected>
				Soft
			</Chip>

			<Chip variant="ghost" color="primary" selected>
				Ghost
			</Chip>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Chip size="sm">Small</Chip>
			<Chip size="md">Medium</Chip>
			<Chip size="lg">Large</Chip>
		</div>
	),
};

export const Radii: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Chip radius="sm">Small Radius</Chip>
			<Chip radius="md">Medium Radius</Chip>
			<Chip radius="lg">Large Radius</Chip>
			<Chip radius="xl">XL Radius</Chip>
			<Chip radius="full">Full Radius</Chip>
		</div>
	),
};

export const WithIcons: Story = {
	render: () => (
		<div className="flex flex-wrap gap-3">
			<Chip selected>
				<span aria-hidden="true">✓</span>
				Selected
			</Chip>

			<Chip color="primary">
				<span aria-hidden="true">+</span>
				Add
			</Chip>

			<Chip color="destructive">
				<span aria-hidden="true">×</span>
				Remove
			</Chip>
		</div>
	),
};

export const FilterExample: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Chip color="primary" selected>
				All
			</Chip>

			<Chip>UPSC</Chip>

			<Chip>SSC</Chip>

			<Chip>Banking</Chip>

			<Chip>Railway</Chip>
		</div>
	),
};

export const StatusExample: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Chip color="success" selected>
				Active
			</Chip>

			<Chip color="warning" selected>
				Pending
			</Chip>

			<Chip color="destructive" selected>
				Failed
			</Chip>

			<Chip color="neutral" selected>
				Draft
			</Chip>
		</div>
	),
};

export const FullMatrix: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap gap-2">
				<Chip color="primary" size="sm">
					Small
				</Chip>

				<Chip color="primary" size="md">
					Medium
				</Chip>

				<Chip color="primary" size="lg">
					Large
				</Chip>
			</div>

			<div className="flex flex-wrap gap-2">
				<Chip color="primary" variant="outline">
					Outline
				</Chip>

				<Chip color="primary" variant="solid">
					Solid
				</Chip>

				<Chip color="primary" variant="soft">
					Soft
				</Chip>

				<Chip color="primary" variant="ghost">
					Ghost
				</Chip>
			</div>

			<div className="flex flex-wrap gap-2">
				<Chip color="primary" selected>
					Selected
				</Chip>

				<Chip color="success" selected>
					Success
				</Chip>

				<Chip color="warning" selected>
					Warning
				</Chip>

				<Chip color="destructive" selected>
					Error
				</Chip>
			</div>
		</div>
	),
};
