import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import {
	SelectedVehiclesSection,
	VehicleFilterBuilder,
} from "@/features/program/components/vehicle";

import {
	useResolveVehicleFilters,
	useUpdateProgramVehicles,
	useVehicleCatalog,
	useVehicleMakesForYears,
	useVehicleYears,
} from "../hooks/use-program-vehicles";

import { emptyVehicleFilterRow, vehiclesDefaultValues } from "../constants";

import { useProgramEditor } from "../editor/program-editor-context";

import {
	type VehicleFilterRow,
	vehiclesFormSchema,
	type VehiclesFormValues,
} from "../schema";
import { retainAvailableValues } from "../utils";

export function VehiclesForm() {
	const { programId, revisionId, isReadOnly, setSectionSaving } =
		useProgramEditor();
	const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

	const form = useForm<VehiclesFormValues>({
		resolver: zodResolver(vehiclesFormSchema),
		defaultValues: vehiclesDefaultValues,
		mode: "onBlur",
	});

	const selectedRows =
		useWatch({ control: form.control, name: "selectedRows" }) ?? [];

	const currentRow =
		useWatch({ control: form.control, name: "currentRow" }) ??
		emptyVehicleFilterRow;

	/* ------------------------------------------------------------------ */
	/* Current selections                                                  */
	/* ------------------------------------------------------------------ */

	const selectedYears = React.useMemo(() => {
		if (currentRow.modelYears.includes("*")) {
			return [];
		}

		return currentRow.modelYears.map(Number).filter(Number.isInteger);
	}, [currentRow.modelYears]);

	const selectedMakes = React.useMemo(() => {
		if (currentRow.makes.includes("*")) {
			return [];
		}

		return currentRow.makes;
	}, [currentRow.makes]);

	/* ------------------------------------------------------------------ */
	/* Years                                                               */
	/* ------------------------------------------------------------------ */

	const { data: yearsResponse, isLoading: yearsLoading } = useVehicleYears();

	const yearOptions = React.useMemo(
		() =>
			(yearsResponse?.years ?? []).map((year) => ({
				value: String(year),
				label: String(year),
			})),
		[yearsResponse],
	);

	/* ------------------------------------------------------------------ */
	/* Makes                                                               */
	/* ------------------------------------------------------------------ */

	const { data: makes, isLoading: makesLoading } =
		useVehicleMakesForYears(selectedYears);

	const makeOptions = React.useMemo(
		() =>
			makes.map((item) => ({
				value: item.make,
				label: item.make,
				description: item.oemCode ? `OEM: ${item.oemCode}` : undefined,
			})),
		[makes],
	);

	/* ------------------------------------------------------------------ */
	/* Catalog                                                             */
	/* ------------------------------------------------------------------ */

	/**
	 * The search endpoint accepts scalar year/make values.
	 *
	 * useVehicleCatalog() handles:
	 *
	 *   2026
	 *   2025
	 *
	 * or:
	 *
	 *   2026 + Chevrolet
	 *   2026 + GMC
	 *   2025 + Chevrolet
	 *   2025 + GMC
	 *
	 * and merges/de-duplicates the results.
	 *
	 * When Any is selected, the corresponding filter is omitted.
	 */
	const shouldLoadCatalog =
		selectedYears.length > 0 || selectedMakes.length > 0;
	const { data: catalogResponse, isLoading: catalogLoading } =
		useVehicleCatalog(selectedYears, selectedMakes, shouldLoadCatalog);
	const catalogVehicles = catalogResponse?.vehicles ?? [];

	console.log("catalogResponse", catalogResponse);
	/* ------------------------------------------------------------------ */
	/* Models                                                              */
	/* ------------------------------------------------------------------ */

	const modelOptions = React.useMemo(() => {
		const values = new Map<string, string>();
		for (const vehicle of catalogVehicles) {
			if (!vehicle.model) {
				continue;
			}
			const key = vehicle.model.toLowerCase();

			if (!values.has(key)) {
				values.set(key, vehicle.model);
			}
		}

		return [...values.values()]
			.sort((a, b) => a.localeCompare(b))
			.map((model) => ({
				value: model,
				label: model,
			}));
	}, [catalogVehicles]);

	/* ------------------------------------------------------------------ */
	/* Fuel types                                                          */
	/* ------------------------------------------------------------------ */

	const fuelOptions = React.useMemo(() => {
		const values = new Map<string, string>();

		for (const vehicle of catalogVehicles) {
			if (!vehicle.fuelType) {
				continue;
			}

			const key = vehicle.fuelType.toLowerCase();

			if (!values.has(key)) {
				values.set(key, vehicle.fuelType);
			}
		}

		return [...values.values()]
			.sort((a, b) => a.localeCompare(b))
			.map((fuelType) => ({
				value: fuelType,
				label: fuelType,
			}));
	}, [catalogVehicles]);

	/* ------------------------------------------------------------------ */
	/* Segments                                                            */
	/* ------------------------------------------------------------------ */

	const segmentOptions = React.useMemo(() => {
		const values = new Map<string, string>();

		for (const vehicle of catalogVehicles) {
			if (!vehicle.segment) {
				continue;
			}

			const key = vehicle.segment.toLowerCase();

			if (!values.has(key)) {
				values.set(key, vehicle.segment);
			}
		}

		return [...values.values()]
			.sort((a, b) => a.localeCompare(b))
			.map((segment) => ({
				value: segment,
				label: segment,
			}));
	}, [catalogVehicles]);

	/* ------------------------------------------------------------------ */
	/* Dependent selection cleanup                                         */
	/* ------------------------------------------------------------------ */

	const onEditRow = (index: number) => {
		if (isReadOnly) {
			return;
		}

		const row = selectedRows[index];

		if (!row) {
			return;
		}

		form.setValue(
			"currentRow",
			{
				modelYears: [...row.modelYears],
				makes: [...row.makes],
				models: [...row.models],
				fuelTypes: [...row.fuelTypes],
				segments: [...row.segments],
			},
			{
				shouldDirty: false,
			},
		);

		setEditingIndex(index);
	};

	const onDeleteRow = (index: number) => {
		if (isReadOnly) {
			return;
		}

		const nextRows = selectedRows.filter((_, rowIndex) => rowIndex !== index);

		form.setValue("selectedRows", nextRows, {
			shouldDirty: true,
			shouldValidate: true,
		});

		if (editingIndex === index) {
			setEditingIndex(null);

			form.setValue("currentRow", {
				...emptyVehicleFilterRow,
			});

			return;
		}

		if (editingIndex !== null && index < editingIndex) {
			setEditingIndex((current) => (current === null ? null : current - 1));
		}
	};

	const onCancelEdit = () => {
		setEditingIndex(null);

		form.setValue("currentRow", {
			...emptyVehicleFilterRow,
		});
	};

	/* ------------------------------------------------------------------ */
	/* Submit                                                              */
	/* ------------------------------------------------------------------ */
	const resolveVehicleFilters = useResolveVehicleFilters();
	const { mutateAsync: updateVehiclesAsync, isPending: isUpdatingVehicles } =
		useUpdateProgramVehicles();

	const persistRows = React.useCallback(
		async (rows: VehicleFilterRow[]) => {
			/*
			 * New-program mode does not have a program/revision yet.
			 *
			 * Keep the rows in RHF. They will be available when the
			 * program/revision has been created.
			 */
			if (programId == null || revisionId == null) {
				return;
			}

			const resolved = await resolveVehicleFilters(rows);

			const result = await updateVehiclesAsync({
				programId,
				revisionId,
				payload: {
					vehicleCatalogIds: resolved.vehicleCatalogIds,
				},
			});
			console.log("RESULT VEHICLE SVAE", result);
		},
		[programId, revisionId, resolveVehicleFilters, updateVehiclesAsync],
	);

	const onCommitRow = async (values: VehiclesFormValues) => {
		if (isReadOnly || isUpdatingVehicles) {
			return;
		}

		const row = values.currentRow;

		/*
		 * Required filter dimensions.
		 *
		 * Segment remains optional.
		 */
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

		try {
			setSectionSaving(true);

			/*
			 * IMPORTANT:
			 *
			 * This is the ONLY place Add Row / Update Row
			 * causes a DB save.
			 */
			await persistRows(nextRows);

			/*
			 * Only update the committed form state after
			 * persistence succeeds.
			 */
			form.setValue("selectedRows", nextRows, {
				shouldDirty: false,
				shouldValidate: true,
			});

			form.setValue(
				"currentRow",
				{
					...emptyVehicleFilterRow,
				},
				{
					shouldDirty: false,
					shouldValidate: false,
				},
			);

			setEditingIndex(null);

			form.clearErrors();
		} catch (error) {
			console.error("Failed to save vehicle selection:", error);
		} finally {
			setSectionSaving(false);
		}
	};

	/* ------------------------------------------------------------------ */
	/* Render                                                              */
	/* ------------------------------------------------------------------ */

	const catalogLoadingState = catalogLoading || makesLoading;

	/**
	 * Remove values that are no longer available.
	 *
	 * Example:
	 *
	 * 2026
	 * Chevrolet
	 * Silverado
	 *
	 * then change year to 2025.
	 *
	 * If Silverado is not available for the new selection,
	 * it must not remain selected.
	 */

	// Model
	useEffect(() => {
		if (currentRow.models.includes("*")) return;

		const availableModels = modelOptions.map((option) => option.value);
		const nextModels = retainAvailableValues(
			currentRow.models,
			availableModels,
		);
		if (
			nextModels.length !== currentRow.models.length ||
			nextModels.some((value, index) => value !== currentRow.models[index])
		) {
			form.setValue("currentRow.models", nextModels, {
				shouldDirty: true,
				shouldValidate: false,
			});
		}
	}, [currentRow.models, modelOptions, form]);

	// Fuel
	useEffect(() => {
		if (currentRow.fuelTypes.includes("*")) return;
		const availableFuelTypes = fuelOptions.map((option) => option.value);
		const nextFuelTypes = retainAvailableValues(
			currentRow.fuelTypes,
			availableFuelTypes,
		);
		if (
			nextFuelTypes.length !== currentRow.fuelTypes.length ||
			nextFuelTypes.some(
				(value, index) => value !== currentRow.fuelTypes[index],
			)
		) {
			form.setValue("currentRow.fuelTypes", nextFuelTypes, {
				shouldDirty: true,
				shouldValidate: false,
			});
		}
	}, [currentRow.fuelTypes, fuelOptions, form]);

	// Segment
	useEffect(() => {
		if (currentRow.segments.includes("*")) {
			return;
		}
		const availableSegments = segmentOptions.map((option) => option.value);

		const nextSegments = retainAvailableValues(
			currentRow.segments,
			availableSegments,
		);

		if (
			nextSegments.length !== currentRow.segments.length ||
			nextSegments.some((value, index) => value !== currentRow.segments[index])
		) {
			form.setValue("currentRow.segments", nextSegments, {
				shouldDirty: true,
				shouldValidate: false,
			});
		}
	}, [currentRow.segments, segmentOptions, form]);

	return (
		<FormProvider {...form}>
			<Box
				component="form"
				onSubmit={form.handleSubmit(onCommitRow)}
				sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
			>
				<VehicleFilterBuilder
					disabled={isReadOnly}
					editing={editingIndex !== null}
					onCancelEdit={onCancelEdit}
					columns={[
						{
							id: "model-year",
							title: "Model Year",
							options: yearOptions,
							value: currentRow.modelYears,
							onValueChange: (value) => {
								form.setValue("currentRow.modelYears", value, {
									shouldDirty: true,
									shouldValidate: false,
								});
							},
							getValue: (option) => option.value,
							getLabel: (option) => option.label,
							searchPlaceholder: "Search model year...",
							allowAny: true,
							loading: yearsLoading,
						},

						{
							id: "make",
							title: "Make",
							options: makeOptions,
							value: currentRow.makes,
							onValueChange: (value) => {
								form.setValue("currentRow.makes", value, {
									shouldDirty: true,
									shouldValidate: false,
								});
							},
							getValue: (option) => option.value,
							getLabel: (option) => option.label,
							searchPlaceholder: "Search make...",
							allowAny: true,
							loading: makesLoading,
						},

						{
							id: "model",
							title: "Model",
							options: modelOptions,
							value: currentRow.models,
							onValueChange: (value) => {
								form.setValue("currentRow.models", value, {
									shouldDirty: true,
									shouldValidate: false,
								});
							},
							getValue: (option) => option.value,
							getLabel: (option) => option.label,
							searchPlaceholder: "Search model...",
							allowAny: true,
							loading: catalogLoadingState,
						},

						{
							id: "fuel-type",
							title: "Fuel Type",
							options: fuelOptions,
							value: currentRow.fuelTypes,
							onValueChange: (value) => {
								form.setValue("currentRow.fuelTypes", value, {
									shouldDirty: true,
									shouldValidate: false,
								});
							},
							getValue: (option) => option.value,
							getLabel: (option) => option.label,
							searchPlaceholder: "Search fuel type...",
							allowAny: true,
							loading: catalogLoadingState,
						},

						{
							id: "segment",
							title: "Segment",
							options: segmentOptions,
							value: currentRow.segments,
							onValueChange: (value) => {
								form.setValue("currentRow.segments", value, {
									shouldDirty: true,
									shouldValidate: false,
								});
							},
							getValue: (option) => option.value,
							getLabel: (option) => option.label,
							searchPlaceholder: "Search segment...",
							allowAny: true,
							loading: catalogLoadingState,
						},
					]}
					// onAddRow={isReadOnly ? undefined : onAddRow}
				/>

				<SelectedVehiclesSection
					rows={selectedRows}
					onEdit={isReadOnly ? undefined : onEditRow}
					onDelete={isReadOnly ? undefined : onDeleteRow}
				/>
			</Box>
		</FormProvider>
	);
}
