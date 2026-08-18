// src/components/ui/stat-card/stat-card.stories.tsx

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WarningIcon from "@mui/icons-material/Warning";
import Typography from "@mui/material/Typography";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatCard } from "./stat-card";

const meta = {
	title: "UI/StatCard",
	component: StatCard,
	parameters: {
		layout: "centered",
	},
	args: {
		label: "Active Programs",
		value: 24,
		tone: "active",
	},
	argTypes: {
		tone: {
			control: "select",
			options: [
				"draft",
				"review",
				"approved",
				"active",
				"expired",
				"primary",
				"success",
				"warning",
				"error",
				"info",
				"neutral",
			],
		},
		onClick: {
			action: "clicked",
		},
	},
	decorators: [
		(Story) => (
			<div style={{ width: 280 }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof StatCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Draft: Story = {
	args: {
		label: "Draft",
		value: 12,
		tone: "draft",
	},
};

export const Review: Story = {
	args: {
		label: "In Review",
		value: 5,
		tone: "review",
	},
};

export const Approved: Story = {
	args: {
		label: "Approved",
		value: 18,
		tone: "approved",
	},
};

export const Active: Story = {
	args: {
		label: "Active",
		value: 24,
		tone: "active",
	},
};

export const Expired: Story = {
	args: {
		label: "Expired",
		value: 3,
		tone: "expired",
	},
};

export const Success: Story = {
	args: {
		label: "Successful",
		value: 128,
		tone: "success",
	},
};

export const Warning: Story = {
	args: {
		label: "Needs Attention",
		value: 7,
		tone: "warning",
	},
};

export const Error: Story = {
	args: {
		label: "Errors",
		value: 2,
		tone: "error",
	},
};

export const Info: Story = {
	args: {
		label: "Information",
		value: 42,
		tone: "info",
	},
};

export const WithIcon: Story = {
	args: {
		label: "Vehicles",
		value: 1_248,
		tone: "primary",
		icon: <DirectionsCarIcon fontSize="small" />,
	},
};

export const WithCustomContent: Story = {
	args: {
		label: "Active Programs",
		value: 24,
		tone: "active",
		children: (
			<Typography variant="body2" color="text.secondary">
				+12% from last month
			</Typography>
		),
	},
};

export const Selected: Story = {
	args: {
		label: "Selected",
		value: 24,
		tone: "primary",
		selected: true,
	},
};

export const Disabled: Story = {
	args: {
		label: "Disabled",
		value: 24,
		tone: "neutral",
		disabled: true,
	},
};

export const Clickable: Story = {
	args: {
		label: "Active Programs",
		value: 24,
		tone: "active",
		onClick: () => {
			console.log("StatCard clicked");
		},
	},
};

export const IconAndContent: Story = {
	args: {
		label: "Program Health",
		value: "Healthy",
		tone: "success",
		icon: <CheckCircleIcon fontSize="small" />,
		children: (
			<Typography variant="body2" color="text.secondary">
				All required sections completed.
			</Typography>
		),
	},
};

export const WarningWithIcon: Story = {
	args: {
		label: "Attention Required",
		value: 7,
		tone: "warning",
		icon: <WarningIcon fontSize="small" />,
	},
};
