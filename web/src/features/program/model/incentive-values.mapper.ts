import type {
  IncentiveComponentDto,
  IncentiveComponentInput,
  ProgramValuesResponseDto,
} from "../api/values.api";
import type { IncentiveValuesFormValues } from "../schema";

const CASH_COMPONENTS = [
  { code: "CUSTOMER_CASH", name: "Customer Cash", field: "customerCash", sequenceNo: 1 },
  { code: "BONUS_CASH", name: "Bonus Cash", field: "bonusCash", sequenceNo: 2 },
  { code: "DOWN_PAYMENT_ASSIST", name: "Down Payment Assist", field: "downPaymentAssist", sequenceNo: 3 },
] as const;

const MANAGED_COMPONENT_CODES = [
  ...CASH_COMPONENTS.map((item) => item.code),
  "APR_BY_TERM",
];

function getCashValue(
  components: IncentiveComponentDto[],
  componentCode: string,
): number {
  const component = components.find((item) => item.componentCode === componentCode);
  const attribute = component?.attributes.find((item) => item.key === "CASH_AMOUNT");
  return attribute?.numberValue ?? 0;
}

function mapAprByTerm(
  components: IncentiveComponentDto[],
  financeTerms: number[],
): IncentiveValuesFormValues["aprByTerm"] {
  const component = components.find((item) => item.componentCode === "APR_BY_TERM");
  const byTerm = new Map<number, number>();
  const attributes = component?.attributes ?? [];

  for (let index = 0; index < attributes.length - 1; index += 2) {
    const term = attributes[index];
    const rate = attributes[index + 1];
    if (
      term?.key === "TERM_MONTHS" &&
      typeof term.numberValue === "number" &&
      rate?.key === "APR_RATE" &&
      typeof rate.numberValue === "number"
    ) {
      byTerm.set(term.numberValue, rate.numberValue);
    }
  }

  return financeTerms.map((termMonths) => ({
    termMonths,
    aprRate: byTerm.get(termMonths) ?? 0,
  }));
}

export function mapProgramValuesToForm(
  data: ProgramValuesResponseDto,
): IncentiveValuesFormValues {
  return {
    customerCash: getCashValue(data.components, "CUSTOMER_CASH"),
    bonusCash: getCashValue(data.components, "BONUS_CASH"),
    downPaymentAssist: getCashValue(data.components, "DOWN_PAYMENT_ASSIST"),
    aprByTerm: mapAprByTerm(data.components, data.financeTerms),
    stackableWith: [],
    notStackableWith: [],
    belongsTo: "",
  };
}

function preserveUnknownComponents(
  components: IncentiveComponentDto[],
): IncentiveComponentInput[] {
  return components
    .filter((item) => !MANAGED_COMPONENT_CODES.includes(item.componentCode))
    .map((item) => ({
      componentCode: item.componentCode,
      componentName: item.componentName,
      sequenceNo: item.sequenceNo,
      attributes: item.attributes.map((attribute) => ({
        key: attribute.key,
        numberValue: attribute.numberValue,
        textValue: attribute.textValue,
      })),
    }));
}

export function mapIncentiveFormToComponents(
  values: IncentiveValuesFormValues,
  existing: ProgramValuesResponseDto,
): IncentiveComponentInput[] {
  const components = preserveUnknownComponents(existing.components);

  for (const item of CASH_COMPONENTS) {
    const amount = values[item.field];
    if (amount <= 0) continue;
    components.push({
      componentCode: item.code,
      componentName: item.name,
      sequenceNo: item.sequenceNo,
      attributes: [{ key: "CASH_AMOUNT", numberValue: amount }],
    });
  }

  const aprAttributes = values.aprByTerm
    .filter((item) => item.aprRate > 0)
    .flatMap((item) => [
      { key: "TERM_MONTHS" as const, numberValue: item.termMonths },
      { key: "APR_RATE" as const, numberValue: item.aprRate },
    ]);

  if (aprAttributes.length > 0) {
    components.push({
      componentCode: "APR_BY_TERM",
      componentName: "APR by Term",
      sequenceNo: 4,
      attributes: aprAttributes,
    });
  }

  return components;
}
