import type { VehicleFilterRow } from "../schema";

export function formatValues(values: string[]) {
	if (values.length === 0) {
		return "*";
	}

	if (values.includes("*")) {
		return "*";
	}

	return values.join(", ");
}

export function formatRow(row: VehicleFilterRow) {
	return [
		`Year: ${formatValues(row.modelYears)}`,
		`Make: ${formatValues(row.makes)}`,
		`Model: ${formatValues(row.models)}`,
		`Fuel: ${formatValues(row.fuelTypes)}`,
		`Segment: ${formatValues(row.segments)}`,
	].join(" · ");
}

export function formatSelectedVehicle(row: VehicleFilterRow) {
	return [
		`MY ${formatValues(row.modelYears)}`,
		`Make ${formatValues(row.makes)}`,
		`Model ${formatValues(row.models)}`,
		`Fuel ${formatValues(row.fuelTypes)}`,
		`Segment ${formatValues(row.segments)}`,
	].join(" · ");
}
function formatPreviewValues(values: string[]) {
	if (values.length === 0 || values.includes("*")) {
		return "*";
	}

	return values.join("|");
}

export function formatPreviewRow(row: VehicleFilterRow) {
	return [
		`+YEAR={${formatPreviewValues(row.modelYears)}}`,
		`+MAKE=${formatPreviewValues(row.makes)}`,
		`+MODEL=${formatPreviewValues(row.models)}`,
		`+FUEL=${formatPreviewValues(row.fuelTypes)}`,
		`+SEGMENT=${formatPreviewValues(row.segments)}`,
	].join("");
}
