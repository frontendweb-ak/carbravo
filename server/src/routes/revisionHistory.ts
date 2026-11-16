import { Hono } from "hono";

import { currentUser } from "../lib/auth.js";
import { badRequest, notFound } from "../lib/errors.js";
import { getProgramOrThrow } from "../lib/programs.js";
import { readDb, revisionLabel } from "../store.js";

export const revisionHistory = new Hono();

function parsePage(value: string | undefined, fallback: number, name: string, min: number, max?: number): number {
  if (value === undefined) return fallback;
  if (!/^\\d+$/.test(value)) {
    throw badRequest("VALIDATION_ERROR", `${name} must be an integer`);
  }
  const parsed = Number(value);
  if (parsed < min || (max !== undefined && parsed > max)) {
    throw badRequest("VALIDATION_ERROR", `${name} is outside the allowed range`);
  }
  return parsed;
}

/**
 * GET /api/programs/:programId/revisions
 *
 * Paginated revision history matching the OpenAPI RevisionHistoryItem schema.
 */
revisionHistory.get("/programs/:programId/revisions", async (c) => {
  currentUser(c);

  const db = await readDb();
  const programId = Number(c.req.param("programId"));
  if (!Number.isInteger(programId) || programId <= 0) {
    throw badRequest("VALIDATION_ERROR", "programId must be a positive integer");
  }

  const program = getProgramOrThrow(db, programId);
  const page = parsePage(c.req.query("page"), 0, "page", 0);
  const size = parsePage(c.req.query("size"), 25, "size", 1, 100);

  const revisions = db.revisions
    .filter((revision) => revision.programId === program.id)
    .sort((a, b) => {
      if (a.majorRevision !== b.majorRevision) return b.majorRevision - a.majorRevision;
      return b.minorRevision - a.minorRevision;
    });

  const totalElements = revisions.length;
  const content = revisions
    .slice(page * size, page * size + size)
    .map((revision) => ({
      revisionId: revision.id,
      majorRevision: revision.majorRevision,
      minorRevision: revision.minorRevision,
      revisionLabel: revisionLabel(revision),
      revisionStatus: revision.status,
      isMinorRevision: revision.isMinorRevision,
      isSubmitted: revision.approval.isSubmitted,
      approved: revision.approval.approved,
      postedAt: revision.postedAt,
      postedBy: revision.postedBy,
      createdAt: revision.createdAt,
      createdBy: revision.createdBy,
    }));

  return c.json({
    content,
    pagination: {
      page,
      size,
      totalElements,
      totalPages: totalElements === 0 ? 0 : Math.ceil(totalElements / size),
    },
  });
});

/**
 * GET /api/programs/:programId/revisions/:revisionId/detail
 *
 * Returns the compact immutable revision detail described by OpenAPI.
 */
revisionHistory.get(
  "/programs/:programId/revisions/:revisionId/detail",
  async (c) => {
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

    return c.json({
      revisionId: revision.id,
      majorRevision: revision.majorRevision,
      minorRevision: revision.minorRevision,
      revisionLabel: revisionLabel(revision),
      revisionStatus: revision.status,
      isMinorRevision: revision.isMinorRevision,
      programName: program.name,
      programType: revision.setup.programTypeCode ?? program.programType ?? "",
      vehicleCount: revision.vehicles.length,
      createdAt: revision.createdAt,
      createdBy: revision.createdBy,
      postedAt: revision.postedAt,
      postedBy: revision.postedBy,
    });
  },
);
