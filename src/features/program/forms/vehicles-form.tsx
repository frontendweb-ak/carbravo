import { toast } from "@/components/ui";
import {
	SelectedVehiclesSection,
	VehicleFilterBuilder,
} from "@/features/program/components/vehicle";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
	emptyVehicleFilterRow,
	FUEL_TYPE_OPTIONS,
	MAKE_OPTIONS,
	MODEL_OPTIONS,
	MODEL_YEAR_OPTIONS,
	SEGMENT_OPTIONS,
	vehiclesDefaultValues,
} from "../constants";
import { type VehiclesFormValues, vehiclesFormSchema } from "../schema";

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
		useWatch({ control: form.control, name: "selectedRows" }) ?? [];

	/**
	 * Current row being built/edited.
	 */
	const currentRow =
		useWatch({ control: form.control, name: "currentRow" }) ??
		emptyVehicleFilterRow;

	/**
	 * Add a new row OR update an existing row.
	 */
	const onAddRow = () => {
		const row = form.getValues("currentRow");

		/**
		 * Model year, make, model and fuel are mandatory.
		 *
		 * Segment is optional.
		 *
		 * "*" is already a valid selection because it is
		 * represented inside the arrays.
		 */
		const missingRequired =
			row.modelYears.length === 0 ||
			row.makes.length === 0 ||
			row.models.length === 0 ||
			row.fuelTypes.length === 0;

		if (missingRequired) {
			toast.add({
				title:
					"Select at least one value or * for model year, make, model and fuel.",
			});

			return;
		}

		/**
		 * EDIT MODE
		 *
		 * Replace the existing row.
		 */
		if (editingIndex !== null) {
			const nextRows = selectedRows.map((existingRow, index) =>
				index === editingIndex ? { ...row } : existingRow,
			);
			form.setValue("selectedRows", nextRows, {
				shouldDirty: true,
				shouldValidate: true,
			});
			setEditingIndex(null);
			form.setValue("currentRow", { ...emptyVehicleFilterRow });
			return;
		}

		/**
		 * ADD MODE
		 *
		 * Append a new row.
		 */
		const nextRows = [...selectedRows, { ...row }];

		form.setValue("selectedRows", nextRows, {
			shouldDirty: true,
			shouldValidate: true,
		});

		form.setValue("currentRow", { ...emptyVehicleFilterRow });
	};

	/**
	 * Start editing a selected row.
	 *
	 * IMPORTANT:
	 * We do NOT remove the row from selectedRows.
	 *
	 * The row remains visible while editing.
	 * When Update Row is clicked, it gets replaced.
	 */
	const onEditRow = (index: number) => {
		const row = selectedRows[index];

		if (!row) return;

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
		 * the edited row's index moves one position up.
		 */
		if (editingIndex !== null && index < editingIndex) {
			setEditingIndex((current) => (current === null ? null : current - 1));
		}
	};

	/**
	 * Cancel editing without changing selectedRows.
	 */
	const onCancelEdit = () => {
		setEditingIndex(null);

		form.setValue("currentRow", {
			...emptyVehicleFilterRow,
		});
	};

	/**
	 * Final form submission.
	 *
	 * currentRow is temporary UI state.
	 * selectedRows contains the actual vehicle configuration.
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
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

				<SelectedVehiclesSection
					rows={selectedRows}
					onEdit={onEditRow}
					onDelete={onDeleteRow}
				/>

				<div className="flex justify-end">
					<button
						type="submit"
						className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
					>
						Save Vehicles
					</button>
				</div>
			</form>
		</FormProvider>
	);
}
