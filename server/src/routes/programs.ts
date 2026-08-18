// src/routes/programs.ts

import { Hono } from "hono";
import { currentUser, requireRole } from "../lib/auth.js";
import { badRequest, conflict } from "../lib/errors.js";
import {
  getActiveRevision,
  getDraftRevision,
  getProgramOrThrow,
  getProgramWorkflowStatus,
  programListItem,
  revisionRef,
} from "../lib/programs.js";
import {
  getNextId,
  type MockRevision,
  readDb,
  revisionLabel,
  writeDb,
} from "../store.js";

export const programs = new Hono();

/**
 * GET /api/programs
 */
const PROGRAM_STATUSES = ["DRAFT", "ACTIVE", "EXPIRED"] as const;
const PROGRAM_TYPES = ["CUSTOMER_CASH", "APR", "BONUS_CASH"] as const;

function parseNonNegativeInt(
  value: string | undefined,
  defaultValue: number,
  field: string,
): number {
  if (value === undefined) {
    return defaultValue;
  }

  if (!/^\d+$/.test(value)) {
    throw badRequest(
      "VALIDATION_ERROR",
      `${field} must be a non-negative integer`,
    );
  }

  return Number(value);
}

function parseBooleanQuery(
  value: string | undefined,
  field: string,
): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value !== "true" && value !== "false") {
    throw badRequest("VALIDATION_ERROR", `${field} must be true or false`);
  }

  return value === "true";
}

/**
 * GET /api/programs
 */
programs.get("/programs", async (c) => {
  currentUser(c);

  const db = await readDb();

  const status = c.req.query("status");
  const programType = c.req.query("programType");
  const search = c.req.query("search")?.trim().toLowerCase();
  const dateFrom = c.req.query("dateFrom");
  const dateTo = c.req.query("dateTo");

  const pendingApproval = parseBooleanQuery(
    c.req.query("pendingApproval"),
    "pendingApproval",
  );

  const page = parseNonNegativeInt(c.req.query("page"), 0, "page");
  const size = parseNonNegativeInt(c.req.query("size"), 25, "size");

  if (size < 1 || size > 100) {
    throw badRequest("VALIDATION_ERROR", "size must be between 1 and 100");
  }

  if (
    status &&
    !PROGRAM_STATUSES.includes(status as (typeof PROGRAM_STATUSES)[number])
  ) {
    throw badRequest("VALIDATION_ERROR", "Invalid program status");
  }

  if (
    programType &&
    !PROGRAM_TYPES.includes(programType as (typeof PROGRAM_TYPES)[number])
  ) {
    throw badRequest("VALIDATION_ERROR", "Invalid program type");
  }

  let list = db.programs.filter((program) => program.deletedAt === null);
  if (status) {
    list = list.filter((program) => program.status === status);
  }

  if (programType) {
    list = list.filter((program) => program.programType === programType);
  }

  if (search) {
    list = list.filter((program) =>
      [program.name, program.identifier].some((value) =>
        value.toLowerCase().includes(search),
      ),
    );
  }

  if (dateFrom) {
    list = list.filter(
      (program) =>
        program.deliveryStartDate !== null &&
        program.deliveryStartDate >= dateFrom,
    );
  }

  if (dateTo) {
    list = list.filter(
      (program) =>
        program.deliveryEndDate !== null && program.deliveryEndDate <= dateTo,
    );
  }

  if (pendingApproval === true) {
    list = list.filter((program) => {
      const draft = getDraftRevision(db, program);

      return Boolean(draft?.approval.isSubmitted && !draft.approval.approved);
    });
  }

  const totalElements = list.length;

  const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / size);

  const content = list
    .slice(page * size, page * size + size)
    .map((program) => programListItem(db, program));

  return c.json({
    content,
    pagination: {
      page,
      size,
      totalElements,
      totalPages,
    },
  });
});

/**
 * POST /api/programs
 *
 * Creates:
 *   - program
 *   - initial draft revision
 *
 * The setup is intentionally NOT submitted here.
 * Setup is saved through the revision-scoped setup endpoint.
 */
programs.post("/programs", async (c) => {
  const user = requireRole(c, "AUTHOR", "ADMIN");

  const body = await c.req.json().catch(() => ({}));
  if (!body || typeof body !== "object") {
    throw badRequest("VALIDATION_ERROR", "Request body must be a JSON object");
  }

  const programName =
    typeof body.programName === "string" ? body.programName.trim() : "";

  if (!programName) {
    throw badRequest("BAD_REQUEST", "programName is required");
  }

  if (programName.length > 255) {
    throw badRequest(
      "BAD_REQUEST",
      "programName must be 255 characters or fewer",
    );
  }

  const db = await readDb();
  const now = new Date().toISOString();

  const programId = getNextId(db.programs);
  const revisionId = getNextId(db.revisions);

  const identifier = `PROG-${new Date().getFullYear()}-${String(
    programId,
  ).padStart(4, "0")}`;

  const revision: MockRevision = {
    id: revisionId,
    programId,

    majorRevision: 1,
    minorRevision: 0,

    status: "DRAFT",
    isMinorRevision: false,

    createdAt: now,
    createdBy: user.username,

    postedAt: null,
    postedBy: null,

    approval: {
      revisionId,

      isSubmitted: false,
      submittedAt: null,
      submittedBy: null,

      approved: false,
      approvedAt: null,
      approvedBy: null,

      approvalComment: null,

      rejectedAt: null,
      rejectedBy: null,
      rejectionReason: null,
    },

    setup: {
      programTypeCode: null,
      purchaseType: null,

      customerTypeCodes: [],

      contactName: null,
      contactEmail: null,
      contactPhone: null,

      financialProviderCode: null,

      conditionCode: null,

      mileageCeiling: null,

      topOfDeal: false,
      vinException: false,

      mfpnText: null,
      disclosureText: null,

      localeCode: "en-US",

      deliveryStartDate: null,
      deliveryEndDate: null,

      effectiveStartDate: null,
      effectiveEndDate: null,

      financeTerms: [],
      creditTiers: [],
    },

    vehicles: [],
    geography: [],
    values: {
      financeTerms: [],
      components: [],
    },
    summary: {},
    copiedFromRevisionId: null,
  };

  const program = {
    id: programId,
    identifier,
    name: programName,
    status: "DRAFT" as const,
    programType: "",
    activeRevisionId: null,
    draftRevisionId: revisionId,
    deliveryStartDate: null,
    deliveryEndDate: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  /*
   * Persist program and revision together.
   *
   * With the JSON mock store this is one write.
   * In Spring Boot this must become one database transaction.
   */
  db.programs.push(program);
  db.revisions.push(revision);

  db.activity.unshift({
    id: getNextId(db.activity),
    entityType: "INCENTIVE_PROGRAM",
    entityId: program.id,
    operation: "CREATE",
    changedBy: user.username,
    changedAt: now,
    programName: program.name,
    programIdentifier: program.identifier,
  });

  await writeDb(db);

  return c.json(
    {
      programId: program.id,
      programIdentifier: program.identifier,
      programStatus: program.status,
      revisionId: revision.id,
      revisionStatus: revision.status,
      majorRevision: revision.majorRevision,
      minorRevision: revision.minorRevision,
      revisionLabel: revisionLabel(revision),
    },
    201,
  );
});

/**
 * GET /api/programs/:programId
 */
programs.get("/programs/:programId", async (c) => {
  currentUser(c);
  const db = await readDb();
  const programId = Number(c.req.param("programId"));
  const program = getProgramOrThrow(db, programId);

  const activeRevision = getActiveRevision(db, program);
  const draftRevision = getDraftRevision(db, program);

  return c.json({
    programId: program.id,
    programIdentifier: program.identifier,
    programName: program.name,

    programStatus: getProgramWorkflowStatus(program, draftRevision),

    programType: program.programType,

    activeRevision: activeRevision ? revisionRef(activeRevision) : null,
    draftRevision: draftRevision ? revisionRef(draftRevision) : null,

    deliveryStartDate: program.deliveryStartDate,
    deliveryEndDate: program.deliveryEndDate,

    updatedAt: program.updatedAt,
  });
});

/**
 * DELETE /api/programs/:programId
 */
programs.delete("/programs/:programId", async (c) => {
  const user = requireRole(c, "ADMIN");

  const programId = Number(c.req.param("programId"));
  if (!Number.isInteger(programId) || programId <= 0) {
    throw badRequest(
      "VALIDATION_ERROR",
      "programId must be a positive integer",
    );
  }

  const db = await readDb();
  const program = getProgramOrThrow(db, programId);

  /*
   * A posted revision means the program has entered
   * the production lifecycle and cannot be deleted.
   */
  const hasPostedRevision = db.revisions.some(
    (revision) =>
      revision.programId === programId &&
      (revision.status === "ACTIVE" || revision.status === "EXPIRED"),
  );
  if (program.status !== "DRAFT" || hasPostedRevision) {
    throw conflict(
      "REVISION_NOT_EDITABLE",
      "Only a program that has never been posted can be deleted",
    );
  }

  const now = new Date().toISOString();

  program.deletedAt = now;
  program.updatedAt = now;

  db.activity.unshift({
    id: getNextId(db.activity),
    entityType: "INCENTIVE_PROGRAM",
    entityId: program.id,

    operation: "DELETE",
    changedBy: user.username,
    changedAt: now,

    programId: program.id,
    programName: program.name,
    programIdentifier: program.identifier,
  });
  await writeDb(db);
  return c.body(null, 204);
});

/**
 * POST /programs/:programId/clone
 */
programs.post("/programs/:programId/clone", async (c) => {
  const user = requireRole(c, "AUTHOR", "ADMIN");

  const sourceProgramId = Number(c.req.param("programId"));
  if (!Number.isInteger(sourceProgramId) || sourceProgramId <= 0) {
    throw badRequest(
      "VALIDATION_ERROR",
      "programId must be a positive integer",
    );
  }

  const db = await readDb();

  const sourceProgram = getProgramOrThrow(db, sourceProgramId);

  /*
   * Clone the canonical active revision when available.
   *
   * For a program that has never been posted, the draft
   * revision is the only available revision.
   */
  const sourceRevision =
    getDraftRevision(db, sourceProgram) ?? getActiveRevision(db, sourceProgram);
  if (!sourceRevision) {
    throw badRequest("PROGRAM_NOT_CLONABLE", "No revision available to clone");
  }

  const now = new Date().toISOString();
  const newProgramId = getNextId(db.programs);
  const newRevisionId = getNextId(db.revisions);

  const identifier = `PROG-${new Date().getFullYear()}-${String(
    newProgramId,
  ).padStart(4, "0")}`;

  const clonedRevision: MockRevision = {
    ...structuredClone(sourceRevision),

    id: newRevisionId,
    programId: newProgramId,

    majorRevision: 1,
    minorRevision: 0,

    status: "DRAFT",
    isMinorRevision: false,

    createdAt: now,
    createdBy: user.username,

    postedAt: null,
    postedBy: null,

    approval: {
      revisionId: newRevisionId,

      isSubmitted: false,
      submittedAt: null,
      submittedBy: null,

      approved: false,
      approvedAt: null,
      approvedBy: null,
      approvalComment: null,

      rejectedAt: null,
      rejectedBy: null,
      rejectionReason: null,
    },

    copiedFromRevisionId: sourceRevision.id,
  };

  const clonedProgram = {
    id: newProgramId,
    identifier,
    name: `${sourceProgram.name} Copy`,
    status: "DRAFT" as const,
    programType: sourceProgram.programType,
    activeRevisionId: null,
    draftRevisionId: newRevisionId,
    deliveryStartDate: null,
    deliveryEndDate: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  db.programs.push(clonedProgram);
  db.revisions.push(clonedRevision);

  db.activity.unshift({
    id: getNextId(db.activity),

    entityType: "INCENTIVE_PROGRAM",
    entityId: clonedProgram.id,

    operation: "CREATE",

    changedBy: user.username,
    changedAt: now,

    programId: clonedProgram.id,
    programName: clonedProgram.name,
    programIdentifier: clonedProgram.identifier,

    comment: `Cloned from program ${sourceProgram.identifier}`,
  });

  await writeDb(db);
  return c.json(
    {
      programId: clonedProgram.id,
      programIdentifier: clonedProgram.identifier,
      programStatus: clonedProgram.status,
      revisionId: clonedRevision.id,
      revisionStatus: clonedRevision.status,

      majorRevision: clonedRevision.majorRevision,
      minorRevision: clonedRevision.minorRevision,

      revisionLabel: revisionLabel(clonedRevision),
    },
    201,
  );
});
