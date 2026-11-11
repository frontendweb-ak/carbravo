import { Hono } from "hono";

import { requireRole } from "../lib/auth.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import {
  getActiveRevision,
  getDraftRevision,
  getProgramOrThrow,
  getRevisionForMajorRevision,
} from "../lib/programs.js";
import {
  clone,
  getNextId,
  type MockRevision,
  readDb,
  revisionLabel,
  writeDb,
} from "../store.js";

export const revisions = new Hono();

/**
 * POST /api/programs/:programId/revisions
 *
 * Creates a new major revision by copying the
 * currently active revision.
 *
 * ACTIVE 2.1
 *     ↓
 * DRAFT 3.0
 */
revisions.post("/programs/:programId/revise", async (c) => {
  const user = requireRole(c, "AUTHOR", "ADMIN");

  const programId = Number(c.req.param("programId"));

  if (!Number.isInteger(programId)) {
    throw badRequest("VALIDATION_ERROR", "programId must be an integer");
  }

  const overwrite = c.req.query("overwrite") === "true";

  const db = await readDb();
  const program = getProgramOrThrow(db, programId);

  if (program.status !== "ACTIVE") {
    throw conflict("PROGRAM_NOT_ACTIVE", "Only active programs can be revised");
  }

  /*
   * A program may have only one working draft.
   */
  const existingDraft = getDraftRevision(db, program);

  if (existingDraft && !overwrite) {
    throw conflict(
      "DRAFT_ALREADY_EXISTS",
      "A draft revision already exists for this program",
    );
  }

  /*
   * The new major revision must originate from
   * the current active revision.
   */
  const sourceRevision = getRevisionForMajorRevision(db, program);

  if (!sourceRevision) {
    throw conflict(
      "NO_ACTIVE_REVISION",
      "Program does not have an active revision to revise",
    );
  }

  const now = new Date().toISOString();
  const revisionId = getNextId(db.revisions);

  const revision: MockRevision = {
    id: revisionId,
    programId: program.id,

    majorRevision: sourceRevision.majorRevision + 1,
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

    /*
     * Deep-copy the active revision snapshot.
     *
     * Changes to the draft must never mutate
     * the active revision.
     */
    setup: clone(sourceRevision.setup),
    vehicles: clone(sourceRevision.vehicles),
    geography: clone(sourceRevision.geography),
    values: clone(sourceRevision.values),
    summary: clone(sourceRevision.summary),

    copiedFromRevisionId: sourceRevision.id,
  };

  db.revisions.push(revision);

  /*
   * Program now has a working draft.
   */
  program.draftRevisionId = revision.id;
  program.updatedAt = now;

  db.activity.unshift({
    id: getNextId(db.activity),

    entityType: "INCENTIVE_REVISION",
    entityId: revision.id,

    operation: "REVISE",

    changedBy: user.username,
    changedAt: now,

    comment: null,

    programId: program.id,
    programName: program.name,
    programIdentifier: program.identifier,
  });

  await writeDb(db);

  return c.json(
    {
      programId: program.id,
      programIdentifier: program.identifier,
      programName: program.name,

      revisionId: revision.id,
      revisionStatus: revision.status,

      majorRevision: revision.majorRevision,
      minorRevision: revision.minorRevision,

      revisionLabel: revisionLabel(revision),

      copiedFromRevisionId: revision.copiedFromRevisionId,
    },
    201,
  );
});

/**
 * POST /api/programs/:programId/revisions/:revisionId/minor-revise
 *
 * Creates a minor revision from the specified revision.
 *
 * Example:
 *
 * ACTIVE 2.0
 *     ↓
 * DRAFT 2.1
 */
revisions.post(
  "/programs/:programId/minor-revise",
  async (c) => {
    const user = requireRole(c, "AUTHOR", "ADMIN");
    const programId = Number(c.req.param("programId"));
    if (!Number.isInteger(programId) || programId <= 0) {
      throw badRequest("VALIDATION_ERROR", "programId must be a positive integer");
    }
    const overwrite = c.req.query("overwrite") === "true";
    const db = await readDb();
    const program = getProgramOrThrow(db, programId);
    const sourceRevision = getActiveRevision(db, program);
    if (!sourceRevision) {
      throw conflict("PROGRAM_NOT_ACTIVE", "Only active programs can be revised");
    }
    if (sourceRevision.minorRevision >= 99) {
      throw conflict("MINOR_LIMIT_EXCEEDED", "Minor revision limit has been reached");
    }

    /**
     * Only one draft revision is allowed.
     */
    const existingDraft = db.revisions.find(
      (revision) =>
        revision.programId === program.id && revision.status === "DRAFT",
    );

    if (existingDraft && !overwrite) {
      throw conflict(
        "DRAFT_ALREADY_EXISTS",
        "A draft revision already exists for this program",
      );
    }

    /**
     * overwrite=true removes the existing draft.
     */
    if (existingDraft && overwrite) {
      db.revisions = db.revisions.filter(
        (revision) => revision.id !== existingDraft.id,
      );

      program.draftRevisionId = null;
    }

    const revisionIdNew = getNextId(db.revisions);

    const now = new Date().toISOString();

    const revision: MockRevision = {
      id: revisionIdNew,

      programId: program.id,

      majorRevision: sourceRevision.majorRevision,

      minorRevision: sourceRevision.minorRevision + 1,

      status: "DRAFT",

      isMinorRevision: true,

      createdAt: now,

      createdBy: user.username,

      postedAt: null,

      postedBy: null,

      approval: {
        revisionId: revisionIdNew,

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

      setup: clone(sourceRevision.setup),

      vehicles: clone(sourceRevision.vehicles),

      geography: clone(sourceRevision.geography),

      values: clone(sourceRevision.values),

      summary: clone(sourceRevision.summary),

      copiedFromRevisionId: sourceRevision.id,
    };

    db.revisions.push(revision);

    program.draftRevisionId = revision.id;
    program.updatedAt = now;

    db.activity.unshift({
      id: getNextId(db.activity),

      entityType: "INCENTIVE_REVISION",

      entityId: revision.id,

      operation: "MINOR_REVISE",

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

        programName: program.name,

        revisionId: revision.id,

        revisionStatus: revision.status,

        majorRevision: revision.majorRevision,

        minorRevision: revision.minorRevision,

        revisionLabel: revisionLabel(revision),

        isMinorRevision: revision.isMinorRevision,

        copiedFromRevisionId: revision.copiedFromRevisionId,
      },
      201,
    );
  },
);

/* Submit, approve and reject are implemented in approval.ts. */

/**
 * POST /api/programs/:programId/revisions/:revisionId/post
 *
 * Promotes a DRAFT revision to ACTIVE.
 *
 * Rules:
 * - Major revision must be approved.
 * - Minor revision does not require approval.
 * - Existing ACTIVE revision becomes EXPIRED.
 * - Program becomes ACTIVE.
 * - draftRevisionId is cleared.
 * - activeRevisionId points to the posted revision.
 */
revisions.post(
	"/programs/:programId/revisions/:revisionId/post-to-production",
	async (c) => {
		const user = requireRole(c, "AUTHOR", "ADMIN");

		const programId = Number(c.req.param("programId"));
		const revisionId = Number(c.req.param("revisionId"));

		if (!Number.isInteger(programId) || !Number.isInteger(revisionId)) {
			throw badRequest(
				"VALIDATION_ERROR",
				"programId and revisionId must be integers",
			);
		}

		const db = await readDb();

		const program = getProgramOrThrow(db, programId);

		const revision = db.revisions.find(
			(item) => item.id === revisionId && item.programId === program.id,
		);

		if (!revision) {
			throw notFound("REVISION_NOT_FOUND", "Revision not found");
		}

		/**
		 * Only DRAFT revisions can be posted.
		 */
		if (revision.status !== "DRAFT") {
			throw conflict(
				"REVISION_NOT_EDITABLE",
				"Only a draft revision can be posted",
			);
		}

		/**
		 * Major revisions require approval.
		 *
		 * Minor revisions are exempt.
		 */
		if (!revision.isMinorRevision && !revision.approval.approved) {
			throw conflict(
				"REVISION_NOT_APPROVED",
				"Major revision must be approved before posting",
			);
		}

		const now = new Date().toISOString();

		/**
		 * Find the currently active revision.
		 */
		const previousActive = db.revisions.find(
			(item) =>
				item.programId === program.id &&
				item.status === "ACTIVE" &&
				item.id !== revision.id,
		);

		/**
		 * Expire the previous active revision.
		 */
		if (previousActive) {
			previousActive.status = "EXPIRED";
		}

		/**
		 * Promote draft to active.
		 */
		revision.status = "ACTIVE";
		revision.postedAt = now;
		revision.postedBy = user.username;

		/**
		 * Update program pointers.
		 */
		program.status = "ACTIVE";
		program.activeRevisionId = revision.id;
		program.draftRevisionId = null;
		program.updatedAt = now;

		/**
		 * Keep program-level dates synchronized.
		 */
		if (revision.setup.deliveryStartDate) {
			program.deliveryStartDate = revision.setup.deliveryStartDate;
		}

		if (revision.setup.deliveryEndDate) {
			program.deliveryEndDate = revision.setup.deliveryEndDate;
		}

		db.activity.unshift({
			id: getNextId(db.activity),

			entityType: "INCENTIVE_REVISION",

			entityId: revision.id,

			operation: "POST_TO_PRODUCTION",

			changedBy: user.username,

			changedAt: now,

			programName: program.name,

			programIdentifier: program.identifier,
		});

		await writeDb(db);

		return c.json({
			programId: program.id,

			programIdentifier: program.identifier,

			programName: program.name,

			programStatus: program.status,

			revisionId: revision.id,

			revisionLabel: revisionLabel(revision),

			revisionStatus: revision.status,

			majorRevision: revision.majorRevision,

			minorRevision: revision.minorRevision,

			previousActiveRevisionId: previousActive?.id ?? null,

			postedAt: revision.postedAt,

			postedBy: revision.postedBy,
		});
	},
);
/**
 * POST /api/programs/:programId/expire
 *
 * Expires the program lifecycle without changing its active revision
 * snapshot, as defined by the OpenAPI contract.
 */
revisions.post("/programs/:programId/expire", async (c) => {
  const user = requireRole(c, "ADMIN");
  const programId = Number(c.req.param("programId"));

  if (!Number.isInteger(programId) || programId <= 0) {
    throw badRequest("VALIDATION_ERROR", "programId must be a positive integer");
  }

  const db = await readDb();
  const program = getProgramOrThrow(db, programId);

  if (program.status !== "ACTIVE") {
    throw conflict("PROGRAM_NOT_ACTIVE", "Only active programs can be expired");
  }

  const now = new Date().toISOString();
  program.status = "EXPIRED";
  program.updatedAt = now;

  db.activity.unshift({
    id: getNextId(db.activity),
    entityType: "INCENTIVE_PROGRAM",
    entityId: program.id,
    operation: "EXPIRE",
    changedBy: user.username,
    changedAt: now,
    comment: null,
    programId: program.id,
    programName: program.name,
    programIdentifier: program.identifier,
  });

  await writeDb(db);
  return c.json({ programId: program.id, programStatus: program.status });
});
