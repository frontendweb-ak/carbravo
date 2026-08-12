import {
	FormDateInput,
	FormDateTimeInput,
	FormInput,
	FormTextarea,
	FormTimeInput,
	Row,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormCheckbox } from "./form-checkbox";

const meta = {
	title: "Components/Form",
	tags: ["autodocs"],

	parameters: {
		layout: "centered",

		docs: {
			description: {
				component:
					"Form components built on React Hook Form. Each component provides label, required state, validation error, description, disabled state, and field integration.",
			},
		},
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Schema                                                                     */
/* -------------------------------------------------------------------------- */

const schema = z.object({
	name: z.string().min(2, "Program name must be at least 2 characters"),

	email: z.string().email("Enter a valid email address"),

	password: z.string().min(8, "Password must be at least 8 characters"),

	phone: z.string().min(10, "Enter a valid phone number"),

	website: z.string().url("Enter a valid URL").optional().or(z.literal("")),

	amount: z.coerce.number().min(0, "Amount cannot be negative"),

	startDate: z.string().min(1, "Start date is required"),

	startTime: z.string().min(1, "Start time is required"),

	startDateTime: z.string().min(1, "Date and time are required"),

	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(500, "Description cannot exceed 500 characters"),

	terms: z.boolean(),

	marketing: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

/* -------------------------------------------------------------------------- */
/* Default values                                                             */
/* -------------------------------------------------------------------------- */

const defaultValues: FormValues = {
	name: "",
	email: "",
	password: "",
	phone: "",
	website: "",
	amount: 0,
	startDate: "",
	startTime: "",
	startDateTime: "",
	description: "",
	terms: false,
	marketing: false,
};

/* -------------------------------------------------------------------------- */
/* Complete Form                                                              */
/* -------------------------------------------------------------------------- */

export const CompleteForm: Story = {
	render: () => {
		const form = useForm({
			resolver: zodResolver(schema),
			defaultValues,
			mode: "all",
		});

		const onSubmit = (values: FormValues) => {
			console.log("Form values:", values);
		};

		return (
			<div className="w-[720px] max-w-full">
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Basic inputs */}

					<Row gap={12}>
						<FormInput
							control={form.control}
							name="name"
							label="Program name"
							required
							placeholder="Enter program name"
						/>

						<FormInput
							control={form.control}
							name="email"
							label="Email address"
							required
							type="email"
							placeholder="admin@carbravo.com"
						/>
					</Row>

					<FormInput
						control={form.control}
						name="password"
						label="Password"
						required
						type="password"
						placeholder="Enter password"
					/>

					<FormInput
						control={form.control}
						name="phone"
						label="Phone number"
						required
						type="tel"
						placeholder="+1 555 123 4567"
					/>

					<FormInput
						control={form.control}
						name="website"
						label="Website"
						type="url"
						placeholder="https://carbravo.com"
					/>

					<FormInput
						control={form.control}
						name="amount"
						label="Amount"
						required
						type="number"
						min={0}
						step={100}
						placeholder="1,000"
					/>

					{/* Date / time */}

					<Row gap={12}>
						<FormDateInput
							control={form.control}
							name="startDate"
							label="Start date"
							required
						/>

						<FormTimeInput
							control={form.control}
							name="startTime"
							label="Start time"
							required
						/>
					</Row>

					<FormDateTimeInput
						control={form.control}
						name="startDateTime"
						label="Start date and time"
						required
					/>

					{/* Textarea */}

					<FormTextarea
						control={form.control}
						name="description"
						label="Program description"
						required
						placeholder="Describe the program..."
						description="Provide a short description of this incentive program."
						maxLength={500}
						rows={5}
					/>

					{/* Actions */}

					<div className="flex justify-end gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => form.reset()}
						>
							Reset
						</Button>

						<Button type="submit" loading={form.formState.isSubmitting}>
							Save Program
						</Button>
					</div>
				</form>
			</div>
		);
	},
};

/* -------------------------------------------------------------------------- */
/* Basic Inputs                                                               */
/* -------------------------------------------------------------------------- */

export const Inputs: Story = {
	render: () => {
		const form = useForm<FormValues>({
			defaultValues,
		});

		return (
			<div className="w-96 space-y-6">
				<FormInput
					control={form.control}
					name="name"
					label="Program name"
					required
					placeholder="Enter program name"
				/>

				<FormInput
					control={form.control}
					name="email"
					label="Email address"
					required
					type="email"
					placeholder="admin@carbravo.com"
				/>

				<FormInput
					control={form.control}
					name="password"
					label="Password"
					required
					type="password"
					placeholder="Enter password"
				/>

				<FormInput
					control={form.control}
					name="phone"
					label="Phone number"
					placeholder="+1 555 123 4567"
				/>

				<FormInput
					control={form.control}
					name="website"
					label="Website"
					type="url"
					placeholder="https://carbravo.com"
				/>

				<FormInput
					control={form.control}
					name="amount"
					label="Amount"
					type="number"
					min={0}
					step={100}
					placeholder="1,000"
				/>
			</div>
		);
	},
};

/* -------------------------------------------------------------------------- */
/* Date and Time                                                              */
/* -------------------------------------------------------------------------- */

export const DateAndTime: Story = {
	render: () => {
		const form = useForm<FormValues>({
			defaultValues,
		});

		return (
			<div className="w-96 space-y-6">
				<FormDateInput
					control={form.control}
					name="startDate"
					label="Start date"
					required
				/>

				<FormTimeInput
					control={form.control}
					name="startTime"
					label="Start time"
					required
				/>

				<FormDateTimeInput
					control={form.control}
					name="startDateTime"
					label="Start date and time"
					required
				/>
			</div>
		);
	},
};

/* -------------------------------------------------------------------------- */
/* Textarea                                                                   */
/* -------------------------------------------------------------------------- */

export const Description: Story = {
	render: () => {
		const form = useForm<FormValues>({
			defaultValues,
		});

		return (
			<div className="w-96">
				<FormTextarea
					control={form.control}
					name="description"
					label="Program description"
					required
					placeholder="Describe the program..."
					description="Provide a short description of this incentive program."
					maxLength={500}
					rows={5}
				/>
			</div>
		);
	},
};

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

export const Validation: Story = {
	render: () => {
		const form = useForm({
			resolver: zodResolver(schema),
			defaultValues,
			mode: "all",
		});

		return (
			<div className="w-96">
				<form
					onSubmit={form.handleSubmit((values) => console.log(values))}
					className="space-y-6"
				>
					<FormInput
						control={form.control}
						name="name"
						label="Program name"
						required
						placeholder="Enter program name"
					/>

					<FormInput
						control={form.control}
						name="email"
						label="Email address"
						required
						type="email"
						placeholder="admin@carbravo.com"
					/>

					<FormDateInput
						control={form.control}
						name="startDate"
						label="Start date"
						required
					/>

					<FormTextarea
						control={form.control}
						name="description"
						label="Program description"
						required
						maxLength={500}
						placeholder="Describe the program..."
					/>

					<Button type="submit">Submit</Button>
				</form>
			</div>
		);
	},
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                   */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
	render: () => {
		const form = useForm<FormValues>({
			defaultValues: {
				...defaultValues,
				name: "CarBravo Incentive Program",
				email: "admin@carbravo.com",
				startDate: "2026-08-12",
				startTime: "09:30",
			},
		});

		return (
			<div className="w-96 space-y-6">
				<FormInput
					control={form.control}
					name="name"
					label="Program name"
					disabled
				/>

				<FormInput
					control={form.control}
					name="email"
					label="Email address"
					disabled
				/>

				<FormDateInput
					control={form.control}
					name="startDate"
					label="Start date"
					disabled
				/>

				<FormTimeInput
					control={form.control}
					name="startTime"
					label="Start time"
					disabled
				/>

				<FormTextarea
					control={form.control}
					name="description"
					label="Program description"
					disabled
					maxLength={500}
				/>
			</div>
		);
	},
};

/* -------------------------------------------------------------------------- */
/* Description / Helper Text                                                  */
/* -------------------------------------------------------------------------- */

export const WithDescription: Story = {
	render: () => {
		const form = useForm<FormValues>({
			defaultValues,
		});

		return (
			<div className="w-96 space-y-6">
				<FormInput
					control={form.control}
					name="name"
					label="Program name"
					required
					placeholder="Enter program name"
					description="This name will be displayed to customers."
				/>

				<FormDateInput
					control={form.control}
					name="startDate"
					label="Start date"
					required
					description="The date when this program becomes active."
				/>

				<FormTimeInput
					control={form.control}
					name="startTime"
					label="Start time"
					description="Use your local business timezone."
				/>

				<FormTextarea
					control={form.control}
					name="description"
					label="Program description"
					description="Provide a short description of this incentive program."
					maxLength={500}
				/>
			</div>
		);
	},
};
export const Checkbox: Story = {
	render: () => {
		const form = useForm<FormValues>({
			defaultValues,
		});

		return (
			<div className="w-96 space-y-6">
				<FormCheckbox
					control={form.control}
					name="terms"
					label="Accept terms and conditions"
				/>

				<FormCheckbox
					control={form.control}
					name="marketing"
					label="Send me marketing emails"
					description="You can change this preference later."
				/>
			</div>
		);
	},
};

/* -------------------------------------------------------------------------- */
/* Checkbox Required                                                          */
/* -------------------------------------------------------------------------- */

export const CheckboxRequired: Story = {
	render: () => {
		const form = useForm<FormValues>({
			defaultValues,
		});

		return (
			<div className="w-96">
				<FormCheckbox
					control={form.control}
					name="terms"
					label="Accept terms and conditions"
					required
					description="You must accept the terms before continuing."
				/>
			</div>
		);
	},
};
/* -------------------------------------------------------------------------- */
/* Two Column Form                                                            */
/* -------------------------------------------------------------------------- */

export const TwoColumn: Story = {
	render: () => {
		const form = useForm<FormValues>({
			defaultValues,
		});

		return (
			<div className="w-[720px] max-w-full">
				<form className="space-y-6">
					<Row gap={12}>
						<FormInput
							control={form.control}
							name="name"
							label="Program name"
							required
							placeholder="Enter program name"
						/>

						<FormInput
							control={form.control}
							name="email"
							label="Email address"
							required
							type="email"
							placeholder="admin@carbravo.com"
						/>
					</Row>

					<Row gap={12}>
						<FormDateInput
							control={form.control}
							name="startDate"
							label="Start date"
							required
						/>

						<FormTimeInput
							control={form.control}
							name="startTime"
							label="Start time"
							required
						/>
					</Row>

					<FormInput
						control={form.control}
						name="amount"
						label="Amount"
						type="number"
						placeholder="1,000"
					/>

					<FormTextarea
						control={form.control}
						name="description"
						label="Program description"
						maxLength={500}
						rows={5}
					/>
				</form>
			</div>
		);
	},
};
