import type { Meta, StoryObj } from "@storybook/react-vite";

import { Row } from "./row";

const meta = {
	title: "Layout/Row",
	component: Row,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		justify: {
			control: "select",
			options: ["start", "center", "end", "between", "around", "evenly"],
		},
		align: {
			control: "select",
			options: ["start", "center", "end", "stretch", "baseline"],
		},
		wrap: {
			control: "boolean",
		},
		gap: {
			control: "text",
		},
	},
	args: {
		justify: "start",
		align: "center",
		wrap: false,
		gap: 8,
	},
} satisfies Meta<typeof Row>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {
		children: (
			<>
				<div className="rounded-md bg-primary px-4 py-3 text-sm text-primary-foreground">
					Item 1
				</div>

				<div className="rounded-md bg-secondary px-4 py-3 text-sm text-secondary-foreground">
					Item 2
				</div>

				<div className="rounded-md bg-muted px-4 py-3 text-sm">Item 3</div>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Center                                                                     */
/* -------------------------------------------------------------------------- */

export const Center: Story = {
	args: {
		justify: "center",
		align: "center",
		children: (
			<>
				<div className="rounded-md bg-primary px-4 py-3 text-sm text-primary-foreground">
					First
				</div>

				<div className="rounded-md bg-secondary px-4 py-3 text-sm text-secondary-foreground">
					Second
				</div>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Space Between                                                              */
/* -------------------------------------------------------------------------- */

export const SpaceBetween: Story = {
	args: {
		justify: "between",
		align: "center",
		className: "w-[500px]",
		children: (
			<>
				<div>
					<p className="text-sm font-semibold">CarBravo</p>

					<p className="text-xs text-muted-foreground">Vehicle marketplace</p>
				</div>

				<button
					type="button"
					className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
				>
					View Vehicles
				</button>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Alignment                                                                  */
/* -------------------------------------------------------------------------- */

export const Alignment: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			{(["start", "center", "end", "stretch", "baseline"] as const).map(
				(align) => (
					<Row
						key={align}
						align={align}
						gap={8}
						className="h-20 w-[400px] rounded-lg border border-dashed border-border px-3"
					>
						<div className="rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground">
							{align}
						</div>

						<div className="rounded-md bg-muted px-3 py-5 text-xs">Content</div>
					</Row>
				),
			)}
		</div>
	),
	args: {
		align: "center",
		gap: 8,
	},
};

/* -------------------------------------------------------------------------- */
/* Wrapping                                                                   */
/* -------------------------------------------------------------------------- */

export const Wrap: Story = {
	args: {
		wrap: true,
		gap: 12,
		className: "w-[350px]",
		children: (
			<>
				{Array.from({ length: 8 }, (_, index) => (
					<div key={index} className="rounded-md bg-muted px-4 py-3 text-sm">
						Item {index + 1}
					</div>
				))}
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export const Navigation: Story = {
	args: {
		align: "center",
		gap: 20,
		children: (
			<>
				<a href="#home" className="text-sm font-medium hover:text-primary">
					Home
				</a>

				<a href="#vehicles" className="text-sm font-medium hover:text-primary">
					Vehicles
				</a>

				<a href="#about" className="text-sm font-medium hover:text-primary">
					About
				</a>

				<button
					type="button"
					className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
				>
					Sign In
				</button>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Actions                                                                    */
/* -------------------------------------------------------------------------- */

export const Actions: Story = {
	args: {
		justify: "end",
		align: "center",
		gap: 8,
		children: (
			<>
				<button
					type="button"
					className="rounded-md border border-border px-3 py-2 text-sm"
				>
					Cancel
				</button>

				<button
					type="button"
					className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
				>
					Save
				</button>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Card Header                                                                */
/* -------------------------------------------------------------------------- */

export const CardHeader: Story = {
	args: {
		justify: "between",
		align: "center",
		gap: 16,
		className: "w-[500px] rounded-lg border border-border bg-card p-4",
		children: (
			<>
				<div>
					<h2 className="text-base font-semibold">Vehicle Details</h2>

					<p className="text-sm text-muted-foreground">Last updated today</p>
				</div>

				<button
					type="button"
					className="rounded-md border border-border px-3 py-2 text-sm"
				>
					Edit
				</button>
			</>
		),
	},
};
