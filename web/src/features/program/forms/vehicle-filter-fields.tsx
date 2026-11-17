import { Box } from "@mui/material";
import type { UseFormReturn } from "react-hook-form";

import {
	VehicleFilterBuilder,
	type VehicleFilterColumn,
} from "../components/vehicle";
import type { VehicleFilterOption } from "../utils/vehicle-options";
import type { VehicleFilterRow, VehiclesFormValues } from "../schema";

interface VehicleFilterFieldsProps {
	form: UseFormReturn<VehiclesFormValues>;
	currentRow: VehicleFilterRow;
	yearOptions: VehicleFilterOption[];
	makeOptions: VehicleFilterOption[];
	modelOptions: VehicleFilterOption[];
	fuelOptions: VehicleFilterOption[];
	segmentOptions: VehicleFilterOption[];
	yearsLoading: boolean;
	makesLoading: boolean;
	catalogLoadingState: boolean;
	disabled: boolean;
	editing: boolean;
	onCancelEdit: () => void;
}

export function VehicleFilterFields({
	form,
	currentRow,
	yearOptions,
	makeOptions,
	modelOptions,
	fuelOptions,
	segmentOptions,
	yearsLoading,
	makesLoading,
	catalogLoadingState,
	disabled,
	editing,
	onCancelEdit,
}: VehicleFilterFieldsProps) {
	const columns: VehicleFilterColumn[] = [
		{
			id: "model-year",
			title: "Model Year",
			options: yearOptions,
			value: currentRow.modelYears,
			onValueChange: (value) =>
				form.setValue("currentRow.modelYears", value, {
					shouldDirty: true,
					shouldValidate: false,
				}),
			getValue: (option: VehicleFilterOption) => option.value,
			getLabel: (option: VehicleFilterOption) => option.label,
			searchPlaceholder: "Search model year...",
			allowAny: true,
			loading: yearsLoading,
		},
		{
			id: "make",
			title: "Make",
			options: makeOptions,
			value: currentRow.makes,
			onValueChange: (value) =>
				form.setValue("currentRow.makes", value, {
					shouldDirty: true,
					shouldValidate: false,
				}),
			getValue: (option: VehicleFilterOption) => option.value,
			getLabel: (option: VehicleFilterOption) => option.label,
			searchPlaceholder: "Search make...",
			allowAny: true,
			loading: makesLoading,
		},
		{
			id: "model",
			title: "Model",
			options: modelOptions,
			value: currentRow.models,
			onValueChange: (value) =>
				form.setValue("currentRow.models", value, {
					shouldDirty: true,
					shouldValidate: false,
				}),
			getValue: (option: VehicleFilterOption) => option.value,
			getLabel: (option: VehicleFilterOption) => option.label,
			searchPlaceholder: "Search model...",
			allowAny: true,
			loading: catalogLoadingState,
		},
		{
			id: "fuel-type",
			title: "Fuel Type",
			options: fuelOptions,
			value: currentRow.fuelTypes,
			onValueChange: (value) =>
				form.setValue("currentRow.fuelTypes", value, {
					shouldDirty: true,
					shouldValidate: false,
				}),
			getValue: (option: VehicleFilterOption) => option.value,
			getLabel: (option: VehicleFilterOption) => option.label,
			searchPlaceholder: "Search fuel type...",
			allowAny: true,
			loading: catalogLoadingState,
		},
		{
			id: "segment",
			title: "Segment",
			options: segmentOptions,
			value: currentRow.segments,
			onValueChange: (value) =>
				form.setValue("currentRow.segments", value, {
					shouldDirty: true,
					shouldValidate: false,
				}),
			getValue: (option: VehicleFilterOption) => option.value,
			getLabel: (option: VehicleFilterOption) => option.label,
			searchPlaceholder: "Search segment...",
			allowAny: true,
			loading: catalogLoadingState,
		},
	];

	return (
		<Box
			component="section"
			sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
		>
			<VehicleFilterBuilder
				disabled={disabled}
				editing={editing}
				onCancelEdit={onCancelEdit}
				columns={columns}
			/>
		</Box>
	);
}
