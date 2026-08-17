import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import {
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
			<Box
				component="form"
				onSubmit={form.handleSubmit(onSubmit)}
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2.5,
				}}
			>
				{/* =========================================================
				    1. FINANCIAL PROVIDER
				========================================================= */}

				<ProgramSection title="Financial provider">
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								lg: "repeat(2, minmax(0, 1fr))",
							},
							gap: 2.5,
						}}
					>
						<FormSelect
							control={form.control}
							name="financialProviderCode"
							label="Provider"
							required
							options={FINANCIAL_PROVIDER_OPTIONS}
						/>

						<Box
							sx={{
								display: "flex",
								alignItems: "flex-end",
								pb: 0.0625,
							}}
						>
							<FormCheckbox
								control={form.control}
								name="tierRate"
								label="Apply tier-based rate structure (TBD)"
							/>
						</Box>
					</Box>
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
						selectionMode="multiple"
						options={CUSTOMER_TYPE_OPTIONS}
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

	<Stack direction="row" sx={{justifyContent:"flex-end"}}>
					<Button
						type="submit"
						variant="contained"
						disabled={form.formState.isSubmitting}
					>
						Save Eligibility
					</Button>
				</Stack>
			</Box>
		</FormProvider>
	);
}