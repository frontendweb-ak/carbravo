import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "./flex";

const meta = {
	title: "Layout/Flex",
	component: Flex,
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
} satisfies Meta<typeof Flex>;

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
/* Justify                                                                    */
/* -------------------------------------------------------------------------- */

export const Justify: Story = {
	render: () => (
		<div className="flex w-[600px] flex-col gap-4">
			{(["start", "center", "end", "between", "around", "evenly"] as const).map(
				(justify) => (
					<Flex
						key={justify}
						justify={justify}
						align="center"
						className="h-14 rounded-lg border border-dashed border-border px-3"
					>
						{[1, 2, 3].map((item) => (
							<div
								key={item}
								className="rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground"
							>
								{item}
							</div>
						))}
					</Flex>
				),
			)}
		</div>
	),
	args: {
		justify: "start",
		align: "center",
		gap: 8,
	},
};

/* -------------------------------------------------------------------------- */
/* Align                                                                      */
/* -------------------------------------------------------------------------- */

export const Align: Story = {
	render: () => (
		<div className="flex w-[500px] flex-col gap-4">
			{(["start", "center", "end", "stretch", "baseline"] as const).map(
				(align) => (
					<Flex
						key={align}
						align={align}
						justify="between"
						className="h-24 rounded-lg border border-dashed border-border px-4"
					>
						<div className="rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground">
							{align}
						</div>

						<div className="rounded-md bg-secondary px-3 py-6 text-xs text-secondary-foreground">
							Content
						</div>

						<div className="rounded-md bg-muted px-3 py-3 text-xs">Item</div>
					</Flex>
				),
			)}
		</div>
	),
	args: {
		justify: "between",
		align: "center",
		gap: 8,
	},
};

/* -------------------------------------------------------------------------- */
/* Wrap                                                                       */
/* -------------------------------------------------------------------------- */

export const Wrap: Story = {
	args: {
		wrap: true,
		gap: 12,
	},
	render: (args) => (
		<Flex {...args} className="w-[350px]">
			{Array.from({ length: 10 }, (_, index) => (
				<div key={index} className="rounded-md bg-muted px-4 py-3 text-sm">
					Item {index + 1}
				</div>
			))}
		</Flex>
	),
};

/* -------------------------------------------------------------------------- */
/* Gap                                                                        */
/* -------------------------------------------------------------------------- */

export const Gap: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			{[0, 4, 8, 16, 24].map((gap) => (
				<Flex key={gap} gap={gap} align="center">
					<span className="w-12 text-xs text-muted-foreground">{gap}px</span>

					<div className="size-8 rounded bg-primary" />
					<div className="size-8 rounded bg-secondary" />
					<div className="size-8 rounded bg-muted" />
				</Flex>
			))}
		</div>
	),
	args: {
		gap: 8,
	},
};

/* -------------------------------------------------------------------------- */
/* String Gap                                                                 */
/* -------------------------------------------------------------------------- */

export const StringGap: Story = {
	args: {
		gap: "1.5rem",
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
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export const Header: Story = {
	args: {
		justify: "between",
		align: "center",
		gap: 16,
		children: (
			<>
				<div>
					<h2 className="text-base font-semibold">CarBravo</h2>

					<p className="text-xs text-muted-foreground">Vehicle marketplace</p>
				</div>

				<nav>
					<Flex gap={20} align="center">
						<a
							href="#vehicles"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							Vehicles
						</a>

						<a
							href="#mentors"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							Mentors
						</a>

						<button
							type="button"
							className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
						>
							Sign in
						</button>
					</Flex>
				</nav>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Card Actions                                                               */
/* -------------------------------------------------------------------------- */

export const CardActions: Story = {
	args: {
		justify: "between",
		align: "center",
		gap: 8,
		children: (
			<>
				<div>
					<p className="text-sm font-medium">Vehicle Details</p>

					<p className="text-xs text-muted-foreground">Updated today</p>
				</div>

				<Flex gap={8}>
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
				</Flex>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Responsive Example                                                         */
/* -------------------------------------------------------------------------- */

export const ResponsiveExample: Story = {
	args: {
		wrap: true,
		gap: 16,
	},
	render: (args) => (
		<Flex {...args} className="w-[500px] rounded-lg border border-border p-4">
			<div className="min-w-[200px] flex-1 rounded-md bg-muted p-4">
				<p className="text-sm font-medium">Content</p>
			</div>

			<div className="min-w-[200px] flex-1 rounded-md bg-muted p-4">
				<p className="text-sm font-medium">Sidebar</p>
			</div>
		</Flex>
	),
};
