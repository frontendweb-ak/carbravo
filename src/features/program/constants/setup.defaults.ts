import type { SetupFormValues } from "../schema";

export const setupDefaultValues: SetupFormValues = {
	programName: "",
	programNumber: "",
	incentiveCodes: "",
	country: "United States",

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

	flags: {
		vinException: false,
		topOfDeal: false,
		noAddOns: false,
	},
};
