import type { Meta, StoryObj } from "@storybook/react-vite";
import { type Status, StatusBadge } from "./status-badge";

const statuses: Status[] = [
	"draft",
	"review",
	"approved",
	"active",
	"expired",
	"success",
	"warning",
	"destructive",
	"info",
	"neutral",
];

const meta = {
	title: "Components/StatusBadge",
	component: StatusBadge,
	parameters: {
		layout: "centered",
	},
	argTypes: {
		status: {
			control: "select",
			options: statuses,
		},
		size: {
			control: "select",
			options: ["sm", "default", "lg"],
		},
		children: {
			control: "text",
		},
	},
	args: {
		status: "active",
	},
} satisfies Meta<typeof StatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllStatuses: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			{statuses.map((status) => (
				<StatusBadge key={status} status={status} />
			))}
		</div>
	),
};

export const CustomLabel: Story = {
	args: {
		status: "active",
		children: "Currently Active",
	},
};

export const Small: Story = {
	args: {
		status: "approved",
		size: "sm",
	},
};

export const Large: Story = {
	args: {
		status: "warning",
		size: "lg",
	},
};

export const StatusMatrix: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			{(["sm", "default", "lg"] as const).map((size) => (
				<div key={size} className="flex flex-wrap items-center gap-2">
					<span className="w-20 text-sm">{size}</span>

					{statuses.map((status) => (
						<StatusBadge
							key={`${size}-${status}`}
							status={status}
							size={size}
						/>
					))}
				</div>
			))}
		</div>
	),
};
