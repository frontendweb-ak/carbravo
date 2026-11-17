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
	const { setSaveStatus } = useProgramEditor();
	const updateSelection = (name: keyof VehicleFilterRow, value: string[]) => {
		form.setValue(`currentRow.${name}`, value, {
			shouldDirty: true,
			shouldValidate: false,
		});
		setSaveStatus("unsaved");
	};

	const columns: VehicleFilterColumn[] = [
		{
			id: "model-year",
			title: "Model Year",
			options: yearOptions,
			value: currentRow.modelYears,
			onValueChange: (value) =>
				updateSelection("modelYears", value),
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
				updateSelection("makes", value),
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
				updateSelection("models", value),
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
				updateSelection("fuelTypes", value),
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
				updateSelection("segments", value),
			getValue: (option: VehicleFilterOption) => option.value,
			getLabel: (option: VehicleFilterOption) => option.label,
			searchPlaceholder: "Search segment...",
			allowAny: true,
			loading: catalogLoadingState,
		},
	];

	return (
		<VehicleFilterBuilder
			disabled={disabled}
			editing={editing}
			onCancelEdit={onCancelEdit}
			columns={columns}
		/>
	);
}
