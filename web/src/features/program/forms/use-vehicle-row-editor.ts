import { useCallback, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
	useResolveVehicleFilters,
	useUpdateProgramVehicles,
} from "../hooks/use-program-vehicles";
import { emptyVehicleFilterRow } from "../constants";
import type { VehicleFilterRow, VehiclesFormValues } from "../schema";

interface UseVehicleRowEditorOptions {
	form: UseFormReturn<VehiclesFormValues>;
	programId?: number;
	revisionId?: number;
	canEdit: boolean;
	setSectionSaving: (saving: boolean) => void;
}

export function useVehicleRowEditor({
	form,
	programId,
	revisionId,
	canEdit,
	setSectionSaving,
}: UseVehicleRowEditorOptions) {
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const resolveVehicleFilters = useResolveVehicleFilters();
	const { mutateAsync: updateVehiclesAsync, isPending: isUpdatingVehicles } =
		useUpdateProgramVehicles();

	const selectedRows = form.watch("selectedRows") ?? [];
	const currentRow = form.watch("currentRow") ?? emptyVehicleFilterRow;

	const persistRows = useCallback(
		async (rows: VehicleFilterRow[]) => {
			// New programs do not have a revision ID until Setup is created.
			if (!canEdit || programId == null || revisionId == null) return;

			const resolved = await resolveVehicleFilters(rows);
			const vehicleCatalogIds = [...new Set(resolved.vehicleCatalogIds)];

			await updateVehiclesAsync({
				programId,
				revisionId,
				payload: { vehicleCatalogIds },
			});
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
		},
		[canEdit, form, selectedRows],
	);

	const onCancelEdit = useCallback(() => {
		setEditingIndex(null);
		form.setValue("currentRow", { ...emptyVehicleFilterRow });
	}, [form]);

	const onDeleteRow = useCallback(
		async (index: number) => {
			if (!canEdit || isUpdatingVehicles) return;

			const nextRows = selectedRows.filter((_, rowIndex) => rowIndex !== index);
			setSectionSaving(true);

			try {
				await persistRows(nextRows);
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
			} catch (error) {
				console.error("Failed to remove vehicle selection:", error);
			} finally {
				setSectionSaving(false);
			}
		},
		[
			canEdit,
			editingIndex,
			form,
			isUpdatingVehicles,
			persistRows,
			selectedRows,
			setSectionSaving,
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

			setSectionSaving(true);

			try {
				await persistRows(nextRows);

				// Update local committed rows only after the API save succeeds.
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
			} catch (error) {
				console.error("Failed to save vehicle selection:", error);
			} finally {
				setSectionSaving(false);
			}
		},
		[
			canEdit,
			editingIndex,
			form,
			isUpdatingVehicles,
			persistRows,
			setSectionSaving,
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
