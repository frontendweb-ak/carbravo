import { Hono } from "hono";

import { currentUser, requireRole } from "../lib/auth.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";

import { getProgramOrThrow } from "../lib/programs.js";

import { clone, getNextId, readDb, writeDb } from "../store.js";

export const summary = new Hono();

/**
 * GET
 * /api/programs/:programId/revisions/:revisionId/summary
 *
 * Returns a UI-friendly summary of the
 * current revision.
 */
summary.get("/programs/:programId/revisions/:revisionId/summary", async (c) => {
	currentUser(c);

	const db = await readDb();

	const programId = Number(c.req.param("programId"));

	const revisionId = Number(c.req.param("revisionId"));

	const program = getProgramOrThrow(db, programId);

	const revision = db.revisions.find(
		(item) => item.id === revisionId && item.programId === program.id,
	);

	if (!revision) {
		throw notFound("REVISION_NOT_FOUND", "Revision not found");
	}

	const setup = revision.setup;

	const components = Array.isArray(revision.values?.components)
		? revision.values.components
		: [];

	const includedGeography = revision.geography.filter(
		(rule) => rule.isIncluded,
	);

	const summary = {
		program: {
			programId: program.id,

			programIdentifier: program.identifier,

			programName: program.name,

			programType: program.programType,
		},

		revision: {
			revisionId: revision.id,

			majorRevision: revision.majorRevision,

			minorRevision: revision.minorRevision,

			revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,

			status: revision.status,

			isMinorRevision: revision.isMinorRevision,
		},

		setup: {
			programTypeCode: setup.programTypeCode,

			purchaseType: setup.purchaseType,

			customerTypeCodes: setup.customerTypeCodes,

			conditionCode: setup.conditionCode,

			financialProviderCode: setup.financialProviderCode,

			deliveryStartDate: setup.deliveryStartDate,

			deliveryEndDate: setup.deliveryEndDate,

			effectiveStartDate: setup.effectiveStartDate,

			effectiveEndDate: setup.effectiveEndDate,
		},

		vehicles: {
			count: revision.vehicles.length,

			vehicleCatalogIds: revision.vehicles,
		},

		geography: {
			count: includedGeography.length,

			rules: includedGeography,
		},

		values: {
			componentCount: components.length,

			components,
		},

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

		completion: revision.summary,
	};

	return c.json(summary);
});

/**
 * PATCH
 * /api/programs/:programId/revisions/:revisionId/summary
 *
 * Updates the calculated/manual completion summary
 * for the current revision.
 */
summary.patch(
	"/programs/:programId/revisions/:revisionId/summary",
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
				"Summary can only be edited while the revision is DRAFT",
			);
		}

		/**
		 * Store the supplied summary snapshot.
		 */
		revision.summary = clone(body);

		/**
		 * Major revision changes invalidate
		 * approval/submission state.
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

			revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,

			revisionStatus: revision.status,

			summary: revision.summary,

			approval: {
				isSubmitted: revision.approval.isSubmitted,

				approved: revision.approval.approved,
			},
		});
	},
);
