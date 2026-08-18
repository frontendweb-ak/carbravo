// src/components/ui/primitives/button/button.stories.tsx

import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";

const meta = {
	title: "UI/Button",
	component: Button,

	argTypes: {
		variant: {
			control: "select",
			options: [
				"primary",
				"secondary",
				"outline",
				"ghost",
				"danger",
				"success",
			],
		},

		color: {
			control: "select",
			options: [
				"inherit",
				"primary",
				"secondary",
				"success",
				"error",
				"info",
				"warning",
			],
		},

		size: {
			control: "select",
			options: ["small", "medium", "large"],
		},

		loading: {
			control: "boolean",
		},

		disabled: {
			control: "boolean",
		},

		fullWidth: {
			control: "boolean",
		},

		startIcon: {
			control: false,
		},

		endIcon: {
			control: false,
		},
	},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Basic                                                                       */
/* -------------------------------------------------------------------------- */

export const Playground: Story = {
	args: {
		children: "Button",
		variant: "primary",
	},
};

export const Primary: Story = {
	args: {
		children: "Save",
		variant: "primary",
	},
};

export const Secondary: Story = {
	args: {
		children: "Cancel",
		variant: "secondary",
	},
};

export const Outline: Story = {
	args: {
		children: "Edit",
		variant: "outline",
	},
};

export const Ghost: Story = {
	args: {
		children: "Learn More",
		variant: "ghost",
	},
};

export const Danger: Story = {
	args: {
		children: "Delete",
		variant: "danger",
	},
};

export const Success: Story = {
	args: {
		children: "Approve",
		variant: "success",
	},
};

/* -------------------------------------------------------------------------- */
/* Icons                                                                       */
/* -------------------------------------------------------------------------- */

export const StartIcon: Story = {
	args: {
		children: "Add Program",
		variant: "primary",
		startIcon: <AddIcon />,
	},
};

export const EndIcon: Story = {
	args: {
		children: "Continue",
		variant: "primary",
		endIcon: <ArrowForwardIcon />,
	},
};

export const StartAndEndIcons: Story = {
	args: {
		children: "Save Program",
		variant: "primary",
		startIcon: <SaveIcon />,
		endIcon: <ArrowForwardIcon />,
	},
};

export const EditWithIcon: Story = {
	args: {
		children: "Edit Program",
		variant: "outline",
		startIcon: <EditIcon />,
	},
};

export const DeleteWithIcon: Story = {
	args: {
		children: "Delete Program",
		variant: "danger",
		startIcon: <DeleteIcon />,
	},
};

export const ApproveWithIcon: Story = {
	args: {
		children: "Approve",
		variant: "success",
		startIcon: <CheckIcon />,
	},
};

/* -------------------------------------------------------------------------- */
/* Loading                                                                     */
/* -------------------------------------------------------------------------- */

export const Loading: Story = {
	args: {
		children: "Saving...",
		variant: "primary",
		loading: true,
	},
};

export const LoadingWithStartIcon: Story = {
	args: {
		children: "Saving...",
		variant: "primary",
		loading: true,
		startIcon: <SaveIcon />,
	},
};

/* -------------------------------------------------------------------------- */
/* States                                                                      */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
	args: {
		children: "Disabled",
		variant: "primary",
		disabled: true,
	},
};

export const Small: Story = {
	args: {
		children: "Small",
		variant: "primary",
		size: "small",
		startIcon: <AddIcon />,
	},
};

export const Medium: Story = {
	args: {
		children: "Medium",
		variant: "primary",
		size: "medium",
		startIcon: <AddIcon />,
	},
};

export const Large: Story = {
	args: {
		children: "Large",
		variant: "primary",
		size: "large",
		startIcon: <AddIcon />,
	},
};

export const FullWidth: Story = {
	args: {
		children: "Continue",
		variant: "primary",
		fullWidth: true,
		endIcon: <ArrowForwardIcon />,
	},
};
