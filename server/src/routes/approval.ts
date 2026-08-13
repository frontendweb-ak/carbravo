import { Hono } from "hono";

import { currentUser, requireRole } from "../lib/auth.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { getProgramOrThrow } from "../lib/programs.js";
import { getNextId, readDb, writeDb } from "../store.js";

export const approval = new Hono();

/**
 * GET
 * /api/programs/:programId/revisions/:revisionId/approval
 *
 * Returns the approval/submission state of a revision.
 */
approval.get(
	"/programs/:programId/revisions/:revisionId/approval",
	async (c) => {
		currentUser(c);

		const programId = Number(c.req.param("programId"));
		const revisionId = Number(c.req.param("revisionId"));

		const db = await readDb();

		const program = getProgramOrThrow(db, programId);

		const revision = db.revisions.find(
			(item) => item.id === revisionId && item.programId === program.id,
		);

		if (!revision) {
			throw notFound("REVISION_NOT_FOUND", "Revision not found");
		}

		return c.json({
			programId: program.id,
			programIdentifier: program.identifier,
			programName: program.name,

			revisionId: revision.id,
			revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,
			revisionStatus: revision.status,
			isMinorRevision: revision.isMinorRevision,

			approval: {
				isSubmitted: revision.approval.isSubmitted,

				submittedAt: revision.approval.submittedAt,

				submittedBy: revision.approval.submittedBy,

				approved: revision.approval.approved,

				approvedAt: revision.approval.approvedAt,

				approvedBy: revision.approval.approvedBy,

				approvalComment: revision.approval.approvalComment,

				rejectedAt: revision.approval.rejectedAt,

				rejectedBy: revision.approval.rejectedBy,

				rejectionReason: revision.approval.rejectionReason,
			},
		});
	},
);

/**
 * POST
 * /api/programs/:programId/revisions/:revisionId/submit
 *
 * Submits a draft revision for approval.
 */
approval.post(
	"/programs/:programId/revisions/:revisionId/submit",
	async (c) => {
		const user = requireRole(c, "AUTHOR", "ADMIN");

		const programId = Number(c.req.param("programId"));
		const revisionId = Number(c.req.param("revisionId"));

		const db = await readDb();

		const program = getProgramOrThrow(db, programId);

		const revision = db.revisions.find(
			(item) => item.id === revisionId && item.programId === program.id,
		);

		if (!revision) {
			throw notFound("REVISION_NOT_FOUND", "Revision not found");
		}

		if (revision.status !== "DRAFT") {
			throw conflict(
				"REVISION_NOT_EDITABLE",
				"Only a draft revision can be submitted",
			);
		}

		if (revision.approval.isSubmitted) {
			throw conflict(
				"ALREADY_SUBMITTED",
				"Revision has already been submitted",
			);
		}

		/**
		 * Basic completion validation.
		 *
		 * The real Spring Boot service can perform
		 * the complete business validation later.
		 */
		const validationErrors: string[] = [];

		if (!revision.setup.programTypeCode) {
			validationErrors.push("programTypeCode is required");
		}

		if (!revision.setup.purchaseType) {
			validationErrors.push("purchaseType is required");
		}

		if (!revision.setup.deliveryStartDate) {
			validationErrors.push("deliveryStartDate is required");
		}

		if (!revision.setup.deliveryEndDate) {
			validationErrors.push("deliveryEndDate is required");
		}

		if (validationErrors.length > 0) {
			throw badRequest("VALIDATION_ERROR", "Revision is not complete", {
				errors: validationErrors,
			});
		}

		const now = new Date().toISOString();

		revision.approval.isSubmitted = true;
		revision.approval.submittedAt = now;
		revision.approval.submittedBy = user.username;

		/**
		 * A new submission clears any previous rejection.
		 */
		revision.approval.rejectedAt = null;
		revision.approval.rejectedBy = null;
		revision.approval.rejectionReason = null;

		revision.approval.approved = false;
		revision.approval.approvedAt = null;
		revision.approval.approvedBy = null;
		revision.approval.approvalComment = null;

		program.updatedAt = now;

		db.activity.unshift({
			id: getNextId(db.activity),

			entityType: "INCENTIVE_REVISION",

			entityId: revision.id,

			operation: "SUBMIT",

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

			revisionId: revision.id,

			revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,

			revisionStatus: revision.status,

			approval: {
				isSubmitted: revision.approval.isSubmitted,

				submittedAt: revision.approval.submittedAt,

				submittedBy: revision.approval.submittedBy,

				approved: revision.approval.approved,

				approvedAt: revision.approval.approvedAt,

				approvedBy: revision.approval.approvedBy,

				approvalComment: revision.approval.approvalComment,

				rejectedAt: revision.approval.rejectedAt,

				rejectedBy: revision.approval.rejectedBy,

				rejectionReason: revision.approval.rejectionReason,
			},
		});
	},
);

/**
 * POST
 * /api/programs/:programId/revisions/:revisionId/approve
 *
 * Approves a submitted draft revision.
 */
approval.post(
	"/programs/:programId/revisions/:revisionId/approve",
	async (c) => {
		const user = requireRole(c, "APPROVER", "ADMIN");

		const programId = Number(c.req.param("programId"));
		const revisionId = Number(c.req.param("revisionId"));

		const body = await c.req.json().catch(() => ({}));

		const db = await readDb();

		const program = getProgramOrThrow(db, programId);

		const revision = db.revisions.find(
			(item) => item.id === revisionId && item.programId === program.id,
		);

		if (!revision) {
			throw notFound("REVISION_NOT_FOUND", "Revision not found");
		}

		if (revision.status !== "DRAFT") {
			throw conflict(
				"REVISION_NOT_EDITABLE",
				"Only a draft revision can be approved",
			);
		}

		if (!revision.approval.isSubmitted) {
			throw conflict(
				"REVISION_NOT_SUBMITTED",
				"Revision must be submitted before approval",
			);
		}

		if (revision.approval.approved) {
			throw conflict("ALREADY_APPROVED", "Revision has already been approved");
		}

		const comment =
			typeof body?.approvalComment === "string"
				? body.approvalComment.trim()
				: null;

		const now = new Date().toISOString();

		revision.approval.approved = true;
		revision.approval.approvedAt = now;
		revision.approval.approvedBy = user.username;
		revision.approval.approvalComment = comment;

		// Approval replaces a previous rejection state.
		revision.approval.rejectedAt = null;
		revision.approval.rejectedBy = null;
		revision.approval.rejectionReason = null;

		program.updatedAt = now;

		db.activity.unshift({
			id: getNextId(db.activity),

			entityType: "INCENTIVE_REVISION",

			entityId: revision.id,

			operation: "APPROVE",

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

			revisionId: revision.id,

			revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,

			revisionStatus: revision.status,

			approval: {
				isSubmitted: revision.approval.isSubmitted,

				submittedAt: revision.approval.submittedAt,

				submittedBy: revision.approval.submittedBy,

				approved: revision.approval.approved,

				approvedAt: revision.approval.approvedAt,

				approvedBy: revision.approval.approvedBy,

				approvalComment: revision.approval.approvalComment,

				rejectedAt: revision.approval.rejectedAt,

				rejectedBy: revision.approval.rejectedBy,

				rejectionReason: revision.approval.rejectionReason,
			},
		});
	},
);

/**
 * POST
 * /api/programs/:programId/revisions/:revisionId/reject
 *
 * Rejects a submitted draft revision.
 */
approval.post(
	"/programs/:programId/revisions/:revisionId/reject",
	async (c) => {
		const user = requireRole(c, "APPROVER", "ADMIN");

		const programId = Number(c.req.param("programId"));
		const revisionId = Number(c.req.param("revisionId"));

		const body = await c.req.json().catch(() => ({}));

		const db = await readDb();

		const program = getProgramOrThrow(db, programId);

		const revision = db.revisions.find(
			(item) => item.id === revisionId && item.programId === program.id,
		);

		if (!revision) {
			throw notFound("REVISION_NOT_FOUND", "Revision not found");
		}

		if (revision.status !== "DRAFT") {
			throw conflict(
				"REVISION_NOT_EDITABLE",
				"Only a draft revision can be rejected",
			);
		}

		if (!revision.approval.isSubmitted) {
			throw conflict(
				"REVISION_NOT_SUBMITTED",
				"Revision must be submitted before it can be rejected",
			);
		}

		if (revision.approval.approved) {
			throw conflict(
				"REVISION_ALREADY_APPROVED",
				"An approved revision cannot be rejected",
			);
		}

		const rejectionReason =
			typeof body?.rejectionReason === "string"
				? body.rejectionReason.trim()
				: "";

		if (!rejectionReason) {
			throw badRequest("VALIDATION_ERROR", "rejectionReason is required");
		}

		const now = new Date().toISOString();

		revision.approval.rejectedAt = now;
		revision.approval.rejectedBy = user.username;
		revision.approval.rejectionReason = rejectionReason;

		/**
		 * Rejection means the revision is no longer
		 * awaiting approval.
		 *
		 * It remains DRAFT so the AUTHOR can edit
		 * and submit it again.
		 */
		revision.approval.isSubmitted = false;
		revision.approval.submittedAt = null;
		revision.approval.submittedBy = null;

		revision.approval.approved = false;
		revision.approval.approvedAt = null;
		revision.approval.approvedBy = null;
		revision.approval.approvalComment = null;

		program.updatedAt = now;

		db.activity.unshift({
			id: getNextId(db.activity),

			entityType: "INCENTIVE_REVISION",

			entityId: revision.id,

			operation: "REJECT",

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
			revisionId: revision.id,
			revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,
			revisionStatus: revision.status,
			approval: {
				isSubmitted: revision.approval.isSubmitted,
				submittedAt: revision.approval.submittedAt,
				submittedBy: revision.approval.submittedBy,
				approved: revision.approval.approved,
				approvedAt: revision.approval.approvedAt,
				approvedBy: revision.approval.approvedBy,
				approvalComment: revision.approval.approvalComment,
				rejectedAt: revision.approval.rejectedAt,
				rejectedBy: revision.approval.rejectedBy,
				rejectionReason: revision.approval.rejectionReason,
			},
		});
	},
);
