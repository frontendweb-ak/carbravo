import { describe, expect, it } from "vitest";

import { retainAvailableValues } from "./vehicle-utils";

describe("retainAvailableValues", () => {
	it("retains selected values that are still available case-insensitively", () => {
		expect(
			retainAvailableValues(["silverado", "Equinox", "Traverse"], [
				"Silverado",
				"Equinox",
			]),
		).toEqual(["silverado", "Equinox"]);
	});

	it("preserves the wildcard selection", () => {
		expect(retainAvailableValues(["*"], ["Silverado"])).toEqual(["*"]);
	});

	it("returns an empty selection when none of the selected values remain available", () => {
		expect(retainAvailableValues(["Silverado"], ["Equinox"])).toEqual([]);
	});
});
