// src/routes/setup.ts

import { Hono } from "hono";

import { currentUser, requireRole } from "../lib/auth.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { getProgramOrThrow } from "../lib/programs.js";
import { getNextId, type MockRevision, readDb, writeDb } from "../store.js";

export const setup = new Hono();

/**
 * ============================================================
 * OpenAPI-aligned API types
 * ============================================================
 *
 * These types intentionally represent the HTTP contract.
 *
 * The persistence model in store.ts may contain the same fields,
 * but these types are the API boundary.
 */

/**
 * OpenAPI:
 *
 * SetupInput.required:
 * - programName
 * - programTypeCode
 * - purchaseType
 * - customerTypeCodes
 * - conditionCode
 * - deliveryStartDate
 * - deliveryEndDate
 */
type SetupInput = {
  programName: string;
  programTypeCode: "CUSTOMER_CASH" | "APR" | "BONUS_CASH";
  purchaseType: "CASH" | "FINANCE";
  customerTypeCodes: string[];
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  financialProviderCode?: string | null;
  conditionCode:
    | "CARBRAVO"
    | "MANUFACTURER_CERTIFIED"
    | "USED_INSPECTED"
    | "USED_AS_IS";
  mileageCeiling?: number | null;
  topOfDeal?: boolean;
  vinException?: boolean;
  mfpnText?: string | null;
  disclosureText?: string | null;
  localeCode?: string;
  deliveryStartDate: string;
  deliveryEndDate: string;
  effectiveStartDate?: string | null;
  effectiveEndDate?: string | null;
  financeTerms?: number[];
  creditTiers?: Array<"A_PLUS" | "A1" | "A2" | "B">;
};

/**
 * OpenAPI Setup response.
 *
 * Setup = revision/program metadata + SetupInput.
 */
type SetupResponse = {
  programId: number;
  programIdentifier: string;

  revisionId: number;
  majorRevision: number;
  minorRevision: number;
  revisionLabel: string;
  revisionStatus: MockRevision["status"];

  programName: string;

  programTypeCode: "CUSTOMER_CASH" | "APR" | "BONUS_CASH";

  purchaseType: "CASH" | "FINANCE";

  customerTypeCodes: string[];

  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;

  financialProviderCode: string | null;

  conditionCode:
    | "CARBRAVO"
    | "MANUFACTURER_CERTIFIED"
    | "USED_INSPECTED"
    | "USED_AS_IS";

  mileageCeiling: number | null;

  topOfDeal: boolean;
  vinException: boolean;

  mfpnText: string | null;
  disclosureText: string | null;

  localeCode: string;

  deliveryStartDate: string;
  deliveryEndDate: string;
  effectiveStartDate: string | null;
  effectiveEndDate: string | null;
  financeTerms: number[];
  creditTiers: Array<"A_PLUS" | "A1" | "A2" | "B">;
};

/**
 * ============================================================
 * Constants matching OpenAPI enums
 * ============================================================
 */

const PROGRAM_TYPE_CODES = ["CUSTOMER_CASH", "APR", "BONUS_CASH"] as const;
const PURCHASE_TYPES = ["CASH", "FINANCE"] as const;
const CONDITION_CODES = [
  "CARBRAVO",
  "MANUFACTURER_CERTIFIED",
  "USED_INSPECTED",
  "USED_AS_IS",
] as const;
const CREDIT_TIER_CODES = ["A_PLUS", "A1", "A2", "B"] as const;

/**
 * ============================================================
 * Route parameter validation
 * ============================================================
 */

function getIds(c: {
  req: {
    param: (name: string) => string;
  };
}) {
  const programId = Number(c.req.param("programId"));
  const revisionId = Number(c.req.param("revisionId"));

  if (
    !Number.isInteger(programId) ||
    !Number.isInteger(revisionId) ||
    programId <= 0 ||
    revisionId <= 0
  ) {
    throw badRequest(
      "VALIDATION_ERROR",
      "programId and revisionId must be positive integers",
    );
  }

  return {
    programId,
    revisionId,
  };
}

/**
 * ============================================================
 * Revision lookup
 * ============================================================
 */

function getRevision(
  db: Awaited<ReturnType<typeof readDb>>,
  programId: number,
  revisionId: number,
): MockRevision {
  const revision = db.revisions.find(
    (item) => item.id === revisionId && item.programId === programId,
  );

  if (!revision) {
    throw notFound("REVISION_NOT_FOUND", "Revision not found");
  }

  return revision;
}

/**
 * ============================================================
 * Generic validation helpers
 * ============================================================
 */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.toISOString().slice(0, 10) === value;
}

function isValidEmail(value: string): boolean {
  /**
   * Basic API-boundary email validation.
   *
   * The OpenAPI contract declares format: email.
   * This intentionally does not attempt to implement
   * the entire RFC 5322 grammar.
   */
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * ============================================================
 * Setup validation
 * ============================================================
 *
 * Validation follows SetupInput from openapi.yaml.
 */

function validateSetup(body: unknown): asserts body is SetupInput {
  if (!isPlainObject(body)) {
    throw badRequest("VALIDATION_ERROR", "Request body must be an object");
  }

  /**
   * ----------------------------------------------------------
   * Required fields
   * ----------------------------------------------------------
   */

  if (typeof body.programName !== "string" || !body.programName.trim()) {
    throw badRequest("VALIDATION_ERROR", "programName is required");
  }

  if (body.programName.trim().length > 255) {
    throw badRequest(
      "VALIDATION_ERROR",
      "programName must be 255 characters or fewer",
    );
  }

  if (
    typeof body.programTypeCode !== "string" ||
    !PROGRAM_TYPE_CODES.includes(
      body.programTypeCode as (typeof PROGRAM_TYPE_CODES)[number],
    )
  ) {
    throw badRequest("VALIDATION_ERROR", "Invalid programTypeCode");
  }

  if (
    typeof body.purchaseType !== "string" ||
    !PURCHASE_TYPES.includes(
      body.purchaseType as (typeof PURCHASE_TYPES)[number],
    )
  ) {
    throw badRequest("VALIDATION_ERROR", "Invalid purchaseType");
  }

  if (!Array.isArray(body.customerTypeCodes)) {
    throw badRequest("VALIDATION_ERROR", "customerTypeCodes must be an array");
  }

  if (body.customerTypeCodes.length < 1 || body.customerTypeCodes.length > 50) {
    throw badRequest(
      "VALIDATION_ERROR",
      "customerTypeCodes must contain between 1 and 50 values",
    );
  }

  if (
    body.customerTypeCodes.some(
      (value) => typeof value !== "string" || !value.trim(),
    )
  ) {
    throw badRequest(
      "VALIDATION_ERROR",
      "customerTypeCodes must contain valid strings",
    );
  }

  if (
    typeof body.conditionCode !== "string" ||
    !CONDITION_CODES.includes(
      body.conditionCode as (typeof CONDITION_CODES)[number],
    )
  ) {
    throw badRequest("VALIDATION_ERROR", "Invalid conditionCode");
  }

  if (
    typeof body.deliveryStartDate !== "string" ||
    typeof body.deliveryEndDate !== "string"
  ) {
    throw badRequest(
      "VALIDATION_ERROR",
      "deliveryStartDate and deliveryEndDate are required",
    );
  }

  /**
   * ----------------------------------------------------------
   * Dates
   * ----------------------------------------------------------
   */

  if (!isValidDate(body.deliveryStartDate)) {
    throw badRequest(
      "VALIDATION_ERROR",
      "deliveryStartDate must be a valid date in YYYY-MM-DD format",
    );
  }

  if (!isValidDate(body.deliveryEndDate)) {
    throw badRequest(
      "VALIDATION_ERROR",
      "deliveryEndDate must be a valid date in YYYY-MM-DD format",
    );
  }

  if (body.deliveryStartDate > body.deliveryEndDate) {
    throw badRequest(
      "VALIDATION_ERROR",
      "deliveryStartDate cannot be after deliveryEndDate",
    );
  }

  /**
   * ----------------------------------------------------------
   * Nullable string fields
   * ----------------------------------------------------------
   */

  if (body.contactName !== undefined && body.contactName !== null) {
    if (typeof body.contactName !== "string" || body.contactName.length > 255) {
      throw badRequest(
        "VALIDATION_ERROR",
        "contactName must be a string of 255 characters or fewer",
      );
    }
  }

  if (body.contactEmail !== undefined && body.contactEmail !== null) {
    if (
      typeof body.contactEmail !== "string" ||
      !isValidEmail(body.contactEmail)
    ) {
      throw badRequest(
        "VALIDATION_ERROR",
        "contactEmail must be a valid email address",
      );
    }
  }

  if (
    body.contactPhone !== undefined &&
    body.contactPhone !== null &&
    typeof body.contactPhone !== "string"
  ) {
    throw badRequest(
      "VALIDATION_ERROR",
      "contactPhone must be a string or null",
    );
  }

  if (
    body.financialProviderCode !== undefined &&
    body.financialProviderCode !== null &&
    typeof body.financialProviderCode !== "string"
  ) {
    throw badRequest(
      "VALIDATION_ERROR",
      "financialProviderCode must be a string or null",
    );
  }

  if (
    body.mfpnText !== undefined &&
    body.mfpnText !== null &&
    typeof body.mfpnText !== "string"
  ) {
    throw badRequest("VALIDATION_ERROR", "mfpnText must be a string or null");
  }

  if (
    body.disclosureText !== undefined &&
    body.disclosureText !== null &&
    typeof body.disclosureText !== "string"
  ) {
    throw badRequest(
      "VALIDATION_ERROR",
      "disclosureText must be a string or null",
    );
  }

  if (body.localeCode !== undefined && typeof body.localeCode !== "string") {
    throw badRequest("VALIDATION_ERROR", "localeCode must be a string");
  }

  /**
   * ----------------------------------------------------------
   * Optional dates
   * ----------------------------------------------------------
   */

  if (
    body.effectiveStartDate !== undefined &&
    body.effectiveStartDate !== null
  ) {
    if (
      typeof body.effectiveStartDate !== "string" ||
      !isValidDate(body.effectiveStartDate)
    ) {
      throw badRequest(
        "VALIDATION_ERROR",
        "effectiveStartDate must be a valid date or null",
      );
    }
  }

  if (body.effectiveEndDate !== undefined && body.effectiveEndDate !== null) {
    if (
      typeof body.effectiveEndDate !== "string" ||
      !isValidDate(body.effectiveEndDate)
    ) {
      throw badRequest(
        "VALIDATION_ERROR",
        "effectiveEndDate must be a valid date or null",
      );
    }
  }

  if (
    body.effectiveStartDate &&
    body.effectiveEndDate &&
    body.effectiveStartDate > body.effectiveEndDate
  ) {
    throw badRequest(
      "VALIDATION_ERROR",
      "effectiveStartDate cannot be after effectiveEndDate",
    );
  }

  /**
   * ----------------------------------------------------------
   * mileageCeiling
   * OpenAPI: integer | null
   * ----------------------------------------------------------
   */

  if (body.mileageCeiling !== undefined && body.mileageCeiling !== null) {
    if (
      typeof body.mileageCeiling !== "number" ||
      !Number.isInteger(body.mileageCeiling)
    ) {
      throw badRequest(
        "VALIDATION_ERROR",
        "mileageCeiling must be an integer or null",
      );
    }
  }

  /**
   * ----------------------------------------------------------
   * Boolean fields
   * ----------------------------------------------------------
   */

  if (body.topOfDeal !== undefined && typeof body.topOfDeal !== "boolean") {
    throw badRequest("VALIDATION_ERROR", "topOfDeal must be a boolean");
  }

  if (
    body.vinException !== undefined &&
    typeof body.vinException !== "boolean"
  ) {
    throw badRequest("VALIDATION_ERROR", "vinException must be a boolean");
  }

  /**
   * ----------------------------------------------------------
   * Finance terms
   * OpenAPI: integer[]
   * ----------------------------------------------------------
   */

  if (body.financeTerms !== undefined) {
    if (
      !Array.isArray(body.financeTerms) ||
      body.financeTerms.some(
        (value) => typeof value !== "number" || !Number.isInteger(value),
      )
    ) {
      throw badRequest(
        "VALIDATION_ERROR",
        "financeTerms must contain integer values",
      );
    }
  }

  /**
   * ----------------------------------------------------------
   * Credit tiers
   * OpenAPI enum:
   * A_PLUS | A1 | A2 | B
   * ----------------------------------------------------------
   */

  if (body.creditTiers !== undefined) {
    if (!Array.isArray(body.creditTiers)) {
      throw badRequest("VALIDATION_ERROR", "creditTiers must be an array");
    }

    if (
      body.creditTiers.some(
        (value) =>
          typeof value !== "string" ||
          !CREDIT_TIER_CODES.includes(
            value as (typeof CREDIT_TIER_CODES)[number],
          ),
      )
    ) {
      throw badRequest("VALIDATION_ERROR", "Invalid creditTiers value");
    }
  }
}

/**
 * ============================================================
 * API response mapper
 * ============================================================
 *
 * IMPORTANT:
 * Do not spread revision.setup directly into the response.
 *
 * The API response is an explicit DTO.
 * This prevents internal DB fields from leaking into HTTP.
 */

function setupResponse(
  program: Awaited<ReturnType<typeof readDb>>["programs"][number],
  revision: MockRevision,
): SetupResponse {
  const setup = revision.setup;

  return {
    programId: program.id,
    programIdentifier: program.identifier,

    revisionId: revision.id,
    majorRevision: revision.majorRevision,
    minorRevision: revision.minorRevision,
    revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,
    revisionStatus: revision.status,

    programName: setup.programName ?? program.name,

    programTypeCode: setup.programTypeCode as SetupResponse["programTypeCode"],

    purchaseType: setup.purchaseType as SetupResponse["purchaseType"],

    customerTypeCodes: [...setup.customerTypeCodes],

    contactName: setup.contactName ?? null,
    contactEmail: setup.contactEmail ?? null,
    contactPhone: setup.contactPhone ?? null,

    financialProviderCode: setup.financialProviderCode ?? null,

    conditionCode: setup.conditionCode as SetupResponse["conditionCode"],

    mileageCeiling: setup.mileageCeiling ?? null,

    topOfDeal: setup.topOfDeal ?? false,

    vinException: setup.vinException ?? false,

    mfpnText: setup.mfpnText ?? null,

    disclosureText: setup.disclosureText ?? null,

    localeCode: setup.localeCode ?? "en-US",

    deliveryStartDate: setup.deliveryStartDate as string,

    deliveryEndDate: setup.deliveryEndDate as string,

    effectiveStartDate: setup.effectiveStartDate ?? null,

    effectiveEndDate: setup.effectiveEndDate ?? null,

    financeTerms: [...(setup.financeTerms ?? [])],

    creditTiers: (setup.creditTiers ?? []) as SetupResponse["creditTiers"],
  };
}

/**
 * ============================================================
 * GET /api/programs/:programId/revisions/:revisionId/setup
 * ============================================================
 *
 * OpenAPI operationId: getSetup
 *
 * Response: Setup
 */

setup.get("/programs/:programId/revisions/:revisionId/setup", async (c) => {
  currentUser(c);

  const { programId, revisionId } = getIds(c);

  const db = await readDb();

  const program = getProgramOrThrow(db, programId);

  const revision = getRevision(db, program.id, revisionId);

  return c.json(setupResponse(program, revision));
});

/**
 * ============================================================
 * PUT /api/programs/:programId/revisions/:revisionId/setup
 * ============================================================
 *
 * OpenAPI operationId: saveSetup
 *
 * Roles:
 * AUTHOR, ADMIN
 *
 * Guard:
 * revision.status === DRAFT
 *
 * Side effect:
 * Major revision => reset approval.
 * Minor revision => preserve approval.
 */

setup.put("/programs/:programId/revisions/:revisionId/setup", async (c) => {
  const user = requireRole(c, "AUTHOR", "ADMIN");

  const { programId, revisionId } = getIds(c);

  const body = await c.req.json<unknown>().catch(() => null);

  if (body === null) {
    throw badRequest("VALIDATION_ERROR", "Request body must be valid JSON");
  }

  validateSetup(body);

  const db = await readDb();

  const program = getProgramOrThrow(db, programId);

  const revision = getRevision(db, program.id, revisionId);

  /**
   * OpenAPI guard:
   * setup can only be saved for DRAFT revision.
   */
  if (revision.status !== "DRAFT") {
    throw conflict(
      "REVISION_NOT_EDITABLE",
      "Setup can only be edited while the revision is DRAFT",
    );
  }

  const now = new Date().toISOString();

  /**
   * Store the complete SetupInput snapshot.
   *
   * Defaults here correspond to the mock persistence model.
   * They do not alter the HTTP contract.
   */
  revision.setup = {
    ...revision.setup,

    programName: body.programName.trim(),

    programTypeCode: body.programTypeCode,

    purchaseType: body.purchaseType,

    customerTypeCodes: [...body.customerTypeCodes],

    contactName: body.contactName ?? null,

    contactEmail: body.contactEmail ?? null,

    contactPhone: body.contactPhone ?? null,

    financialProviderCode: body.financialProviderCode ?? null,

    conditionCode: body.conditionCode,

    mileageCeiling: body.mileageCeiling ?? null,

    topOfDeal: body.topOfDeal ?? false,

    vinException: body.vinException ?? false,

    mfpnText: body.mfpnText ?? null,

    disclosureText: body.disclosureText ?? null,

    localeCode: body.localeCode ?? "en-US",

    deliveryStartDate: body.deliveryStartDate,

    deliveryEndDate: body.deliveryEndDate,

    effectiveStartDate: body.effectiveStartDate ?? null,

    effectiveEndDate: body.effectiveEndDate ?? null,

    financeTerms: [...(body.financeTerms ?? [])],

    creditTiers: [...(body.creditTiers ?? [])],
  };

  /**
   * Program-level fields are a projection of setup.
   *
   * This keeps GET /programs and GET /setup consistent.
   */
  program.name = revision.setup.programName ?? program.name;

  program.programType = revision.setup.programTypeCode ?? program.programType;

  program.deliveryStartDate = revision.setup.deliveryStartDate;

  program.deliveryEndDate = revision.setup.deliveryEndDate;

  program.updatedAt = now;

  /**
   * OpenAPI:
   *
   * Major revision:
   * approval is reset.
   *
   * Minor revision:
   * approval remains untouched.
   */
  resetApprovalIfNeeded(revision);

  /**
   * Audit activity.
   */
  db.activity.unshift({
    id: getNextId(db.activity),

    entityType: "INCENTIVE_REVISION",

    entityId: revision.id,

    operation: "UPDATE",

    changedBy: user.username,

    changedAt: now,

    programName: program.name,

    programIdentifier: program.identifier,
  });

  await writeDb(db);

  /**
   * HTTP response MUST be Setup.
   */
  return c.json(setupResponse(program, revision));
});

/**
 * ============================================================
 * Approval reset helper
 * ============================================================
 */

function resetApprovalIfNeeded(revision: MockRevision): void {
  /**
   * OpenAPI explicitly exempts minor revisions.
   */
  if (revision.isMinorRevision) {
    return;
  }

  revision.approval.isSubmitted = false;
  revision.approval.submittedAt = null;
  revision.approval.submittedBy = null;

  revision.approval.approved = false;
  revision.approval.approvedAt = null;
  revision.approval.approvedBy = null;
  revision.approval.approvalComment = null;

  revision.approval.rejectedAt = null;
  revision.approval.rejectedBy = null;
  revision.approval.rejectionReason = null;
}
