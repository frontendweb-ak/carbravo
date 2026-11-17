import { describe, expect, it } from "vitest";

import { setupDefaultValues } from "../constants";
import { setupFormSchema } from "./setup.schema";

const validSetup = {
	...setupDefaultValues,
	programName: "Spring Finance Event",
	deliveryStart: "01-03-2026",
	deliveryEnd: "31-03-2026",
	programType: "APR",
	purchaseType: "CASH",
	creditTiers: ["A1"],
	contact: "Alex Morgan",
};

describe("setupFormSchema", () => {
	it("accepts a valid cash program without finance terms", () => {
		expect(setupFormSchema.safeParse(validSetup).success).toBe(true);
	});

	it("requires a program name, delivery dates, credit tier, and contact", () => {
		const result = setupFormSchema.safeParse({
			...validSetup,
			programName: " ",
			deliveryStart: "",
			deliveryEnd: "not-a-date",
			creditTiers: [],
			contact: " ",
		});

		expect(result.success).toBe(false);

		if (result.success) return;

		const issuePaths = result.error.issues.map((issue) => issue.path.join("."));
		expect(issuePaths).toEqual(
			expect.arrayContaining([
				"programName",
				"deliveryStart",
				"deliveryEnd",
				"creditTiers",
				"contact",
			]),
		);
	});

	it("rejects an end date before the start date", () => {
		const result = setupFormSchema.safeParse({
			...validSetup,
			deliveryStart: "31-03-2026",
			deliveryEnd: "01-03-2026",
		});

		expect(result.success).toBe(false);

		if (result.success) return;

		expect(result.error.issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					path: ["deliveryEnd"],
					message: "Delivery end must be on or after delivery start",
				}),
			]),
		);
	});

	it("requires at least one finance term for finance programs", () => {
		const result = setupFormSchema.safeParse({
			...validSetup,
			purchaseType: "FINANCE",
			financeTerms: [],
		});

		expect(result.success).toBe(false);

		if (result.success) return;

		expect(result.error.issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					path: ["financeTerms"],
					message: "Select at least one finance term",
				}),
			]),
		);
	});
});
