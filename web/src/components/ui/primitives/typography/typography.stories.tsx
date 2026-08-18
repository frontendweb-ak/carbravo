// src/components/ui/primitives/typography/typography.stories.tsx

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "./typography";

const meta = {
	title: "UI/Typography",
	component: Typography,

	argTypes: {
		variant: {
			control: "select",
			options: [
				"display",
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
				"bodyLarge",
				"body",
				"bodyMedium",
				"bodySmall",
				"label",
				"labelSmall",
				"caption",
				"overline",
				"stat",
			],
		},

		weight: {
			control: "select",
			options: ["regular", "medium", "semibold", "bold"],
		},

		color: {
			control: "select",
			options: [
				"default",
				"primary",
				"secondary",
				"muted",
				"success",
				"warning",
				"error",
				"info",
				"inherit",
			],
		},
	},
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		variant: "body",
		children: "CarBravo typography",
	},
};

export const Display: Story = {
	args: {
		variant: "display",
		children: "Incentive authoring dashboard",
	},
};

export const PageTitle: Story = {
	args: {
		variant: "h1",
		children: "Incentive authoring dashboard",
	},
};

export const SectionTitle: Story = {
	args: {
		variant: "h4",
		weight: "bold",
		children: "Expiring soon",
	},
};

export const Body: Story = {
	args: {
		variant: "body",
		children:
			"The plain-language summary dealers see. Describes how the program was authored.",
	},
};

export const BodySmall: Story = {
	args: {
		variant: "bodySmall",
		color: "muted",
		children: "3 hours ago",
	},
};

export const Label: Story = {
	args: {
		variant: "label",
		weight: "bold",
		children: "PROGRAM",
	},
};

export const Overline: Story = {
	args: {
		variant: "overline",
		color: "primary",
		children: "Welcome back, Alex Chen",
	},
};

export const Stat: Story = {
	args: {
		variant: "stat",
		children: "24",
	},
};

export const Status: Story = {
	render: () => (
		<div style={{ display: "flex", gap: 24 }}>
			<Typography variant="overline" color="primary">
				DRAFT
			</Typography>

			<Typography variant="overline" color="warning">
				REVIEW
			</Typography>

			<Typography variant="overline" color="success">
				ACTIVE
			</Typography>
		</div>
	),
};

export const DashboardHierarchy: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			<Typography variant="overline" color="primary">
				WELCOME BACK, ALEX CHEN
			</Typography>

			<Typography variant="display">Incentive authoring dashboard</Typography>

			<Typography variant="bodySmall" color="muted">
				Signed in as Admin · Wednesday, July 2, 2026
			</Typography>
		</div>
	),
};
