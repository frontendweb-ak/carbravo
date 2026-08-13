import {
	FormCheckbox,
	FormChoiceChipGroup,
	FormDateInput,
	FormInput,
	FormSelect,
	FormTimeInput,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ProgramSection } from "../components";
import {
	CONDITION_TIER_OPTIONS,
	COUNTRY_OPTIONS,
	CREDIT_TIER_OPTIONS,
	PROGRAM_TYPE_OPTIONS,
	PURCHASE_TYPE_OPTIONS,
	setupDefaultValues,
} from "../constants";
import { useProgramEditor } from "../editor/program-editor-context";
import { useUpdateProgramSetup } from "../hooks";
import { type SetupFormValues, setupFormSchema } from "../schema";

interface FlagCardProps {
	children: React.ReactNode;
}

function FlagCard({ children }: FlagCardProps) {
	return (
		<div className="rounded-xl border border-border px-4 py-3">{children}</div>
	);
}

export function SetupForm() {
	const {
		mode,
		programId,
		revisionId,
		registerSaveHandler,
		updateSectionStatus,
		isReadOnly,
		// isSaving,
	} = useProgramEditor();

	const updateSetup = useUpdateProgramSetup();

	const form = useForm({
		resolver: zodResolver(setupFormSchema),
		defaultValues: setupDefaultValues,
		mode: "onBlur",
	});

	const savingRef = useRef(false);
	/**
	 * ---------------------------------------------------------------
	 * Persist Setup
	 * ---------------------------------------------------------------
	 *
	 * IMPORTANT:
	 * Replace the body of this function with the actual
	 * React Query mutation/API call.
	 *
	 * The section is marked completed ONLY after the API succeeds.
	 */
	const persistSetup = useCallback(
		async (values: SetupFormValues) => {
			if (savingRef.current) {
				return;
			}

			if (!programId || !revisionId) {
				return;
			}

			savingRef.current = true;

			try {
				await updateSetup.mutateAsync({
					programId,
					revisionId,
					payload: values,
				});

				updateSectionStatus("setup", "completed");
			} catch (error) {
				updateSectionStatus("setup", "warning");
				throw error;
			} finally {
				savingRef.current = false;
			}
		},
		[programId, revisionId, updateSetup, updateSectionStatus],
	);

	/**
	 * ---------------------------------------------------------------
	 * Save current section
	 * ---------------------------------------------------------------
	 *
	 * This is what the global "Save draft" button will eventually call.
	 */
	const saveSetup = useCallback(async () => {
		if (isReadOnly) return;

		const valid = await form.trigger();
		if (!valid) {
			updateSectionStatus("setup", "warning");
			return;
		}

		const values = form.getValues();
		await persistSetup(values as SetupFormValues);
	}, [form, isReadOnly, persistSetup, updateSectionStatus]);

	/**
	 * ---------------------------------------------------------------
	 * Register Setup save handler
	 * ---------------------------------------------------------------
	 *
	 * ProgramLayout/Header can now call:
	 *
	 * saveCurrentSection()
	 *
	 * and this function will execute.
	 */
	useEffect(() => {
		registerSaveHandler(saveSetup);

		return () => {
			registerSaveHandler(null);
		};
	}, [registerSaveHandler, saveSetup]);

	/**
	 * ---------------------------------------------------------------
	 * Detect incomplete/dirty Setup
	 * ---------------------------------------------------------------
	 *
	 * Once the user starts editing, the sidebar should show warning
	 * until the section is successfully saved.
	 */
	useEffect(() => {
		if (!form.formState.isDirty) {
			return;
		}

		updateSectionStatus("setup", "warning");
	}, [form.formState.isDirty, updateSectionStatus]);

	/**
	 * ---------------------------------------------------------------
	 * Auto-save
	 * ---------------------------------------------------------------
	 *
	 * Don't save on every keystroke.
	 *
	 * Wait until the user stops typing.
	 */
	useEffect(() => {
		if (!form.formState.isDirty || isReadOnly) {
			return;
		}

		const timer = window.setTimeout(() => {
			void saveSetup();
		}, 1000);

		return () => {
			window.clearTimeout(timer);
		};
	}, [form.formState.isDirty, isReadOnly, saveSetup]);

	return (
		<FormProvider {...form}>
			<form className="space-y-5">
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
				{/* <div className="flex justify-end">
					<Button type="submit">Save Setup</Button>
				</div> */}
			</form>
		</FormProvider>
	);
}
