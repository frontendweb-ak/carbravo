import {
	Button,
	Container,
	FilterTabs,
	FormCheckboxGroup,
	FormChoiceChipGroup,
	FormDateInput,
	FormInput,
	FormRadioGroup,
	FormSelect,
	FormSwitch,
	FormTextarea,
	FormTimeInput,
	Row,
} from "@/components/ui";
import { env } from "@/config/env";
import { AppProviders } from "@/providers/AppProviders";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import "./App.css";

import { useState } from "react";
import Header from "./components/layout/header";
import { FormDateTimeInput } from "./components/ui/forms/form-datetime-input";
import { ProgramSectionSidebar } from "./features/program";
import { PROGRAM_SIDE_MENU } from "./features/program/constants";
import { VehicleFilterBuilder } from "./features/vehicle";

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
	active: z.boolean(),
	programType: z.string().min(1),
	creditTiers: z.array(z.string()).min(1, "Select at least one credit tier"),
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
			active: false,
			programType: "apr",
			creditTiers: [],
		},

		mode: "all",
	});

	const onSubmit = (formData: FormValues) => {
		console.log("Values", formData);
	};

	const value = useWatch({ control: form.control, name: "vehicle" });
	console.log("Vs", value);
	type ProgramStatus =
		| "all"
		| "draft"
		| "review"
		| "approved"
		| "active"
		| "expired";

	const [filter, setFilter] = useState<ProgramStatus>("all");
	// const filteredPrograms = [].filter((program) => {
	// 	if (status === "all") {
	// 		return true;
	// 	}

	// 	return program.status === status;
	// });

	const [modelYears, setModelYears] = useState<string[]>([]);
	const [makes, setMakes] = useState<string[]>([]);
	const [models, setModels] = useState<string[]>([]);
	const [fuelTypes, setFuelTypes] = useState<string[]>([]);
	const [segments, setSegments] = useState<string[]>([]);
	const [activeSection, setActiveSection] = useState("");
	return (
		<AppProviders>
			<FormProvider {...form}>
				<Header />

				<Container className="space-y-8 p-8">
					<ProgramSectionSidebar
						sections={PROGRAM_SIDE_MENU}
						activeSection={activeSection}
						onSectionChange={setActiveSection}
						completion={0}
					/>
					<header>
						<h1 className="text-2xl font-semibold">{env.appName}</h1>
						<p className="text-sm text-muted-foreground">
							Environment: {env.environment}
						</p>
					</header>
					<FilterTabs
						value={filter}
						onValueChange={setFilter}
						items={[
							{
								value: "all",
								label: "All",
								count: 7,
							},
							{
								value: "draft",
								label: "Draft",
								count: 2,
							},
							{
								value: "review",
								label: "Review",
								count: 1,
							},
							{
								value: "approved",
								label: "Approved",
								count: 1,
							},
							{
								value: "active",
								label: "Active",
								count: 2,
							},
							{
								value: "expired",
								label: "Expired",
								count: 1,
							},
						]}
					/>
					<VehicleFilterBuilder
						columns={[
							{
								id: "model-year",
								title: "Model year",

								options: [
									{ id: "2027", name: "2027" },
									{ id: "2026", name: "2026" },
									{ id: "2025", name: "2025" },
									{ id: "2024", name: "2024" },
									{ id: "2023", name: "2023" },
								],

								value: modelYears,
								onValueChange: setModelYears,

								getValue: (item) => item.id,
								getLabel: (item) => item.name,

								anyLabel: "* Any Model year",

								searchPlaceholder: "Search model year...",
							},

							{
								id: "make",
								title: "Make",

								options: [
									{ id: "chevrolet", name: "Chevrolet" },
									{ id: "buick", name: "Buick" },
									{ id: "gmc", name: "GMC" },
									{ id: "cadillac", name: "Cadillac" },
									{ id: "ford", name: "Ford" },
								],

								value: makes,
								onValueChange: setMakes,

								getValue: (item) => item.id,
								getLabel: (item) => item.name,

								anyLabel: "* Any Make",

								searchPlaceholder: "Search make...",
							},

							{
								id: "model",
								title: "Model",

								options: [
									{ id: "acadia", name: "Acadia" },
									{ id: "accord", name: "Accord" },
									{ id: "altima", name: "Altima" },
									{ id: "ariya", name: "Ariya" },
									{ id: "arteon", name: "Arteon" },
								],

								value: models,
								onValueChange: setModels,

								getValue: (item) => item.id,
								getLabel: (item) => item.name,

								anyLabel: "* Any Model",

								searchPlaceholder: "Search model...",
							},

							{
								id: "fuel-type",
								title: "Fuel type",

								options: [
									{ id: "gas", name: "Gas" },
									{ id: "diesel", name: "Diesel" },
									{ id: "hybrid", name: "Hybrid" },
									{ id: "phev", name: "PHEV" },
									{ id: "ev", name: "EV" },
								],

								value: fuelTypes,
								onValueChange: setFuelTypes,

								getValue: (item) => item.id,
								getLabel: (item) => item.name,

								anyLabel: "* Any Fuel type",

								searchPlaceholder: "Search fuel type...",
							},

							{
								id: "segment",
								title: "Segment",

								options: [
									{ id: "sedan", name: "Sedan" },
									{ id: "coupe", name: "Coupe" },
									{ id: "convertible", name: "Convertible" },
									{ id: "truck", name: "Truck" },
									{ id: "suv", name: "SUV" },
								],

								value: segments,
								onValueChange: setSegments,

								getValue: (item) => item.id,
								getLabel: (item) => item.name,

								anyLabel: "* Any Segment",

								searchPlaceholder: "Search segment...",
							},
						]}
						onAddRow={() => {
							console.log("Add vehicle row");
						}}
					/>
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
						<FormSwitch
							control={form.control}
							name="active"
							label="Active"
							description="Enable this program for customers."
						/>
						<FormChoiceChipGroup
							control={form.control}
							name="programType"
							label="Program type"
							required
							options={[
								{
									value: "customer_cash",
									label: "Customer Cash",
								},
								{
									value: "apr",
									label: "APR",
								},
								{
									value: "bonus_cash",
									label: "Bonus Cash",
								},
							]}
						/>
						<FormChoiceChipGroup
							control={form.control}
							name="creditTiers"
							label="Condition tier"
							required
							color="secondary"
							selectionMode="multiple"
							options={[
								{
									value: "carbravo_certified",
									label: "CarBravo Certified",
								},
								{
									value: "manufacturer_certified",
									label: "Manufacturer Certified",
								},
								{
									value: "used_inspected",
									label: "Used — Inspected",
								},
								{
									value: "used_as_is",
									label: "Used — As-Is",
								},
							]}
						/>
						<FormSelect
							control={form.control}
							name="vehicle"
							label="Vehicle"
							required
							placeholder="Select a vehicle"
							options={[
								{
									id: "car",
									name: "Car",
									description: "Passenger car",
									active: true,
								},
								{
									id: "bike",
									name: "Bike",
									description: "Two-wheeler",
									active: true,
								},
								{
									id: "truck",
									name: "Truck",
									description: "Commercial vehicle",
									active: true,
								},
								{
									id: "bus",
									name: "Bus",
									description: "Passenger bus",
									active: false,
								},
							]}
							getValue={(item) => item.id}
							getLabel={(item) => item.name}
							getDescription={(item) => item.description}
							getDisabled={(item) => item.active === false}
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
				</Container>
			</FormProvider>
		</AppProviders>
	);
}

export default App;
