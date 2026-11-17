import { describe, expect, it } from "vitest";

import { toVehicleFilterOptions } from "./vehicle-options";

describe("toVehicleFilterOptions", () => {
	it("removes blank and case-insensitive duplicate values", () => {
		expect(toVehicleFilterOptions(["SUV", "suv", "", "Truck"])).toEqual([
			{ value: "SUV", label: "SUV" },
			{ value: "Truck", label: "Truck" },
		]);
	});

	it("sorts options alphabetically", () => {
		expect(toVehicleFilterOptions(["Truck", "Coupe", "Sedan"]).map((x) => x.value)).toEqual([
			"Coupe",
			"Sedan",
			"Truck",
		]);
	});

	it("returns an empty list for an empty catalog", () => {
		expect(toVehicleFilterOptions([])).toEqual([]);
	});
});
