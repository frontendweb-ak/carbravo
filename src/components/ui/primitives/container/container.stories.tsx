import type { Meta, StoryObj } from "@storybook/react-vite";

import { Container } from "./container";

const meta = {
	title: "Layout/Container",
	component: Container,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg", "xl", "2xl", "full"],
		},
		centered: {
			control: "boolean",
		},
	},
	args: {
		size: "2xl",
		centered: true,
	},
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {
		children: (
			<div className="rounded-lg border border-dashed border-border p-6">
				<p className="text-sm font-medium">Default container</p>

				<p className="mt-1 text-sm text-muted-foreground">
					2xl width with centered layout.
				</p>
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Sizes                                                                      */
/* -------------------------------------------------------------------------- */

export const Sizes: Story = {
	render: () => (
		<div className="space-y-4">
			{(["sm", "md", "lg", "xl", "2xl", "full"] as const).map((size) => (
				<Container key={size} size={size}>
					<div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
						<p className="text-sm font-medium">Container: {size}</p>

						<p className="text-xs text-muted-foreground">
							Resize the viewport to see the max-width behavior.
						</p>
					</div>
				</Container>
			))}
		</div>
	),
	args: {
		size: "2xl",
	},
};

/* -------------------------------------------------------------------------- */
/* Small                                                                      */
/* -------------------------------------------------------------------------- */

export const Small: Story = {
	args: {
		size: "sm",
		children: (
			<div className="rounded-lg border border-border bg-card p-6">
				<h2 className="font-semibold">Small Container</h2>

				<p className="mt-2 text-sm text-muted-foreground">
					Maximum width: 2xl.
				</p>
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Medium                                                                     */
/* -------------------------------------------------------------------------- */

export const Medium: Story = {
	args: {
		size: "md",
		children: (
			<div className="rounded-lg border border-border bg-card p-6">
				<h2 className="font-semibold">Medium Container</h2>

				<p className="mt-2 text-sm text-muted-foreground">
					Maximum width: 4xl.
				</p>
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Large                                                                      */
/* -------------------------------------------------------------------------- */

export const Large: Story = {
	args: {
		size: "lg",
		children: (
			<div className="rounded-lg border border-border bg-card p-6">
				<h2 className="font-semibold">Large Container</h2>

				<p className="mt-2 text-sm text-muted-foreground">
					Maximum width: 5xl.
				</p>
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Extra Large                                                                */
/* -------------------------------------------------------------------------- */

export const ExtraLarge: Story = {
	args: {
		size: "xl",
		children: (
			<div className="rounded-lg border border-border bg-card p-6">
				<h2 className="font-semibold">Extra Large Container</h2>

				<p className="mt-2 text-sm text-muted-foreground">
					Maximum width: 6xl.
				</p>
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* 2XL                                                                        */
/* -------------------------------------------------------------------------- */

export const TwoXL: Story = {
	args: {
		size: "2xl",
		children: (
			<div className="rounded-lg border border-border bg-card p-6">
				<h2 className="font-semibold">2XL Container</h2>

				<p className="mt-2 text-sm text-muted-foreground">
					Maximum width: 1360px.
				</p>
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Full                                                                       */
/* -------------------------------------------------------------------------- */

export const Full: Story = {
	args: {
		size: "full",
		children: (
			<div className="rounded-lg border border-border bg-card p-6">
				<h2 className="font-semibold">Full Container</h2>

				<p className="mt-2 text-sm text-muted-foreground">
					No maximum width is applied.
				</p>
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Not Centered                                                              */
/* -------------------------------------------------------------------------- */

export const NotCentered: Story = {
	args: {
		size: "lg",
		centered: false,
		children: (
			<div className="rounded-lg border border-dashed border-border p-6">
				<p className="text-sm font-medium">Non-centered container</p>

				<p className="mt-1 text-sm text-muted-foreground">
					The container keeps its max-width but does not apply mx-auto.
				</p>
			</div>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Page Layout Example                                                        */
/* -------------------------------------------------------------------------- */

export const PageLayout: Story = {
	render: () => (
		<div className="min-h-screen bg-background">
			<header className="border-b border-border">
				<Container
					size="2xl"
					className="flex h-16 items-center justify-between"
				>
					<span className="font-semibold">CarBravo</span>

					<nav className="flex items-center gap-6 text-sm text-muted-foreground">
						<a href="#home">Home</a>
						<a href="#vehicles">Vehicles</a>
						<a href="#about">About</a>
					</nav>
				</Container>
			</header>

			<main>
				<Container size="lg" className="py-12">
					<div className="space-y-4">
						<h1 className="text-3xl font-bold">Find your next vehicle</h1>

						<p className="max-w-2xl text-muted-foreground">
							A responsive page layout using the Container primitive.
						</p>

						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<div className="h-32 rounded-lg border border-border bg-card" />
							<div className="h-32 rounded-lg border border-border bg-card" />
							<div className="h-32 rounded-lg border border-border bg-card" />
						</div>
					</div>
				</Container>
			</main>
		</div>
	),
	args: {
		size: "2xl",
		centered: true,
	},
};
