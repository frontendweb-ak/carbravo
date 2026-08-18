// src/lib/programs.ts

import {
  revisionLabel,
  type MockDb,
  type MockProgram,
  type MockRevision,
} from "../store.js";
import type { ProgramWorkflowStatus } from "../types/types.js";

import { notFound } from "./errors.js";

/* -------------------------------------------------------------------------- */
/* Program workflow                                                           */
/* -------------------------------------------------------------------------- */

export function getProgramWorkflowStatus(
	program: MockProgram,
	draft: MockRevision | null,
): ProgramWorkflowStatus {
	/*
	 * Program lifecycle always wins for posted programs.
	 */
	if (program.status === "ACTIVE") return "ACTIVE";
	if (program.status === "EXPIRED") return "EXPIRED";

	/*
	 * A program that has never been posted is represented
	 * by its draft revision workflow.
	 */
	if (!draft) return "DRAFT";

	if (draft.approval.isSubmitted && draft.approval.approved) {
		return "APPROVED";
	}

	if (draft.approval.isSubmitted && !draft.approval.approved) {
		return "REVIEW";
	}

	return "DRAFT";
}

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
/* Vehicles                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Returns lightweight vehicle labels for the programs list.
 *
 * The list should not return the complete vehicle catalog object.
 */
function mapVehicleLabels(
	db: MockDb,
	revision: MockRevision,
) {
	return revision.vehicles
		.map((selection) => {
			const vehicle = db.vehicles.find(
				(item) =>
					item.vehicleCatalogId === selection.vehicleCatalogId,
			);

			if (!vehicle) {
				return null;
			}

			return {
				vehicleCatalogId: vehicle.vehicleCatalogId,
				label: `${vehicle.make} ${vehicle.model}`,
			};
		})
		.filter(
			(vehicle): vehicle is NonNullable<typeof vehicle> =>
				vehicle !== null,
		);
}

/* -------------------------------------------------------------------------- */
/* Geography                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Converts stored geography rules into the compact geography summary
 * required by the programs list.
 *
 * Examples:
 *
 *   National
 *   Midwest
 *   Southeast
 *   CA, NY, WA
 */
function mapGeographySummary(
	revision: MockRevision,
): string[] {
	const includedRules = revision.geography.filter(
		(rule) => rule.isIncluded,
	);

	if (includedRules.length === 0) {
		return [];
	}

	/*
	 * National is already a complete summary.
	 */
	const national = includedRules.find(
		(rule) =>
			rule.level === "REGION" &&
			rule.code === "NATIONAL",
	);

	if (national) {
		return [national.name ?? "National"];
	}

	return includedRules
		.filter((rule) => rule.level === "STATE")
		.map((rule) => rule.name ?? rule.code);
}

/* -------------------------------------------------------------------------- */
/* Program list item                                                          */
/* -------------------------------------------------------------------------- */

export function programListItem(
	db: MockDb,
	program: MockProgram,
) {
	const active = getActiveRevision(db, program);
	const draft = getDraftRevision(db, program);

	const currentRevision =
		active ?? draft;

	const workflowStatus = getProgramWorkflowStatus(
		program,
		draft,
	);
console.log("PROGRAM LIST MAPPER V2");
console.log({
	programId: program.id,
	currentRevisionId: currentRevision?.id,
	vehicles: currentRevision
		? mapVehicleLabels(db, currentRevision)
		: [],
	geography: currentRevision
		? mapGeographySummary(currentRevision)
		: [],
});
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
		programStatus: workflowStatus,

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

		/*
		 * Effective dates shown in the Programs table.
		 */
		effectiveStartDate:
			currentRevision?.setup.effectiveStartDate ??
			null,

		effectiveEndDate:
			currentRevision?.setup.effectiveEndDate ??
			null,

		/*
		 * Lightweight vehicle summary.
		 */
		vehicles: currentRevision
			? mapVehicleLabels(db, currentRevision)
			: [],

		/*
		 * Lightweight geography summary.
		 */
		geography: currentRevision
			? mapGeographySummary(currentRevision)
			: [],

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