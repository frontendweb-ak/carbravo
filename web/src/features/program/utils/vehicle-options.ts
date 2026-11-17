export interface VehicleFilterOption {
	value: string;
	label: string;
	description?: string;
}

export function toVehicleFilterOptions(values: string[]): VehicleFilterOption[] {
	const uniqueValues = new Map<string, string>();

	for (const value of values) {
		if (!value) continue;

		const key = value.toLocaleLowerCase();
		if (!uniqueValues.has(key)) {
			uniqueValues.set(key, value);
		}
	}

	return [...uniqueValues.values()]
		.sort((left, right) => left.localeCompare(right))
		.map((value) => ({ value, label: value }));
}
