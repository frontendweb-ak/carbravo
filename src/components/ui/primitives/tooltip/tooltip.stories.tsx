import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

const meta = {
	title: "Components/Tooltip",
	component: Tooltip,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {},
	render: () => (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
					Hover me
				</TooltipTrigger>

				<TooltipContent>This is a tooltip.</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	),
};

/* -------------------------------------------------------------------------- */
/* Bottom                                                                      */
/* -------------------------------------------------------------------------- */

export const Bottom: Story = {
	args: {},
	render: () => (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
					Hover me
				</TooltipTrigger>

				<TooltipContent side="bottom">Tooltip on the bottom.</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	),
};

/* -------------------------------------------------------------------------- */
/* Left                                                                       */
/* -------------------------------------------------------------------------- */

export const Left: Story = {
	args: {},
	render: () => (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
					Hover me
				</TooltipTrigger>

				<TooltipContent side="left">Tooltip on the left.</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	),
};

/* -------------------------------------------------------------------------- */
/* Right                                                                      */
/* -------------------------------------------------------------------------- */

export const Right: Story = {
	args: {},
	render: () => (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
					Hover me
				</TooltipTrigger>

				<TooltipContent side="right">Tooltip on the right.</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	),
};

/* -------------------------------------------------------------------------- */
/* Positions                                                                  */
/* -------------------------------------------------------------------------- */

export const Positions: Story = {
	args: {},
	render: () => (
		<TooltipProvider>
			<div className="flex items-center gap-8">
				<Tooltip>
					<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
						Top
					</TooltipTrigger>

					<TooltipContent side="top">Top tooltip</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
						Right
					</TooltipTrigger>

					<TooltipContent side="right">Right tooltip</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
						Bottom
					</TooltipTrigger>

					<TooltipContent side="bottom">Bottom tooltip</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
						Left
					</TooltipTrigger>

					<TooltipContent side="left">Left tooltip</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};

/* -------------------------------------------------------------------------- */
/* Long Content                                                               */
/* -------------------------------------------------------------------------- */

export const LongContent: Story = {
	args: {},
	render: () => (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
					Hover for details
				</TooltipTrigger>

				<TooltipContent className="max-w-xs">
					This tooltip contains more detailed information about the action. It
					demonstrates how longer content wraps inside the tooltip.
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	),
};

/* -------------------------------------------------------------------------- */
/* Custom Delay                                                               */
/* -------------------------------------------------------------------------- */

export const CustomDelay: Story = {
	args: {},
	render: () => (
		<TooltipProvider delay={500}>
			<Tooltip>
				<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
					Hover and wait
				</TooltipTrigger>

				<TooltipContent>This tooltip has a 500ms delay.</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	),
};

/* -------------------------------------------------------------------------- */
/* With Icon                                                                  */
/* -------------------------------------------------------------------------- */

export const WithIcon: Story = {
	args: {},
	render: () => (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger
					aria-label="More information"
					className="flex size-8 items-center justify-center rounded-full border border-border text-sm"
				>
					?
				</TooltipTrigger>

				<TooltipContent>More information about this option.</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	),
};

/* -------------------------------------------------------------------------- */
/* With Keyboard Shortcut                                                     */
/* -------------------------------------------------------------------------- */

export const WithKeyboardShortcut: Story = {
	args: {},
	render: () => (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
					Save
				</TooltipTrigger>

				<TooltipContent>
					<span>Save changes</span>

					<kbd
						data-slot="kbd"
						className="rounded border border-background/20 px-1.5 py-0.5 text-[10px]"
					>
						Ctrl + S
					</kbd>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	),
};

/* -------------------------------------------------------------------------- */
/* Multiple Tooltips                                                          */
/* -------------------------------------------------------------------------- */

export const Multiple: Story = {
	args: {},
	render: () => (
		<TooltipProvider>
			<div className="flex items-center gap-3">
				<Tooltip>
					<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
						Edit
					</TooltipTrigger>

					<TooltipContent>Edit item</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
						Delete
					</TooltipTrigger>

					<TooltipContent>Delete item</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger className="rounded-md border border-border px-3 py-2 text-sm">
						Share
					</TooltipTrigger>

					<TooltipContent>Share item</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};
