import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { FormChoiceChipGroup, FormInput } from "@/components/ui/forms";

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
			<Stack
				component="form"
				onSubmit={form.handleSubmit(onSubmit)}
				spacing={2.5}
			>
				{/* =========================================================
				    1. APR BY TERM
				========================================================= */}

				<ProgramSection
					title="APR by term"
					description="Set Purchase type to Finance in Setup to author APR by term."
				>
					<Box
						sx={{
							borderRadius: 1.5,
							backgroundColor: "action.hover",
							px: 1.5,
							py: 1.25,
						}}
					>
						<Typography variant="body2" color="text.secondary">
							APR values can be configured when the program's Purchase Type is
							set to Finance.
						</Typography>
					</Box>
				</ProgramSection>

				{/* =========================================================
				    2. CASH VALUES
				========================================================= */}

				<ProgramSection title="Cash values">
					<Grid container spacing={2.5}>
						<Grid size={{ xs: 12, lg: 4 }}>
							<FormInput
								control={form.control}
								name="customerCash"
								label="Customer Cash"
								type="number"
								placeholder="0"
							/>
						</Grid>

						<Grid size={{ xs: 12, lg: 4 }}>
							<FormInput
								control={form.control}
								name="bonusCash"
								label="Bonus Cash"
								type="number"
								placeholder="0"
							/>
						</Grid>

						<Grid size={{ xs: 12, lg: 4 }}>
							<FormInput
								control={form.control}
								name="downPaymentAssist"
								label="Down Payment Assist"
								type="number"
								placeholder="0"
							/>
						</Grid>
					</Grid>
				</ProgramSection>

				{/* =========================================================
				    3. STACKABILITY
				========================================================= */}

				<ProgramSection
					title="Stackability"
					description="How this program combines with others on the same deal."
				>
					<Stack spacing={3}>
						{/* Stackable with */}

						<FormChoiceChipGroup
							control={form.control}
							name="stackableWith"
							label="Stackable with"
							description="Can combine"
							selectionMode="multiple"
							options={STACKABILITY_OPTIONS}
							borderRadius={5}
						/>

						{/* Not stackable with */}

						<FormChoiceChipGroup
							control={form.control}
							name="notStackableWith"
							label="Not stackable with"
							description="Mutually exclusive"
							selectionMode="multiple"
							options={STACKABILITY_OPTIONS}
							borderRadius={5}
						/>

						{/* Belongs to */}

						<FormInput
							control={form.control}
							name="belongsTo"
							label="Belongs to"
							placeholder="e.g. GMF National"
						/>
					</Stack>
				</ProgramSection>
			</Stack>
		</FormProvider>
	);
}