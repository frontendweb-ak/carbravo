import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import {
	Button,
	FormCheckbox,
	FormChoiceChipGroup,
	FormSelect,
	FormTextarea,
	Typography,
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
								flexDirection: "column",
								justifyContent: "flex-end",
								minWidth: 0,
							}}
						>
							<Typography
								variant="overline"
								sx={{ mb: 0.75, color: "text.secondary" }}
							>
								Tier rate
							</Typography>

							<Box
								sx={{
									minHeight: 40,
									display: "flex",
									alignItems: "center",
								}}
							>
								<FormCheckbox
									control={form.control}
									name="tierRate"
									variant="inline"
									label={
										<>
											Apply tier-based rate structure{" "}
											<Box
												component="span"
												sx={{
													color: "warning.main",
													fontWeight: 700,
												}}
											>
												(TBD)
											</Box>
										</>
									}
								/>
							</Box>
						</Box>
					</Box>
				</ProgramSection>

				{/* =========================================================
				    2. CUSTOMER TYPE
				========================================================= */}

				<ProgramSection
					title="Customer type"
					description="Who is eligible for this program."
					headerAction={
						<Button
							type="button"
							variant="outline"
							size="small"
							onClick={() => {
								const allValues = CUSTOMER_TYPE_OPTIONS.map(
									(option) => option.value,
								);

								const currentValues = form.getValues("customerTypeCodes");

								form.setValue(
									"customerTypeCodes",
									currentValues.length === allValues.length ? [] : allValues,
									{
										shouldDirty: true,
										shouldValidate: false,
									},
								);
							}}
						>
							{form.watch("customerTypeCodes").length ===
							CUSTOMER_TYPE_OPTIONS.length
								? "Clear all"
								: "Select all"}
						</Button>
					}
				>
					<FormChoiceChipGroup
						control={form.control}
						borderRadius={5}
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
						maxLength={2000}
						showCounter
					/>
				</ProgramSection>
			</Box>
		</FormProvider>
	);
}