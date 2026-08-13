import type { Meta, StoryObj } from "@storybook/react-vite";

import { Center } from "./center";

const meta = {
	title: "Layout/Center",
	component: Center,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		gap: {
			control: "text",
		},
		wrap: {
			control: "boolean",
		},
		justify: {
			control: "select",
			options: ["start", "center", "end", "between", "around", "evenly"],
		},
		align: {
			control: "select",
			options: ["start", "center", "end", "stretch", "baseline"],
		},
	},
	args: {
		justify: "center",
		align: "center",
		gap: 8,
		wrap: false,
	},
} satisfies Meta<typeof Center>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {
		children: (
			<div className="rounded-lg bg-primary px-6 py-4 text-sm font-medium text-primary-foreground">
				Centered content
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Icon / Content                                                             */
/* -------------------------------------------------------------------------- */

export const Icon: Story = {
	args: {
		children: (
			<div className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
				✓
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Multiple Items                                                             */
/* -------------------------------------------------------------------------- */

export const MultipleItems: Story = {
	args: {
		gap: 12,
		children: (
			<>
				<div className="rounded-md bg-primary px-4 py-3 text-sm text-primary-foreground">
					One
				</div>

				<div className="rounded-md bg-secondary px-4 py-3 text-sm text-secondary-foreground">
					Two
				</div>

				<div className="rounded-md bg-muted px-4 py-3 text-sm">Three</div>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Full Area                                                                  */
/* -------------------------------------------------------------------------- */

export const FullArea: Story = {
	args: {
		className:
			"flex min-h-[300px] w-[500px] rounded-xl border border-dashed border-border bg-muted/30",
		children: (
			<div className="text-center">
				<h2 className="text-lg font-semibold">Empty State</h2>

				<p className="mt-1 text-sm text-muted-foreground">
					Everything is centered inside the container.
				</p>
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Loading                                                                     */
/* -------------------------------------------------------------------------- */

export const Loading: Story = {
	args: {
		className: "min-h-[200px] w-[400px] rounded-lg border border-border",
		children: (
			<div className="flex flex-col items-center gap-3">
				<div className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />

				<span className="text-sm text-muted-foreground">Loading...</span>
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

export const EmptyState: Story = {
	args: {
		className: "min-h-[250px] w-[450px] rounded-xl border border-border",
		gap: 8,
		children: (
			<>
				<div className="flex size-12 items-center justify-center rounded-full bg-muted text-xl">
					?
				</div>

				<h2 className="text-base font-semibold">No vehicles found</h2>

				<p className="max-w-xs text-center text-sm text-muted-foreground">
					Try changing your filters or search criteria.
				</p>

				<button
					type="button"
					className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
				>
					Clear Filters
				</button>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Card Content                                                               */
/* -------------------------------------------------------------------------- */

export const CardContent: Story = {
	args: {
		className:
			"min-h-[250px] w-[350px] rounded-xl border border-border bg-card p-6",
		children: (
			<>
				<div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
					✓
				</div>

				<div className="text-center">
					<h2 className="text-base font-semibold">Success</h2>

					<p className="mt-1 text-sm text-muted-foreground">
						Your changes have been saved successfully.
					</p>
				</div>

				<button
					type="button"
					className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
				>
					Continue
				</button>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Responsive                                                                 */
/* -------------------------------------------------------------------------- */

export const Responsive: Story = {
	args: {
		wrap: true,
		gap: 16,
		className:
			"min-h-[250px] w-full max-w-[600px] rounded-xl border border-border p-6",
		children: (
			<>
				<div className="size-24 rounded-lg bg-primary" />
				<div className="size-24 rounded-lg bg-secondary" />
				<div className="size-24 rounded-lg bg-muted" />
			</>
		),
	},
};
