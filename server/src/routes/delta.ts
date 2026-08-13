import { Hono } from "hono";
import { currentUser } from "../lib/auth.js";
import { notFound } from "../lib/errors.js";
import { getProgramOrThrow } from "../lib/programs.js";
import { readDb } from "../store.js";

export const delta = new Hono();

/**
 * GET
 * /api/programs/:programId/revisions/:revisionId/delta
 *
 * Compares a revision with the revision it
 * was copied from.
 */
delta.get("/programs/:programId/revisions/:revisionId/delta", async (c) => {
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

	const previousRevision = revision.copiedFromRevisionId
		? db.revisions.find((item) => item.id === revision.copiedFromRevisionId)
		: findPreviousRevision(db.revisions, revision);

	if (!previousRevision) {
		return c.json({
			programId: program.id,

			revisionId: revision.id,

			previousRevisionId: null,

			changes: [],

			hasChanges: false,
		});
	}

	const changes: DeltaChange[] = [];

	/**
	 * Setup changes
	 */
	compareObject(changes, "values", previousRevision.values, revision.values);
	/**
	 * Vehicle changes
	 */
	compareArrays(
		changes,
		"vehicles",
		previousRevision.vehicles,
		revision.vehicles,
	);

	/**
	 * Geography changes
	 */
	compareArrays(
		changes,
		"geography",
		previousRevision.geography,
		revision.geography,
	);

	/**
	 * Values/components changes
	 */
	compareObject(changes, "values", previousRevision.values, revision.values);

	return c.json({
		programId: program.id,

		programIdentifier: program.identifier,

		programName: program.name,

		revisionId: revision.id,

		revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,

		previousRevisionId: previousRevision.id,

		previousRevisionLabel: `${previousRevision.majorRevision}.${previousRevision.minorRevision}`,

		hasChanges: changes.length > 0,

		changes,
	});
});

interface DeltaChange {
	section: string;

	path: string;

	type: "ADDED" | "REMOVED" | "CHANGED";

	before?: unknown;

	after?: unknown;
}

/**
 * Compares two objects recursively.
 */
function compareObject(
	changes: DeltaChange[],
	section: string,
	before: object | null | undefined,
	after: object | null | undefined,
	path = "",
): void {
	const beforeObject = isPlainObject(before) ? before : {};

	const afterObject = isPlainObject(after) ? after : {};

	const keys = new Set([
		...Object.keys(beforeObject),
		...Object.keys(afterObject),
	]);

	for (const key of keys) {
		const currentPath = path ? `${path}.${key}` : key;

		const beforeValue = beforeObject[key];
		const afterValue = afterObject[key];

		if (beforeValue === undefined && afterValue !== undefined) {
			changes.push({
				section,
				path: currentPath,
				type: "ADDED",
				after: afterValue,
			});

			continue;
		}

		if (beforeValue !== undefined && afterValue === undefined) {
			changes.push({
				section,
				path: currentPath,
				type: "REMOVED",
				before: beforeValue,
			});

			continue;
		}

		if (isPlainObject(beforeValue) && isPlainObject(afterValue)) {
			compareObject(changes, section, beforeValue, afterValue, currentPath);

			continue;
		}

		if (!deepEqual(beforeValue, afterValue)) {
			changes.push({
				section,
				path: currentPath,
				type: "CHANGED",
				before: beforeValue,
				after: afterValue,
			});
		}
	}
}

/**
 * Compares arrays.
 *
 * For primitive arrays, reports added/removed values.
 * For object arrays, compares the whole array.
 */
function compareArrays(
	changes: DeltaChange[],
	section: string,
	before: unknown[],
	after: unknown[],
) {
	if (deepEqual(before, after)) {
		return;
	}

	const beforePrimitives = before.every(
		(item) => item === null || typeof item !== "object",
	);

	const afterPrimitives = after.every(
		(item) => item === null || typeof item !== "object",
	);

	if (beforePrimitives && afterPrimitives) {
		const beforeSet = new Set(before);

		const afterSet = new Set(after);

		for (const value of afterSet) {
			if (!beforeSet.has(value)) {
				changes.push({
					section,
					path: section,
					type: "ADDED",
					before: undefined,
					after: value,
				});
			}
		}

		for (const value of beforeSet) {
			if (!afterSet.has(value)) {
				changes.push({
					section,
					path: section,
					type: "REMOVED",
					before: value,
					after: undefined,
				});
			}
		}

		return;
	}

	changes.push({
		section,
		path: section,
		type: "CHANGED",
		before,
		after,
	});
}

/**
 * Find the previous revision when the
 * copiedFromRevisionId is unavailable.
 */
function findPreviousRevision(
	revisions: Awaited<ReturnType<typeof readDb>>["revisions"],
	current: (typeof revisions)[number],
) {
	return revisions
		.filter(
			(revision) =>
				revision.programId === current.programId &&
				revision.id !== current.id &&
				(revision.majorRevision < current.majorRevision ||
					(revision.majorRevision === current.majorRevision &&
						revision.minorRevision < current.minorRevision)),
		)
		.sort((a, b) => {
			if (a.majorRevision !== b.majorRevision) {
				return b.majorRevision - a.majorRevision;
			}

			return b.minorRevision - a.minorRevision;
		})[0];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepEqual(a: unknown, b: unknown): boolean {
	if (Object.is(a, b)) {
		return true;
	}

	if (
		typeof a !== "object" ||
		typeof b !== "object" ||
		a === null ||
		b === null
	) {
		return false;
	}

	if (Array.isArray(a) !== Array.isArray(b)) {
		return false;
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) {
			return false;
		}

		return a.every((value, index) => deepEqual(value, b[index]));
	}

	const aObj = a as Record<string, unknown>;

	const bObj = b as Record<string, unknown>;

	const keys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);

	for (const key of keys) {
		if (!deepEqual(aObj[key], bObj[key])) {
			return false;
		}
	}

	return true;
}
