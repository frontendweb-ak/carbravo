import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, ShieldCheck } from "lucide-react";

import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "./avatar";

const meta = {
	title: "Components/Avatar",
	component: Avatar,
	tags: ["autodocs"],

	parameters: {
		layout: "centered",

		docs: {
			description: {
				component:
					"CarBravo avatar component for user profiles, administrators, employees, and grouped user representations.",
			},
		},
	},

	argTypes: {
		size: {
			control: "select",
			options: ["sm", "default", "lg"],
			description: "Controls the avatar size.",
		},
	},
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Basic                                                                       */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {
		children: <AvatarFallback>AC</AvatarFallback>,
	},
};

export const Small: Story = {
	args: {
		size: "sm",
		children: <AvatarFallback>AC</AvatarFallback>,
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		children: <AvatarFallback>AC</AvatarFallback>,
	},
};

/* -------------------------------------------------------------------------- */
/* Image                                                                       */
/* -------------------------------------------------------------------------- */

export const WithImage: Story = {
	args: {
		children: (
			<>
				<AvatarImage src="https://i.pravatar.cc/150?img=12" alt="Alex Chen" />
				<AvatarFallback>AC</AvatarFallback>
			</>
		),
	},
};

export const ImageWithFallback: Story = {
	args: {
		children: (
			<>
				<AvatarImage src="/invalid-avatar-image.jpg" alt="Alex Chen" />
				<AvatarFallback>AC</AvatarFallback>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* Fallbacks                                                                   */
/* -------------------------------------------------------------------------- */

export const Initials: Story = {
	args: {
		children: <AvatarFallback>AC</AvatarFallback>,
	},
};

export const SingleInitial: Story = {
	args: {
		children: <AvatarFallback>A</AvatarFallback>,
	},
};

/* -------------------------------------------------------------------------- */
/* Badge                                                                       */
/* -------------------------------------------------------------------------- */

export const WithBadge: Story = {
	args: {
		children: (
			<>
				<AvatarFallback>AC</AvatarFallback>
				<AvatarBadge />
			</>
		),
	},
};

export const Verified: Story = {
	args: {
		children: (
			<>
				<AvatarFallback>AC</AvatarFallback>
				<AvatarBadge>
					<Check />
				</AvatarBadge>
			</>
		),
	},
};

export const Admin: Story = {
	args: {
		size: "lg",
		children: (
			<>
				<AvatarFallback>AC</AvatarFallback>
				<AvatarBadge>
					<ShieldCheck />
				</AvatarBadge>
			</>
		),
	},
};

/* -------------------------------------------------------------------------- */
/* All sizes                                                                   */
/* -------------------------------------------------------------------------- */

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar size="sm">
				<AvatarFallback>AC</AvatarFallback>
			</Avatar>

			<Avatar>
				<AvatarFallback>AC</AvatarFallback>
			</Avatar>

			<Avatar size="lg">
				<AvatarFallback>AC</AvatarFallback>
			</Avatar>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Avatar group                                                                */
/* -------------------------------------------------------------------------- */

export const Group: Story = {
	render: () => (
		<AvatarGroup>
			<Avatar>
				<AvatarFallback>AC</AvatarFallback>
			</Avatar>

			<Avatar>
				<AvatarFallback>JS</AvatarFallback>
			</Avatar>

			<Avatar>
				<AvatarFallback>MR</AvatarFallback>
			</Avatar>

			<Avatar>
				<AvatarFallback>SK</AvatarFallback>
			</Avatar>
		</AvatarGroup>
	),
};

export const GroupWithCount: Story = {
	render: () => (
		<AvatarGroup>
			<Avatar>
				<AvatarFallback>AC</AvatarFallback>
			</Avatar>

			<Avatar>
				<AvatarFallback>JS</AvatarFallback>
			</Avatar>

			<Avatar>
				<AvatarFallback>MR</AvatarFallback>
			</Avatar>

			<AvatarGroupCount>+8</AvatarGroupCount>
		</AvatarGroup>
	),
};

/* -------------------------------------------------------------------------- */
/* CarBravo examples                                                           */
/* -------------------------------------------------------------------------- */

export const AdminProfile: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Avatar>
				<AvatarFallback>AC</AvatarFallback>
				<AvatarBadge>
					<Check />
				</AvatarBadge>
			</Avatar>

			<div className="flex flex-col">
				<span className="text-sm font-medium">Alex Chen</span>
				<span className="text-xs text-muted-foreground">Administrator</span>
			</div>
		</div>
	),
};
