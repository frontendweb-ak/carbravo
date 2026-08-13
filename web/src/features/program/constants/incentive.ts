import type { IncentiveValuesFormValues } from "../schema";

/* -------------------------------------------------------------------------- */
/* Stackability                                                               */
/* -------------------------------------------------------------------------- */

export const STACKABILITY_OPTIONS = [
	{
		value: "BONUS_CASH",
		label: "Bonus Cash",
	},
	{
		value: "CUSTOMER_CASH",
		label: "Consumer Cash",
	},
	{
		value: "APR",
		label: "APR Cash",
	},
	{
		value: "DOWN_PAYMENT",
		label: "Down Payment",
	},
];

/* -------------------------------------------------------------------------- */
/* Defaults                                                                   */
/* -------------------------------------------------------------------------- */

export const incentiveValuesDefaultValues: IncentiveValuesFormValues = {
	customerCash: 0,
	bonusCash: 0,
	downPaymentAssist: 0,

	stackableWith: [],
	notStackableWith: [],

	belongsTo: "",
};
