import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card";

const meta = {
	title: "Components/Card",
	component: Card,
	parameters: {
		layout: "centered",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["default", "sm"],
		},
	},
	args: {
		size: "default",
	},
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Card {...args} className="w-[380px]">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>
					This is a short description for the card.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<p>
					Card content goes here. You can place forms, text, images, or other
					components inside the content area.
				</p>
			</CardContent>

			<CardFooter>
				<p className="text-sm text-muted-foreground">Card footer</p>
			</CardFooter>
		</Card>
	),
};

export const Small: Story = {
	args: {
		size: "sm",
	},
	render: (args) => (
		<Card {...args} className="w-[380px]">
			<CardHeader>
				<CardTitle>Small Card</CardTitle>
				<CardDescription>
					This card uses the small spacing variant.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<p>Content with reduced card spacing.</p>
			</CardContent>

			<CardFooter>
				<p className="text-sm text-muted-foreground">Footer</p>
			</CardFooter>
		</Card>
	),
};

export const WithAction: Story = {
	render: () => (
		<Card className="w-[380px]">
			<CardHeader>
				<CardTitle>Account Settings</CardTitle>
				<CardDescription>Manage your account preferences.</CardDescription>

				<CardAction>
					<button
						type="button"
						className="text-sm font-medium text-primary hover:underline"
					>
						Edit
					</button>
				</CardAction>
			</CardHeader>

			<CardContent>
				<p>Update your profile, password, and notification preferences.</p>
			</CardContent>
		</Card>
	),
};

export const WithBorderedHeader: Story = {
	render: () => (
		<Card className="w-[380px]">
			<CardHeader className="border-b">
				<CardTitle>Profile</CardTitle>
				<CardDescription>Your profile information.</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="space-y-2">
					<p className="font-medium">John Doe</p>
					<p className="text-sm text-muted-foreground">john@example.com</p>
				</div>
			</CardContent>
		</Card>
	),
};

export const ContentOnly: Story = {
	render: () => (
		<Card className="w-[380px]">
			<CardContent className="pt-(--card-spacing)">
				<p>A simple card containing only content.</p>
			</CardContent>
		</Card>
	),
};

export const FullExample: Story = {
	render: () => (
		<Card className="w-[420px]">
			<CardHeader>
				<CardTitle>Project Overview</CardTitle>
				<CardDescription>
					Track the current status of your project.
				</CardDescription>

				<CardAction>
					<button
						type="button"
						className="text-sm font-medium text-primary hover:underline"
					>
						View
					</button>
				</CardAction>
			</CardHeader>

			<CardContent>
				<div className="space-y-4">
					<div>
						<p className="text-sm text-muted-foreground">Project</p>
						<p className="font-medium">AIM Platform</p>
					</div>

					<div>
						<p className="text-sm text-muted-foreground">Status</p>
						<p className="font-medium">In Progress</p>
					</div>

					<div>
						<p className="text-sm text-muted-foreground">Progress</p>
						<div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
							<div className="h-full w-[65%] rounded-full bg-primary" />
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="justify-between">
				<span className="text-sm text-muted-foreground">
					Last updated today
				</span>

				<button
					type="button"
					className="text-sm font-medium text-primary hover:underline"
				>
					Open Project
				</button>
			</CardFooter>
		</Card>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Card size="default" className="w-[380px]">
				<CardHeader>
					<CardTitle>Default Size</CardTitle>
					<CardDescription>Default card spacing.</CardDescription>
				</CardHeader>

				<CardContent>
					<p>Default card content.</p>
				</CardContent>
			</Card>

			<Card size="sm" className="w-[380px]">
				<CardHeader>
					<CardTitle>Small Size</CardTitle>
					<CardDescription>Reduced card spacing.</CardDescription>
				</CardHeader>

				<CardContent>
					<p>Small card content.</p>
				</CardContent>
			</Card>
		</div>
	),
};
