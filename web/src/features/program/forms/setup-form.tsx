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
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

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
	useProgram,
	useProgramSetup,
	useUpdateProgramSetup,
} from "../hooks";
import {
	mapSetupFormToDto,
	mapSetupResponseToForm,
} from "../model/setup.mapper";
import { setupFormSchema } from "../schema";

interface FlagCardProps {
	children: React.ReactNode;
}

function FlagCard({ children }: FlagCardProps) {
	return (
		<div className="rounded-xl border border-border px-4 py-3">{children}</div>
	);
}

interface SetupFormProps {
	mode: "new" | "edit";
	programId?: number;
	revisionId?: number;
	readOnly?: boolean;

	/**
	 * Called after a new program is created by the first
	 * successful auto-save.
	 *
	 * The editor should normally update its route/context
	 * with these IDs.
	 */
	onCreated?: (result: { programId: number; revisionId: number }) => void;
}

type SetupFormInput = z.input<typeof setupFormSchema>;
type SetupFormOutput = z.output<typeof setupFormSchema>;

const AUTO_SAVE_DELAY = 1000;

export function SetupForm({
	mode,
	programId,
	revisionId,
	readOnly = false,
	onCreated,
}: SetupFormProps) {
	const { registerSaveHandler, updateSectionStatus } = useProgramEditor();

	/* ---------------------------------------------------------------------- */
	/* Mode / permissions                                                     */
	/* ---------------------------------------------------------------------- */

	const isExistingRevision =
		mode === "edit" && programId != null && revisionId != null;

	const canEdit = mode === "new" || (isExistingRevision && !readOnly);

	/*
	 * New programs do not have IDs until the first successful
	 * POST /programs/setup.
	 */
	const createdRevisionRef = useRef<{
		programId: number;
		revisionId: number;
	} | null>(null);
	const persistenceRef = useRef<{
		programId?: number;
		revisionId?: number;
	}>({
		programId,
		revisionId,
	});
	useEffect(() => {
		if (mode === "edit") {
			persistenceRef.current = {
				programId,
				revisionId,
			};
		}
	}, [mode, programId, revisionId]);
	/* ---------------------------------------------------------------------- */
	/* API                                                                     */
	/* ---------------------------------------------------------------------- */

	const {
		data: setup,
		isLoading: isSetupLoading,
		isError: isSetupError,
		refetch: refetchSetup,
	} = useProgramSetup(programId, revisionId);

	const program = useProgram(programId);
	console.log("program", program.data);
	const { mutateAsync: createProgramAsync } = useCreateProgram();
	const { mutateAsync: updateSetupAsync } = useUpdateProgramSetup();
	/* ---------------------------------------------------------------------- */
	/* Form                                                                    */
	/* ---------------------------------------------------------------------- */

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

	/* ---------------------------------------------------------------------- */
	/* Lifecycle refs                                                          */
	/* ---------------------------------------------------------------------- */

	/*
	 * Prevent API hydration from triggering auto-save.
	 */
	const hydratedRef = useRef(false);

	/*
	 * Prevent saves after unmount.
	 */
	const mountedRef = useRef(true);

	/*
	 * Debounce timer.
	 */
	const saveTimerRef = useRef<number | null>(null);

	/*
	 * Only one network request at a time.
	 */
	const savingRef = useRef(false);

	/*
	 * If the user changes another field while a request is
	 * running, keep the newest values here.
	 */
	const pendingSaveRef = useRef<SetupFormOutput | null>(null);

	/*
	 * Prevent duplicate create calls for a new program.
	 */
	const createInFlightRef = useRef(false);

	/* ---------------------------------------------------------------------- */
	/* Mount / unmount                                                         */
	/* ---------------------------------------------------------------------- */

	useEffect(() => {
		mountedRef.current = true;

		return () => {
			mountedRef.current = false;

			if (saveTimerRef.current !== null) {
				window.clearTimeout(saveTimerRef.current);
				saveTimerRef.current = null;
			}

			pendingSaveRef.current = null;
		};
	}, []);

	/* ---------------------------------------------------------------------- */
	/* Load existing revision                                                  */
	/* ---------------------------------------------------------------------- */

	useEffect(() => {
		if (!isExistingRevision) {
			return;
		}

		if (!setup) {
			return;
		}

		const values = mapSetupResponseToForm(setup);

		/*
		 * reset() is hydration, not a user edit.
		 */
		form.reset(values);

		hydratedRef.current = true;

		updateSectionStatus("setup", "completed");
	}, [isExistingRevision, setup, form, updateSectionStatus]);

	/* ---------------------------------------------------------------------- */
	/* New program initialization                                              */
	/* ---------------------------------------------------------------------- */

	useEffect(() => {
		if (mode !== "new") {
			return;
		}

		hydratedRef.current = true;
	}, [mode]);

	/* ---------------------------------------------------------------------- */
	/* Persist                                                                  */
	/* ---------------------------------------------------------------------- */

	const persistSetup = useCallback(
		async (values: SetupFormOutput) => {
			if (!canEdit || !mountedRef.current) {
				return;
			}

			pendingSaveRef.current = values;

			if (savingRef.current) {
				return;
			}

			savingRef.current = true;

			try {
				while (pendingSaveRef.current && mountedRef.current) {
					const latestValues = pendingSaveRef.current;
					pendingSaveRef.current = null;

					const payload = mapSetupFormToDto(latestValues);

					/* ------------------------------------------------------ */
					/* NEW PROGRAM                                           */
					/* ------------------------------------------------------ */

					if (mode === "new" && !persistenceRef.current.programId) {
						if (createInFlightRef.current) {
							pendingSaveRef.current = latestValues;
							break;
						}

						createInFlightRef.current = true;

						try {
							const result = await createProgramAsync(payload);

							if (result.programId == null || result.revisionId == null) {
								throw new Error(
									"Create program response did not contain programId/revisionId.",
								);
							}

							persistenceRef.current = {
								programId: result.programId,
								revisionId: result.revisionId,
							};

							/*
							 * Tell the editor that the new program now exists.
							 */
							onCreated?.({
								programId: result.programId,
								revisionId: result.revisionId,
							});
						} finally {
							createInFlightRef.current = false;
						}

						/*
						 * IMPORTANT:
						 *
						 * POST /programs creates the program/revision.
						 * It does NOT save the complete setup DTO.
						 *
						 * Therefore continue and PUT the setup.
						 */
					}

					/* ------------------------------------------------------ */
					/* SETUP UPDATE                                           */
					/* ------------------------------------------------------ */

					const currentProgramId = persistenceRef.current.programId;

					const currentRevisionId = persistenceRef.current.revisionId;

					if (currentProgramId == null || currentRevisionId == null) {
						throw new Error(
							"Cannot save setup without programId and revisionId.",
						);
					}

					await updateSetupAsync({
						programId: currentProgramId,
						revisionId: currentRevisionId,
						payload,
					});
				}

				if (mountedRef.current) {
					updateSectionStatus("setup", "completed");
				}
			} catch (error) {
				if (mountedRef.current) {
					updateSectionStatus("setup", "warning");
				}

				console.error("Program setup autosave failed", error);
			} finally {
				savingRef.current = false;
			}
		},
		[
			canEdit,
			mode,
			createProgramAsync,
			updateSetupAsync,
			onCreated,
			updateSectionStatus,
		],
	);

	/* ---------------------------------------------------------------------- */
	/* Silent auto-save                                                        */
	/* ---------------------------------------------------------------------- */

	const autoSaveSetup = useCallback(async () => {
		if (!canEdit) {
			return;
		}

		if (!hydratedRef.current) {
			return;
		}

		/*
		 * Autosave must not validate the complete UI form.
		 *
		 * The UI contains fields that are not part of the
		 * OpenAPI Setup DTO.
		 *
		 * Example:
		 * - programNumber
		 * - incentiveCodes
		 * - country
		 * - firstVisibleDate
		 *
		 * Those fields can legitimately be empty while the
		 * OpenAPI setup payload is still saveable.
		 */
		const values = form.getValues();
		await persistSetup(values as SetupFormOutput);
		//
	}, [canEdit, form, persistSetup]);

	/* ---------------------------------------------------------------------- */
	/* Auto-save debounce                                                      */
	/* ---------------------------------------------------------------------- */
	const latestValuesRef = useRef<SetupFormOutput | null>(null);
	useEffect(() => {
		if (!canEdit) {
			return;
		}

		const subscription = form.watch((values) => {
			if (!hydratedRef.current) {
				return;
			}

			latestValuesRef.current = values as SetupFormOutput;

			if (saveTimerRef.current !== null) {
				window.clearTimeout(saveTimerRef.current);
			}

			saveTimerRef.current = window.setTimeout(() => {
				saveTimerRef.current = null;

				const latest = latestValuesRef.current;

				if (!latest) {
					return;
				}

				void persistSetup(latest);
			}, AUTO_SAVE_DELAY);
		});

		return () => {
			subscription.unsubscribe();

			if (saveTimerRef.current !== null) {
				window.clearTimeout(saveTimerRef.current);
				saveTimerRef.current = null;
			}
		};
	}, [canEdit, form, persistSetup]);

	/* ---------------------------------------------------------------------- */
	/* Dirty status                                                            */
	/* ---------------------------------------------------------------------- */

	useEffect(() => {
		if (!canEdit) {
			return;
		}

		if (!hydratedRef.current || !form.formState.isDirty) {
			return;
		}

		/*
		 * Don't overwrite "saving".
		 */
		if (savingRef.current) {
			return;
		}

		updateSectionStatus("setup", "warning");
	}, [canEdit, form.formState.isDirty, formValues, updateSectionStatus]);

	/* ---------------------------------------------------------------------- */
	/* Conditional finance terms                                               */
	/* ---------------------------------------------------------------------- */

	useEffect(() => {
		if (purchaseType === "FINANCE") {
			return;
		}

		const currentTerms = form.getValues("financeTerms");

		if (currentTerms.length === 0) {
			return;
		}

		/*
		 * Finance terms are not applicable to Cash.
		 *
		 * This should be considered a user-driven business
		 * state change, so dirty state is intentional.
		 */
		form.setValue("financeTerms", [], {
			shouldDirty: true,
			shouldTouch: false,
			shouldValidate: false,
		});
	}, [purchaseType, form]);

	/* ---------------------------------------------------------------------- */
	/* Manual Save Draft                                                       */
	/* ---------------------------------------------------------------------- */

	const saveSetup = useCallback(async () => {
		if (!canEdit) {
			return;
		}

		/*
		 * Manual save DOES show validation errors.
		 */
		await form.handleSubmit(
			async (values) => {
				await persistSetup(values);
			},
			() => {
				updateSectionStatus("setup", "warning");
			},
		)();
	}, [canEdit, form, persistSetup, updateSectionStatus]);

	/* ---------------------------------------------------------------------- */
	/* Register Save Draft                                                     */
	/* ---------------------------------------------------------------------- */

	useEffect(() => {
		if (!canEdit) {
			registerSaveHandler(null);
			return;
		}

		registerSaveHandler(saveSetup);

		return () => {
			registerSaveHandler(null);
		};
	}, [canEdit, registerSaveHandler, saveSetup]);

	/* ---------------------------------------------------------------------- */
	/* Loading                                                                  */
	/* ---------------------------------------------------------------------- */

	if (isExistingRevision && isSetupLoading) {
		return (
			<div className="rounded-xl border bg-card p-6">
				<p className="text-sm text-muted-foreground">Loading setup...</p>
			</div>
		);
	}

	/* ---------------------------------------------------------------------- */
	/* Error                                                                    */
	/* ---------------------------------------------------------------------- */

	if (isExistingRevision && isSetupError) {
		return (
			<div className="rounded-xl border border-destructive/30 bg-card p-6">
				<div className="flex items-center justify-between gap-4">
					<div>
						<p className="text-sm font-semibold text-destructive">
							Failed to load setup
						</p>

						<p className="mt-1 text-sm text-muted-foreground">
							We couldn't load this revision's setup data.
						</p>
					</div>

					<button
						type="button"
						className="rounded-md border px-3 py-2 text-sm"
						onClick={() => {
							void refetchSetup();
						}}
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	/* ---------------------------------------------------------------------- */
	/* Form                                                                     */
	/* ---------------------------------------------------------------------- */

	return (
		<FormProvider {...form}>
			<form
				className="space-y-5"
				onSubmit={(event) => {
					event.preventDefault();
				}}
				noValidate
			>
				{/* ============================================================ */}
				{/* PROGRAM DETAILS                                              */}
				{/* ============================================================ */}

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
							disabled={!canEdit}
						/>

						<FormInput
							control={form.control}
							name="programNumber"
							label="Program Number"
							required
							placeholder="4821"
							disabled={!canEdit}
						/>

						<FormInput
							control={form.control}
							name="incentiveCodes"
							label="Incentive Codes"
							required
							placeholder="GMF-APR-2027-06"
							disabled={!canEdit}
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
							disabled={!canEdit}
						/>
					</div>
				</ProgramSection>

				{/* ============================================================ */}
				{/* CONTROLLING DATES                                             */}
				{/* ============================================================ */}

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
							disabled={!canEdit}
						/>

						<FormDateInput
							control={form.control}
							name="deliveryEnd"
							label="Delivery End"
							required
							disabled={!canEdit}
						/>

						<div />

						<FormDateInput
							control={form.control}
							name="firstVisibleDate"
							label="First Visible — Date"
							required
							disabled={!canEdit}
						/>

						<FormTimeInput
							control={form.control}
							name="firstVisibleTime"
							label="First Visible — Time"
							disabled={!canEdit}
						/>

						<div />
					</div>

					<div className="mt-4 rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
						First-visible may precede delivery start — it controls when
						downstream services expose the program, which can differ from when
						it becomes active.
					</div>
				</ProgramSection>

				{/* ============================================================ */}
				{/* PROGRAM CONFIGURATION                                         */}
				{/* ============================================================ */}

				<ProgramSection title="Program configuration" description="">
					<div className="grid grid-cols-1 gap-x-5 gap-y-4 lg:grid-cols-12">
						<div className="lg:col-span-5">
							<FormChoiceChipGroup
								control={form.control}
								name="programType"
								label="Program Type"
								required
								options={PROGRAM_TYPE_OPTIONS}
								getValue={(option) => option.value}
								getLabel={(option) => option.label}
								disabled={!canEdit}
							/>
						</div>

						<div className="lg:col-span-3">
							<FormChoiceChipGroup
								control={form.control}
								name="purchaseType"
								label="Purchase Type"
								required
								options={PURCHASE_TYPE_OPTIONS}
								getValue={(option) => option.value}
								getLabel={(option) => option.label}
								disabled={!canEdit}
							/>
						</div>

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
								disabled={!canEdit}
							/>
						</div>

						<div className="lg:col-span-12">
							<FormChoiceChipGroup
								control={form.control}
								name="conditionTier"
								label="Condition Tier"
								required
								options={CONDITION_TIER_OPTIONS}
								getValue={(option) => option.value}
								getLabel={(option) => option.label}
								disabled={!canEdit}
							/>
						</div>

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
								disabled={!canEdit}
							/>
						</div>

						{purchaseType === "FINANCE" && (
							<div className="lg:col-span-12">
								<FormChoiceChipGroup
									control={form.control}
									name="financeTerms"
									label="Terms (Months)"
									selectionMode="multiple"
									options={FINANCE_TERM_OPTIONS}
									getValue={(option) => option.value.toString()}
									getLabel={(option) => option.label}
									disabled={!canEdit}
								/>
							</div>
						)}

						<div className="lg:col-span-12">
							<FormInput
								control={form.control}
								name="contact"
								label="Contact"
								required
								placeholder="Program owner name"
								disabled={!canEdit}
							/>
						</div>
					</div>
				</ProgramSection>

				{/* ============================================================ */}
				{/* FLAGS                                                          */}
				{/* ============================================================ */}

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
								disabled={!canEdit}
							/>
						</FlagCard>

						<FlagCard>
							<FormCheckbox
								control={form.control}
								name="flags.topOfDeal"
								label="Top of Deal"
								description="Program headlines the deal stack."
								disabled={!canEdit}
							/>
						</FlagCard>

						<FlagCard>
							<FormCheckbox
								control={form.control}
								name="flags.noAddOns"
								label="No add-ons"
								description="Program cannot be combined with dealer add-ons."
								disabled={!canEdit}
							/>
						</FlagCard>
					</div>
				</ProgramSection>
			</form>
		</FormProvider>
	);
}