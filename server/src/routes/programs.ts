// src/routes/programs.ts

import { Hono } from "hono";
import { currentUser, requireRole } from "../lib/auth.js";
import { badRequest, conflict } from "../lib/errors.js";
import {
  getActiveRevision,
  getDraftRevision,
  getProgramOrThrow,
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
programs.get("/programs", async (c) => {
  currentUser(c);
  const db = await readDb();
  const status = c.req.query("status");
  const programType = c.req.query("programType");
  const search = c.req.query("search")?.trim().toLowerCase();
  const dateFrom = c.req.query("dateFrom");
  const dateTo = c.req.query("dateTo");
  const pendingApproval = c.req.query("pendingApproval");
  const page = Math.max(0, Number(c.req.query("page") ?? 0));
  const size = Math.min(100, Math.max(1, Number(c.req.query("size") ?? 25)));

  let list = db.programs.filter((program) => program.deletedAt === null);
  if (status) {
    list = list.filter((program) => program.status === status);
  }

  if (programType) {
    list = list.filter((program) => program.programType === programType);
  }

  if (search) {
    list = list.filter(
      (program) =>
        program.name.toLowerCase().includes(search) ||
        program.identifier.toLowerCase().includes(search),
    );
  }

  if (dateFrom) {
    list = list.filter(
      (program) => (program.deliveryStartDate ?? "") >= dateFrom,
    );
  }

  if (dateTo) {
    list = list.filter(
      (program) => (program.deliveryEndDate ?? "9999-12-31") <= dateTo,
    );
  }

  if (pendingApproval === "true") {
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

  const statusCounts = {
    all: 0,
    draft: 0,
    review: 0,
    approved: 0,
    active: 0,
    expired: 0,
  };

  for (const program of db.programs.filter(
    (program) => program.deletedAt === null,
  )) {
    statusCounts.all++;

    const draftRevision = getDraftRevision(db, program);

    if (program.status === "ACTIVE") {
      statusCounts.active++;
      continue;
    }

    if (program.status === "EXPIRED") {
      statusCounts.expired++;
      continue;
    }

    if (draftRevision) {
      if (!draftRevision.approval.isSubmitted) {
        statusCounts.draft++;
      } else if (!draftRevision.approval.approved) {
        statusCounts.review++;
      } else {
        statusCounts.approved++;
      }
    }
  }

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
 */
programs.post("/programs", async (c) => {
  const user = requireRole(c, "AUTHOR", "ADMIN");
  const body = await c.req.json().catch(() => ({}));
  const programName = body.programName?.trim();

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
  const programId = getNextId(db.programs);
  const revisionId = getNextId(db.revisions);
  const now = new Date().toISOString();
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
      programName,
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
  const active = getActiveRevision(db, program);
  const draft = getDraftRevision(db, program);

  return c.json({
    programId: program.id,
    programIdentifier: program.identifier,
    programName: program.name,
    programStatus: program.status,
    programType: program.programType,

    activeRevision: active ? revisionRef(active) : null,
    draftRevision: draft
      ? {
          ...revisionRef(draft),
          isSubmitted: draft.approval.isSubmitted,
          approved: draft.approval.approved,
        }
      : null,

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
  const db = await readDb();
  const programId = Number(c.req.param("programId"));
  const program = getProgramOrThrow(db, programId);
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
    programName: program.name,
    programIdentifier: program.identifier,
  });
  await writeDb(db);
  return c.body(null, 204);
});
