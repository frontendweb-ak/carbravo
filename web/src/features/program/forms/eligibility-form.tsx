import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import {
	Button,
	FormCheckbox,
	FormChoiceChipGroup,
	FormSelect,
	FormTextarea,
} from "@/components/ui";

import { ProgramSection } from "../components";

import {
	CUSTOMER_TYPE_OPTIONS,
	eligibilityDefaultValues,
	FINANCIAL_PROVIDER_OPTIONS,
} from "../constants";

import { type EligibilityFormValues, eligibilityFormSchema } from "../schema";

export function EligibilityForm() {
	const form = useForm<EligibilityFormValues>({
		resolver: zodResolver(eligibilityFormSchema),
		defaultValues: eligibilityDefaultValues,
		mode: "onBlur",
	});

	const onSubmit = (values: EligibilityFormValues) => {
		console.log("ELIGIBILITY SUBMIT", values);
	};

	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
				{/* =========================================================
				    1. FINANCIAL PROVIDER
				========================================================= */}

				<ProgramSection title="Financial provider">
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormSelect
							control={form.control}
							name="financialProviderCode"
							label="Provider"
							required
							valueType="id"
							options={FINANCIAL_PROVIDER_OPTIONS}
							getValue={(option) => option.value}
							getLabel={(option) => option.label}
						/>

						<div className="flex items-end pb-0.5">
							<FormCheckbox
								control={form.control}
								name="tierRate"
								label="Apply tier-based rate structure (TBD)"
							/>
						</div>
					</div>
				</ProgramSection>

				{/* =========================================================
				    2. CUSTOMER TYPE
				========================================================= */}

				<ProgramSection
					title="Customer type"
					description="Who is eligible for this program."
				>
					<FormChoiceChipGroup
						control={form.control}
						name="customerTypeCodes"
						label="Customer type"
						required
						radius="full"
						size="sm"
						selectionMode="multiple"
						options={CUSTOMER_TYPE_OPTIONS}
						getValue={(option) => option.value}
						getLabel={(option) => option.label}
					/>
				</ProgramSection>

				{/* =========================================================
				    3. ELIGIBILITY FOOTNOTES
				========================================================= */}

				<ProgramSection
					title="Eligibility footnotes"
					description="Legal & conditional text shown with the incentive."
				>
					<FormTextarea
						control={form.control}
						name="footnotes"
						label="Footnotes"
						required
						placeholder="Enter disclaimer or conditions..."
						rows={5}
						maxLength={2000}
					/>
				</ProgramSection>

				{/* =========================================================
				    FORM ACTION
				========================================================= */}

				<div className="flex justify-end">
					<Button type="submit">Save Eligibility</Button>
				</div>
			</form>
		</FormProvider>
	);
}
