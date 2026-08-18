// src/components/ui/card/card.stories.tsx

import { Button } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "./card";

const meta = {
	title: "UI/Card",
	component: Card,
	parameters: {
		layout: "centered",
	},
	args: {
		children: "Card content",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["outlined", "elevation", "flat"],
		},
		padding: {
			control: "select",
			options: ["none", "sm", "md", "lg"],
		},
		clickable: {
			control: "boolean",
		},
		selected: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHeader: Story = {
	args: {
		title: "Program details",
		subtitle: "Configure the basic program information.",
		children: "Card content goes here.",
	},
};

export const WithHeaderAction: Story = {
	args: {
		title: "Program details",
		subtitle: "Configure the basic program information.",
		headerAction: (
			<Button size="small" variant="outlined">
				Edit
			</Button>
		),
		children: "Card content goes here.",
	},
};

export const WithFooter: Story = {
	args: {
		title: "Program details",
		children: "Card content goes here.",
		footer: (
			<>
				<Button size="small">Cancel</Button>
				<Button size="small" variant="contained">
					Save
				</Button>
			</>
		),
	},
};

export const Flat: Story = {
	args: {
		variant: "flat",
		title: "Flat card",
		children: "No border or elevation.",
	},
};

export const Elevated: Story = {
	args: {
		variant: "elevation",
		title: "Elevated card",
		children: "Card using MUI elevation.",
	},
};

export const NoPadding: Story = {
	args: {
		padding: "none",
		children: "No internal card padding.",
	},
};

export const SmallPadding: Story = {
	args: {
		padding: "sm",
		children: "Small padding.",
	},
};

export const LargePadding: Story = {
	args: {
		padding: "lg",
		children: "Large padding.",
	},
};

export const Clickable: Story = {
	args: {
		clickable: true,
		title: "Clickable card",
		children: "Hover and click this card.",
		onClick: () => {
			console.log("Card clicked");
		},
	},
};

export const Selected: Story = {
	args: {
		selected: true,
		title: "Selected card",
		children: "This card is currently selected.",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		title: "Disabled card",
		children: "This card is disabled.",
	},
};

export const CompleteExample: Story = {
	args: {
		variant: "outlined",
		padding: "md",
		title: "Program",
		subtitle: "Summer Finance Event",
		headerAction: (
			<Button size="small" variant="outlined">
				Edit
			</Button>
		),
		children: "Program configuration content.",
		footer: (
			<>
				<Button size="small">Cancel</Button>
				<Button size="small" variant="contained">
					Save
				</Button>
			</>
		),
	},
};
