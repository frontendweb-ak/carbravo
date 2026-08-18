// src/components/ui/status-badge/status-badge.stories.tsx

import Stack from "@mui/material/Stack";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusBadge } from "./status-badge";

const meta = {
	title: "UI/StatusBadge",
	component: StatusBadge,

	argTypes: {
		status: {
			control: "select",
			options: ["DRAFT", "REVIEW", "APPROVED", "ACTIVE", "EXPIRED"],
		},

		children: {
			control: "text",
		},
	},

	args: {
		status: "DRAFT",
	},
} satisfies Meta<typeof StatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Playground                                                                  */
/* -------------------------------------------------------------------------- */

export const Playground: Story = {};

/* -------------------------------------------------------------------------- */
/* Statuses                                                                     */
/* -------------------------------------------------------------------------- */

export const Draft: Story = {
	args: {
		status: "DRAFT",
	},
};

export const Review: Story = {
	args: {
		status: "REVIEW",
	},
};

export const Approved: Story = {
	args: {
		status: "APPROVED",
	},
};

export const Active: Story = {
	args: {
		status: "ACTIVE",
	},
};

export const Expired: Story = {
	args: {
		status: "EXPIRED",
	},
};

/* -------------------------------------------------------------------------- */
/* Custom label                                                                 */
/* -------------------------------------------------------------------------- */

export const CustomLabel: Story = {
	args: {
		status: "APPROVED",
		children: "Ready for Launch",
	},
};

/* -------------------------------------------------------------------------- */
/* Showcase                                                                     */
/* -------------------------------------------------------------------------- */

export const AllStatuses: Story = {
	render: () => (
		<Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
			<StatusBadge status="DRAFT" />
			<StatusBadge status="REVIEW" />
			<StatusBadge status="APPROVED" />
			<StatusBadge status="ACTIVE" />
			<StatusBadge status="EXPIRED" />
		</Stack>
	),
};
