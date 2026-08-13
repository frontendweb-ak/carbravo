import type { EligibilityFormValues } from "../schema";

/* -------------------------------------------------------------------------- */
/* Financial providers                                                        */
/* -------------------------------------------------------------------------- */

export const FINANCIAL_PROVIDER_OPTIONS = [
	{ value: "GMF", label: "GM Financial" },
	{ value: "CAPITAL_ONE", label: "Capital One" },
	{ value: "ALLY", label: "Ally" },
];

/* -------------------------------------------------------------------------- */
/* Customer types                                                             */
/* -------------------------------------------------------------------------- */

export const CUSTOMER_TYPE_OPTIONS = [
	{
		value: "GENERAL_CONSUMER",
		label: "General Consumer",
	},
	{
		value: "COLLEGE",
		label: "College",
	},
	{
		value: "DEALERSHIP_EMPLOYEE",
		label: "Dealership Employee",
	},
	{
		value: "EDUCATOR",
		label: "Educator",
	},
	{
		value: "FIRST_RESPONDER",
		label: "First Responder",
	},
	{
		value: "GM_EMPLOYEES_FAMILY",
		label: "GM Employees & Family",
	},
	{
		value: "HEALTHCARE_PROFESSIONAL",
		label: "Healthcare Professional",
	},
	{
		value: "MEMBERSHIP",
		label: "Membership",
	},
	{
		value: "MILITARY",
		label: "Military",
	},
	{
		value: "SUPPLIER",
		label: "Supplier",
	},
];

/* -------------------------------------------------------------------------- */
/* Defaults                                                                   */
/* -------------------------------------------------------------------------- */

export const eligibilityDefaultValues: EligibilityFormValues = {
	financialProviderCode: "",
	tierRate: false,
	customerTypeCodes: [],
	footnotes: "",
};
