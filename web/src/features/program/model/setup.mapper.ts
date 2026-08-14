import type {
	ProgramSetupDto,
	ProgramSetupResponseDto,
} from "../api/setup.api";

import type { SetupFormValues } from "../schema";

/* -------------------------------------------------------------------------- */
/* Date mapping                                                               */
/* -------------------------------------------------------------------------- */

function mapApiDateToFormDate(
	value: string | null | undefined,
): string {
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

function mapFormDateToApiDate(
	value: string | null | undefined,
): string | null {
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
/* Condition mapping                                                          */
/* -------------------------------------------------------------------------- */

const FORM_TO_API_CONDITION = {
	CARBRAVO_CERTIFIED: "CARBRAVO",
	MANUFACTURER_CERTIFIED: "MANUFACTURER_CERTIFIED",
	USED_INSPECTED: "USED_INSPECTED",
	USED_AS_IS: "USED_AS_IS",
} as const;

const API_TO_FORM_CONDITION = {
	CARBRAVO: "CARBRAVO_CERTIFIED",
	MANUFACTURER_CERTIFIED: "MANUFACTURER_CERTIFIED",
	USED_INSPECTED: "USED_INSPECTED",
	USED_AS_IS: "USED_AS_IS",
} as const;

/* -------------------------------------------------------------------------- */
/* API → Form                                                                 */
/* -------------------------------------------------------------------------- */

export function mapSetupResponseToForm(
	data: ProgramSetupResponseDto,
): SetupFormValues {
	return {
		/* ------------------------------------------------------------------ */
		/* UI-only fields                                                      */
		/* ------------------------------------------------------------------ */

		programName: data.programName,

		/*
		 * These fields are not part of the current setup API contract.
		 * They therefore cannot be populated from ProgramSetupResponseDto.
		 */
		programNumber: "",
		incentiveCodes: "",
		country: "",

		deliveryStart: mapApiDateToFormDate(
			data.deliveryStartDate,
		),

		deliveryEnd: mapApiDateToFormDate(
			data.deliveryEndDate,
		),

		firstVisibleDate: "",
		firstVisibleTime: "",

		/* ------------------------------------------------------------------ */
		/* Setup API → UI                                                      */
		/* ------------------------------------------------------------------ */

		programType: data.programTypeCode,

		purchaseType: data.purchaseType,

		mileageMaximum: data.mileageCeiling ?? 0,

		conditionTier:
			API_TO_FORM_CONDITION[
				data.conditionCode as keyof typeof API_TO_FORM_CONDITION
			] ?? data.conditionCode,

		creditTiers: [...data.creditTiers],

		financeTerms: [...data.financeTerms],

		contact: data.contactName ?? "",

		/* ------------------------------------------------------------------ */
		/* UI-only flags                                                       */
		/* ------------------------------------------------------------------ */

		flags: {
			vinException: data.vinException,
			topOfDeal: data.topOfDeal,
			noAddOns: false,
		},
	};
}

/* -------------------------------------------------------------------------- */
/* Form → API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Convert the UI form back to the OpenAPI setup DTO.
 *
 * `existing` is important for edit mode.
 *
 * The setup form does not expose every API field, so fields that are not
 * represented by the UI must be preserved from the existing API response
 * instead of being overwritten with null/empty values.
 */
export function mapSetupFormToDto(
	values: SetupFormValues,
	existing?: ProgramSetupResponseDto,
): ProgramSetupDto {
	const conditionCode =
		FORM_TO_API_CONDITION[
			values.conditionTier as keyof typeof FORM_TO_API_CONDITION
		] ?? values.conditionTier;

	return {
		/* ------------------------------------------------------------------ */
		/* Fields controlled by UI                                             */
		/* ------------------------------------------------------------------ */

		programName: values.programName,

		programTypeCode: values.programType,

		purchaseType: values.purchaseType,

		mileageCeiling: values.mileageMaximum,

		conditionCode,

		topOfDeal: values.flags.topOfDeal,

		vinException: values.flags.vinException,

		deliveryStartDate:
			mapFormDateToApiDate(values.deliveryStart),

		deliveryEndDate:
			mapFormDateToApiDate(values.deliveryEnd),

		financeTerms:
			values.purchaseType === "FINANCE"
				? [...values.financeTerms]
				: [],

		creditTiers: [...values.creditTiers],

		/* ------------------------------------------------------------------ */
		/* API fields not currently represented by the UI                     */
		/* ------------------------------------------------------------------ */

		customerTypeCodes:
			existing?.customerTypeCodes?.length
				? [...existing.customerTypeCodes]
				: ["STANDARD"],

		contactName:
			values.contact?.trim() || null,

		contactEmail:
			existing?.contactEmail ?? null,

		contactPhone:
			existing?.contactPhone ?? null,

		financialProviderCode:
			existing?.financialProviderCode ?? null,

		mfpnText:
			existing?.mfpnText ?? null,

		disclosureText:
			existing?.disclosureText ?? null,

		localeCode:
			existing?.localeCode ?? "en-US",

		effectiveStartDate:
			existing?.effectiveStartDate ?? null,

		effectiveEndDate:
			existing?.effectiveEndDate ?? null,
	};
}