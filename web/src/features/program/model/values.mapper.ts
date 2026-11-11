import type {
  ProgramValuesResponseDto,
  ReplaceProgramValuesRequestDto,
} from "../api/values.api";
import type { IncentiveValuesFormValues } from "../schema";

const CASH_COMPONENTS = [
  { code: "CUSTOMER_CASH", name: "Customer Cash", formField: "customerCash", sequenceNo: 1 },
  { code: "BONUS_CASH", name: "Bonus Cash", formField: "bonusCash", sequenceNo: 2 },
  { code: "DOWN_PAYMENT_ASSIST", name: "Down Payment Assist", formField: "downPaymentAssist", sequenceNo: 3 },
] as const;

function readCashAmount(
  response: ProgramValuesResponseDto,
  componentCode: string,
): number {
  const component = response.components.find((item) => item.componentCode === componentCode);
  const attribute = component?.attributes.find((item) => item.key === "CASH_AMOUNT");
  return attribute?.numberValue ?? 0;
}

export function mapValuesResponseToForm(
  response: ProgramValuesResponseDto,
): IncentiveValuesFormValues {
  return {
    customerCash: readCashAmount(response, "CUSTOMER_CASH"),
    bonusCash: readCashAmount(response, "BONUS_CASH"),
    downPaymentAssist: readCashAmount(response, "DOWN_PAYMENT_ASSIST"),
    // The current OpenAPI contract does not define stackability fields.
    stackableWith: [],
    notStackableWith: [],
    belongsTo: "",
  };
}

export function mapValuesFormToRequest(
  values: IncentiveValuesFormValues,
): ReplaceProgramValuesRequestDto {
  return {
    components: CASH_COMPONENTS.map((component) => ({
      componentCode: component.code,
      componentName: component.name,
      sequenceNo: component.sequenceNo,
      attributes: [
        {
          key: "CASH_AMOUNT",
          numberValue: values[component.formField],
          textValue: null,
        },
      ],
    })),
  };
}

export function hasUnsupportedStackabilityValues(
  values: IncentiveValuesFormValues,
): boolean {
  return values.stackableWith.length > 0 ||
    values.notStackableWith.length > 0 ||
    values.belongsTo.trim().length > 0;
}
