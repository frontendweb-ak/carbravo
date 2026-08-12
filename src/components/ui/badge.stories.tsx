import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertTriangle, Check, Clock, XCircle } from "lucide-react";

import { Badge } from "./badge";

const meta = {
	title: "Components/Badge",
	component: Badge,
	tags: ["autodocs"],

	parameters: {
		layout: "centered",

		docs: {
			description: {
				component:
					"CarBravo's reusable badge primitive for compact labels, metadata, statuses, and contextual information.",
			},
		},
	},

	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"brand",
				"success",
				"warning",
				"info",
				"destructive",
				"outline",
				"ghost",
				"link",
			],
		},

		size: {
			control: "select",
			options: ["sm", "default", "lg"],
		},
	},
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Basic                                                                       */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {
		children: "Default",
	},
};

export const Brand: Story = {
	args: {
		variant: "brand",
		children: "CarBravo",
	},
};

/* -------------------------------------------------------------------------- */
/* Semantic                                                                    */
/* -------------------------------------------------------------------------- */

export const Success: Story = {
	args: {
		variant: "success",
		children: "Success",
	},
};

export const Warning: Story = {
	args: {
		variant: "warning",
		children: "Warning",
	},
};

export const Info: Story = {
	args: {
		variant: "info",
		children: "Information",
	},
};

export const Destructive: Story = {
	args: {
		variant: "destructive",
		children: "Error",
	},
};

/* -------------------------------------------------------------------------- */
/* Neutral                                                                     */
/* -------------------------------------------------------------------------- */

export const Outline: Story = {
	args: {
		variant: "outline",
		children: "Outline",
	},
};

export const Ghost: Story = {
	args: {
		variant: "ghost",
		children: "Ghost",
	},
};

export const Link: Story = {
	args: {
		variant: "link",
		children: "View details",
	},
};

/* -------------------------------------------------------------------------- */
/* Sizes                                                                       */
/* -------------------------------------------------------------------------- */

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Badge size="sm">Small</Badge>
			<Badge>Default</Badge>
			<Badge size="lg">Large</Badge>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Icons                                                                       */
/* -------------------------------------------------------------------------- */

export const WithIcons: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Badge variant="success">
				<Check />
				Approved
			</Badge>

			<Badge variant="warning">
				<AlertTriangle />
				Review
			</Badge>

			<Badge variant="info">
				{/* <Info /> */}
				Information
			</Badge>

			<Badge variant="destructive">
				<XCircle />
				Rejected
			</Badge>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* CarBravo status examples                                                    */
/* -------------------------------------------------------------------------- */

export const ProgramStatuses: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Badge variant="info">
				<Clock />
				Draft
			</Badge>

			<Badge variant="warning">
				<AlertTriangle />
				Review
			</Badge>

			<Badge variant="success">
				<Check />
				Approved
			</Badge>

			<Badge variant="success">Active</Badge>

			<Badge variant="destructive">
				<XCircle />
				Expired
			</Badge>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Dashboard examples                                                          */
/* -------------------------------------------------------------------------- */

export const Revision: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<span className="text-sm text-muted-foreground">Revision</span>

			<Badge size="sm" variant="outline">
				2.0
			</Badge>
		</div>
	),
};

export const Expiration: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<span className="text-sm text-muted-foreground">Expires</span>

			<Badge size="sm" variant="warning">
				Jul 31, 2026
			</Badge>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Links                                                                       */
/* -------------------------------------------------------------------------- */

export const AsLink: Story = {
	render: () => (
		<Badge
			variant="outline"
			render={<a href="/programs" aria-label="View all programs" />}
		>
			View programs
		</Badge>
	),
};
