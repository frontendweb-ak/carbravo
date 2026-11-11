import { Hono } from "hono";

import { currentUser, requireRole } from "../lib/auth.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { getProgramOrThrow } from "../lib/programs.js";
import { getNextId, readDb, writeDb } from "../store.js";

export const summary = new Hono();

/**
 * GET /api/programs/:programId/revisions/:revisionId/summary
 *
 * Read-only projection matching the OpenAPI RevisionSummary schema.
 */
summary.get("/programs/:programId/revisions/:revisionId/summary", async (c) => {
  currentUser(c);

  const programId = Number(c.req.param("programId"));
  const revisionId = Number(c.req.param("revisionId"));
  if (!Number.isInteger(programId) || programId <= 0 || !Number.isInteger(revisionId) || revisionId <= 0) {
    throw badRequest("VALIDATION_ERROR", "programId and revisionId must be positive integers");
  }

  const db = await readDb();
  const program = getProgramOrThrow(db, programId);
  const revision = db.revisions.find(
    (item) => item.id === revisionId && item.programId === program.id,
  );
  if (!revision) {
    throw notFound("REVISION_NOT_FOUND", "Revision not found");
  }

  const vehicles = revision.vehicles.flatMap((selection) => {
    const vehicle = db.vehicles.find(
      (item) => item.vehicleCatalogId === selection.vehicleCatalogId,
    );
    if (!vehicle) return [];
    return [{
      vehicleCatalogId: vehicle.vehicleCatalogId,
      label: `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trimName ? ` ${vehicle.trimName}` : ""}`,
    }];
  });

  return c.json({
    program: {
      programId: program.id,
      programIdentifier: program.identifier,
      programName: program.name,
      programStatus: program.status,
    },
    revision: {
      revisionId: revision.id,
      majorRevision: revision.majorRevision,
      minorRevision: revision.minorRevision,
      revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,
      revisionStatus: revision.status,
      isMinorRevision: revision.isMinorRevision,
    },
    setup: {
      programTypeCode: revision.setup.programTypeCode ?? "",
      customerTypeCode: revision.setup.customerTypeCodes.join(", "),
      deliveryStartDate: revision.setup.deliveryStartDate,
      deliveryEndDate: revision.setup.deliveryEndDate,
    },
    vehicles,
    geoRules: revision.geography.map(({ isIncluded, level, code, name }) => ({
      isIncluded,
      level,
      code,
      name,
    })),
    components: revision.values.components.map(({ componentCode, componentName }) => ({
      componentCode,
      componentName,
    })),
    mfpnText: revision.setup.mfpnText ?? "",
    disclosureText: revision.setup.disclosureText ?? "",
  });
});

/**
 * PATCH /api/programs/:programId/revisions/:revisionId/summary
 *
 * The API contract intentionally limits this endpoint to text-only updates
 * for a minor-revision draft. Other setup or summary fields are not accepted.
 */
summary.patch(
  "/programs/:programId/revisions/:revisionId/summary",
  async (c) => {
    const user = requireRole(c, "AUTHOR", "ADMIN");
    const programId = Number(c.req.param("programId"));
    const revisionId = Number(c.req.param("revisionId"));
    if (!Number.isInteger(programId) || programId <= 0 || !Number.isInteger(revisionId) || revisionId <= 0) {
      throw badRequest("VALIDATION_ERROR", "programId and revisionId must be positive integers");
    }

    const body = await c.req.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw badRequest("VALIDATION_ERROR", "Request body must be an object");
    }

    const input = body as Record<string, unknown>;
    const hasMfpnText = Object.prototype.hasOwnProperty.call(input, "mfpnText");
    const hasDisclosureText = Object.prototype.hasOwnProperty.call(input, "disclosureText");
    if (!hasMfpnText && !hasDisclosureText) {
      throw badRequest("VALIDATION_ERROR", "At least one text field is required");
    }
    if (hasMfpnText && typeof input.mfpnText !== "string") {
      throw badRequest("VALIDATION_ERROR", "mfpnText must be a string");
    }
    if (hasDisclosureText && typeof input.disclosureText !== "string") {
      throw badRequest("VALIDATION_ERROR", "disclosureText must be a string");
    }

    const db = await readDb();
    const program = getProgramOrThrow(db, programId);
    const revision = db.revisions.find(
      (item) => item.id === revisionId && item.programId === program.id,
    );
    if (!revision) {
      throw notFound("REVISION_NOT_FOUND", "Revision not found");
    }
    if (revision.status !== "DRAFT" || !revision.isMinorRevision) {
      throw conflict("REVISION_NOT_EDITABLE", "Only a minor-revision draft can update summary text");
    }

    if (hasMfpnText) revision.setup.mfpnText = input.mfpnText as string;
    if (hasDisclosureText) revision.setup.disclosureText = input.disclosureText as string;

    const now = new Date().toISOString();
    program.updatedAt = now;
    db.activity.unshift({
      id: getNextId(db.activity),
      entityType: "INCENTIVE_REVISION",
      entityId: revision.id,
      operation: "UPDATE",
      changedBy: user.username,
      changedAt: now,
      comment: "Updated minor revision disclosure text",
      programId: program.id,
      programName: program.name,
      programIdentifier: program.identifier,
    });

    await writeDb(db);
    return c.json({
      mfpnText: revision.setup.mfpnText ?? "",
      disclosureText: revision.setup.disclosureText ?? "",
    });
  },
);
