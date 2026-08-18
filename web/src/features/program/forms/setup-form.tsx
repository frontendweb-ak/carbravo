import {
	FormCheckbox,
	FormChoiceChipGroup,
	FormDateInput,
	FormInput,
	FormSelect,
	FormTimeInput,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Alert,
	Box,
	Button,
	Stack,
	Typography,
} from "@mui/material";
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
		<Box
			sx={{
				border: 1,
				borderColor: "divider",
				borderRadius: 3,
				px: 2,
				py: 1.5,
			}}
		>
			{children}
		</Box>
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
	onCreated?: (result: {
		programId: number;
		revisionId: number;
	}) => void;
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
	const {
		registerSaveHandler,
		updateSectionStatus,
	} = useProgramEditor();

	/* ---------------------------------------------------------------------- */
	/* Mode / permissions                                                     */
	/* ---------------------------------------------------------------------- */

	const isExistingRevision =
		mode === "edit" &&
		programId != null &&
		revisionId != null;

	const canEdit =
		mode === "new" ||
		(isExistingRevision && !readOnly);

	/* ---------------------------------------------------------------------- */
	/* API                                                                     */
	/* ---------------------------------------------------------------------- */

	const {
		data: setup,
		isLoading: isSetupLoading,
		isError: isSetupError,
		refetch: refetchSetup,
	} = useProgramSetup(programId, revisionId);

	const {
		mutateAsync: createProgramAsync,
	} = useCreateProgram();

	const {
		mutateAsync: updateSetupAsync,
	} = useUpdateProgramSetup();

	/* ---------------------------------------------------------------------- */
	/* Form                                                                    */
	/* ---------------------------------------------------------------------- */

	const form = useForm<
		SetupFormInput,
		unknown,
		SetupFormOutput
	>({
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
	/* Persistence state                                                       */
	/* ---------------------------------------------------------------------- */

	const persistenceRef = useRef<{
		programId: number | undefined;
		revisionId: number | undefined;
	}>({
		programId,
		revisionId,
	});

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

	const hydratedRevisionRef = useRef<string | null>(
		null,
	);

	useEffect(() => {
		if (!isExistingRevision || !setup) {
			return;
		}

		const hydrationKey = `${programId}:${revisionId}`;

		if (
			hydratedRevisionRef.current ===
			hydrationKey
		) {
			return;
		}

		hydratedRevisionRef.current = hydrationKey;

		hydratedRef.current = false;

		const values =
			mapSetupResponseToForm(setup);

		form.reset(values);

		hydratedRef.current = true;

		updateSectionStatus(
			"setup",
			"completed",
		);
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

		hydratedRef.current = true;
		hydratedRevisionRef.current = "new";
	}, [mode]);

	/* ---------------------------------------------------------------------- */
	/* Autosave state                                                          */
	/* ---------------------------------------------------------------------- */

	const saveTimerRef = useRef<number | null>(
		null,
	);

	const savingRef = useRef(false);

	const pendingSaveRef =
		useRef<SetupFormOutput | null>(null);

	const createInFlightRef = useRef(false);

	const changeVersionRef = useRef(0);

	const latestValuesRef =
		useRef<SetupFormOutput | null>(null);

	/* ---------------------------------------------------------------------- */
	/* Section status                                                          */
	/* ---------------------------------------------------------------------- */

	const sectionStatusRef =
		useRef<string | null>(null);

	const setSetupStatus = useCallback(
		(status: "completed" | "warning") => {
			if (!mountedRef.current) {
				return;
			}

			if (
				sectionStatusRef.current ===
				status
			) {
				return;
			}

			sectionStatusRef.current = status;

			updateSectionStatus(
				"setup",
				status,
			);
		},
		[updateSectionStatus],
	);

	/* ---------------------------------------------------------------------- */
	/* Persistence                                                             */
	/* ---------------------------------------------------------------------- */

	const persistSetup = useCallback(
		async (values: SetupFormOutput) => {
			if (
				!canEdit ||
				!mountedRef.current
			) {
				return;
			}

			pendingSaveRef.current = values;

			if (savingRef.current) {
				return;
			}

			savingRef.current = true;

			try {
				while (
					mountedRef.current &&
					pendingSaveRef.current != null
				) {
					const latestValues =
						pendingSaveRef.current;

					pendingSaveRef.current =
						null;

					const versionAtStart =
						changeVersionRef.current;

					const payload =
						mapSetupFormToDto(
							latestValues,
						);

					/* ====================================================== */
					/* CREATE NEW PROGRAM                                     */
					/* ====================================================== */

					if (
						mode === "new" &&
						persistenceRef.current
							.programId == null
					) {
						if (
							createInFlightRef.current
						) {
							pendingSaveRef.current =
								latestValues;

							break;
						}

						createInFlightRef.current =
							true;

						try {
							const created =
								await createProgramAsync(
									{
										programName:
											latestValues.programName,
									},
								);

							if (
								created.programId ==
									null ||
								created.revisionId ==
									null
							) {
								throw new Error(
									"Create program response did not contain programId and revisionId.",
								);
							}

							persistenceRef.current =
								{
									programId:
										created.programId,
									revisionId:
										created.revisionId,
								};
						} finally {
							createInFlightRef.current =
								false;
						}
					}

					/* ====================================================== */
					/* UPDATE SETUP                                           */
					/* ====================================================== */

					const currentProgramId =
						persistenceRef.current
							.programId;

					const currentRevisionId =
						persistenceRef.current
							.revisionId;

					if (
						currentProgramId == null ||
						currentRevisionId == null
					) {
						throw new Error(
							"Cannot save setup without programId and revisionId.",
						);
					}

					await updateSetupAsync({
						programId:
							currentProgramId,
						revisionId:
							currentRevisionId,
						payload,
					});

					/* ====================================================== */
					/* NEW PROGRAM CREATED                                    */
					/* ====================================================== */

					if (
						mode === "new" &&
						versionAtStart ===
							changeVersionRef.current
					) {
						const createdProgramId =
							persistenceRef.current
								.programId;

						const createdRevisionId =
							persistenceRef.current
								.revisionId;

						if (
							createdProgramId !=
								null &&
							createdRevisionId !=
								null
						) {
							onCreated?.({
								programId:
									createdProgramId,
								revisionId:
									createdRevisionId,
							});
						}
					}

					/* ====================================================== */
					/* CHANGES DURING REQUEST                                */
					/* ====================================================== */

					if (
						changeVersionRef.current !==
							versionAtStart &&
						latestValuesRef.current !=
							null &&
						pendingSaveRef.current ==
							null
					) {
						pendingSaveRef.current =
							latestValuesRef.current;
					}
				}

				if (mountedRef.current) {
					setSetupStatus(
						"completed",
					);
				}
			} catch (error) {
				console.error(
					"[SetupForm] autosave failed",
					error,
				);

				if (mountedRef.current) {
					setSetupStatus(
						"warning",
					);
				}
			} finally {
				savingRef.current = false;

				if (
					mountedRef.current &&
					pendingSaveRef.current !=
						null &&
					!savingRef.current
				) {
					queueMicrotask(() => {
						if (
							mountedRef.current &&
							pendingSaveRef.current !=
								null
						) {
							void persistSetup(
								pendingSaveRef.current,
							);
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
	/* Persistence ref                                                         */
	/* ---------------------------------------------------------------------- */

	const persistSetupRef =
		useRef<typeof persistSetup>(
			persistSetup,
		);

	useEffect(() => {
		persistSetupRef.current =
			persistSetup;
	}, [persistSetup]);

	/* ---------------------------------------------------------------------- */
	/* Auto-save subscription                                                  */
	/* ---------------------------------------------------------------------- */

	useEffect(() => {
		if (!canEdit) {
			return;
		}

		const subscription =
			form.watch((values) => {
				if (!hydratedRef.current) {
					return;
				}

				if (!mountedRef.current) {
					return;
				}

				const nextValues =
					values as SetupFormOutput;

				latestValuesRef.current =
					nextValues;

				changeVersionRef.current += 1;

				setSetupStatus("warning");

				if (
					saveTimerRef.current !== null
				) {
					window.clearTimeout(
						saveTimerRef.current,
					);
				}

				saveTimerRef.current =
					window.setTimeout(() => {
						saveTimerRef.current =
							null;

						if (
							!mountedRef.current
						) {
							return;
						}

						const latest =
							latestValuesRef.current;

						if (!latest) {
							return;
						}

						void persistSetupRef.current(
							latest,
						);
					}, AUTO_SAVE_DELAY);
			});

		return () => {
			subscription.unsubscribe();

			if (
				saveTimerRef.current !== null
			) {
				window.clearTimeout(
					saveTimerRef.current,
				);

				saveTimerRef.current = null;
			}
		};
	}, [
		canEdit,
		form,
		setSetupStatus,
	]);

	/* ---------------------------------------------------------------------- */
	/* Conditional finance terms                                               */
	/* ---------------------------------------------------------------------- */

	useEffect(() => {
		if (purchaseType === "FINANCE") {
			return;
		}

		const currentTerms =
			form.getValues(
				"financeTerms",
			);

		if (currentTerms.length === 0) {
			return;
		}

		form.setValue(
			"financeTerms",
			[],
			{
				shouldDirty: true,
				shouldTouch: false,
				shouldValidate: false,
			},
		);
	}, [purchaseType, form]);

	/* ---------------------------------------------------------------------- */
	/* Manual Save Draft                                                       */
	/* ---------------------------------------------------------------------- */

	const saveSetupRef =
		useRef<(() => Promise<void>) | null>(
			null,
		);

	saveSetupRef.current = async () => {
		if (!canEdit) {
			return;
		}

		await form.handleSubmit(
			async (values) => {
				if (
					saveTimerRef.current !==
					null
				) {
					window.clearTimeout(
						saveTimerRef.current,
					);

					saveTimerRef.current = null;
				}

				latestValuesRef.current =
					values;

				changeVersionRef.current += 1;

				await persistSetupRef.current(
					values,
				);
			},
			() => {
				setSetupStatus("warning");
			},
		)();
	};

	/* ---------------------------------------------------------------------- */
	/* Register Save Draft                                                     */
	/* ---------------------------------------------------------------------- */

	const stableSaveHandlerRef =
		useRef(async () => {
			await saveSetupRef.current?.();
		});

	useEffect(() => {
		if (!canEdit) {
			registerSaveHandler(null);
			return;
		}

		registerSaveHandler(
			stableSaveHandlerRef.current,
		);

		return () => {
			registerSaveHandler(null);
		};
	}, [
		canEdit,
		registerSaveHandler,
	]);

	/* ---------------------------------------------------------------------- */
	/* Loading                                                                  */
	/* ---------------------------------------------------------------------- */

	if (
		isExistingRevision &&
		isSetupLoading
	) {
		return (
			<Box
				sx={{
					border: 1,
					borderColor: "divider",
					borderRadius: 3,
					bgcolor:
						"background.paper",
					p: 3,
				}}
			>
				<Typography
					variant="body2"
					color="text.secondary"
				>
					Loading setup...
				</Typography>
			</Box>
		);
	}

	/* ---------------------------------------------------------------------- */
	/* Error                                                                    */
	/* ---------------------------------------------------------------------- */

	if (
		isExistingRevision &&
		isSetupError
	) {
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
				sx={{
					alignItems: "center",
				}}
			>
				<Stack spacing={0.5}>
					<Typography
						variant="body2"
						sx={{fontWeight:600}}
						
					>
						Failed to load setup
					</Typography>

					<Typography variant="body2">
						We couldn't load this
						revision's setup data.
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
							options={COUNTRY_OPTIONS}
							disabled={!canEdit}
						/>
					</Box>
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
							required
							disabled={!canEdit}
						/>

						<FormTimeInput
							control={form.control}
							name="firstVisibleTime"
							label="First Visible — Time"
							disabled={!canEdit}
						/>

						<Box />
					</Box>

					<Alert
						severity="info"
						variant="standard"
						sx={{
							mt: 2,
							borderRadius: 2,
						}}
					>
						First-visible may precede delivery start — it controls when
						downstream services expose the program, which can differ from when
						it becomes active.
					</Alert>
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

						<Box
							sx={{
								gridColumn: {
									xs: "span 1",
									lg: "span 5",
								},
							}}
						>
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
									name="financeTerms"
									label="Terms (Months)"
									selectionMode="multiple"
									options={FINANCE_TERM_OPTIONS}
									disabled={!canEdit}
									color="info"
								/>
							</Box>
						)}

						{/* Contact */}

						<Box
							sx={{
								gridColumn: {
									xs: "span 1",
									lg: "span 12",
								},
							}}
						>
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
					</Box>
				</ProgramSection>
			</Stack>
		</FormProvider>
	);
}