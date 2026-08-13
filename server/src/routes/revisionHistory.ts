import { Hono } from "hono";

import { currentUser } from "../lib/auth.js";
import { notFound } from "../lib/errors.js";

import { getProgramOrThrow } from "../lib/programs.js";

import { readDb, revisionLabel } from "../store.js";

export const revisionHistory = new Hono();

/**
 * GET /api/programs/:programId/revisions
 *
 * Returns all revisions for a program.
 */
revisionHistory.get("/programs/:programId/revisions", async (c) => {
	currentUser(c);

	const db = await readDb();

	const programId = Number(c.req.param("programId"));

	const program = getProgramOrThrow(db, programId);

	const revisions = db.revisions
		.filter((revision) => revision.programId === program.id)
		.sort((a, b) => {
			if (a.majorRevision !== b.majorRevision) {
				return b.majorRevision - a.majorRevision;
			}

			return b.minorRevision - a.minorRevision;
		})
		.map((revision) => ({
			revisionId: revision.id,

			revisionLabel: revisionLabel(revision),

			majorRevision: revision.majorRevision,

			minorRevision: revision.minorRevision,

			status: revision.status,

			isMinorRevision: revision.isMinorRevision,

			createdAt: revision.createdAt,

			createdBy: revision.createdBy,

			postedAt: revision.postedAt,

			postedBy: revision.postedBy,

			isSubmitted: revision.approval.isSubmitted,

			approved: revision.approval.approved,

			approvedAt: revision.approval.approvedAt,

			approvedBy: revision.approval.approvedBy,

			rejectedAt: revision.approval.rejectedAt,

			rejectedBy: revision.approval.rejectedBy,

			rejectionReason: revision.approval.rejectionReason,

			copiedFromRevisionId: revision.copiedFromRevisionId ?? null,
		}));

	return c.json({
		programId: program.id,

		programIdentifier: program.identifier,

		programName: program.name,

		activeRevisionId: program.activeRevisionId,

		draftRevisionId: program.draftRevisionId,

		revisions,
	});
});

/**
 * GET
 * /programs/:programId/revisions/:revisionId/detail
 *
 * Returns a complete revision snapshot.
 */
revisionHistory.get(
	"/programs/:programId/revisions/:revisionId/detail",
	async (c) => {
		currentUser(c);

		const db = await readDb();

		const programId = Number(c.req.param("programId"));
		const revisionId = Number(c.req.param("revisionId"));

		if (!Number.isInteger(programId) || !Number.isInteger(revisionId)) {
			throw notFound("REVISION_NOT_FOUND", "Revision not found");
		}

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

			revision: {
				revisionId: revision.id,

				revisionLabel: revisionLabel(revision),

				majorRevision: revision.majorRevision,

				minorRevision: revision.minorRevision,

				status: revision.status,

				isMinorRevision: revision.isMinorRevision,

				createdAt: revision.createdAt,

				createdBy: revision.createdBy,

				postedAt: revision.postedAt,

				postedBy: revision.postedBy,

				copiedFromRevisionId: revision.copiedFromRevisionId ?? null,

				setup: revision.setup,

				vehicles: revision.vehicles,

				geography: revision.geography,

				values: revision.values,

				summary: revision.summary,

				approval: revision.approval,
			},
		});
	},
);
