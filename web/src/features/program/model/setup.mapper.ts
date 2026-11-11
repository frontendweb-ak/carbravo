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

const FORM_TO_API_CONDITION: Record<string, string> = {
  CARBRAVO_CERTIFIED: "CARBRAVO",
  MANUFACTURER_CERTIFIED: "MANUFACTURER_CERTIFIED",
  USED_INSPECTED: "USED_INSPECTED",
  USED_AS_IS: "USED_AS_IS",
};

const API_TO_FORM_CONDITION: Record<string, string> = {
  CARBRAVO: "CARBRAVO_CERTIFIED",
  CARBRAVO_CERTIFIED: "CARBRAVO_CERTIFIED",
  MANUFACTURER_CERTIFIED: "MANUFACTURER_CERTIFIED",
  USED_INSPECTED: "USED_INSPECTED",
  USED_AS_IS: "USED_AS_IS",
};

/**
 * Builds a complete SetupInput from the last API snapshot, then applies
 * section-specific changes. This prevents a section save from erasing
 * fields owned by another section.
 */
export function mergeSetupResponseToDto(
  existing: ProgramSetupResponseDto,
  overrides: Partial<ProgramSetupDto>,
): ProgramSetupDto {
  return {
    programName: existing.programName,
    programTypeCode: existing.programTypeCode,
    customerTypeCodes: [...existing.customerTypeCodes],
    contactName: existing.contactName,
    contactEmail: existing.contactEmail,
    contactPhone: existing.contactPhone,
    financialProviderCode: existing.financialProviderCode,
    conditionCode: existing.conditionCode,
    conditionTier: existing.conditionTier,
    mileageCeiling: existing.mileageCeiling,
    topOfDeal: existing.topOfDeal,
    vinException: existing.vinException,
    mfpnText: existing.mfpnText,
    disclosureText: existing.disclosureText,
    localeCode: existing.localeCode,
    deliveryStartDate: existing.deliveryStartDate,
    deliveryEndDate: existing.deliveryEndDate,
    effectiveStartDate: existing.effectiveStartDate,
    effectiveEndDate: existing.effectiveEndDate,
    financeTerms: [...existing.financeTerms],
    creditTiers: [...existing.creditTiers],
    ...overrides,
  };
}

export function mapSetupResponseToForm(
  data: ProgramSetupResponseDto,
): SetupFormValues {
  return {
    programName: data.programName,
    // These are present in the reference UI but absent from the API contract.
    programNumber: "",
    incentiveCodes: "",
    country: "US",
    deliveryStart: mapApiDateToFormDate(data.deliveryStartDate),
    deliveryEnd: mapApiDateToFormDate(data.deliveryEndDate),
    firstVisibleDate: "",
    firstVisibleTime: "",
    programType: data.programTypeCode,
    // Purchase type is UI-only; financeTerms is the only related API field.
    purchaseType: data.financeTerms.length > 0 ? "FINANCE" : "CASH",
    mileageMaximum: data.mileageCeiling ?? 0,
    conditionTier:
      API_TO_FORM_CONDITION[data.conditionTier ?? data.conditionCode ?? ""] ??
      "CARBRAVO_CERTIFIED",
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

export function mapSetupFormToDto(
  values: SetupFormValues,
  existing?: ProgramSetupResponseDto,
): ProgramSetupDto {
  const mappedConditionTier =
    FORM_TO_API_CONDITION[values.conditionTier] ?? values.conditionTier;

  const base = existing
    ? mergeSetupResponseToDto(existing, {})
    : {
        programName: values.programName,
        programTypeCode: values.programType,
        customerTypeCodes: ["STANDARD"],
        deliveryStartDate: "",
        deliveryEndDate: "",
      };

  return {
    ...base,
    programName: values.programName,
    programTypeCode: values.programType,
    conditionTier: mappedConditionTier,
    mileageCeiling: values.mileageMaximum,
    topOfDeal: values.flags.topOfDeal,
    vinException: values.flags.vinException,
    contactName: values.contact.trim() || null,
    deliveryStartDate: mapFormDateToApiDate(values.deliveryStart),
    deliveryEndDate: mapFormDateToApiDate(values.deliveryEnd),
    financeTerms:
      values.purchaseType === "FINANCE" ? [...values.financeTerms] : [],
    creditTiers: [...values.creditTiers],
  };
}


/**
 * Strip revision metadata from a Setup response before sending a complete
 * SetupInput to PUT /setup.
 */
export function mapSetupResponseToDto(data: ProgramSetupResponseDto): ProgramSetupDto {
  return {
    programName: data.programName,
    programTypeCode: data.programTypeCode,
    customerTypeCodes: [...data.customerTypeCodes],
    contactName: data.contactName,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    financialProviderCode: data.financialProviderCode,
    conditionCode: data.conditionCode,
    conditionTier: data.conditionTier,
    mileageCeiling: data.mileageCeiling,
    topOfDeal: data.topOfDeal,
    vinException: data.vinException,
    mfpnText: data.mfpnText,
    disclosureText: data.disclosureText,
    localeCode: data.localeCode,
    deliveryStartDate: data.deliveryStartDate,
    deliveryEndDate: data.deliveryEndDate,
    effectiveStartDate: data.effectiveStartDate,
    effectiveEndDate: data.effectiveEndDate,
    financeTerms: [...data.financeTerms],
    creditTiers: [...data.creditTiers],
  };
}
