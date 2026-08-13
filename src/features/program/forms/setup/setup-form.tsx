import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import {
	FormCheckboxGroup,
	FormInput,
	FormRadioGroup,
	FormSelect,
} from "@/components/ui";

import { setupDefaultValues } from "../../constants";
import { type SetupFormValues, setupFormSchema } from "../../schema";

const PROGRAM_TYPE_OPTIONS = [
	{
		value: "CUSTOMER_CASH",
		label: "Customer Cash",
	},
	{
		value: "APR",
		label: "APR",
	},
	{
		value: "BONUS_CASH",
		label: "Bonus Cash",
	},
];

const PURCHASE_TYPE_OPTIONS = [
	{
		value: "CASH",
		label: "Cash",
	},
	{
		value: "FINANCE",
		label: "Finance",
	},
];

const CONDITION_TIER_OPTIONS = [
	{
		value: "CARBRAVO_CERTIFIED",
		label: "CarBravo Certified",
	},
	{
		value: "MANUFACTURER_CERTIFIED",
		label: "Manufacturer Certified",
	},
	{
		value: "USED_INSPECTED",
		label: "Used — Inspected",
	},
	{
		value: "USED_AS_IS",
		label: "Used — As-Is",
	},
];

const CREDIT_TIER_OPTIONS = [
	{
		value: "A_PLUS",
		label: "A+ — Excellent Credit",
	},
	{
		value: "A1",
		label: "A1 — Very Good Credit",
	},
	{
		value: "A2",
		label: "A2 — Good Credit",
	},
	{
		value: "B",
		label: "B — Fair Credit",
	},
];

const COUNTRY_OPTIONS = [
	{
		value: "US",
		label: "United States",
	},
	{
		value: "CA",
		label: "Canada",
	},
];

const FLAG_OPTIONS = [
	{
		value: "vinException",
		label: "VIN Exception",
		description: "Conditional — appears below the line, not against net price.",
	},
	{
		value: "topOfDeal",
		label: "Top of Deal",
		description: "Program headlines the deal stack.",
	},
	{
		value: "noAddOns",
		label: "No add-ons",
		description: "Cannot be combined with dealer add-ons.",
	},
];

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<section className="rounded-2xl border border-border bg-card p-6">
			<div className="mb-6">
				<h2 className="text-base font-bold text-foreground">{title}</h2>

				{description && (
					<p className="mt-1 text-sm text-muted-foreground">{description}</p>
				)}
			</div>

			{children}
		</section>
	);
}

export function SetupForm() {
	const form = useForm({
		resolver: zodResolver(setupFormSchema),
		defaultValues: setupDefaultValues,
		mode: "onBlur",
	});

	const onSubmit = (values: SetupFormValues) => {
		console.log("SETUP SUBMIT", values);
	};

	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
				{/* =========================================================
				    PROGRAM DETAILS
				========================================================= */}

				<Section
					title="Program details"
					description="Core metadata identifying this incentive program."
				>
					<div className="grid gap-5 md:grid-cols-2">
						<FormInput
							control={form.control}
							name="programName"
							label="Program Name"
							required
							placeholder="Enter program name"
						/>

						<FormInput
							control={form.control}
							name="programNumber"
							label="Program Number"
							required
							placeholder="Enter program number"
						/>

						<FormInput
							control={form.control}
							name="incentiveCodes"
							label="Incentive Codes"
							required
							placeholder="Enter incentive codes"
							description="One or more incentive codes associated with this program."
						/>

						<FormSelect
							control={form.control}
							name="country"
							label="Country"
							required
							valueType="id"
							options={COUNTRY_OPTIONS}
							getValue={(option) => option.value}
							getLabel={(option) => option.label}
						/>
					</div>
				</Section>

				{/* =========================================================
				    CONTROLLING DATES
				========================================================= */}

				<Section
					title="Controlling dates"
					description="Delivery window and visibility timing for the program."
				>
					<div className="grid gap-5 md:grid-cols-2">
						<FormInput
							control={form.control}
							name="deliveryStart"
							label="Delivery Start"
							required
							type="date"
						/>

						<FormInput
							control={form.control}
							name="deliveryEnd"
							label="Delivery End"
							required
							type="date"
						/>

						<FormInput
							control={form.control}
							name="firstVisibleDate"
							label="First Visible — Date"
							required
							type="date"
						/>

						<FormInput
							control={form.control}
							name="firstVisibleTime"
							label="First Visible — Time"
							type="time"
						/>
					</div>

					<div className="mt-4 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
						First-visible may precede delivery start — it controls when
						downstream services expose the program, which can differ from when
						it becomes active.
					</div>
				</Section>

				{/* =========================================================
				    PROGRAM CONFIGURATION
				========================================================= */}

				<Section
					title="Program configuration"
					description="Define how the incentive applies to eligible vehicles and customers."
				>
					<div className="grid gap-6 lg:grid-cols-2">
						<FormRadioGroup
							control={form.control}
							name="programType"
							label="Program Type"
							required
							options={PROGRAM_TYPE_OPTIONS}
							getValue={(option) => option.value}
							getLabel={(option) => option.label}
						/>

						<FormRadioGroup
							control={form.control}
							name="purchaseType"
							label="Purchase Type"
							required
							options={PURCHASE_TYPE_OPTIONS}
							getValue={(option) => option.value}
							getLabel={(option) => option.label}
						/>

						<FormInput
							control={form.control}
							name="mileageMaximum"
							label="Mileage Maximum"
							required
							type="number"
							description="Vehicles above this odometer reading are excluded."
						/>

						<FormRadioGroup
							control={form.control}
							name="conditionTier"
							label="Condition Tier"
							required
							options={CONDITION_TIER_OPTIONS}
							getValue={(option) => option.value}
							getLabel={(option) => option.label}
						/>

						<div className="lg:col-span-2">
							<FormCheckboxGroup
								control={form.control}
								name="creditTiers"
								label="Credit Tier"
								options={CREDIT_TIER_OPTIONS}
								getValue={(option) => option.value}
								getLabel={(option) => option.label}
								getDescription={(option) => option.label}
								description="Credit qualifications this incentive applies to. Select one or more."
							/>
						</div>

						<FormInput
							control={form.control}
							name="contact"
							label="Contact"
							required
							placeholder="Program owner or contact"
						/>
					</div>
				</Section>

				{/* =========================================================
				    FLAGS
				========================================================= */}

				<Section
					title="Flags"
					description="Conditional behaviors applied to this program."
				>
					<FormCheckboxGroup
						control={form.control}
						name="flags"
						label="Program Flags"
						options={FLAG_OPTIONS}
						getValue={(option) => option.value}
						getLabel={(option) => option.label}
						getDescription={(option) => option.description}
					/>
				</Section>

				{/* =========================================================
				    ACTIONS
				========================================================= */}

				<div className="flex items-center justify-end gap-3">
					<button
						type="button"
						className="rounded-lg border border-border px-4 py-2 text-sm font-semibold"
						onClick={() => form.reset()}
					>
						Reset
					</button>

					<button
						type="submit"
						className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
					>
						Save Setup
					</button>
				</div>
			</form>
		</FormProvider>
	);
}
