import {
	FormCheckbox,
	FormChoiceChipGroup,
	FormDateInput,
	FormInput,
	FormSelect,
	FormTimeInput,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { ProgramSection } from "../components";
import {
	CONDITION_TIER_OPTIONS,
	COUNTRY_OPTIONS,
	CREDIT_TIER_OPTIONS,
	FINANCE_TERM_OPTIONS,
	PROGRAM_TYPE_OPTIONS,
	PURCHASE_TYPE_OPTIONS,
	setupDefaultValues,
} from "../constants";
import { useProgramEditor } from "../editor/program-editor-context";
import {
	useCreateProgram,
	useProgramSetup,
	useUpdateProgramSetup,
} from "../hooks";
import { setupFormSchema } from "../schema";
import type { SetupFormInput, SetupFormOutput } from "./setup-form.types";
import { useSetupFormPersistence } from "./use-setup-form-persistence";

interface SetupFormProps {
	mode: "new" | "edit";
	programId?: number;
	revisionId?: number;
	readOnly?: boolean;
	onCreated?: (result: { programId: number; revisionId: number }) => void;
}

export function SetupForm({
	mode,
	programId,
	revisionId,
	readOnly = false,
	onCreated,
}: SetupFormProps) {
	const { registerSaveHandler, updateSectionStatus, isMinorRevision } =
		useProgramEditor();
	const isExistingRevision =
		mode === "edit" && programId != null && revisionId != null;
	const canEdit =
		mode === "new" || (isExistingRevision && !readOnly && !isMinorRevision);

	const {
		data: setup,
		isLoading: isSetupLoading,
		isError: isSetupError,
		refetch: refetchSetup,
	} = useProgramSetup(programId, revisionId);
	const { mutateAsync: createProgramAsync } = useCreateProgram();
	const { mutateAsync: updateSetupAsync } = useUpdateProgramSetup();

	const form = useForm<SetupFormInput, unknown, SetupFormOutput>({
		resolver: zodResolver(setupFormSchema),
		defaultValues: setupDefaultValues,
		mode: "onBlur",
		reValidateMode: "onBlur",
	});
	const purchaseType = useWatch({
		control: form.control,
		name: "purchaseType",
	});

	useSetupFormPersistence({
		mode,
		programId,
		revisionId,
		isExistingRevision,
		canEdit,
		setup,
		form,
		createProgram: createProgramAsync,
		updateSetup: updateSetupAsync,
		onCreated,
		updateSectionStatus,
		registerSaveHandler,
	});

	useEffect(() => {
		if (purchaseType === "FINANCE") return;

		const currentTerms = form.getValues("financeTerms");
		if (currentTerms.length === 0) return;

		form.setValue("financeTerms", [], {
			shouldDirty: true,
			shouldTouch: false,
			shouldValidate: false,
		});
	}, [purchaseType, form]);

	/* ---------------------------------------------------------------------- */
	/* Loading                                                                  */
	/* ---------------------------------------------------------------------- */

	if (isExistingRevision && isSetupLoading) {
		return (
			<Box
				sx={{
					border: 1,
					borderColor: "divider",
					borderRadius: 3,
					bgcolor: "background.paper",
					p: 3,
				}}
			>
				<Typography variant="body2" color="text.secondary">
					Loading setup...
				</Typography>
			</Box>
		);
	}

	/* ---------------------------------------------------------------------- */
	/* Error                                                                    */
	/* ---------------------------------------------------------------------- */

	if (isExistingRevision && isSetupError) {
		return (
			<Alert
				severity="error"
				variant="outlined"
				action={
					<Button
						size="small"
						color="inherit"
						onClick={() => {
							void refetchSetup();
						}}
					>
						Retry
					</Button>
				}
				sx={{ alignItems: "center" }}
			>
				<Stack spacing={0.5}>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						Failed to load setup
					</Typography>

					<Typography variant="body2">
						We couldn't load this revision's setup data.
					</Typography>
				</Stack>
			</Alert>
		);
	}

	/* ---------------------------------------------------------------------- */
	/* Form                                                                     */
	/* ---------------------------------------------------------------------- */

	return (
		<FormProvider {...form}>
			<Stack
				component="form"
				spacing={4}
				noValidate
				onSubmit={(event) => {
					event.preventDefault();
				}}
			>
				{/* ============================================================ */}
				{/* PROGRAM DETAILS                                              */}
				{/* ============================================================ */}

				<ProgramSection
					title="Program details"
					description="Core metadata identifying this incentive program."
				>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								lg: "repeat(2, minmax(0, 1fr))",
							},
							gap: 4,
						}}
					>
						<FormInput
							control={form.control}
							name="programName"
							label="Program Name"
							required
							placeholder="e.g. Summer Finance Event"
							disabled={!canEdit}
						/>

						<FormInput
							control={form.control}
							name="programNumber"
							label="Program Number"
							placeholder="Generated by the backend"
							disabled
						/>

						<FormInput
							control={form.control}
							name="incentiveCodes"
							label="Incentive Codes"
							placeholder="Provided by the incentive system"
							disabled
						/>

						<FormSelect
							control={form.control}
							name="country"
							label="Country"
							options={COUNTRY_OPTIONS}
							disabled
						/>
					</Box>
					<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
						Program number, incentive codes and country are reference-only in the current API.
					</Typography>
				</ProgramSection>

				{/* ============================================================ */}
				{/* CONTROLLING DATES                                             */}
				{/* ============================================================ */}

				<ProgramSection
					title="Controlling dates"
					description="Delivery window and the moment values become visible downstream."
				>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								lg: "repeat(3, minmax(0, 1fr))",
							},
							columnGap: 2.5,
							rowGap: 2.5,
						}}
					>
						<FormDateInput
							control={form.control}
							name="deliveryStart"
							label="Delivery Start"
							required
							disabled={!canEdit}
						/>

						<FormDateInput
							control={form.control}
							name="deliveryEnd"
							label="Delivery End"
							required
							disabled={!canEdit}
						/>

						<Box />

						<FormDateInput
							control={form.control}
							name="firstVisibleDate"
							label="First Visible — Date"
							disabled
						/>

						<FormTimeInput
							control={form.control}
							name="firstVisibleTime"
							label="First Visible — Time"
							disabled
						/>

						<Box />
					</Box>

					<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
						First-visible date and time are reference-only in the current API.
					</Typography>
				</ProgramSection>

				{/* ============================================================ */}
				{/* PROGRAM CONFIGURATION                                         */}
				{/* ============================================================ */}

				<ProgramSection title="Program configuration">
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								lg: "repeat(12, minmax(0, 1fr))",
							},
							columnGap: 2.5,
							rowGap: 2,
						}}
					>
						{/* Program Type */}

						<Box sx={{ gridColumn: { xs: "span 1", lg: "span 5" } }}>
							<FormChoiceChipGroup
								control={form.control}
								name="programType"
								label="Program Type"
								required
								options={PROGRAM_TYPE_OPTIONS}
								disabled={!canEdit}
							/>
						</Box>

						{/* Purchase Type */}

						<Box
							sx={{
								gridColumn: {
									xs: "span 1",
									lg: "span 3",
								},
							}}
						>
							<FormChoiceChipGroup
								control={form.control}
								name="purchaseType"
								label="Purchase Type"
								required
								options={PURCHASE_TYPE_OPTIONS}
								disabled={!canEdit}
							/>
						</Box>

						{/* Mileage */}

						<Box
							sx={{
								gridColumn: {
									xs: "span 1",
									lg: "span 4",
								},
							}}
						>
							<FormInput
								control={form.control}
								name="mileageMaximum"
								label="Mileage Maximum"
								type="number"
								placeholder="59999"
								rightElement={
									<Typography variant="caption" color="text.secondary">
										mi
									</Typography>
								}
								description="Vehicles above this odometer reading are excluded."
								disabled={!canEdit}
							/>
						</Box>

						{/* Condition Tier */}

						<Box
							sx={{
								gridColumn: {
									xs: "span 1",
									lg: "span 12",
								},
							}}
						>
							<FormChoiceChipGroup
								control={form.control}
								name="conditionTier"
								label="Condition Tier"
								required
								options={CONDITION_TIER_OPTIONS}
								disabled={!canEdit}
							/>
						</Box>

						{/* Credit Tiers */}

						<Box
							sx={{
								gridColumn: {
									xs: "span 1",
									lg: "span 12",
								},
							}}
						>
							<FormChoiceChipGroup
								control={form.control}
								name="creditTiers"
								label="Credit Tier"
								selectionMode="multiple"
								color="info"
								options={CREDIT_TIER_OPTIONS}
								description="Credit qualifications this incentive applies to. Select one or more."
								disabled={!canEdit}
								borderRadius={5}
							/>
						</Box>

						{/* Finance Terms */}

						{purchaseType === "FINANCE" && (
							<Box sx={{ gridColumn: { xs: "span 1", lg: "span 12" } }}>
								<FormChoiceChipGroup
									control={form.control}
									name="financeTerms"
									label="Terms (Months)"
									selectionMode="multiple"
									options={FINANCE_TERM_OPTIONS}
									disabled={!canEdit}
									color="info"
								/>
							</Box>
						)}

						<Box sx={{ gridColumn: { xs: "span 1", lg: "span 12" } }}>
							<FormInput
								control={form.control}
								name="contact"
								label="Contact"
								required
								placeholder="Program owner name"
								disabled={!canEdit}
							/>
						</Box>
					</Box>
				</ProgramSection>

				{/* ============================================================ */}
				{/* FLAGS                                                          */}
				{/* ============================================================ */}

				<ProgramSection
					title="Flags"
					description="Conditional behaviors applied to this program."
				>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								lg: "repeat(3, minmax(0, 1fr))",
							},
							gap: 2,
						}}
					>
						<FormCheckbox
							control={form.control}
							name="flags.vinException"
							label="VIN Exception"
							description="Conditional — appears below the line, not against net price."
							disabled={!canEdit}
						/>

						<FormCheckbox
							control={form.control}
							name="flags.topOfDeal"
							label="Top of Deal"
							description="Program headlines the deal stack."
							disabled={!canEdit}
						/>

						<FormCheckbox
							control={form.control}
							name="flags.noAddOns"
							label="No add-ons"
							description="Not persisted by the current OpenAPI contract."
							disabled
						/>
					</Box>
				</ProgramSection>
			</Stack>
		</FormProvider>
	);
}
