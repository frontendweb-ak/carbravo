import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box } from "./box";

const meta = {
	title: "Layout/Box",
	component: Box,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		asChild: {
			control: "boolean",
		},
	},
	args: {
		asChild: false,
	},
} satisfies Meta<typeof Box>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {
		children: (
			<div className="rounded-lg border border-border bg-card p-6">
				<p className="text-sm font-medium">Box component</p>

				<p className="mt-1 text-sm text-muted-foreground">
					A simple layout primitive.
				</p>
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* With ClassName                                                             */
/* -------------------------------------------------------------------------- */

export const WithClassName: Story = {
	args: {
		className: "flex h-32 w-64 items-center justify-center rounded-lg bg-muted",
		children: <span className="text-sm font-medium">Styled Box</span>,
	},
};

/* -------------------------------------------------------------------------- */
/* Flex                                                                       */
/* -------------------------------------------------------------------------- */

export const Flex: Story = {
	args: {
		className: "flex items-center gap-4",
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
/* Grid                                                                       */
/* -------------------------------------------------------------------------- */

export const Grid: Story = {
	args: {
		className: "grid grid-cols-3 gap-4",
		children: (
			<>
				<div className="rounded-md border border-border p-4">Item 1</div>

				<div className="rounded-md border border-border p-4">Item 2</div>

				<div className="rounded-md border border-border p-4">Item 3</div>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* As Child                                                                   */
/* -------------------------------------------------------------------------- */

export const AsChild: Story = {
	args: {
		asChild: true,
		children: (
			<a
				href="#box"
				className="inline-flex rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
			>
				Box rendered as link
			</a>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* As Child Button                                                            */
/* -------------------------------------------------------------------------- */

export const AsChildButton: Story = {
	args: {
		asChild: true,
		children: (
			<button
				type="button"
				className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			>
				Box rendered as button
			</button>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Nested Boxes                                                               */
/* -------------------------------------------------------------------------- */

export const Nested: Story = {
	args: {
		className: "flex flex-col gap-4 rounded-lg border p-4",
		children: (
			<>
				<Box className="rounded-md bg-muted p-4">
					<span className="text-sm">Outer content</span>
				</Box>

				<Box className="rounded-md border border-dashed p-4">
					<span className="text-sm">Nested content</span>
				</Box>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Card Layout                                                                */
/* -------------------------------------------------------------------------- */

export const CardLayout: Story = {
	args: {
		className:
			"w-[400px] overflow-hidden rounded-xl border border-border bg-card",
		children: (
			<>
				<Box className="border-b border-border p-5">
					<h2 className="text-base font-semibold">Profile</h2>

					<p className="mt-1 text-sm text-muted-foreground">
						Manage your profile information.
					</p>
				</Box>

				<Box className="space-y-4 p-5">
					<div>
						<p className="text-sm font-medium">John Doe</p>

						<p className="text-sm text-muted-foreground">john@example.com</p>
					</div>

					<button
						type="button"
						className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
					>
						Edit Profile
					</button>
				</Box>
			</>
		),
	},
};
