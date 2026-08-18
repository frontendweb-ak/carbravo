// src/components/ui/primitives/icon-button/icon-button.stories.tsx

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconButton } from "./icon-button";

const meta = {
	title: "UI/IconButton",
	component: IconButton,

	argTypes: {
		color: {
			control: "select",
			options: [
				"default",
				"inherit",
				"primary",
				"secondary",
				"error",
				"info",
				"success",
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

		edge: {
			control: "select",
			options: [false, "start", "end"],
		},

		children: {
			control: false,
		},
	},
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		children: <AddIcon />,
		"aria-label": "Add",
		color: "primary",
	},
};

export const Add: Story = {
	args: {
		children: <AddIcon />,
		"aria-label": "Add",
		color: "primary",
	},
};

export const Edit: Story = {
	args: {
		children: <EditIcon />,
		"aria-label": "Edit",
		color: "primary",
	},
};

export const Delete: Story = {
	args: {
		children: <DeleteIcon />,
		"aria-label": "Delete",
		color: "error",
	},
};

export const Save: Story = {
	args: {
		children: <SaveIcon />,
		"aria-label": "Save",
		color: "primary",
	},
};

export const Refresh: Story = {
	args: {
		children: <RefreshIcon />,
		"aria-label": "Refresh",
		color: "primary",
	},
};

export const Settings: Story = {
	args: {
		children: <SettingsIcon />,
		"aria-label": "Settings",
		color: "default",
	},
};

export const More: Story = {
	args: {
		children: <MoreVertIcon />,
		"aria-label": "More options",
		color: "default",
	},
};

export const Back: Story = {
	args: {
		children: <ArrowBackIcon />,
		"aria-label": "Go back",
		color: "default",
	},
};

export const Small: Story = {
	args: {
		children: <EditIcon />,
		"aria-label": "Edit",
		size: "small",
		color: "primary",
	},
};

export const Medium: Story = {
	args: {
		children: <EditIcon />,
		"aria-label": "Edit",
		size: "medium",
		color: "primary",
	},
};

export const Large: Story = {
	args: {
		children: <EditIcon />,
		"aria-label": "Edit",
		size: "large",
		color: "primary",
	},
};

export const Disabled: Story = {
	args: {
		children: <DeleteIcon />,
		"aria-label": "Delete",
		color: "error",
		disabled: true,
	},
};

export const Loading: Story = {
	args: {
		children: <SaveIcon />,
		"aria-label": "Saving",
		color: "primary",
		loading: true,
	},
};

export const LoadingDisabled: Story = {
	args: {
		children: <RefreshIcon />,
		"aria-label": "Refreshing",
		color: "primary",
		loading: true,
		disabled: true,
	},
};
