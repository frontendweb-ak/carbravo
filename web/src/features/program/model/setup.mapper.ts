import type {
	ProgramSetupDto,
	ProgramSetupResponseDto,
} from "../api/setup.api";

import type { SetupFormValues } from "../schema";

function mapApiDateToFormDate(value: string | null | undefined): string {
	if (!value) {
		return "";
	}
	const date = value.slice(0, 10);
	const [year, month, day] = date.split("-");
	if (!year || !month || !day) {
		return "";
	}
	return `${day}-${month}-${year}`;
}

function mapFormDateToApiDate(value: string | null | undefined): string | null {
	if (!value) {
		return null;
	}
	const [day, month, year] = value.split("-");
	if (!day || !month || !year) {
		return value;
	}
	return `${year}-${month}-${day}`;
}

/* -------------------------------------------------------------------------- */
/* API → Form                                                                 */
/* -------------------------------------------------------------------------- */

export function mapSetupResponseToForm(
	data: ProgramSetupResponseDto,
): SetupFormValues {
	return {
		/* UI fields */

		programName: data.programName,

		// Not present in current setup API
		programNumber: "",
		incentiveCodes: "",
		country: "",

		deliveryStart: mapApiDateToFormDate(data.deliveryStartDate),

		deliveryEnd: mapApiDateToFormDate(data.deliveryEndDate),

		// Not present in current setup API
		firstVisibleDate: "",
		firstVisibleTime: "",

		/* API → UI */
		programType: data.programTypeCode,
		purchaseType: data.purchaseType,
		mileageMaximum: data.mileageCeiling ?? 0,
		conditionTier: data.conditionCode,
		creditTiers: [...data.creditTiers],
		financeTerms: [...data.financeTerms],
		contact: data.contactName ?? "",

		flags: {
			vinException: data.vinException,
			topOfDeal: data.topOfDeal,

			// Not present in API
			noAddOns: false,
		},
	};
}
/* -------------------------------------------------------------------------- */
/* Form → API                                                                 */
/* -------------------------------------------------------------------------- */
export function mapSetupFormToDto(values: SetupFormValues): ProgramSetupDto {
	return {
		programName: values.programName,

		programTypeCode: values.programType,
		purchaseType: values.purchaseType,

		customerTypeCodes: [],

		contactName: values.contact || null,
		contactEmail: null,
		contactPhone: null,

		financialProviderCode: null,

		conditionCode: values.conditionTier,

		mileageCeiling: values.mileageMaximum,

		topOfDeal: values.flags.topOfDeal,
		vinException: values.flags.vinException,

		mfpnText: null,
		disclosureText: null,

		localeCode: "en-US",
		deliveryStartDate: mapFormDateToApiDate(values.deliveryStart),
		deliveryEndDate: mapFormDateToApiDate(values.deliveryEnd),
		effectiveStartDate: null,
		effectiveEndDate: null,

		financeTerms:
			values.purchaseType === "FINANCE" ? [...values.financeTerms] : [],

		creditTiers: [...values.creditTiers],
	};
}
