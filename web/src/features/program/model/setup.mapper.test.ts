import { describe, expect, it } from "vitest";

import type { ProgramSetupResponseDto } from "../api/setup.api";
import {
  mapSetupFormToDto,
  mapSetupResponseToForm,
  mapSetupResponseToDto,
} from "./setup.mapper";

const response: ProgramSetupResponseDto = {
  programId: 12,
  programIdentifier: "CB-2026-0012",
  revisionId: 120,
  majorRevision: 2,
  minorRevision: 1,
  revisionLabel: "2.1",
  revisionStatus: "DRAFT",
  programName: "Spring Finance Event",
  programTypeCode: "APR",
  customerTypeCodes: ["GENERAL_CONSUMER", "LOYALTY"],
  contactName: "Alex Morgan",
  contactEmail: "alex@example.com",
  contactPhone: "555-0100",
  financialProviderCode: "GM_FINANCIAL",
  conditionCode: "CARBRAVO",
  conditionTier: "CARBRAVO",
  mileageCeiling: 60000,
  topOfDeal: true,
  vinException: false,
  mfpnText: "Offer subject to approval.",
  disclosureText: "See dealer for details.",
  localeCode: "en-US",
  deliveryStartDate: "2026-03-01",
  deliveryEndDate: "2026-03-31",
  effectiveStartDate: "2026-03-01",
  effectiveEndDate: "2026-03-31",
  financeTerms: [36, 48],
  creditTiers: ["A1", "A2"],
};

describe("setup mapper", () => {
  it("hydrates date, condition, finance and flag fields from the API response", () => {
    expect(mapSetupResponseToForm(response)).toMatchObject({
      programName: "Spring Finance Event",
      deliveryStart: "01-03-2026",
      deliveryEnd: "31-03-2026",
      purchaseType: "FINANCE",
      financeTerms: [36, 48],
      conditionTier: "CARBRAVO_CERTIFIED",
      flags: { topOfDeal: true, vinException: false, noAddOns: false },
    });
  });

  it("preserves API-owned fields when creating a full setup update", () => {
    const formValues = {
      programName: "Spring Finance Event Updated",
      programNumber: "",
      incentiveCodes: "",
      country: "US",
      deliveryStart: "02-03-2026",
      deliveryEnd: "31-03-2026",
      firstVisibleDate: "",
      firstVisibleTime: "",
      programType: "APR",
      purchaseType: "FINANCE",
      mileageMaximum: 65000,
      conditionTier: "CARBRAVO_CERTIFIED",
      creditTiers: ["A1"],
      financeTerms: [36, 48, 60],
      contact: "Alex Morgan",
      flags: { topOfDeal: true, vinException: true, noAddOns: false },
    };

    const updated = mapSetupFormToDto(formValues, response);

    expect(updated).toMatchObject({
      programName: "Spring Finance Event Updated",
      programTypeCode: "APR",
      deliveryStartDate: "2026-03-02",
      deliveryEndDate: "2026-03-31",
      financeTerms: [36, 48, 60],
      creditTiers: ["A1"],
      financialProviderCode: "GM_FINANCIAL",
      mfpnText: "Offer subject to approval.",
      disclosureText: "See dealer for details.",
      contactEmail: "alex@example.com",
      contactPhone: "555-0100",
    });
  });

  it("strips response metadata when mapping back to the request DTO", () => {
    const dto = mapSetupResponseToDto(response);

    expect(dto).toMatchObject({
      programName: "Spring Finance Event",
      customerTypeCodes: ["GENERAL_CONSUMER", "LOYALTY"],
      financeTerms: [36, 48],
    });
    expect(dto).not.toHaveProperty("revisionId");
    expect(dto).not.toHaveProperty("programIdentifier");
  });
});
