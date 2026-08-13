import type { Meta, StoryObj } from "@storybook/react-vite";

import { Col } from "./col";

const meta = {
	title: "Layout/Col",
	component: Col,
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
		align: "stretch",
		wrap: false,
		gap: 8,
	},
} satisfies Meta<typeof Col>;

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
/* Centered                                                                   */
/* -------------------------------------------------------------------------- */

export const Centered: Story = {
	args: {
		justify: "center",
		align: "center",
		className: "h-[300px] w-[300px] border border-dashed border-border",
		children: (
			<>
				<div className="rounded-md bg-primary px-4 py-3 text-sm text-primary-foreground">
					First
				</div>

				<div className="rounded-md bg-secondary px-4 py-3 text-sm text-secondary-foreground">
					Second
				</div>

				<div className="rounded-md bg-muted px-4 py-3 text-sm">Third</div>
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
		align: "stretch",
		className: "h-[300px] w-[300px] border border-border p-4",
		children: (
			<>
				<div className="rounded-md bg-muted p-4">
					<p className="text-sm font-semibold">Header</p>
				</div>

				<div className="rounded-md bg-muted p-4">
					<p className="text-sm">Main content</p>
				</div>

				<div className="rounded-md bg-muted p-4">
					<p className="text-sm">Footer</p>
				</div>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Alignment                                                                  */
/* -------------------------------------------------------------------------- */

export const Alignment: Story = {
	render: () => (
		<div className="flex flex-row gap-6">
			{(["start", "center", "end", "stretch"] as const).map((align) => (
				<Col
					key={align}
					align={align}
					gap={8}
					className="h-[180px] w-[150px] rounded-lg border border-dashed border-border p-3"
				>
					<div className="rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground">
						{align}
					</div>

					<div className="rounded-md bg-muted px-3 py-4 text-xs">Content</div>
				</Col>
			))}
		</div>
	),
	args: {
		align: "stretch",
		gap: 8,
	},
};

/* -------------------------------------------------------------------------- */
/* Gap                                                                        */
/* -------------------------------------------------------------------------- */

export const Gap: Story = {
	args: {
		gap: 24,
		children: (
			<>
				<div className="rounded-md bg-primary p-4 text-sm text-primary-foreground">
					First
				</div>

				<div className="rounded-md bg-secondary p-4 text-sm text-secondary-foreground">
					Second
				</div>

				<div className="rounded-md bg-muted p-4 text-sm">Third</div>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Wrap                                                                       */
/* -------------------------------------------------------------------------- */

export const Wrap: Story = {
	args: {
		wrap: true,
		gap: 12,
		className: "h-[250px] w-[300px]",
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
/* Form Layout                                                                */
/* -------------------------------------------------------------------------- */

export const FormLayout: Story = {
	args: {
		gap: 16,
		className: "w-[400px]",
		children: (
			<>
				<div>
					<label htmlFor="name" className="mb-1.5 block text-sm font-medium">
						Full Name
					</label>

					<input
						id="name"
						type="text"
						placeholder="Enter your name"
						className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
					/>
				</div>

				<div>
					<label htmlFor="email" className="mb-1.5 block text-sm font-medium">
						Email
					</label>

					<input
						id="email"
						type="email"
						placeholder="Enter your email"
						className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
					/>
				</div>

				<button
					type="button"
					className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
				>
					Submit
				</button>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Card                                                                       */
/* -------------------------------------------------------------------------- */

export const Card: Story = {
	args: {
		gap: 16,
		className: "w-[350px] rounded-xl border border-border bg-card p-5",
		children: (
			<>
				<div>
					<h2 className="text-lg font-semibold">Vehicle Details</h2>

					<p className="mt-1 text-sm text-muted-foreground">
						Information about the selected vehicle.
					</p>
				</div>

				<div className="rounded-lg bg-muted p-4">
					<p className="text-sm font-medium">2024 Honda City</p>

					<p className="mt-1 text-xs text-muted-foreground">
						Automatic · Petrol · 18,000 km
					</p>
				</div>

				<button
					type="button"
					className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
				>
					View Details
				</button>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Page Section                                                               */
/* -------------------------------------------------------------------------- */

export const PageSection: Story = {
	args: {
		gap: 20,
		className: "w-[500px]",
		children: (
			<>
				<div>
					<h1 className="text-2xl font-bold">Find your next car</h1>

					<p className="mt-1 text-sm text-muted-foreground">
						Browse vehicles that match your preferences.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="h-32 rounded-lg border border-border bg-card" />
					<div className="h-32 rounded-lg border border-border bg-card" />
				</div>
			</>
		),
	},
};
