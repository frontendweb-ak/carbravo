import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	AlertTriangle,
	ArrowRight,
	Check,
	Plus,
	Search,
	Settings,
	Trash2,
} from "lucide-react";

import { Button } from "./button";

const meta = {
	title: "Components/Button",
	component: Button,
	tags: ["autodocs"],

	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"CarBravo's primary action component. Supports semantic variants, sizes, icons, loading states, and full-width layouts.",
			},
		},
	},

	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"secondary",
				"outline",
				"ghost",
				"destructive",
				"success",
				"warning",
				"link",
			],
			description: "Visual style of the button.",
		},

		size: {
			control: "select",
			options: [
				"xs",
				"sm",
				"default",
				"lg",
				"xl",
				"icon",
				"icon-xs",
				"icon-sm",
				"icon-lg",
			],
			description: "Button size.",
		},

		fullWidth: {
			control: "boolean",
			description: "Expands the button to the available width.",
		},

		loading: {
			control: "boolean",
			description: "Displays the loading state and disables interaction.",
		},

		loadingText: {
			control: "text",
			description: "Optional text displayed while loading.",
		},

		disabled: {
			control: "boolean",
		},

		onClick: {
			action: "clicked",
		},
	},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "New Program",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		children: "Secondary Action",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
		children: "Cancel",
	},
};

export const Ghost: Story = {
	args: {
		variant: "ghost",
		children: "More Options",
	},
};

export const Destructive: Story = {
	args: {
		variant: "destructive",
		children: "Delete Program",
	},
};

export const Success: Story = {
	args: {
		variant: "success",
		children: "Approve Program",
	},
};

export const Warning: Story = {
	args: {
		variant: "warning",
		children: "Review Required",
	},
};

export const Link: Story = {
	args: {
		variant: "link",
		children: "View Program",
	},
};

/* -------------------------------------------------------------------------- */
/* Sizes                                                                       */
/* -------------------------------------------------------------------------- */

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Button size="xs">Extra Small</Button>
			<Button size="sm">Small</Button>
			<Button>Default</Button>
			<Button size="lg">Large</Button>
			<Button size="xl">Extra Large</Button>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Icons                                                                       */
/* -------------------------------------------------------------------------- */

export const WithLeadingIcon: Story = {
	args: {
		children: "New Program",
	},
	render: (args) => (
		<Button {...args}>
			<Plus />
			New Program
		</Button>
	),
};

export const WithTrailingIcon: Story = {
	args: {
		children: "View Program",
	},
	render: (args) => (
		<Button {...args}>
			View Program
			<ArrowRight />
		</Button>
	),
};

export const IconButtons: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Button size="icon-xs" aria-label="Search">
				<Search />
			</Button>

			<Button size="icon-sm" aria-label="Settings">
				<Settings />
			</Button>

			<Button size="icon" aria-label="Approve">
				<Check />
			</Button>

			<Button size="icon-lg" aria-label="Delete">
				<Trash2 />
			</Button>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* States                                                                      */
/* -------------------------------------------------------------------------- */

export const Loading: Story = {
	args: {
		loading: true,
		children: "Save Program",
	},
};

export const LoadingWithText: Story = {
	args: {
		loading: true,
		loadingText: "Saving...",
		children: "Save Program",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		children: "Unavailable",
	},
};

/* -------------------------------------------------------------------------- */
/* Layout                                                                      */
/* -------------------------------------------------------------------------- */

export const FullWidth: Story = {
	args: {
		fullWidth: true,
		children: "Create Program",
	},
	parameters: {
		layout: "padded",
	},
};

/* -------------------------------------------------------------------------- */
/* Real CarBravo examples                                                      */
/* -------------------------------------------------------------------------- */

export const DashboardActions: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button>
				<Plus />
				New Program
			</Button>

			<Button variant="outline">
				<Search />
				Browse Programs
			</Button>

			<Button variant="success">
				<Check />
				Approve
			</Button>

			<Button variant="warning">
				<AlertTriangle />
				Review
			</Button>

			<Button variant="destructive">
				<Trash2 />
				Delete
			</Button>
		</div>
	),
};
