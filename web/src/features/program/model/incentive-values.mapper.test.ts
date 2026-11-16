import { describe, expect, it } from "vitest";

import type { ProgramValuesResponseDto } from "../api/values.api";
import {
  mapIncentiveFormToComponents,
  mapProgramValuesToForm,
} from "./incentive-values.mapper";

const response: ProgramValuesResponseDto = {
  financeTerms: [36, 48, 60],
  scopeVehicles: [],
  components: [
    {
      componentId: 1,
      componentCode: "CUSTOMER_CASH",
      componentName: "Customer Cash",
      sequenceNo: 1,
      attributes: [
        { attributeId: 1, key: "CASH_AMOUNT", numberValue: 1250, textValue: null },
      ],
    },
    {
      componentId: 2,
      componentCode: "APR_BY_TERM",
      componentName: "APR by Term",
      sequenceNo: 4,
      attributes: [
        { attributeId: 2, key: "TERM_MONTHS", numberValue: 36, textValue: null },
        { attributeId: 3, key: "APR_RATE", numberValue: 2.9, textValue: null },
        { attributeId: 4, key: "TERM_MONTHS", numberValue: 48, textValue: null },
        { attributeId: 5, key: "APR_RATE", numberValue: 3.9, textValue: null },
      ],
    },
    {
      componentId: 3,
      componentCode: "LEGAL_DISCLOSURE",
      componentName: "Legal Disclosure",
      sequenceNo: 8,
      attributes: [
        { attributeId: 6, key: "CASH_AMOUNT", numberValue: null, textValue: "See terms" },
      ],
    },
  ],
};

describe("incentive values mapper", () => {
  it("hydrates cash and APR values for the selected finance terms", () => {
    expect(mapProgramValuesToForm(response)).toMatchObject({
      customerCash: 1250,
      bonusCash: 0,
      downPaymentAssist: 0,
      aprByTerm: [
        { termMonths: 36, aprRate: 2.9 },
        { termMonths: 48, aprRate: 3.9 },
        { termMonths: 60, aprRate: 0 },
      ],
    });
  });

  it("replaces managed values while preserving components owned by other sections", () => {
    const values = {
      customerCash: 1500,
      bonusCash: 0,
      downPaymentAssist: 250,
      aprByTerm: [
        { termMonths: 36, aprRate: 2.5 },
        { termMonths: 48, aprRate: 0 },
      ],
      stackableWith: [],
      notStackableWith: [],
      belongsTo: "",
    };

    const components = mapIncentiveFormToComponents(values, response);

    expect(components.map((component) => component.componentCode)).toEqual([
      "LEGAL_DISCLOSURE",
      "CUSTOMER_CASH",
      "DOWN_PAYMENT_ASSIST",
      "APR_BY_TERM",
    ]);
    expect(components[0]?.attributes[0]).toMatchObject({
      key: "CASH_AMOUNT",
      textValue: "See terms",
    });
    expect(components.find((component) => component.componentCode === "BONUS_CASH")).toBeUndefined();
    expect(components.find((component) => component.componentCode === "APR_BY_TERM")?.attributes).toEqual([
      { key: "TERM_MONTHS", numberValue: 36 },
      { key: "APR_RATE", numberValue: 2.5 },
    ]);
  });
});
