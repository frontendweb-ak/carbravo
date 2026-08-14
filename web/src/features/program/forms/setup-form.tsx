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

	/* ---------------------------------------------------------------------- */
	/* API                                                                     */
	/* ---------------------------------------------------------------------- */

	const {
		data: setup,
		isLoading: isSetupLoading,
		isError: isSetupError,
		refetch: refetchSetup,
	} = useProgramSetup(programId, revisionId);

	const { mutateAsync: createProgramAsync } = useCreateProgram();
	const { mutateAsync: updateSetupAsync } = useUpdateProgramSetup();

	/* ---------------------------------------------------------------------- */
	/* Form                                                                    */
	/* ---------------------------------------------------------------------- */

	const form = useForm<SetupFormInput, unknown, SetupFormOutput>({
		resolver: zodResolver(setupFormSchema),
		defaultValues: setupDefaultValues,

		/*
		 * Manual Save Draft validates.
		 *
		 * Autosave does NOT call trigger() / handleSubmit().
		 */
		mode: "onBlur",
		reValidateMode: "onBlur",
	});

	const purchaseType = useWatch({
		control: form.control,
		name: "purchaseType",
	});

	/* ---------------------------------------------------------------------- */
	/* Persistence state                                                       */
	/* ---------------------------------------------------------------------- */

	/**
	 * The IDs used by persistence.
	 *
	 * EDIT:
	 *   initialized with programId/revisionId.
	 *
	 * NEW:
	 *   initially empty.
	 *   populated after POST /programs succeeds.
	 */
	const persistenceRef = useRef<{
		programId: number | undefined;
		revisionId: number | undefined;
	}>({
		programId,
		revisionId,
	});

	/**
	 * Keep edit IDs synchronized with route/context.
	 */
	useEffect(() => {
		if (mode !== "edit") {
			return;
		}

		persistenceRef.current = {
			programId,
			revisionId,
		};
	}, [mode, programId, revisionId]);

	/* ---------------------------------------------------------------------- */
	/* Lifecycle                                                               */
	/* ---------------------------------------------------------------------- */

	const mountedRef = useRef(false);

	useEffect(() => {
		mountedRef.current = true;

		return () => {
			mountedRef.current = false;
		};
	}, []);

	/* ---------------------------------------------------------------------- */
	/* Hydration                                                               */
	/* ---------------------------------------------------------------------- */

	const hydratedRef = useRef(false);

	/**
	 * Prevent the same revision from being hydrated repeatedly.
	 *
	 * This is important because React Query can update the `setup`
	 * object without meaning that the user changed the form.
	 */
	const hydratedRevisionRef = useRef<string | null>(null);

	useEffect(() => {
		if (!isExistingRevision || !setup) {
			return;
		}

		const hydrationKey = `${programId}:${revisionId}`;

		if (hydratedRevisionRef.current === hydrationKey) {
			return;
		}

		hydratedRevisionRef.current = hydrationKey;

		/*
		 * Block autosave BEFORE reset().
		 */
		hydratedRef.current = false;

		const values = mapSetupResponseToForm(setup);

		form.reset(values);

		/*
		 * Hydration is complete.
		 *
		 * reset() has finished and the form is now safe to watch.
		 */
		hydratedRef.current = true;

		/*
		 * This happens once for the loaded revision.
		 *
		 * It is NOT inside a dirty-state effect.
		 */
		updateSectionStatus("setup", "completed");
	}, [
		isExistingRevision,
		setup,
		programId,
		revisionId,
		form,
		updateSectionStatus,
	]);

	/* ---------------------------------------------------------------------- */
	/* New program hydration                                                   */
	/* ---------------------------------------------------------------------- */

	useEffect(() => {
		if (mode !== "new") {
			return;
		}

		/*
		 * New form starts with setupDefaultValues.
		 *
		 * There is no API hydration.
		 */
		hydratedRef.current = true;
		hydratedRevisionRef.current = "new";
	}, [mode]);

	/* ---------------------------------------------------------------------- */
	/* Autosave state                                                          */
	/* ---------------------------------------------------------------------- */

	const saveTimerRef = useRef<number | null>(null);

	const savingRef = useRef(false);

	const pendingSaveRef = useRef<SetupFormOutput | null>(null);

	const createInFlightRef = useRef(false);

	/**
	 * Incremented every time the user changes a field.
	 *
	 * Used to determine whether another edit happened while an
	 * API request was running.
	 */
	const changeVersionRef = useRef(0);

	/**
	 * Latest form values.
	 */
	const latestValuesRef = useRef<SetupFormOutput | null>(null);

	/* ---------------------------------------------------------------------- */
	/* Section status                                                          */
	/* ---------------------------------------------------------------------- */

	/**
	 * Keep the last status locally so we don't repeatedly call
	 * updateSectionStatus() with the same value.
	 */
	const sectionStatusRef = useRef<string | null>(null);

	const setSetupStatus = useCallback(
		(status: "completed" | "warning") => {
			if (!mountedRef.current) {
				return;
			}

			if (sectionStatusRef.current === status) {
				return;
			}

			sectionStatusRef.current = status;

			updateSectionStatus("setup", status);
		},
		[updateSectionStatus],
	);

	/* ---------------------------------------------------------------------- */
	/* Persistence                                                             */
	/* ---------------------------------------------------------------------- */

	const persistSetup = useCallback(
		async (values: SetupFormOutput) => {
			if (!canEdit || !mountedRef.current) {
				return;
			}

			/*
			 * Always replace pending values with the newest values.
			 */
			pendingSaveRef.current = values;

			/*
			 * A save is already running.
			 *
			 * Do NOT start another request.
			 *
			 * The current request will loop and consume
			 * pendingSaveRef when it finishes.
			 */
			if (savingRef.current) {
				return;
			}

			savingRef.current = true;

			try {
				while (mountedRef.current && pendingSaveRef.current != null) {
					const latestValues = pendingSaveRef.current;

					pendingSaveRef.current = null;

					const versionAtStart = changeVersionRef.current;

					const payload = mapSetupFormToDto(latestValues);

					/* ====================================================== */
					/* CREATE NEW PROGRAM                                     */
					/* ====================================================== */

					if (mode === "new" && persistenceRef.current.programId == null) {
						/*
						 * Prevent duplicate POST /programs.
						 */
						if (createInFlightRef.current) {
							pendingSaveRef.current = latestValues;
							break;
						}

						createInFlightRef.current = true;

						try {
							/*
							 * IMPORTANT:
							 *
							 * POST /programs is NOT the setup endpoint.
							 *
							 * Hono:
							 *
							 * POST /api/programs
							 *
							 * expects the program creation DTO.
							 */
							const created = await createProgramAsync({
								programName: latestValues.programName,
							});

							if (created.programId == null || created.revisionId == null) {
								throw new Error(
									"Create program response did not contain programId and revisionId.",
								);
							}

							/*
							 * Store IDs BEFORE doing the setup PUT.
							 */
							persistenceRef.current = {
								programId: created.programId,
								revisionId: created.revisionId,
							};
						} finally {
							createInFlightRef.current = false;
						}
					}

					/* ====================================================== */
					/* UPDATE SETUP                                           */
					/* ====================================================== */

					const currentProgramId = persistenceRef.current.programId;

					const currentRevisionId = persistenceRef.current.revisionId;

					if (currentProgramId == null || currentRevisionId == null) {
						throw new Error(
							"Cannot save setup without programId and revisionId.",
						);
					}

					/*
					 * This is the actual setup persistence endpoint:
					 *
					 * PUT /api/programs/:programId/revisions/:revisionId/setup
					 */
					await updateSetupAsync({
						programId: currentProgramId,
						revisionId: currentRevisionId,
						payload,
					});

					/*
					 * Only after BOTH:
					 *
					 * POST /programs
					 * AND
					 * PUT /programs/:id/revisions/:revisionId/setup
					 *
					 * succeeded do we tell the editor that the new
					 * program exists.
					 *
					 * This prevents navigation/unmount before setup
					 * has been persisted.
					 */
					if (mode === "new" && versionAtStart === changeVersionRef.current) {
						const createdProgramId = persistenceRef.current.programId;

						const createdRevisionId = persistenceRef.current.revisionId;

						if (createdProgramId != null && createdRevisionId != null) {
							onCreated?.({
								programId: createdProgramId,
								revisionId: createdRevisionId,
							});
						}
					}

					/*
					 * If the user changed something while the request
					 * was running, don't consider this the final save.
					 *
					 * The watch subscription will have placed the
					 * newest values into pendingSaveRef.
					 */
					if (
						changeVersionRef.current !== versionAtStart &&
						latestValuesRef.current != null &&
						pendingSaveRef.current == null
					) {
						pendingSaveRef.current = latestValuesRef.current;
					}
				}

				if (mountedRef.current) {
					setSetupStatus("completed");
				}
			} catch (error) {
				console.error("[SetupForm] autosave failed", error);

				if (mountedRef.current) {
					setSetupStatus("warning");
				}
			} finally {
				savingRef.current = false;

				/*
				 * Race protection:
				 *
				 * If a change arrived after the while-loop checked
				 * pendingSaveRef, schedule one more save.
				 */
				if (
					mountedRef.current &&
					pendingSaveRef.current != null &&
					!savingRef.current
				) {
					queueMicrotask(() => {
						if (mountedRef.current && pendingSaveRef.current != null) {
							void persistSetup(pendingSaveRef.current);
						}
					});
				}
			}
		},
		[
			canEdit,
			mode,
			createProgramAsync,
			updateSetupAsync,
			onCreated,
			setSetupStatus,
		],
	);

	/* ---------------------------------------------------------------------- */
	/* Keep persistence function in a ref                                      */
	/* ---------------------------------------------------------------------- */

	/**
	 * The watch subscription should NOT be recreated whenever
	 * persistSetup changes identity.
	 *
	 * This is one of the important protections against the
	 * autosave render loop.
	 */
	const persistSetupRef = useRef<typeof persistSetup>(persistSetup);

	useEffect(() => {
		persistSetupRef.current = persistSetup;
	}, [persistSetup]);

	/* ---------------------------------------------------------------------- */
	/* Auto-save subscription                                                  */
	/* ---------------------------------------------------------------------- */

	useEffect(() => {
		if (!canEdit) {
			return;
		}

		/*
		 * Subscribe once for the current editable form.
		 *
		 * We intentionally do NOT use:
		 *
		 *   [formValues, isDirty, persistSetup]
		 *
		 * because those dependencies can recreate the subscription
		 * and timer repeatedly.
		 */
		const subscription = form.watch((values) => {
			if (!hydratedRef.current) {
				return;
			}

			if (!mountedRef.current) {
				return;
			}

			const nextValues = values as SetupFormOutput;

			latestValuesRef.current = nextValues;

			changeVersionRef.current += 1;

			/*
			 * User changed something.
			 */
			setSetupStatus("warning");

			/*
			 * Debounce.
			 */
			if (saveTimerRef.current !== null) {
				window.clearTimeout(saveTimerRef.current);
			}

			saveTimerRef.current = window.setTimeout(() => {
				saveTimerRef.current = null;

				if (!mountedRef.current) {
					return;
				}

				const latest = latestValuesRef.current;

				if (!latest) {
					return;
				}

				void persistSetupRef.current(latest);
			}, AUTO_SAVE_DELAY);
		});

		return () => {
			subscription.unsubscribe();

			if (saveTimerRef.current !== null) {
				window.clearTimeout(saveTimerRef.current);

				saveTimerRef.current = null;
			}
		};
	}, [canEdit, form, setSetupStatus]);

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
		 * Cash programs do not have finance terms.
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

	const saveSetupRef = useRef<(() => Promise<void>) | null>(null);

	saveSetupRef.current = async () => {
		if (!canEdit) {
			return;
		}

		/*
		 * Manual save intentionally validates the complete form.
		 */
		await form.handleSubmit(
			async (values) => {
				/*
				 * Cancel a pending debounce timer because the user
				 * explicitly clicked Save Draft.
				 */
				if (saveTimerRef.current !== null) {
					window.clearTimeout(saveTimerRef.current);

					saveTimerRef.current = null;
				}

				latestValuesRef.current = values;

				changeVersionRef.current += 1;

				await persistSetupRef.current(values);
			},
			() => {
				setSetupStatus("warning");
			},
		)();
	};

	/* ---------------------------------------------------------------------- */
	/* Register Save Draft                                                     */
	/* ---------------------------------------------------------------------- */

	/**
	 * Stable wrapper.
	 *
	 * IMPORTANT:
	 *
	 * Do NOT register `saveSetup` directly because its identity can
	 * change on every render.
	 */
	const stableSaveHandlerRef = useRef(async () => {
		await saveSetupRef.current?.();
	});

	useEffect(() => {
		if (!canEdit) {
			registerSaveHandler(null);
			return;
		}

		registerSaveHandler(stableSaveHandlerRef.current);

		return () => {
			registerSaveHandler(null);
		};
	}, [canEdit, registerSaveHandler]);

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