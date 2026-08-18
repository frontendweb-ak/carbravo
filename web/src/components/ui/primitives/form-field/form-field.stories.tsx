// src/components/ui/forms/form-field.stories.tsx

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { FormField } from "./form-field";

const meta = {
	title: "UI/FormField",
	component: FormField,

	argTypes: {
		label: {
			control: "text",
		},

		required: {
			control: "boolean",
		},

		description: {
			control: "text",
		},

		error: {
			control: "text",
		},

		disabled: {
			control: "boolean",
		},

		rightElement: {
			control: false,
		},

		children: {
			control: false,
		},
	},
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Basic                                                                       */
/* -------------------------------------------------------------------------- */

export const Playground: Story = {
	args: {
		label: "Program name",
		required: true,
		children: <TextField fullWidth placeholder="e.g. Summer Finance Event" />,
	},
};

/* -------------------------------------------------------------------------- */
/* Required                                                                    */
/* -------------------------------------------------------------------------- */

export const Required: Story = {
	args: {
		label: "Program name",
		required: true,
		children: <TextField fullWidth placeholder="e.g. Summer Finance Event" />,
	},
};

export const Optional: Story = {
	args: {
		label: "Program description",
		children: <TextField fullWidth placeholder="Enter description" />,
	},
};

/* -------------------------------------------------------------------------- */
/* Description                                                                 */
/* -------------------------------------------------------------------------- */

export const WithDescription: Story = {
	args: {
		label: "Program name",
		required: true,
		description: "Consumer-facing name shown to dealers.",
		children: <TextField fullWidth placeholder="e.g. Summer Finance Event" />,
	},
};

/* -------------------------------------------------------------------------- */
/* Error                                                                       */
/* -------------------------------------------------------------------------- */

export const WithError: Story = {
	args: {
		label: "Program name",
		required: true,
		error: "Program name is required.",
		children: (
			<TextField fullWidth error placeholder="e.g. Summer Finance Event" />
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Right element                                                               */
/* -------------------------------------------------------------------------- */

export const WithRightElement: Story = {
	args: {
		label: "Program number",
		required: true,
		rightElement: (
			<Button size="small" variant="text">
				Generate
			</Button>
		),
		children: <TextField fullWidth placeholder="4821" />,
	},
};

/* -------------------------------------------------------------------------- */
/* Right element + required                                                   */
/* -------------------------------------------------------------------------- */

export const RequiredWithAction: Story = {
	args: {
		label: "Incentive codes",
		required: true,
		rightElement: (
			<Button size="small" variant="text">
				Generate
			</Button>
		),
		children: <TextField fullWidth placeholder="GMF-APR-2027-06" />,
	},
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                    */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
	args: {
		label: "Program name",
		required: true,
		disabled: true,
		children: <TextField fullWidth disabled placeholder="Disabled field" />,
	},
};

/* -------------------------------------------------------------------------- */
/* Complete examples                                                           */
/* -------------------------------------------------------------------------- */

export const ProgramName: Story = {
	args: {
		label: "Program name",
		required: true,
		children: <TextField fullWidth placeholder="e.g. Summer Finance Event" />,
	},
};

export const ProgramNumber: Story = {
	args: {
		label: "Program number",
		required: true,
		rightElement: (
			<Button size="small" variant="text">
				Auto-generate
			</Button>
		),
		children: (
			<TextField
				fullWidth
				value="4821"
				slotProps={{
					input: {
						readOnly: true,
					},
				}}
			/>
		),
	},
};
export const FormGridExample: Story = {
	args: {
		label: "Program name",
		children: <TextField />,
	},
	render: () => (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: 20,
			}}
		>
			<FormField label="Program name" required>
				<TextField fullWidth placeholder="e.g. Summer Finance Event" />
			</FormField>

			<FormField label="Program number" required>
				<TextField fullWidth placeholder="4821" />
			</FormField>

			<FormField label="Incentive codes" required>
				<TextField fullWidth placeholder="GMF-APR-2027-06" />
			</FormField>

			<FormField
				label="Country"
				required
				rightElement={<Button size="small">Change</Button>}
			>
				<TextField
					fullWidth
					value="United States"
					slotProps={{
						input: {
							readOnly: true,
						},
					}}
				/>
			</FormField>
		</div>
	),
};
