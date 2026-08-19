export function retainAvailableValues(
	selected: string[],
	available: string[],
): string[] {
	if (selected.includes("*")) {
		return selected;
	}

	const availableSet = new Set(available.map((value) => value.toLowerCase()));

	return selected.filter((value) => availableSet.has(value.toLowerCase()));
}
