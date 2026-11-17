import { useCallback, useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";

import type {
	CreateProgramRequestDto,
	CreateProgramResponseDto,
} from "../api/programs.api";
import type {
	ProgramSetupDto,
	ProgramSetupResponseDto,
	SaveProgramSetupResponseDto,
} from "../api/setup.api";
import type {
	ProgramEditorMode,
	ProgramSaveStatus,
	ProgramSectionStatus,
} from "../editor/program-editor-context";
import {
	mapSetupFormToDto,
	mapSetupResponseToForm,
} from "../model/setup.mapper";
import type { SetupFormInput, SetupFormOutput } from "./setup-form.types";

const AUTO_SAVE_DELAY = 1000;

type UpdateSetupVariables = {
	programId: number;
	revisionId: number;
	payload: ProgramSetupDto;
};

interface UseSetupFormPersistenceOptions {
	mode: ProgramEditorMode;
	programId?: number;
	revisionId?: number;
	isExistingRevision: boolean;
	canEdit: boolean;
	setup?: ProgramSetupResponseDto;
	form: UseFormReturn<SetupFormInput, unknown, SetupFormOutput>;
	createProgram: (
		payload: CreateProgramRequestDto,
	) => Promise<CreateProgramResponseDto>;
	updateSetup: (
		variables: UpdateSetupVariables,
	) => Promise<SaveProgramSetupResponseDto>;
	onCreated?: (result: { programId: number; revisionId: number }) => void;
	updateSectionStatus: (
		sectionId: string,
		status: ProgramSectionStatus,
	) => void;
	registerSaveHandler: (handler: (() => Promise<void>) | null) => void;
	setSaveStatus: (status: ProgramSaveStatus, error?: string | null) => void;
}

export function useSetupFormPersistence({
	mode,
	programId,
	revisionId,
	isExistingRevision,
	canEdit,
	setup,
	form,
	createProgram,
	updateSetup,
	onCreated,
	updateSectionStatus,
	registerSaveHandler,
	setSaveStatus,
}: UseSetupFormPersistenceOptions): void {
	const persistenceRef = useRef({
		programId,
		revisionId,
	});
	const mountedRef = useRef(false);
	const hydratedRef = useRef(false);
	const hydratedRevisionRef = useRef<string | null>(null);
	const saveTimerRef = useRef<number | null>(null);
	const savingRef = useRef(false);
	const pendingSaveRef = useRef<SetupFormOutput | null>(null);
	const createInFlightRef = useRef(false);
	const changeVersionRef = useRef(0);
	const latestValuesRef = useRef<SetupFormOutput | null>(null);
	const sectionStatusRef = useRef<"completed" | "warning" | null>(null);
	const persistSetupRef = useRef<(values: SetupFormOutput) => Promise<void>>(
		async () => undefined,
	);
	const saveSetupRef = useRef<(() => Promise<void>) | null>(null);
	const stableSaveHandlerRef = useRef(async () => {
		await saveSetupRef.current?.();
	});

	useEffect(() => {
		mountedRef.current = true;

		return () => {
			mountedRef.current = false;
		};
	}, []);

	useEffect(() => {
		if (mode !== "edit") return;
		persistenceRef.current = { programId, revisionId };
	}, [mode, programId, revisionId]);

	useEffect(() => {
		if (!isExistingRevision || !setup) return;

		const hydrationKey = `${programId}:${revisionId}`;
		if (hydratedRevisionRef.current === hydrationKey) return;

		hydratedRevisionRef.current = hydrationKey;
		hydratedRef.current = false;
		form.reset(mapSetupResponseToForm(setup));
		hydratedRef.current = true;
		updateSectionStatus("setup", "completed");
	}, [
		isExistingRevision,
		setup,
		programId,
		revisionId,
		form,
		updateSectionStatus,
	]);

	useEffect(() => {
		if (mode !== "new") return;
		hydratedRef.current = true;
		hydratedRevisionRef.current = "new";
	}, [mode]);

	const setSetupStatus = useCallback(
		(status: "completed" | "warning") => {
			if (!mountedRef.current || sectionStatusRef.current === status) return;

			sectionStatusRef.current = status;
			updateSectionStatus("setup", status);
		},
		[updateSectionStatus],
	);

	const persistSetup = useCallback(
		async (values: SetupFormOutput) => {
			if (!canEdit || !mountedRef.current) return;

			setSaveStatus("saving");
			pendingSaveRef.current = values;
			if (savingRef.current) return;

			savingRef.current = true;

			try {
				while (mountedRef.current && pendingSaveRef.current != null) {
					const latestValues = pendingSaveRef.current;
					pendingSaveRef.current = null;
					const versionAtStart = changeVersionRef.current;
					const payload = mapSetupFormToDto(latestValues, setup);

					if (mode === "new" && persistenceRef.current.programId == null) {
						if (createInFlightRef.current) {
							pendingSaveRef.current = latestValues;
							break;
						}

						createInFlightRef.current = true;

						try {
							const created = await createProgram({
								programName: latestValues.programName,
							});

							if (created.programId == null || created.revisionId == null) {
								throw new Error(
									"Create program response did not contain programId and revisionId.",
								);
							}

							persistenceRef.current = {
								programId: created.programId,
								revisionId: created.revisionId,
							};
						} finally {
							createInFlightRef.current = false;
						}
					}

					const currentProgramId = persistenceRef.current.programId;
					const currentRevisionId = persistenceRef.current.revisionId;

					if (currentProgramId == null || currentRevisionId == null) {
						throw new Error(
							"Cannot save setup without programId and revisionId.",
						);
					}

					await updateSetup({
						programId: currentProgramId,
						revisionId: currentRevisionId,
						payload,
					});

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
					setSaveStatus("saved");
				}
			} catch (error) {
				console.error("[SetupForm] autosave failed", error);

				if (mountedRef.current) {
					setSetupStatus("warning");
					setSaveStatus(
						"error",
						error instanceof Error ? error.message : "Setup could not be saved.",
					);
				}
			} finally {
				savingRef.current = false;

				if (
					mountedRef.current &&
					pendingSaveRef.current != null &&
					!savingRef.current
				) {
					queueMicrotask(() => {
						if (mountedRef.current && pendingSaveRef.current != null) {
							void persistSetupRef.current(pendingSaveRef.current);
						}
					});
				}
			}
		},
		[
			canEdit,
			mode,
			setup,
			createProgram,
			updateSetup,
			onCreated,
			setSetupStatus,
			setSaveStatus,
		],
	);

	useEffect(() => {
		persistSetupRef.current = persistSetup;
	}, [persistSetup]);

	useEffect(() => {
		if (!canEdit) return;

		const subscription = form.watch((values) => {
			if (!hydratedRef.current || !mountedRef.current) return;

			const nextValues = values as SetupFormOutput;
			latestValuesRef.current = nextValues;
			changeVersionRef.current += 1;
			setSetupStatus("warning");
			setSaveStatus("unsaved");

			if (saveTimerRef.current !== null) {
				window.clearTimeout(saveTimerRef.current);
			}

			saveTimerRef.current = window.setTimeout(() => {
				saveTimerRef.current = null;
				if (!mountedRef.current) return;

				const latestValues = latestValuesRef.current;
				if (latestValues) {
					// Autosave intentionally persists incomplete draft data.
					void persistSetupRef.current(latestValues);
				}
			}, AUTO_SAVE_DELAY);
		});

		return () => {
			subscription.unsubscribe();

			if (saveTimerRef.current !== null) {
				window.clearTimeout(saveTimerRef.current);
				saveTimerRef.current = null;
			}
		};
	}, [canEdit, form, setSetupStatus, setSaveStatus]);

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

	saveSetupRef.current = async () => {
		if (!canEdit) return;

		await form.handleSubmit(
			async (values) => {
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
				setSaveStatus("invalid");
			},
		)();
	};
}
