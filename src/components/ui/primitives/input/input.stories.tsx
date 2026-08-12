import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Search } from "lucide-react";

import { Input } from "./input";

const meta = {
	title: "Components/Input",
	component: Input,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"CarBravo's standard input control for forms, program authoring, search, pricing, dates, contact information, and administrative workflows.",
			},
		},
	},

	argTypes: {
		type: {
			control: "select",
			options: [
				"text",
				"email",
				"password",
				"number",
				"tel",
				"url",
				"search",
				"date",
				"time",
				"datetime-local",
				"month",
				"week",
			],
		},

		size: {
			control: "select",
			options: ["sm", "default", "lg"],
		},

		error: {
			control: "boolean",
		},

		success: {
			control: "boolean",
		},

		disabled: {
			control: "boolean",
		},

		readOnly: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Basic                                                                       */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	args: {
		placeholder: "Enter program name",
	},
};

export const WithValue: Story = {
	args: {
		defaultValue: "Summer Finance Event",
	},
};

/* -------------------------------------------------------------------------- */
/* Sizes                                                                       */
/* -------------------------------------------------------------------------- */

export const Sizes: Story = {
	render: () => (
		<div className="flex w-96 flex-col gap-3">
			<Input size="sm" placeholder="Small input" />
			<Input placeholder="Default input" />
			<Input size="lg" placeholder="Large input" />
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Text                                                                        */
/* -------------------------------------------------------------------------- */

export const Text: Story = {
	args: {
		type: "text",
		placeholder: "Program name",
	},
};

/* -------------------------------------------------------------------------- */
/* Email                                                                       */
/* -------------------------------------------------------------------------- */

export const Email: Story = {
	args: {
		type: "email",
		placeholder: "name@company.com",
	},
};

/* -------------------------------------------------------------------------- */
/* Password                                                                    */
/* -------------------------------------------------------------------------- */

export const Password: Story = {
	args: {
		type: "password",
		placeholder: "Enter password",
	},
};

/* -------------------------------------------------------------------------- */
/* Telephone                                                                   */
/* -------------------------------------------------------------------------- */

export const Telephone: Story = {
	args: {
		type: "tel",
		placeholder: "+1 (555) 123-4567",
	},
};

/* -------------------------------------------------------------------------- */
/* URL                                                                         */
/* -------------------------------------------------------------------------- */

export const URL: Story = {
	args: {
		type: "url",
		placeholder: "https://example.com",
	},
};

/* -------------------------------------------------------------------------- */
/* Search                                                                      */
/* -------------------------------------------------------------------------- */

export const SearchInput: Story = {
	render: () => (
		<div className="relative w-96">
			<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

			<Input
				type="search"
				className="pl-9"
				placeholder="Search programs..."
				aria-label="Search programs"
			/>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Date                                                                        */
/* -------------------------------------------------------------------------- */

export const DateInput: Story = {
	args: {
		type: "date",
		"aria-label": "Program expiration date",
	},
};

/* -------------------------------------------------------------------------- */
/* Time                                                                        */
/* -------------------------------------------------------------------------- */

export const TimeInput: Story = {
	args: {
		type: "time",
		"aria-label": "Program start time",
	},
};

/* -------------------------------------------------------------------------- */
/* Date + Time                                                                 */
/* -------------------------------------------------------------------------- */

export const DateTime: Story = {
	args: {
		type: "datetime-local",
		"aria-label": "Program start date and time",
	},
};

/* -------------------------------------------------------------------------- */
/* Month                                                                       */
/* -------------------------------------------------------------------------- */

export const Month: Story = {
	args: {
		type: "month",
		"aria-label": "Program month",
	},
};

/* -------------------------------------------------------------------------- */
/* Week                                                                        */
/* -------------------------------------------------------------------------- */

export const Week: Story = {
	args: {
		type: "week",
		"aria-label": "Program week",
	},
};

/* -------------------------------------------------------------------------- */
/* States                                                                      */
/* -------------------------------------------------------------------------- */

export const Success: Story = {
	args: {
		defaultValue: "EV Bonus Cash",
		success: true,
	},
};

export const Disabled: Story = {
	args: {
		placeholder: "Disabled input",
		disabled: true,
	},
};

export const ReadOnly: Story = {
	args: {
		defaultValue: "Summer Finance Event",
		readOnly: true,
	},
};

/* -------------------------------------------------------------------------- */
/* Common CarBravo fields                                                      */
/* -------------------------------------------------------------------------- */

export const ProgramName: Story = {
	render: () => (
		<div className="w-96 space-y-2">
			<label
				htmlFor="program-name"
				className="text-sm font-medium text-foreground"
			>
				Program name
			</label>

			<Input id="program-name" placeholder="e.g. Summer Finance Event" />

			<p className="text-xs text-muted-foreground">
				Enter a clear name that identifies the incentive program.
			</p>
		</div>
	),
};

export const EmailField: Story = {
	render: () => (
		<div className="w-96 space-y-2">
			<label
				htmlFor="admin-email"
				className="text-sm font-medium text-foreground"
			>
				Administrator email
			</label>

			<div className="relative">
				<Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

				<Input
					id="admin-email"
					type="email"
					className="pl-9"
					placeholder="admin@carbravo.com"
				/>
			</div>
		</div>
	),
};

export const IncentiveAmount: Story = {
	render: () => (
		<div className="w-96 space-y-2">
			<label
				htmlFor="incentive-amount"
				className="text-sm font-medium text-foreground"
			>
				Incentive amount
			</label>

			<Input
				id="incentive-amount"
				type="number"
				min={0}
				step={100}
				placeholder="1,000"
				aria-describedby="incentive-help"
			/>

			<p id="incentive-help" className="text-xs text-muted-foreground">
				Enter the customer incentive amount in USD.
			</p>
		</div>
	),
};

export const ExpirationDate: Story = {
	render: () => (
		<div className="w-96 space-y-2">
			<label
				htmlFor="expiration-date"
				className="text-sm font-medium text-foreground"
			>
				Expiration date
			</label>

			<Input id="expiration-date" type="date" />

			<p className="text-xs text-muted-foreground">
				The program will no longer be active after this date.
			</p>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* All input types                                                             */
/* -------------------------------------------------------------------------- */

export const AllTypes: Story = {
	render: () => (
		<div className="grid w-160 grid-cols-2 gap-4">
			<div className="space-y-2">
				<label htmlFor="input-text" className="text-sm font-medium">
					Text
				</label>
				<Input id="input-text" placeholder="Program name" />
			</div>

			<div className="space-y-2">
				<label htmlFor="input-email" className="text-sm font-medium">
					Email
				</label>
				<Input id="input-email" type="email" placeholder="admin@carbravo.com" />
			</div>

			<div className="space-y-2">
				<label htmlFor="input-password" className="text-sm font-medium">
					Password
				</label>
				<Input id="input-password" type="password" placeholder="Password" />
			</div>

			<div className="space-y-2">
				<label htmlFor="input-number" className="text-sm font-medium">
					Number
				</label>
				<Input id="input-number" type="number" placeholder="1000" />
			</div>

			<div className="space-y-2">
				<label htmlFor="input-tel" className="text-sm font-medium">
					Phone
				</label>
				<Input id="input-tel" type="tel" placeholder="+1 555 123 4567" />
			</div>

			<div className="space-y-2">
				<label htmlFor="input-url" className="text-sm font-medium">
					URL
				</label>
				<Input id="input-url" type="url" placeholder="https://carbravo.com" />
			</div>

			<div className="space-y-2">
				<label htmlFor="input-date" className="text-sm font-medium">
					Date
				</label>
				<Input id="input-date" type="date" />
			</div>

			<div className="space-y-2">
				<label htmlFor="input-time" className="text-sm font-medium">
					Time
				</label>
				<Input id="input-time" type="time" />
			</div>

			<div className="space-y-2">
				<label htmlFor="input-datetime" className="text-sm font-medium">
					Date & time
				</label>
				<Input id="input-datetime" type="datetime-local" />
			</div>

			<div className="space-y-2">
				<label htmlFor="input-month" className="text-sm font-medium">
					Month
				</label>
				<Input id="input-month" type="month" />
			</div>

			<div className="space-y-2">
				<label htmlFor="input-week" className="text-sm font-medium">
					Week
				</label>
				<Input id="input-week" type="week" />
			</div>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Validation examples                                                         */
/* -------------------------------------------------------------------------- */

export const ValidationStates: Story = {
	render: () => (
		<div className="w-96 space-y-5">
			<div className="space-y-2">
				<label htmlFor="valid-program" className="text-sm font-medium">
					Valid
				</label>

				<Input id="valid-program" defaultValue="EV Bonus Cash" success />

				<p className="text-xs text-success">Program name is available.</p>
			</div>

			<div className="space-y-2">
				<label htmlFor="invalid-program" className="text-sm font-medium">
					Invalid
				</label>

				<Input
					id="invalid-program"
					error
					aria-describedby="invalid-program-error"
				/>

				<p id="invalid-program-error" className="text-xs text-destructive">
					Program name is required.
				</p>
			</div>
		</div>
	),
};
