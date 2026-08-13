import { Hono } from "hono";

import { currentUser } from "../lib/auth.js";
import { readDb } from "../store.js";

export const reference = new Hono();

/**
 * GET /api/reference/setup
 *
 * Returns all lookup data required by
 * the Program Setup form.
 */
reference.get("/reference/setup", async (c) => {
	currentUser(c);

	const db = await readDb();

	return c.json({
		programTypes: db.referenceSetup.programTypes,

		purchaseTypes: db.referenceSetup.purchaseTypes,

		customerTypes: db.referenceSetup.customerTypes,

		conditionCodes: db.referenceSetup.conditionCodes,

		financeTermOptions: db.referenceSetup.financeTermOptions,

		creditTierOptions: db.referenceSetup.creditTierOptions,

		financialProviders: db.referenceSetup.financialProviders,
	});
});
