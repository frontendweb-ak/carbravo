import { useCallback, useState } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import {
	useResolveVehicleFilters,
	useUpdateProgramVehicles,
} from "../hooks/use-program-vehicles";
import { emptyVehicleFilterRow } from "../constants";
import type { ProgramSaveStatus } from "../editor/program-editor-context";
import type { VehicleFilterRow, VehiclesFormValues } from "../schema";

interface UseVehicleRowEditorOptions {
	form: UseFormReturn<VehiclesFormValues>;
	programId?: number;
	revisionId?: number;
	canEdit: boolean;
	setSaveStatus: (status: ProgramSaveStatus, error?: string | null) => void;
}

function getErrorMessage(error: unknown): string {
	return error instanceof Error
		? error.message
		: "Vehicle selection could not be saved.";
}

export function useVehicleRowEditor({
	form,
	programId,
	revisionId,
	canEdit,
	setSaveStatus,
}: UseVehicleRowEditorOptions) {
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const resolveVehicleFilters = useResolveVehicleFilters();
	const { mutateAsync: updateVehiclesAsync, isPending: isUpdatingVehicles } =
		useUpdateProgramVehicles();

	const selectedRows =
		useWatch({ control: form.control, name: "selectedRows" }) ?? [];
	const currentRow =
		useWatch({ control: form.control, name: "currentRow" }) ??
		emptyVehicleFilterRow;

	const persistRows = useCallback(
		async (rows: VehicleFilterRow[]): Promise<boolean> => {
			// New programs keep vehicle selections local until Setup creates a revision.
			if (!canEdit || programId == null || revisionId == null) return false;

			const resolved = await resolveVehicleFilters(rows);
			const vehicleCatalogIds = [...new Set(resolved.vehicleCatalogIds)];

			await updateVehiclesAsync({
				programId,
				revisionId,
				payload: { vehicleCatalogIds },
			});
			return true;
		},
		[canEdit, programId, revisionId, resolveVehicleFilters, updateVehiclesAsync],
	);

	const onEditRow = useCallback(
		(index: number) => {
			if (!canEdit) return;

			const row = selectedRows[index];
			if (!row) return;

			form.setValue(
				"currentRow",
				{
					modelYears: [...row.modelYears],
					makes: [...row.makes],
					models: [...row.models],
					fuelTypes: [...row.fuelTypes],
					segments: [...row.segments],
				},
				{ shouldDirty: false },
			);
			setEditingIndex(index);
			setSaveStatus("unsaved");
		},
		[canEdit, form, selectedRows, setSaveStatus],
	);

	const onCancelEdit = useCallback(() => {
		setEditingIndex(null);
		form.setValue("currentRow", { ...emptyVehicleFilterRow });
		setSaveStatus(
			programId != null && revisionId != null
				? selectedRows.length > 0 ? "saved" : "idle"
				: selectedRows.length > 0 ? "unsaved" : "idle",
		);
	}, [form, programId, revisionId, selectedRows.length, setSaveStatus]);

	const onDeleteRow = useCallback(
		async (index: number) => {
			if (!canEdit || isUpdatingVehicles) return;

			const nextRows = selectedRows.filter((_, rowIndex) => rowIndex !== index);
			setSaveStatus("saving");

			try {
				const persisted = await persistRows(nextRows);
				form.setValue("selectedRows", nextRows, {
					shouldDirty: false,
					shouldValidate: true,
				});

				if (editingIndex === index) {
					setEditingIndex(null);
					form.setValue("currentRow", { ...emptyVehicleFilterRow });
				} else if (editingIndex !== null && index < editingIndex) {
					setEditingIndex((current) =>
						current === null ? null : current - 1,
					);
				}

				setSaveStatus(persisted ? "saved" : "unsaved");
			} catch (error) {
				setSaveStatus("error", getErrorMessage(error));
				console.error("Failed to remove vehicle selection:", error);
			}
		},
		[
			canEdit,
			editingIndex,
			form,
			isUpdatingVehicles,
			persistRows,
			selectedRows,
			setSaveStatus,
		],
	);

	const onCommitRow = useCallback(
		async (values: VehiclesFormValues) => {
			if (!canEdit || isUpdatingVehicles) return;

			const row = values.currentRow;
			const missingRequired =
				row.modelYears.length === 0 ||
				row.makes.length === 0 ||
				row.models.length === 0 ||
				row.fuelTypes.length === 0;

			if (missingRequired) {
				setSaveStatus("invalid");
				form.setError("currentRow.modelYears", {
					type: "manual",
					message: "Model year, make, model and fuel type are required.",
				});
				return;
			}

			const nextRow: VehicleFilterRow = {
				modelYears: [...row.modelYears],
				makes: [...row.makes],
				models: [...row.models],
				fuelTypes: [...row.fuelTypes],
				segments: [...row.segments],
			};
			const nextRows =
				editingIndex === null
					? [...values.selectedRows, nextRow]
					: values.selectedRows.map((existingRow, index) =>
							index === editingIndex ? nextRow : existingRow,
						);

			setSaveStatus("saving");

			try {
				const persisted = await persistRows(nextRows);

				// Update local committed rows only after a remote save succeeds,
				// or after the new-program selection is intentionally kept local.
				form.setValue("selectedRows", nextRows, {
					shouldDirty: false,
					shouldValidate: true,
				});
				form.setValue(
					"currentRow",
					{ ...emptyVehicleFilterRow },
					{ shouldDirty: false, shouldValidate: false },
				);
				setEditingIndex(null);
				form.clearErrors();
				setSaveStatus(persisted ? "saved" : "unsaved");
			} catch (error) {
				setSaveStatus("error", getErrorMessage(error));
				console.error("Failed to save vehicle selection:", error);
			}
		},
		[
			canEdit,
			editingIndex,
			form,
			isUpdatingVehicles,
			persistRows,
			setSaveStatus,
		],
	);

	return {
		selectedRows,
		currentRow,
		editingIndex,
		onEditRow,
		onCancelEdit,
		onDeleteRow,
		onCommitRow,
	};
}
