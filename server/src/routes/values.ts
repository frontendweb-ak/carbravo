import { Hono } from "hono";

import { currentUser, requireRole } from "../lib/auth.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { getProgramOrThrow } from "../lib/programs.js";
import { clone, getNextId, readDb, writeDb } from "../store.js";

export const values = new Hono();

/**
 * GET
 * /api/programs/:programId/revisions/:revisionId/values
 */
values.get("/programs/:programId/revisions/:revisionId/values", async (c) => {
	currentUser(c);

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

	return c.json({
		programId: program.id,
		programIdentifier: program.identifier,
		programName: program.name,

		revisionId: revision.id,
		majorRevision: revision.majorRevision,
		minorRevision: revision.minorRevision,
		revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,
		revisionStatus: revision.status,

		values: revision.values,
	});
});

/**
 * PUT
 * /api/programs/:programId/revisions/:revisionId/values
 *
 * Replaces the complete values snapshot.
 */
values.put("/programs/:programId/revisions/:revisionId/values", async (c) => {
	const user = requireRole(c, "AUTHOR", "ADMIN");

	const programId = Number(c.req.param("programId"));
	const revisionId = Number(c.req.param("revisionId"));

	if (!Number.isInteger(programId) || !Number.isInteger(revisionId)) {
		throw badRequest(
			"VALIDATION_ERROR",
			"programId and revisionId must be integers",
		);
	}

	const body = await c.req.json().catch(() => null);

	if (!body || typeof body !== "object" || Array.isArray(body)) {
		throw badRequest("VALIDATION_ERROR", "Request body must be an object");
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
			"Values can only be edited while the revision is DRAFT",
		);
	}

	const input = body as Record<string, unknown>;

	/**
	 * Validate financeTerms.
	 */
	if (
		input.financeTerms !== undefined &&
		(!Array.isArray(input.financeTerms) ||
			input.financeTerms.some(
				(value) => typeof value !== "number" || !Number.isInteger(value),
			))
	) {
		throw badRequest(
			"VALIDATION_ERROR",
			"financeTerms must contain integer values",
		);
	}

	/**
	 * Validate components.
	 */
	if (input.components !== undefined && !Array.isArray(input.components)) {
		throw badRequest("VALIDATION_ERROR", "components must be an array");
	}

	/**
	 * Preserve the Values model defined by MockRevision.
	 *
	 * PUT replaces the complete values snapshot.
	 */
	const nextValues = {
		financeTerms: Array.isArray(input.financeTerms) ? input.financeTerms : [],

		components: Array.isArray(input.components) ? input.components : [],
	};

	revision.values = clone(nextValues);

	/**
	 * Major revision edits reset approval.
	 *
	 * Minor revisions are intentionally exempt.
	 */
	if (!revision.isMinorRevision) {
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

	const now = new Date().toISOString();

	program.updatedAt = now;

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

	return c.json({
		programId: program.id,
		programIdentifier: program.identifier,
		programName: program.name,

		revisionId: revision.id,
		majorRevision: revision.majorRevision,
		minorRevision: revision.minorRevision,
		revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,
		revisionStatus: revision.status,

		values: revision.values,

		approval: {
			isSubmitted: revision.approval.isSubmitted,
			approved: revision.approval.approved,
		},
	});
});
