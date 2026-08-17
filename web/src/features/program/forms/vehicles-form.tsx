import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack } from "@mui/material";
import React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import {
	SelectedVehiclesSection,
	VehicleFilterBuilder,
} from "@/features/program/components/vehicle";

import {
	emptyVehicleFilterRow,
	FUEL_TYPE_OPTIONS,
	MAKE_OPTIONS,
	MODEL_OPTIONS,
	MODEL_YEAR_OPTIONS,
	SEGMENT_OPTIONS,
	vehiclesDefaultValues,
} from "../constants";

import {
	type VehicleFilterRow,
	vehiclesFormSchema,
	type VehiclesFormValues,
} from "../schema";

export function VehiclesForm() {
	const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

	const form = useForm<VehiclesFormValues>({
		resolver: zodResolver(vehiclesFormSchema),
		defaultValues: vehiclesDefaultValues,
		mode: "onBlur",
	});

	/**
	 * Single source of truth for selected vehicle rows.
	 */
	const selectedRows =
		useWatch({
			control: form.control,
			name: "selectedRows",
		}) ?? [];

	/**
	 * Current row being built/edited.
	 */
	const currentRow =
		useWatch({
			control: form.control,
			name: "currentRow",
		}) ?? emptyVehicleFilterRow;

	/**
	 * Add a new row OR update an existing row.
	 */
	const onAddRow = () => {
		const row = form.getValues("currentRow");

		const missingRequired =
			row.modelYears.length === 0 ||
			row.makes.length === 0 ||
			row.models.length === 0 ||
			row.fuelTypes.length === 0;

		if (missingRequired) {
			// Replace this with your MUI Snackbar service.
			console.warn(
				"Select at least one value or * for model year, make, model and fuel.",
			);

			return;
		}

		const nextRow: VehicleFilterRow = {
			...row,
			modelYears: [...row.modelYears],
			makes: [...row.makes],
			models: [...row.models],
			fuelTypes: [...row.fuelTypes],
			segments: [...row.segments],
		};

		/**
		 * EDIT MODE
		 */
		if (editingIndex !== null) {
			const nextRows = selectedRows.map((existingRow, index) =>
				index === editingIndex ? nextRow : existingRow,
			);

			form.setValue("selectedRows", nextRows, {
				shouldDirty: true,
				shouldValidate: true,
			});

			setEditingIndex(null);

			form.setValue("currentRow", {
				...emptyVehicleFilterRow,
			});

			return;
		}

		/**
		 * ADD MODE
		 */
		form.setValue("selectedRows", [...selectedRows, nextRow], {
			shouldDirty: true,
			shouldValidate: true,
		});

		form.setValue("currentRow", {
			...emptyVehicleFilterRow,
		});
	};

	/**
	 * Start editing a selected row.
	 */
	const onEditRow = (index: number) => {
		const row = selectedRows[index];

		if (!row) {
			return;
		}

		form.setValue("currentRow", {
			modelYears: [...row.modelYears],
			makes: [...row.makes],
			models: [...row.models],
			fuelTypes: [...row.fuelTypes],
			segments: [...row.segments],
		});

		setEditingIndex(index);
	};

	/**
	 * Delete a selected row.
	 */
	const onDeleteRow = (index: number) => {
		const nextRows = selectedRows.filter((_, rowIndex) => rowIndex !== index);

		form.setValue("selectedRows", nextRows, {
			shouldDirty: true,
			shouldValidate: true,
		});

		/**
		 * If the row being edited is deleted,
		 * cancel edit mode and clear the builder.
		 */
		if (editingIndex === index) {
			setEditingIndex(null);

			form.setValue("currentRow", {
				...emptyVehicleFilterRow,
			});

			return;
		}

		/**
		 * If a row before the edited row is deleted,
		 * move the edited index up.
		 */
		if (editingIndex !== null && index < editingIndex) {
			setEditingIndex((current) => (current === null ? null : current - 1));
		}
	};

	/**
	 * Cancel editing.
	 */
	const onCancelEdit = () => {
		setEditingIndex(null);

		form.setValue("currentRow", {
			...emptyVehicleFilterRow,
		});
	};

	/**
	 * Final form submission.
	 */
	const onSubmit = (values: VehiclesFormValues) => {
		const payload = {
			vehicleFilters: values.selectedRows,
		};

		console.log("VEHICLES SUBMIT", values);
		console.log("VEHICLES PAYLOAD", payload);
	};

	return (
		<FormProvider {...form}>
			<Stack
				component="form"
				onSubmit={form.handleSubmit(onSubmit)}
				spacing={2.5}
			>
				{/* =======================================================
				    ADD / EDIT VEHICLE
				======================================================= */}

				<VehicleFilterBuilder
					editing={editingIndex !== null}
					onCancelEdit={onCancelEdit}
					columns={[
						{
							id: "model-year",
							title: "Model Year",
							options: MODEL_YEAR_OPTIONS,
							value: currentRow.modelYears,
							onValueChange: (value) => {
								form.setValue("currentRow.modelYears", value, {
									shouldDirty: true,
								});
							},
							getValue: (option) => option.value,
							getLabel: (option) => option.label,
							searchPlaceholder: "Search model year...",
							allowAny: true,
						},

						{
							id: "make",
							title: "Make",
							options: MAKE_OPTIONS,
							value: currentRow.makes,
							onValueChange: (value) => {
								form.setValue("currentRow.makes", value, {
									shouldDirty: true,
								});
							},
							getValue: (option) => option.value,
							getLabel: (option) => option.label,
							searchPlaceholder: "Search make...",
							allowAny: true,
						},

						{
							id: "model",
							title: "Model",
							options: MODEL_OPTIONS,
							value: currentRow.models,
							onValueChange: (value) => {
								form.setValue("currentRow.models", value, {
									shouldDirty: true,
								});
							},
							getValue: (option) => option.value,
							getLabel: (option) => option.label,
							searchPlaceholder: "Search model...",
							allowAny: true,
						},

						{
							id: "fuel-type",
							title: "Fuel Type",
							options: FUEL_TYPE_OPTIONS,
							value: currentRow.fuelTypes,
							onValueChange: (value) => {
								form.setValue("currentRow.fuelTypes", value, {
									shouldDirty: true,
								});
							},
							getValue: (option) => option.value,
							getLabel: (option) => option.label,
							searchPlaceholder: "Search fuel type...",
							allowAny: true,
						},

						{
							id: "segment",
							title: "Segment",
							options: SEGMENT_OPTIONS,
							value: currentRow.segments,
							onValueChange: (value) => {
								form.setValue("currentRow.segments", value, {
									shouldDirty: true,
								});
							},
							getValue: (option) => option.value,
							getLabel: (option) => option.label,
							searchPlaceholder: "Search segment...",
							allowAny: true,
						},
					]}
					onAddRow={onAddRow}
				/>

				{/* =======================================================
				    SELECTED VEHICLES
				======================================================= */}

				<SelectedVehiclesSection
					rows={selectedRows}
					onEdit={onEditRow}
					onDelete={onDeleteRow}
				/>

				{/* =======================================================
				    FORM ACTION
				======================================================= */}

				<Stack direction="row" sx={{ justifyContent: "flex-end" }}>
					<Button
						type="submit"
						variant="contained"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting ? "Saving..." : "Save Vehicles"}
					</Button>
				</Stack>
			</Stack>
		</FormProvider>
	);
}
