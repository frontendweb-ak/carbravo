// src/lib/programs.ts

import {
  revisionLabel,
  type MockDb,
  type MockProgram,
  type MockRevision,
} from "../store.js";

import { notFound } from "./errors.js";

/* -------------------------------------------------------------------------- */
/* Program workflow                                                           */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/* Program lookup                                                             */
/* -------------------------------------------------------------------------- */

export function getProgramOrThrow(
	db: MockDb,
	programId: number,
): MockProgram {
	const program = db.programs.find(
		(item) => item.id === programId && item.deletedAt === null,
	);

	if (!program) {
		throw notFound("PROGRAM_NOT_FOUND", "Program not found");
	}

	return program;
}

/* -------------------------------------------------------------------------- */
/* Revision lookup                                                            */
/* -------------------------------------------------------------------------- */

export function getRevisionOrThrow(
	db: MockDb,
	programId: number,
	revisionId: number,
): MockRevision {
	const revision = db.revisions.find(
		(item) => item.id === revisionId && item.programId === programId,
	);

	if (!revision) {
		throw notFound("REVISION_NOT_FOUND", "Revision not found");
	}

	return revision;
}

export function getActiveRevision(
	db: MockDb,
	program: MockProgram,
): MockRevision | null {
	if (!program.activeRevisionId) {
		return null;
	}

	return (
		db.revisions.find(
			(revision) => revision.id === program.activeRevisionId,
		) ?? null
	);
}

export function getDraftRevision(
	db: MockDb,
	program: MockProgram,
): MockRevision | null {
	if (!program.draftRevisionId) {
		return null;
	}

	return (
		db.revisions.find(
			(revision) => revision.id === program.draftRevisionId,
		) ?? null
	);
}

/* -------------------------------------------------------------------------- */
/* Revision reference                                                         */
/* -------------------------------------------------------------------------- */

export function revisionRef(revision: MockRevision) {
	return {
		revisionId: revision.id,
		majorRevision: revision.majorRevision,
		minorRevision: revision.minorRevision,
		revisionLabel: revisionLabel(revision),
		revisionStatus: revision.status,

		isMinorRevision: revision.isMinorRevision,
		isSubmitted: revision.approval.isSubmitted,
		approved: revision.approval.approved,
	};
}

/* -------------------------------------------------------------------------- */
/* Current revision                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Revision used to populate the program-list summary.
 *
 * Posted programs:
 *   active revision
 *
 * Unposted programs:
 *   draft revision
 */
function getCurrentRevision(
	db: MockDb,
	program: MockProgram,
): MockRevision | null {
	return (
		getActiveRevision(db, program) ??
		getDraftRevision(db, program)
	);
}

/* -------------------------------------------------------------------------- */

export function programListItem(
	db: MockDb,
	program: MockProgram,
) {
	const active = getActiveRevision(db, program);
	const draft = getDraftRevision(db, program);

	const currentRevision =
		active ?? draft;

	return {
		programId: program.id,
		programIdentifier: program.identifier,
		programName: program.name,

		/*
		 * IMPORTANT:
		 * Do not return program.status here.
		 *
		 * The UI has:
		 * DRAFT → REVIEW → APPROVED → ACTIVE → EXPIRED
		 *
		 * while the persisted program lifecycle only has:
		 * DRAFT → ACTIVE → EXPIRED
		 */
		programStatus: program.status,

		programType:
			program.programType ||
			currentRevision?.setup.programTypeCode ||
			"",

		currentRevision: currentRevision
			? revisionRef(currentRevision)
			: undefined,

		hasDraft: Boolean(draft),

		/*
		 * Delivery dates.
		 */
		deliveryStartDate:
			currentRevision?.setup.deliveryStartDate ??
			program.deliveryStartDate,

		deliveryEndDate:
			currentRevision?.setup.deliveryEndDate ??
			program.deliveryEndDate,


		updatedAt: program.updatedAt,
	};
}

/* -------------------------------------------------------------------------- */
/* Revision used for major revision creation                                  */
/* -------------------------------------------------------------------------- */

export function getRevisionForMajorRevision(
	db: MockDb,
	program: MockProgram,
): MockRevision | null {
	const active = getActiveRevision(db, program);

	if (active) {
		return active;
	}

	/*
	 * Expired programs no longer have an active revision.
	 * Use the latest posted revision as the source for revival.
	 */
	const revisions = db.revisions
		.filter(
			(revision) =>
				revision.programId === program.id &&
				(revision.status === "ACTIVE" ||
					revision.status === "EXPIRED"),
		)
		.sort((a, b) => {
			if (a.majorRevision !== b.majorRevision) {
				return b.majorRevision - a.majorRevision;
			}

			return b.minorRevision - a.minorRevision;
		});

	return revisions[0] ?? null;
}