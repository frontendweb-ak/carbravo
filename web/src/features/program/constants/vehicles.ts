import type { VehiclesFormValues } from "../schema";

export const emptyVehicleFilterRow = {
	modelYears: [],
	makes: [],
	models: [],
	fuelTypes: [],
	segments: [],
};

export const vehiclesDefaultValues: VehiclesFormValues = {
	currentRow: emptyVehicleFilterRow,
	selectedRows: [],
};

export const MODEL_YEAR_OPTIONS = [
	{ value: "2027", label: "2027" },
	{ value: "2026", label: "2026" },
	{ value: "2025", label: "2025" },
	{ value: "2024", label: "2024" },
	{ value: "2023", label: "2023" },
];

export const MAKE_OPTIONS = [
	{ value: "CHEVROLET", label: "Chevrolet" },
	{ value: "BUICK", label: "Buick" },
	{ value: "GMC", label: "GMC" },
	{ value: "CADILLAC", label: "Cadillac" },
	{ value: "FORD", label: "Ford" },
];

export const MODEL_OPTIONS = [
	{ value: "ACADIA", label: "Acadia" },
	{ value: "ACCORD", label: "Accord" },
	{ value: "ALTIMA", label: "Altima" },
	{ value: "ARIYA", label: "Ariya" },
	{ value: "ARTEON", label: "Arteon" },
];

export const FUEL_TYPE_OPTIONS = [
	{ value: "GAS", label: "Gas" },
	{ value: "DIESEL", label: "Diesel" },
	{ value: "HYBRID", label: "Hybrid" },
	{ value: "PHEV", label: "PHEV" },
	{ value: "EV", label: "EV" },
];

export const SEGMENT_OPTIONS = [
	{ value: "SEDAN", label: "Sedan" },
	{ value: "COUPE", label: "Coupe" },
	{ value: "CONVERTIBLE", label: "Convertible" },
	{ value: "TRUCK", label: "Truck" },
	{ value: "SUV", label: "SUV" },
];
