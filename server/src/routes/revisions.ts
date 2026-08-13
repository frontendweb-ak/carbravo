import { Hono } from "hono";

import { requireRole } from "../lib/auth.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { getProgramOrThrow } from "../lib/programs.js";
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
revisions.post("/programs/:programId/revisions", async (c) => {
	const user = requireRole(c, "AUTHOR", "ADMIN");

	const programId = Number(c.req.param("programId"));

	if (!Number.isInteger(programId)) {
		throw badRequest("VALIDATION_ERROR", "programId must be an integer");
	}

	const body = await c.req.json().catch(() => ({}));

	const overwrite =
		typeof body?.overwrite === "boolean" ? body.overwrite : false;

	const db = await readDb();

	const program = getProgramOrThrow(db, programId);

	/**
	 * A program can only have one working draft.
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
	 * If overwrite=true, remove the existing draft.
	 *
	 * The previously active revision remains untouched.
	 */
	if (existingDraft && overwrite) {
		db.revisions = db.revisions.filter(
			(revision) => revision.id !== existingDraft.id,
		);

		program.draftRevisionId = null;
	}

	/**
	 * Find the active revision.
	 */
	const activeRevision = db.revisions.find(
		(revision) =>
			revision.id === program.activeRevisionId &&
			revision.programId === program.id &&
			revision.status === "ACTIVE",
	);

	if (!activeRevision) {
		throw badRequest(
			"NO_ACTIVE_REVISION",
			"Program does not have an active revision to revise",
		);
	}

	const revisionId = getNextId(db.revisions);

	const now = new Date().toISOString();

	const revision: MockRevision = {
		id: revisionId,

		programId: program.id,
		majorRevision: activeRevision.majorRevision + 1,
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

		/**
		 * Copy the complete active revision snapshot.
		 */
		setup: clone(activeRevision.setup),
		vehicles: clone(activeRevision.vehicles),
		geography: clone(activeRevision.geography),
		values: clone(activeRevision.values),
		summary: clone(activeRevision.summary),
		copiedFromRevisionId: activeRevision.id,
	};

	db.revisions.push(revision);

	program.draftRevisionId = revision.id;
	program.updatedAt = now;

	db.activity.unshift({
		id: getNextId(db.activity),

		entityType: "INCENTIVE_REVISION",

		entityId: revision.id,

		operation: "REVISE",

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
	"/programs/:programId/revisions/:revisionId/minor-revise",
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
		const body = await c.req.json().catch(() => ({}));
		const overwrite =
			typeof body?.overwrite === "boolean" ? body.overwrite : false;
		const db = await readDb();
		const program = getProgramOrThrow(db, programId);

		/**
		 * Source revision must belong to this program.
		 */
		const sourceRevision = db.revisions.find(
			(revision) =>
				revision.id === revisionId && revision.programId === program.id,
		);
		if (!sourceRevision) {
			throw notFound("REVISION_NOT_FOUND", "Revision not found");
		}

		/**
		 * Minor revision should normally be created
		 * from the currently active revision.
		 */
		if (sourceRevision.status !== "ACTIVE") {
			throw conflict(
				"REVISION_NOT_EDITABLE",
				"Minor revision can only be created from an ACTIVE revision",
			);
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

/**
 * POST /api/programs/:programId/revisions/:revisionId/submit
 *
 * Submits a DRAFT revision for approval.
 */
revisions.post(
	"/programs/:programId/revisions/:revisionId/submit",
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
		 * Only DRAFT revisions can be submitted.
		 */
		if (revision.status !== "DRAFT") {
			throw conflict(
				"REVISION_NOT_EDITABLE",
				"Only a draft revision can be submitted",
			);
		}

		/**
		 * Prevent submitting the same revision twice.
		 */
		if (revision.approval.isSubmitted) {
			throw conflict(
				"ALREADY_SUBMITTED",
				"Revision has already been submitted for approval",
			);
		}

		/**
		 * Basic completion validation.
		 *
		 * The real Java backend can eventually perform
		 * more comprehensive business validation.
		 */
		if (!revision.setup.programTypeCode) {
			throw badRequest(
				"VALIDATION_ERROR",
				"Program type is required before submission",
			);
		}

		if (!revision.setup.purchaseType) {
			throw badRequest(
				"VALIDATION_ERROR",
				"Purchase type is required before submission",
			);
		}

		if (!revision.setup.deliveryStartDate || !revision.setup.deliveryEndDate) {
			throw badRequest(
				"VALIDATION_ERROR",
				"Delivery dates are required before submission",
			);
		}

		if (!revision.setup.customerTypeCodes.length) {
			throw badRequest(
				"VALIDATION_ERROR",
				"At least one customer type is required before submission",
			);
		}

		if (!revision.vehicles.length) {
			throw badRequest(
				"VALIDATION_ERROR",
				"At least one vehicle is required before submission",
			);
		}

		if (!revision.geography.length) {
			throw badRequest(
				"VALIDATION_ERROR",
				"At least one geography rule is required before submission",
			);
		}

		const now = new Date().toISOString();

		revision.approval.isSubmitted = true;
		revision.approval.submittedAt = now;
		revision.approval.submittedBy = user.username;

		/**
		 * A new submission clears previous rejection state.
		 */
		revision.approval.rejectedAt = null;
		revision.approval.rejectedBy = null;
		revision.approval.rejectionReason = null;

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

			revisionLabel: revisionLabel(revision),

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
 * POST /api/programs/:programId/revisions/:revisionId/approve
 *
 * Approves a submitted draft revision.
 */
revisions.post(
	"/programs/:programId/revisions/:revisionId/approve",
	async (c) => {
		const user = requireRole(c, "APPROVER", "ADMIN");

		const programId = Number(c.req.param("programId"));
		const revisionId = Number(c.req.param("revisionId"));

		if (!Number.isInteger(programId) || !Number.isInteger(revisionId)) {
			throw badRequest(
				"VALIDATION_ERROR",
				"programId and revisionId must be integers",
			);
		}

		const body = await c.req.json().catch(() => ({}));

		const approvalComment =
			typeof body?.approvalComment === "string"
				? body.approvalComment.trim()
				: null;

		const db = await readDb();

		const program = getProgramOrThrow(db, programId);

		const revision = db.revisions.find(
			(item) => item.id === revisionId && item.programId === program.id,
		);

		if (!revision) {
			throw notFound("REVISION_NOT_FOUND", "Revision not found");
		}

		/**
		 * Only draft revisions can be approved.
		 */
		if (revision.status !== "DRAFT") {
			throw conflict(
				"REVISION_NOT_EDITABLE",
				"Only a draft revision can be approved",
			);
		}

		/**
		 * Revision must have been submitted first.
		 */
		if (!revision.approval.isSubmitted) {
			throw conflict(
				"REVISION_NOT_SUBMITTED",
				"Revision must be submitted before approval",
			);
		}

		/**
		 * Prevent approving an already-approved revision.
		 */
		if (revision.approval.approved) {
			throw conflict("ALREADY_APPROVED", "Revision has already been approved");
		}

		const now = new Date().toISOString();

		revision.approval.approved = true;
		revision.approval.approvedAt = now;
		revision.approval.approvedBy = user.username;
		revision.approval.approvalComment = approvalComment;

		/**
		 * A successful approval clears any rejection state.
		 */
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

			revisionLabel: revisionLabel(revision),

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
 * POST /api/programs/:programId/revisions/:revisionId/approve
 *
 * Approves a submitted draft revision.
 */
revisions.post(
	"/programs/:programId/revisions/:revisionId/approve",
	async (c) => {
		const user = requireRole(c, "APPROVER", "ADMIN");

		const programId = Number(c.req.param("programId"));
		const revisionId = Number(c.req.param("revisionId"));

		if (!Number.isInteger(programId) || !Number.isInteger(revisionId)) {
			throw badRequest(
				"VALIDATION_ERROR",
				"programId and revisionId must be integers",
			);
		}

		const body = await c.req.json().catch(() => ({}));

		const approvalComment =
			typeof body?.approvalComment === "string"
				? body.approvalComment.trim()
				: null;

		const db = await readDb();

		const program = getProgramOrThrow(db, programId);

		const revision = db.revisions.find(
			(item) => item.id === revisionId && item.programId === program.id,
		);

		if (!revision) {
			throw notFound("REVISION_NOT_FOUND", "Revision not found");
		}

		/**
		 * Only draft revisions can be approved.
		 */
		if (revision.status !== "DRAFT") {
			throw conflict(
				"REVISION_NOT_EDITABLE",
				"Only a draft revision can be approved",
			);
		}

		/**
		 * Revision must have been submitted first.
		 */
		if (!revision.approval.isSubmitted) {
			throw conflict(
				"REVISION_NOT_SUBMITTED",
				"Revision must be submitted before approval",
			);
		}

		/**
		 * Prevent approving an already-approved revision.
		 */
		if (revision.approval.approved) {
			throw conflict("ALREADY_APPROVED", "Revision has already been approved");
		}

		const now = new Date().toISOString();

		revision.approval.approved = true;
		revision.approval.approvedAt = now;
		revision.approval.approvedBy = user.username;
		revision.approval.approvalComment = approvalComment;

		/**
		 * A successful approval clears any rejection state.
		 */
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

			revisionLabel: revisionLabel(revision),

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
 * POST /api/programs/:programId/revisions/:revisionId/reject
 *
 * Rejects a submitted draft revision.
 */
revisions.post(
	"/programs/:programId/revisions/:revisionId/reject",
	async (c) => {
		const user = requireRole(c, "APPROVER", "ADMIN");

		const programId = Number(c.req.param("programId"));
		const revisionId = Number(c.req.param("revisionId"));

		if (!Number.isInteger(programId) || !Number.isInteger(revisionId)) {
			throw badRequest(
				"VALIDATION_ERROR",
				"programId and revisionId must be integers",
			);
		}

		const body = await c.req.json().catch(() => ({}));

		const rejectionReason =
			typeof body?.rejectionReason === "string"
				? body.rejectionReason.trim()
				: "";

		if (!rejectionReason) {
			throw badRequest("VALIDATION_ERROR", "rejectionReason is required");
		}

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
				"ALREADY_APPROVED",
				"An approved revision cannot be rejected",
			);
		}

		const now = new Date().toISOString();

		revision.approval.isSubmitted = false;
		revision.approval.submittedAt = null;
		revision.approval.submittedBy = null;

		revision.approval.approved = false;
		revision.approval.approvedAt = null;
		revision.approval.approvedBy = null;
		revision.approval.approvalComment = null;

		revision.approval.rejectedAt = now;
		revision.approval.rejectedBy = user.username;
		revision.approval.rejectionReason = rejectionReason;

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

			revisionLabel: revisionLabel(revision),

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
 * POST /api/programs/:programId/revisions/:revisionId/expire
 *
 * Manually expires an ACTIVE revision.
 *
 * Result:
 * - revision -> EXPIRED
 * - program -> EXPIRED
 * - activeRevisionId -> null
 * - draftRevisionId is preserved if a draft exists
 */
revisions.post(
	"/programs/:programId/revisions/:revisionId/expire",
	async (c) => {
		const user = requireRole(c, "ADMIN");

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
		 * Only the active revision can be manually expired.
		 */
		if (revision.status !== "ACTIVE") {
			throw conflict(
				"REVISION_NOT_ACTIVE",
				"Only an active revision can be expired",
			);
		}

		const now = new Date().toISOString();

		revision.status = "EXPIRED";

		/**
		 * Only clear the active pointer if this is
		 * the program's current active revision.
		 */
		if (program.activeRevisionId === revision.id) {
			program.activeRevisionId = null;
		}

		program.status = "EXPIRED";

		program.updatedAt = now;

		db.activity.unshift({
			id: getNextId(db.activity),

			entityType: "INCENTIVE_REVISION",

			entityId: revision.id,

			operation: "EXPIRE",

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

			activeRevisionId: program.activeRevisionId,

			draftRevisionId: program.draftRevisionId,

			expiredAt: now,

			expiredBy: user.username,
		});
	},
);
