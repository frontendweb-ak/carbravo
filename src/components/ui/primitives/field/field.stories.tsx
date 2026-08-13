import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldTitle,
} from "./field";

const meta = {
	title: "Components/Field",
	component: Field,
	parameters: {
		layout: "centered",
	},
	argTypes: {
		orientation: {
			control: "select",
			options: ["vertical", "horizontal", "responsive"],
		},
		invalid: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},
	},
	args: {
		orientation: "vertical",
		invalid: false,
		disabled: false,
	},
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<div className="w-[400px]">
			<Field {...args}>
				<FieldLabel htmlFor="name">Name</FieldLabel>

				<input
					id="name"
					type="text"
					placeholder="Enter your name"
					className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
				/>

				<FieldDescription>
					Your full name as it appears on your profile.
				</FieldDescription>
			</Field>
		</div>
	),
};

export const Horizontal: Story = {
	args: {
		orientation: "horizontal",
	},
	render: (args) => (
		<div className="w-[500px]">
			<Field {...args}>
				<FieldLabel htmlFor="email">Email</FieldLabel>

				<input
					id="email"
					type="email"
					placeholder="you@example.com"
					className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
				/>
			</Field>
		</div>
	),
};

export const Responsive: Story = {
	args: {
		orientation: "responsive",
	},
	render: (args) => (
		<div className="w-full max-w-[600px]">
			<FieldGroup>
				<Field {...args}>
					<FieldLabel htmlFor="first-name">First name</FieldLabel>

					<input
						id="first-name"
						type="text"
						placeholder="John"
						className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
					/>
				</Field>

				<Field {...args}>
					<FieldLabel htmlFor="last-name">Last name</FieldLabel>

					<input
						id="last-name"
						type="text"
						placeholder="Doe"
						className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
					/>
				</Field>
			</FieldGroup>
		</div>
	),
};

export const WithContent: Story = {
	render: () => (
		<div className="w-[400px]">
			<Field>
				<FieldLabel htmlFor="username">Username</FieldLabel>

				<FieldContent>
					<input
						id="username"
						type="text"
						placeholder="@username"
						className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
					/>

					<FieldDescription>Your username must be unique.</FieldDescription>
				</FieldContent>
			</Field>
		</div>
	),
};

export const WithTitle: Story = {
	render: () => (
		<div className="w-[400px]">
			<Field>
				<FieldTitle>Notifications</FieldTitle>

				<FieldDescription>
					Choose how you want to receive notifications.
				</FieldDescription>
			</Field>
		</div>
	),
};

export const Invalid: Story = {
	args: {
		invalid: true,
	},
	render: (args) => (
		<div className="w-[400px]">
			<Field {...args}>
				<FieldLabel htmlFor="invalid-email">Email</FieldLabel>

				<input
					id="invalid-email"
					type="email"
					defaultValue="invalid-email"
					aria-invalid="true"
					className="h-10 w-full rounded-md border border-destructive bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-destructive/30"
				/>

				<FieldError>Please enter a valid email address.</FieldError>
			</Field>
		</div>
	),
};

export const MultipleErrors: Story = {
	render: () => (
		<div className="w-[400px]">
			<Field invalid>
				<FieldLabel htmlFor="password">Password</FieldLabel>

				<input
					id="password"
					type="password"
					aria-invalid="true"
					className="h-10 w-full rounded-md border border-destructive bg-background px-3 text-sm outline-none"
				/>

				<FieldError
					errors={[
						{ message: "Password is required." },
						{ message: "Password must contain 8 characters." },
						{ message: "Password must contain a number." },
					]}
				/>
			</Field>
		</div>
	),
};

export const DuplicateErrors: Story = {
	render: () => (
		<div className="w-[400px]">
			<Field invalid>
				<FieldLabel htmlFor="duplicate">Username</FieldLabel>

				<input
					id="duplicate"
					type="text"
					aria-invalid="true"
					className="h-10 w-full rounded-md border border-destructive bg-background px-3 text-sm"
				/>

				<FieldError
					errors={[
						{ message: "Username is already taken." },
						{ message: "Username is already taken." },
						{ message: "Username is required." },
					]}
				/>
			</Field>
		</div>
	),
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	render: (args) => (
		<div className="w-[400px]">
			<Field {...args}>
				<FieldLabel htmlFor="disabled-field">Email</FieldLabel>

				<input
					id="disabled-field"
					type="email"
					disabled
					placeholder="Disabled field"
					className="h-10 w-full rounded-md border border-input bg-muted px-3 text-sm"
				/>

				<FieldDescription>This field is currently disabled.</FieldDescription>
			</Field>
		</div>
	),
};

export const FieldGroupExample: Story = {
	render: () => (
		<div className="w-[500px]">
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="first-name">First name</FieldLabel>

					<input
						id="first-name"
						type="text"
						placeholder="John"
						className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
					/>
				</Field>

				<Field>
					<FieldLabel htmlFor="last-name">Last name</FieldLabel>

					<input
						id="last-name"
						type="text"
						placeholder="Doe"
						className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
					/>
				</Field>

				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>

					<input
						id="email"
						type="email"
						placeholder="john@example.com"
						className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
					/>
				</Field>
			</FieldGroup>
		</div>
	),
};

export const FieldSetExample: Story = {
	render: () => (
		<div className="w-[500px]">
			<FieldSet>
				<FieldLegend>Personal Information</FieldLegend>

				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="full-name">Full name</FieldLabel>

						<input
							id="full-name"
							type="text"
							placeholder="John Doe"
							className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
						/>
					</Field>

					<Field>
						<FieldLabel htmlFor="phone">Phone</FieldLabel>

						<input
							id="phone"
							type="tel"
							placeholder="+91 98765 43210"
							className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
						/>
					</Field>
				</FieldGroup>
			</FieldSet>
		</div>
	),
};

export const LegendAsLabel: Story = {
	render: () => (
		<div className="w-[500px]">
			<FieldSet>
				<FieldLegend variant="label">Preferred Contact</FieldLegend>

				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="contact-email">Email</FieldLabel>

						<input
							id="contact-email"
							type="email"
							placeholder="you@example.com"
							className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
						/>
					</Field>
				</FieldGroup>
			</FieldSet>
		</div>
	),
};

export const Separator: Story = {
	render: () => (
		<div className="w-[500px]">
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="email-login">Email</FieldLabel>

					<input
						id="email-login"
						type="email"
						placeholder="you@example.com"
						className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
					/>
				</Field>

				<FieldSeparator>or</FieldSeparator>

				<Field>
					<FieldLabel htmlFor="phone-login">Phone</FieldLabel>

					<input
						id="phone-login"
						type="tel"
						placeholder="+91 98765 43210"
						className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
					/>
				</Field>
			</FieldGroup>
		</div>
	),
};

export const SeparatorWithoutContent: Story = {
	render: () => (
		<div className="w-[500px]">
			<FieldGroup>
				<Field>
					<FieldLabel>First section</FieldLabel>
					<div className="h-10 rounded-md border border-input" />
				</Field>

				<FieldSeparator />

				<Field>
					<FieldLabel>Second section</FieldLabel>
					<div className="h-10 rounded-md border border-input" />
				</Field>
			</FieldGroup>
		</div>
	),
};

export const CompleteForm: Story = {
	render: () => (
		<div className="w-[500px]">
			<FieldSet>
				<FieldLegend>Account Information</FieldLegend>

				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="complete-name">Name</FieldLabel>

						<FieldContent>
							<input
								id="complete-name"
								type="text"
								placeholder="John Doe"
								className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
							/>

							<FieldDescription>Use your legal name.</FieldDescription>
						</FieldContent>
					</Field>

					<Field>
						<FieldLabel htmlFor="complete-email">Email</FieldLabel>

						<FieldContent>
							<input
								id="complete-email"
								type="email"
								placeholder="john@example.com"
								className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
							/>

							<FieldDescription>
								We'll use this email for account notifications.
							</FieldDescription>
						</FieldContent>
					</Field>

					<Field invalid>
						<FieldLabel htmlFor="complete-password">Password</FieldLabel>

						<FieldContent>
							<input
								id="complete-password"
								type="password"
								aria-invalid="true"
								className="h-10 w-full rounded-md border border-destructive bg-background px-3 text-sm"
							/>

							<FieldError>Password must be at least 8 characters.</FieldError>
						</FieldContent>
					</Field>
				</FieldGroup>
			</FieldSet>
		</div>
	),
};
