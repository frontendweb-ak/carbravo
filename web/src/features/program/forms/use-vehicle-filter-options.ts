import { useEffect, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
	useVehicleCatalog,
	useVehicleMakesForYears,
	useVehicleYears,
} from "../hooks/use-program-vehicles";
import type { VehicleFilterRow, VehiclesFormValues } from "../schema";
import { retainAvailableValues } from "../utils";
import { toVehicleFilterOptions } from "../utils/vehicle-options";

interface UseVehicleFilterOptionsResult {
	yearOptions: { value: string; label: string }[];
	makeOptions: { value: string; label: string; description?: string }[];
	modelOptions: { value: string; label: string }[];
	fuelOptions: { value: string; label: string }[];
	segmentOptions: { value: string; label: string }[];
	yearsLoading: boolean;
	makesLoading: boolean;
	catalogLoadingState: boolean;
}

export function useVehicleFilterOptions(
	currentRow: VehicleFilterRow,
	form: UseFormReturn<VehiclesFormValues>,
): UseVehicleFilterOptionsResult {
	const selectedYears = currentRow.modelYears.includes("*")
		? []
		: currentRow.modelYears.map(Number).filter(Number.isInteger);
	const selectedMakes = currentRow.makes.includes("*") ? [] : currentRow.makes;

	const { data: yearsResponse, isLoading: yearsLoading } = useVehicleYears();
	const { data: makes, isLoading: makesLoading } =
		useVehicleMakesForYears(selectedYears);

	const shouldLoadCatalog =
		selectedYears.length > 0 || selectedMakes.length > 0;
	const { data: catalogResponse, isLoading: catalogLoading } =
		useVehicleCatalog(selectedYears, selectedMakes, shouldLoadCatalog);
	const catalogVehicles = catalogResponse?.vehicles ?? [];

	const yearOptions = useMemo(
		() =>
			(yearsResponse?.years ?? []).map((year) => ({
				value: String(year),
				label: String(year),
			})),
		[yearsResponse],
	);

	const makeOptions = useMemo(
		() =>
			makes.map((item) => ({
				value: item.make,
				label: item.make,
				description: item.oemCode ? `OEM: ${item.oemCode}` : undefined,
			})),
		[makes],
	);

	const modelOptions = useMemo(
		() => toVehicleFilterOptions(catalogVehicles.map((vehicle) => vehicle.model)),
		[catalogVehicles],
	);
	const fuelOptions = useMemo(
		() => toVehicleFilterOptions(catalogVehicles.map((vehicle) => vehicle.fuelType)),
		[catalogVehicles],
	);
	const segmentOptions = useMemo(
		() => toVehicleFilterOptions(catalogVehicles.map((vehicle) => vehicle.segment)),
		[catalogVehicles],
	);

	useEffect(() => {
		if (currentRow.models.includes("*")) return;

		const nextModels = retainAvailableValues(
			currentRow.models,
			modelOptions.map((option) => option.value),
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

	useEffect(() => {
		if (currentRow.fuelTypes.includes("*")) return;

		const nextFuelTypes = retainAvailableValues(
			currentRow.fuelTypes,
			fuelOptions.map((option) => option.value),
		);
		if (
			nextFuelTypes.length !== currentRow.fuelTypes.length ||
			nextFuelTypes.some((value, index) => value !== currentRow.fuelTypes[index])
		) {
			form.setValue("currentRow.fuelTypes", nextFuelTypes, {
				shouldDirty: true,
				shouldValidate: false,
			});
		}
	}, [currentRow.fuelTypes, fuelOptions, form]);

	useEffect(() => {
		if (currentRow.segments.includes("*")) return;

		const nextSegments = retainAvailableValues(
			currentRow.segments,
			segmentOptions.map((option) => option.value),
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

	return {
		yearOptions,
		makeOptions,
		modelOptions,
		fuelOptions,
		segmentOptions,
		yearsLoading,
		makesLoading,
		catalogLoadingState: catalogLoading || makesLoading,
	};
}
