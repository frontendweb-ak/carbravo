import type {
  ProgramSetupDto,
  ProgramSetupResponseDto,
} from "../api/setup.api";
import type { SetupFormValues } from "../schema";

function mapApiDateToFormDate(value: string | null | undefined): string {
  if (!value) return "";
  const [year, month, day] = value.slice(0, 10).split("-");
  return year && month && day ? `${day}-${month}-${year}` : "";
}

function mapFormDateToApiDate(value: string | null | undefined): string {
  if (!value) return "";
  const [day, month, year] = value.split("-");
  return day && month && year ? `${year}-${month}-${day}` : "";
}

const FORM_TO_API_CONDITION = {
  CARBRAVO_CERTIFIED: "CARBRAVO",
  MANUFACTURER_CERTIFIED: "MANUFACTURER_CERTIFIED",
  USED_INSPECTED: "USED_INSPECTED",
  USED_AS_IS: "USED_AS_IS",
} as const;

const API_TO_FORM_CONDITION: Record<string, string> = {
  CARBRAVO: "CARBRAVO_CERTIFIED",
  CARBRAVO_CERTIFIED: "CARBRAVO_CERTIFIED",
  MANUFACTURER_CERTIFIED: "MANUFACTURER_CERTIFIED",
  USED_INSPECTED: "USED_INSPECTED",
  USED_AS_IS: "USED_AS_IS",
};

export function mapSetupResponseToForm(data: ProgramSetupResponseDto): SetupFormValues {
  return {
    programName: data.programName,
    programNumber: "",
    incentiveCodes: "",
    country: "US",
    deliveryStart: mapApiDateToFormDate(data.deliveryStartDate),
    deliveryEnd: mapApiDateToFormDate(data.deliveryEndDate),
    firstVisibleDate: "",
    firstVisibleTime: "",
    programType: data.programTypeCode,
    // Purchase type is a UI-only choice; the contract exposes financeTerms.
    purchaseType: data.financeTerms.length > 0 ? "FINANCE" : "CASH",
    mileageMaximum: data.mileageCeiling ?? 0,
    conditionTier: API_TO_FORM_CONDITION[data.conditionTier ?? data.conditionCode ?? ""] ?? "CARBRAVO_CERTIFIED",
    creditTiers: [...data.creditTiers],
    financeTerms: [...data.financeTerms],
    contact: data.contactName ?? "",
    flags: {
      vinException: data.vinException,
      topOfDeal: data.topOfDeal,
      noAddOns: false,
    },
  };
}

/**
 * Maps the editor's Setup form to the complete OpenAPI SetupInput.
 * Fields owned by other sections are preserved from the loaded snapshot.
 */
export function mapSetupFormToDto(
  values: SetupFormValues,
  existing?: ProgramSetupResponseDto,
): ProgramSetupDto {
  const conditionTier =
    FORM_TO_API_CONDITION[values.conditionTier as keyof typeof FORM_TO_API_CONDITION] ??
    values.conditionTier;

  return {
    programName: values.programName,
    programTypeCode: values.programType,
    customerTypeCodes: existing?.customerTypeCodes.length
      ? [...existing.customerTypeCodes]
      : ["STANDARD"],
    contactName: values.contact.trim() || null,
    contactEmail: existing?.contactEmail ?? null,
    contactPhone: existing?.contactPhone ?? null,
    financialProviderCode: existing?.financialProviderCode ?? null,
    conditionCode: existing?.conditionCode ?? null,
    conditionTier,
    mileageCeiling: values.mileageMaximum,
    topOfDeal: values.flags.topOfDeal,
    vinException: values.flags.vinException,
    mfpnText: existing?.mfpnText ?? null,
    disclosureText: existing?.disclosureText ?? null,
    localeCode: existing?.localeCode ?? "en-US",
    deliveryStartDate: mapFormDateToApiDate(values.deliveryStart),
    deliveryEndDate: mapFormDateToApiDate(values.deliveryEnd),
    effectiveStartDate: existing?.effectiveStartDate ?? null,
    effectiveEndDate: existing?.effectiveEndDate ?? null,
    financeTerms: values.purchaseType === "FINANCE" ? [...values.financeTerms] : [],
    creditTiers: [...values.creditTiers],
  };
}
