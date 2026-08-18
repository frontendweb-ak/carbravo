// src/components/ui/badge/badge.stories.tsx

import Stack from "@mui/material/Stack";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, type BadgeTone } from "./badge";

const TONES: BadgeTone[] = [
	"neutral",
	"primary",
	"secondary",
	"success",
	"warning",
	"error",
	"info",
	"draft",
	"review",
	"approved",
	"active",
	"expired",
];

const meta = {
	title: "UI/Badge",
	component: Badge,

	args: {
		children: "Approved",
		tone: "success",
	},

	argTypes: {
		children: {
			control: "text",
		},

		tone: {
			control: "select",
			options: TONES,
		},
	},
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/* -------------------------------------------------------------------------- */
/* Individual tones                                                           */
/* -------------------------------------------------------------------------- */

export const Neutral: Story = {
	args: {
		children: "Neutral",
		tone: "neutral",
	},
};

export const Primary: Story = {
	args: {
		children: "Primary",
		tone: "primary",
	},
};

export const Secondary: Story = {
	args: {
		children: "Secondary",
		tone: "secondary",
	},
};

export const Success: Story = {
	args: {
		children: "Success",
		tone: "success",
	},
};

export const Warning: Story = {
	args: {
		children: "Warning",
		tone: "warning",
	},
};

export const Error: Story = {
	args: {
		children: "Error",
		tone: "error",
	},
};

export const Info: Story = {
	args: {
		children: "Info",
		tone: "info",
	},
};

export const Draft: Story = {
	args: {
		children: "Draft",
		tone: "draft",
	},
};

export const Review: Story = {
	args: {
		children: "Review",
		tone: "review",
	},
};

export const Approved: Story = {
	args: {
		children: "Approved",
		tone: "approved",
	},
};

export const Active: Story = {
	args: {
		children: "Active",
		tone: "active",
	},
};

export const Expired: Story = {
	args: {
		children: "Expired",
		tone: "expired",
	},
};

/* -------------------------------------------------------------------------- */
/* Showcase                                                                    */
/* -------------------------------------------------------------------------- */

export const AllTones: Story = {
	render: () => (
		<Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }} useFlexGap>
			{TONES.map((tone) => (
				<Badge key={tone} tone={tone}>
					{tone}
				</Badge>
			))}
		</Stack>
	),
};
