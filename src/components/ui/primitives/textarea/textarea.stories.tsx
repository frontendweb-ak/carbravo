import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "./textarea";

const meta = {
	title: "Components/Textarea",
	component: Textarea,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "default", "lg"],
		},
		error: {
			control: "boolean",
		},
		success: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},

		placeholder: {
			control: "text",
		},
	},
	args: {
		size: "default",
		error: false,
		success: false,
		disabled: false,
		placeholder: "Enter your message...",
	},
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {};

/* -------------------------------------------------------------------------- */
/* Small                                                                      */
/* -------------------------------------------------------------------------- */

export const Small: Story = {
	args: {
		size: "sm",
		placeholder: "Small textarea...",
	},
};

/* -------------------------------------------------------------------------- */
/* Large                                                                      */
/* -------------------------------------------------------------------------- */

export const Large: Story = {
	args: {
		size: "lg",
		placeholder: "Large textarea...",
	},
};

/* -------------------------------------------------------------------------- */
/* With Value                                                                 */
/* -------------------------------------------------------------------------- */

export const WithValue: Story = {
	args: {
		value:
			"This is an example of text inside the textarea. It demonstrates how longer content is displayed.",
	},
};

/* -------------------------------------------------------------------------- */
/* Error                                                                      */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Success                                                                    */
/* -------------------------------------------------------------------------- */

export const Success: Story = {
	args: {
		success: true,
		value: "Your feedback has been submitted successfully.",
	},
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                   */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
	args: {
		disabled: true,
		value: "This textarea is disabled.",
	},
};

/* -------------------------------------------------------------------------- */
/* Required                                                                   */
/* -------------------------------------------------------------------------- */

export const Required: Story = {
	args: {
		required: true,
		placeholder: "Tell us about yourself...",
	},
};

/* -------------------------------------------------------------------------- */
/* Read Only                                                                  */
/* -------------------------------------------------------------------------- */

export const ReadOnly: Story = {
	args: {
		readOnly: true,
		value: "This content can be read but cannot be edited by the user.",
	},
};

/* -------------------------------------------------------------------------- */
/* Sizes                                                                      */
/* -------------------------------------------------------------------------- */

export const Sizes: Story = {
	render: () => (
		<div className="flex w-[400px] flex-col gap-4">
			<Textarea size="sm" placeholder="Small textarea..." />

			<Textarea size="default" placeholder="Default textarea..." />

			<Textarea size="lg" placeholder="Large textarea..." />
		</div>
	),
	args: {
		size: "default",
	},
};

/* -------------------------------------------------------------------------- */
/* States                                                                     */
/* -------------------------------------------------------------------------- */

export const States: Story = {
	render: () => (
		<div className="flex w-[400px] flex-col gap-4">
			<Textarea placeholder="Default state..." />

			<Textarea error placeholder="Error state..." />

			<Textarea success placeholder="Success state..." />

			<Textarea disabled placeholder="Disabled state..." />
		</div>
	),
	args: {
		size: "default",
	},
};

/* -------------------------------------------------------------------------- */
/* Character Limit                                                             */
/* -------------------------------------------------------------------------- */

export const CharacterLimit: Story = {
	args: {
		maxLength: 200,
		placeholder: "Write your description...",
		"aria-describedby": "character-count",
	},
	render: (args) => (
		<div className="w-[400px]">
			<Textarea {...args} />

			<div
				id="character-count"
				className="mt-1.5 flex justify-end text-xs text-muted-foreground"
			>
				0 / 200
			</div>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Form Example                                                               */
/* -------------------------------------------------------------------------- */

export const FormExample: Story = {
	render: () => (
		<div className="w-[450px] space-y-2">
			<div className="flex items-center justify-between">
				<label htmlFor="feedback" className="text-sm font-medium">
					Feedback
				</label>

				<span className="text-xs text-muted-foreground">Optional</span>
			</div>

			<Textarea id="feedback" placeholder="Tell us what you think..." />

			<p className="text-xs text-muted-foreground">
				Your feedback helps us improve the product.
			</p>
		</div>
	),
	args: {
		size: "default",
	},
};

/* -------------------------------------------------------------------------- */
/* Error Form                                                                 */
/* -------------------------------------------------------------------------- */

export const ErrorForm: Story = {
	render: () => (
		<div className="w-[450px] space-y-2">
			<label htmlFor="description" className="text-sm font-medium">
				Description
			</label>

			<Textarea
				id="description"
				error
				placeholder="Describe the issue..."
				aria-describedby="description-error"
			/>

			<p id="description-error" className="text-sm text-destructive">
				Description is required.
			</p>
		</div>
	),
	args: {
		size: "default",
	},
};
