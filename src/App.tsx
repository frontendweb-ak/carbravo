import Header from "@/components/layout/Header";
import {
	FormCheckboxGroup,
	FormDateInput,
	FormInput,
	FormRadioGroup,
	FormTextarea,
	FormTimeInput,
	Row,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";
import { AppProviders } from "@/providers/AppProviders";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import "./App.css";
import { FormDateTimeInput } from "./components/ui/forms/form-datetime-input";

const schema = z.object({
	name: z
		.string({
			error: "Name is required",
		})
		.min(2, "Name must be at least 2 characters"),

	email: z.string().email("Enter a valid email address"),

	password: z.string().min(8, "Password must be at least 8 characters"),

	phone: z.string().min(10, "Enter a valid phone number"),

	website: z.string().url("Enter a valid URL").optional().or(z.literal("")),

	amount: z.coerce.number().min(0, "Amount cannot be negative"),

	startDate: z.string().min(1, "Start date is required"),

	startTime: z.string().min(1, "Start time is required"),

	startDateTime: z.string().min(1, "Date and time are required"),
	description: z.string().optional(),

	vehicleTypes: z.array(z.string()).min(1, "Select at least one vehicle type"),
	vehicle: z.string(),
});

type FormValues = z.infer<typeof schema>;

function App() {
	const form = useForm({
		resolver: zodResolver(schema),

		defaultValues: {
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
			vehicleTypes: [],
			vehicle: "bike",
		},

		mode: "all",
	});

	const onSubmit = (formData: FormValues) => {
		console.log("Values", formData);
	};

	return (
		<AppProviders>
			<FormProvider {...form}>
				<Header />

				<main className="mx-auto w-full max-w-3xl space-y-8 p-8">
					<header>
						<h1 className="text-2xl font-semibold">{env.appName}</h1>

						<p className="text-sm text-muted-foreground">
							Environment: {env.environment}
						</p>
					</header>

					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<Row gap={12}>
							<FormInput
								control={form.control}
								name="name"
								label="Program name"
								required
								type="text"
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
						<FormRadioGroup
							control={form.control}
							name="vehicle"
							label="Vehicle type"
							required
							options={[
								{
									value: "car",
									label: "Car",
								},
								{
									value: "bike",
									label: "Bike",
								},
								{
									value: "truck",
									label: "Truck",
								},
							]}
						/>
						<FormCheckboxGroup
							control={form.control}
							name="vehicleTypes"
							label="Vehicle types"
							required
							description="Select the vehicle types this program applies to."
							options={[
								{
									value: "sedan",
									label: "Sedan",
								},
								{
									value: "suv",
									label: "SUV",
								},
								{
									value: "truck",
									label: "Truck",
								},
								{
									value: "coupe",
									label: "Coupe",
								},
								{
									value: "convertible",
									label: "Convertible",
								},
							]}
						/>

						<FormTextarea
							control={form.control}
							name="description"
							label="Program description"
							required
							placeholder="Describe the program..."
							maxLength={500}
							description="Provide a short description of this incentive program."
							rows={5}
						/>

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
				</main>
			</FormProvider>
		</AppProviders>
	);
}

export default App;
