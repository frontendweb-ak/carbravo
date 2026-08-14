import type { SetupFormValues } from "../schema";

export const setupDefaultValues: SetupFormValues = {
	programName: "",
	programNumber: "",
	incentiveCodes: "",
	country: "US",

	deliveryStart: "",
	deliveryEnd: "",
	firstVisibleDate: "",
	firstVisibleTime: "",

	programType: "CUSTOMER_CASH",
	purchaseType: "CASH",

	mileageMaximum: 59999,

	conditionTier: "CARBRAVO_CERTIFIED",

	creditTiers: [],

	contact: "",
	financeTerms: [],
	flags: {
		vinException: false,
		topOfDeal: false,
		noAddOns: false,
	},
};

export const PROGRAM_TYPE_OPTIONS = [
	{ value: "CUSTOMER_CASH", label: "Customer Cash" },
	{ value: "APR", label: "APR" },
	{ value: "BONUS_CASH", label: "Bonus Cash" },
];
export const PURCHASE_TYPE_OPTIONS = [
	{ value: "CASH", label: "Cash" },
	{ value: "FINANCE", label: "Finance" },
];
export const CONDITION_TIER_OPTIONS = [
	{ value: "CARBRAVO_CERTIFIED", label: "CarBravo Certified" },
	{ value: "MANUFACTURER_CERTIFIED", label: "Manufacturer Certified" },
	{ value: "USED_INSPECTED", label: "Used — Inspected" },
	{ value: "USED_AS_IS", label: "Used — As-Is" },
];
export const CREDIT_TIER_OPTIONS = [
	{ value: "A_PLUS", label: "✓ A+ — Excellent Credit" },
	{ value: "A1", label: "✓ A1 — Very Good Credit" },
	{ value: "A2", label: "✓ A2 — Good Credit" },
	{ value: "B", label: "B — Fair Credit" },
];

export const COUNTRY_OPTIONS = [
	{ value: "US", label: "United States" },
	{ value: "CA", label: "Canada" },
];

export const FINANCE_TERM_OPTIONS = [
	{ value: 24, label: "24" },
	{ value: 36, label: "36" },
	{ value: 48, label: "48" },
	{ value: 60, label: "60" },
	{ value: 72, label: "72" },
	{ value: 84, label: "84" },
];