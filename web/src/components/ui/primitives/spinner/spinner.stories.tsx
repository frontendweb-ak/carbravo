import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "./spinner";

const meta = {
	title: "Components/Spinner",
	component: Spinner,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		className: {
			control: "text",
		},
		"aria-label": {
			control: "text",
		},
	},
	args: {
		"aria-label": "Loading",
	},
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {};

/* -------------------------------------------------------------------------- */
/* Sizes                                                                      */
/* -------------------------------------------------------------------------- */

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-6">
			<Spinner className="size-3" />
			<Spinner className="size-4" />
			<Spinner className="size-5" />
			<Spinner className="size-6" />
			<Spinner className="size-8" />
		</div>
	),
	args: {
		"aria-label": "Loading",
	},
};

/* -------------------------------------------------------------------------- */
/* Small                                                                      */
/* -------------------------------------------------------------------------- */

export const Small: Story = {
	args: {
		className: "size-3",
	},
};

/* -------------------------------------------------------------------------- */
/* Large                                                                      */
/* -------------------------------------------------------------------------- */

export const Large: Story = {
	args: {
		className: "size-8",
	},
};

/* -------------------------------------------------------------------------- */
/* Extra Large                                                                */
/* -------------------------------------------------------------------------- */

export const ExtraLarge: Story = {
	args: {
		className: "size-12",
	},
};

/* -------------------------------------------------------------------------- */
/* Custom Label                                                              */
/* -------------------------------------------------------------------------- */

export const CustomLabel: Story = {
	args: {
		"aria-label": "Loading vehicles",
	},
};

/* -------------------------------------------------------------------------- */
/* Button Loading                                                             */
/* -------------------------------------------------------------------------- */

export const ButtonLoading: Story = {
	render: () => (
		<button
			type="button"
			disabled
			className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground opacity-70"
		>
			<Spinner className="size-4" />
			Loading...
		</button>
	),
	args: {
		"aria-label": "Loading",
	},
};

/* -------------------------------------------------------------------------- */
/* Page Loading                                                               */
/* -------------------------------------------------------------------------- */

export const PageLoading: Story = {
	render: () => (
		<div className="flex min-h-[200px] w-[400px] items-center justify-center">
			<div className="flex flex-col items-center gap-3">
				<Spinner className="size-8" />

				<span className="text-sm text-muted-foreground">Loading...</span>
			</div>
		</div>
	),
	args: {
		"aria-label": "Loading page",
	},
};

/* -------------------------------------------------------------------------- */
/* Card Loading                                                               */
/* -------------------------------------------------------------------------- */

export const CardLoading: Story = {
	render: () => (
		<div className="flex h-[180px] w-[320px] items-center justify-center rounded-xl border border-border bg-card">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Spinner />
				<span>Loading data...</span>
			</div>
		</div>
	),
	args: {
		"aria-label": "Loading data",
	},
};
