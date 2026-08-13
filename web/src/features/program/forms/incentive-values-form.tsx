import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button, Col, FormChoiceChipGroup, FormInput } from "@/components/ui";

import { ProgramSection } from "../components";

import {
	incentiveValuesDefaultValues,
	STACKABILITY_OPTIONS,
} from "../constants";

import {
	type IncentiveValuesFormValues,
	incentiveValuesFormSchema,
} from "../schema";

export function IncentiveValuesForm() {
	const form = useForm({
		resolver: zodResolver(incentiveValuesFormSchema),
		defaultValues: incentiveValuesDefaultValues,
		mode: "onBlur",
	});

	const onSubmit = (values: IncentiveValuesFormValues) => {
		console.log("INCENTIVE VALUES SUBMIT", values);
	};

	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
				{/* =========================================================
				    1. APR BY TERM
				========================================================= */}

				<ProgramSection
					title="APR by term"
					description="Set Purchase type to Finance in Setup to author APR by term."
				>
					<div className="rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
						APR values can be configured when the program's Purchase Type is set
						to Finance.
					</div>
				</ProgramSection>

				{/* =========================================================
				    2. CASH VALUES
				========================================================= */}

				<ProgramSection title="Cash values">
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
						<FormInput
							control={form.control}
							name="customerCash"
							label="Customer Cash"
							type="number"
							placeholder="0"
						/>

						<FormInput
							control={form.control}
							name="bonusCash"
							label="Bonus Cash"
							type="number"
							placeholder="0"
						/>

						<FormInput
							control={form.control}
							name="downPaymentAssist"
							label="Down Payment Assist"
							type="number"
							placeholder="0"
						/>
					</div>
				</ProgramSection>

				{/* =========================================================
				    3. STACKABILITY
				========================================================= */}

				<ProgramSection
					title="Stackability"
					description="How this program combines with others on the same deal."
				>
					<Col gap={4}>
						{/* Stackable with */}
						<FormChoiceChipGroup
							control={form.control}
							name="stackableWith"
							label="Stackable with"
							description="Can combine"
							selectionMode="multiple"
							options={STACKABILITY_OPTIONS}
							radius="full"
							size="sm"
							getValue={(option) => option.value}
							getLabel={(option) => option.label}
						/>

						{/* Not stackable with */}
						<FormChoiceChipGroup
							radius="full"
							size="sm"
							control={form.control}
							name="notStackableWith"
							label="Not stackable with"
							description="Mutually exclusive"
							selectionMode="multiple"
							color="destructive"
							options={STACKABILITY_OPTIONS}
							getValue={(option) => option.value}
							getLabel={(option) => option.label}
						/>

						{/* Belongs to */}
						<FormInput
							control={form.control}
							name="belongsTo"
							label="Belongs to"
							placeholder="e.g. GMF National"
						/>
					</Col>
				</ProgramSection>

				{/* =========================================================
				    FORM ACTION
				========================================================= */}
				<div className="flex justify-end">
					<Button type="submit">Save Incentive Values</Button>
				</div>
			</form>
		</FormProvider>
	);
}
