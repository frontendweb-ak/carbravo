import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import {
	FormCheckbox,
	FormChoiceChipGroup,
	FormDateInput,
	FormInput,
	FormSelect,
	FormTimeInput,
} from "@/components/ui";
import { ProgramSection } from "../components";
import { setupDefaultValues } from "../constants";
import { type SetupFormValues, setupFormSchema } from "../schema";

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

interface FlagCardProps {
	children: React.ReactNode;
}

function FlagCard({ children }: FlagCardProps) {
	return (
		<div className="rounded-xl border border-border px-4 py-3">{children}</div>
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
				    1. PROGRAM DETAILS
				========================================================= */}

				<ProgramSection
					title="Program details"
					description="Core metadata identifying this incentive program."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormInput
							control={form.control}
							name="programName"
							label="Program Name"
							required
							placeholder="e.g. Summer Finance Event"
						/>

						<FormInput
							control={form.control}
							name="programNumber"
							label="Program Number"
							required
							placeholder="4821"
						/>

						<FormInput
							control={form.control}
							name="incentiveCodes"
							label="Incentive Codes"
							required
							placeholder="GMF-APR-2027-06"
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
				</ProgramSection>

				{/* =========================================================
				    2. CONTROLLING DATES
				========================================================= */}

				<ProgramSection
					title="Controlling dates"
					description="Delivery window and the moment values become visible downstream."
				>
					<div className="grid grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-3">
						<FormDateInput
							control={form.control}
							name="deliveryStart"
							label="Delivery Start"
							required
						/>

						<FormDateInput
							control={form.control}
							name="deliveryEnd"
							label="Delivery End"
							required
						/>

						<div></div>
						<FormDateInput
							control={form.control}
							name="firstVisibleDate"
							label="First Visible — Date"
							required
						/>

						<FormTimeInput
							control={form.control}
							name="firstVisibleTime"
							label="First Visible — Time"
						/>
						<div></div>
					</div>

					<div className="mt-4 rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
						First-visible may precede delivery start — it controls when
						downstream services expose the program, which can differ from when
						it becomes active.
					</div>
				</ProgramSection>

				{/* =========================================================
				    3. PROGRAM CONFIGURATION
				========================================================= */}

				<ProgramSection title="Program configuration" description="">
					<div className="grid grid-cols-1 gap-x-5 gap-y-4 lg:grid-cols-12">
						{/* Program Type */}
						<div className="lg:col-span-5">
							<FormChoiceChipGroup
								control={form.control}
								name="programType"
								label="Program Type"
								required
								options={PROGRAM_TYPE_OPTIONS}
								getValue={(option) => option.value}
								getLabel={(option) => option.label}
							/>
						</div>

						{/* Purchase Type */}
						<div className="lg:col-span-3">
							<FormChoiceChipGroup
								control={form.control}
								name="purchaseType"
								label="Purchase Type"
								required
								options={PURCHASE_TYPE_OPTIONS}
								getValue={(option) => option.value}
								getLabel={(option) => option.label}
							/>
						</div>

						{/* Mileage */}
						<div className="lg:col-span-4">
							<FormInput
								control={form.control}
								name="mileageMaximum"
								label="Mileage Maximum"
								type="number"
								placeholder="59999"
								rightElement={
									<span className="text-xs text-muted-foreground">mi</span>
								}
								description="Vehicles above this odometer reading are excluded."
							/>
						</div>

						{/* Condition Tier */}
						<div className="lg:col-span-12">
							<FormChoiceChipGroup
								control={form.control}
								name="conditionTier"
								label="Condition Tier"
								required
								options={CONDITION_TIER_OPTIONS}
								getValue={(option) => option.value}
								getLabel={(option) => option.label}
							/>
						</div>

						{/* Credit Tier */}
						<div className="lg:col-span-12">
							<FormChoiceChipGroup
								control={form.control}
								name="creditTiers"
								label="Credit Tier"
								selectionMode="multiple"
								options={CREDIT_TIER_OPTIONS}
								getValue={(option) => option.value}
								getLabel={(option) => option.label}
								description="Credit qualifications this incentive applies to. Select one or more."
							/>
						</div>

						{/* Contact */}
						<div className="lg:col-span-12">
							<FormInput
								control={form.control}
								name="contact"
								label="Contact"
								required
								placeholder="Program owner name"
							/>
						</div>
					</div>
				</ProgramSection>

				{/* =========================================================
				    4. FLAGS
				========================================================= */}

				<ProgramSection
					title="Flags"
					description="Conditional behaviors applied to this program."
				>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
						<FlagCard>
							<FormCheckbox
								control={form.control}
								name="flags.vinException"
								label="VIN Exception"
								description="Conditional — appears below the line, not against net price."
							/>
						</FlagCard>

						<FlagCard>
							<FormCheckbox
								control={form.control}
								name="flags.topOfDeal"
								label="Top of Deal"
								description="Program headlines the deal stack."
							/>
						</FlagCard>

						<FlagCard>
							<FormCheckbox
								control={form.control}
								name="flags.noAddOns"
								label="No add-ons"
								description="Cannot be combined with dealer add-ons."
							/>
						</FlagCard>
					</div>
				</ProgramSection>

				{/* =========================================================
				    FORM ACTION
				========================================================= */}

				<div className="flex justify-end">
					<button
						type="submit"
						className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
					>
						Save Setup
					</button>
				</div>
			</form>
		</FormProvider>
	);
}
