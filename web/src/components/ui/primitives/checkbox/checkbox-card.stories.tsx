// src/components/ui/checkbox-card/checkbox-card.stories.tsx

import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { CheckboxCard } from "./checkbox-card";

const meta = {
	title: "UI/Form/CheckboxCard",
	component: CheckboxCard,

	argTypes: {
		label: {
			control: "text",
		},

		description: {
			control: "text",
		},

		checked: {
			control: "boolean",
		},

		disabled: {
			control: "boolean",
		},
	},

	args: {
		label: "VIN Exception",
		description: "Conditional — appears below the line, not against net price.",
	},
} satisfies Meta<typeof CheckboxCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Playground                                                                  */
/* -------------------------------------------------------------------------- */

export const Playground: Story = {
	render: (args) => {
		const [checked, setChecked] = useState(false);

		return <CheckboxCard {...args} checked={checked} onChange={setChecked} />;
	},
};

/* -------------------------------------------------------------------------- */
/* States                                                                      */
/* -------------------------------------------------------------------------- */

export const Unchecked: Story = {
	args: {
		label: "VIN Exception",
		description: "Conditional — appears below the line, not against net price.",
		checked: false,
	},
};

export const Checked: Story = {
	args: {
		label: "Top of Deal",
		description: "Program headlines the deal stack.",
		checked: true,
	},
};

export const Disabled: Story = {
	args: {
		label: "No add-ons",
		description: "Cannot be combined with dealer add-ons.",
		checked: false,
		disabled: true,
	},
};

export const DisabledChecked: Story = {
	args: {
		label: "No add-ons",
		description: "Cannot be combined with dealer add-ons.",
		checked: true,
		disabled: true,
	},
};

export const WithoutDescription: Story = {
	args: {
		label: "Top of Deal",
		checked: false,
	},
};

/* -------------------------------------------------------------------------- */
/* Flags Example                                                               */
/* -------------------------------------------------------------------------- */

export const FlagsExample: Story = {
	render: () => (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(3, minmax(280px, 1fr))",
				gap: 16,
			}}
		>
			<CheckboxCard
				label="VIN Exception"
				description="Conditional — appears below the line, not against net price."
			/>

			<CheckboxCard
				label="Top of Deal"
				description="Program headlines the deal stack."
			/>

			<CheckboxCard
				label="No add-ons"
				description="Cannot be combined with dealer add-ons."
			/>
		</div>
	),
};
