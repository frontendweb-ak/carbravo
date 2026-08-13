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
	purchaseType: "NEW",

	mileageMaximum: 59999,

	conditionTier: "ANY",

	creditTiers: [],

	contact: "",

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
	{ value: "NEW", label: "New" },
	{ value: "USED", label: "Used" },
];

export const CONDITION_TIER_OPTIONS = [
	{ value: "ANY", label: "Any" },
	{ value: "NEW", label: "New" },
	{ value: "USED", label: "Used" },
];

export const CREDIT_TIER_OPTIONS = [
	{ value: "ANY", label: "Any" },
	{ value: "A", label: "A" },
	{ value: "B", label: "B" },
	{ value: "C", label: "C" },
	{ value: "D", label: "D" },
	{ value: "E", label: "E" },
];

export const COUNTRY_OPTIONS = [
	{ value: "US", label: "United States" },
	{ value: "CA", label: "Canada" },
]; 