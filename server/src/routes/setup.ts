// src/routes/setup.ts

import { Hono } from "hono";

import { currentUser, requireRole } from "../lib/auth.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { getProgramOrThrow } from "../lib/programs.js";

import { getNextId, type MockRevision, readDb, writeDb } from "../store.js";

export const setup = new Hono();

/**
 * Program setup request model.
 *
 * This represents the complete setup section of a revision.
 */
type SetupInput = {
	programName: string;

	programTypeCode: string;

	purchaseType: string;

	customerTypeCodes: string[];

	contactName: string | null;

	contactEmail: string | null;

	contactPhone: string | null;

	financialProviderCode: string | null;

	conditionCode: string;

	mileageCeiling: number | null;

	topOfDeal: boolean;

	vinException: boolean;

	mfpnText: string | null;

	disclosureText: string | null;

	localeCode: string;

	deliveryStartDate: string;

	deliveryEndDate: string;

	effectiveStartDate: string | null;

	effectiveEndDate: string | null;

	financeTerms: number[];

	creditTiers: string[];
};

/**
 * Validate route parameters.
 */
function getIds(c: {
	req: {
		param: (name: string) => string;
	};
}) {
	const programId = Number(c.req.param("programId"));

	const revisionId = Number(c.req.param("revisionId"));

	if (
		!Number.isInteger(programId) ||
		!Number.isInteger(revisionId) ||
		programId <= 0 ||
		revisionId <= 0
	) {
		throw badRequest(
			"VALIDATION_ERROR",
			"programId and revisionId must be positive integers",
		);
	}

	return {
		programId,
		revisionId,
	};
}

/**
 * Find a revision belonging to a program.
 */
function getRevision(
	db: Awaited<ReturnType<typeof readDb>>,
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

/**
 * Reset approval state after a major revision is edited.
 *
 * Minor revisions are intentionally exempt.
 */
function resetApprovalIfNeeded(revision: MockRevision): void {
	if (revision.isMinorRevision) {
		return;
	}

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

/**
 * Validate the setup request body.
 */
function validateSetup(body: Partial<SetupInput>): asserts body is SetupInput {
	const requiredFields: Array<keyof SetupInput> = [
		"programName",
		"programTypeCode",
		"purchaseType",
		"customerTypeCodes",
		"conditionCode",
		"deliveryStartDate",
		"deliveryEndDate",
	];

	for (const field of requiredFields) {
		if (body[field] === undefined || body[field] === null) {
			throw badRequest("VALIDATION_ERROR", `${String(field)} is required`);
		}
	}

	/**
	 * Program name
	 */
	if (typeof body.programName !== "string" || !body.programName.trim()) {
		throw badRequest("VALIDATION_ERROR", "programName is required");
	}

	if (body.programName.trim().length > 255) {
		throw badRequest(
			"VALIDATION_ERROR",
			"programName must be 255 characters or fewer",
		);
	}

	/**
	 * Program type
	 */
	if (typeof body.programTypeCode !== "string") {
		throw badRequest("VALIDATION_ERROR", "programTypeCode must be a string");
	}

	/**
	 * Purchase type
	 */
	if (typeof body.purchaseType !== "string") {
		throw badRequest("VALIDATION_ERROR", "purchaseType must be a string");
	}

	/**
	 * Customer types
	 */
	if (!Array.isArray(body.customerTypeCodes)) {
		throw badRequest("VALIDATION_ERROR", "customerTypeCodes must be an array");
	}

	if (body.customerTypeCodes.length < 1) {
		throw badRequest(
			"VALIDATION_ERROR",
			"customerTypeCodes must contain at least one value",
		);
	}

	if (body.customerTypeCodes.length > 50) {
		throw badRequest(
			"VALIDATION_ERROR",
			"customerTypeCodes must contain at most 50 values",
		);
	}

	if (
		body.customerTypeCodes.some(
			(value) => typeof value !== "string" || !value.trim(),
		)
	) {
		throw badRequest(
			"VALIDATION_ERROR",
			"customerTypeCodes must contain valid strings",
		);
	}

	/**
	 * Condition
	 */
	if (typeof body.conditionCode !== "string") {
		throw badRequest("VALIDATION_ERROR", "conditionCode must be a string");
	}

	/**
	 * Dates
	 */
	if (
		typeof body.deliveryStartDate !== "string" ||
		typeof body.deliveryEndDate !== "string"
	) {
		throw badRequest(
			"VALIDATION_ERROR",
			"deliveryStartDate and deliveryEndDate are required",
		);
	}

	if (body.deliveryStartDate > body.deliveryEndDate) {
		throw badRequest(
			"VALIDATION_ERROR",
			"deliveryStartDate cannot be after deliveryEndDate",
		);
	}

	/**
	 * Optional numeric field.
	 */
	if (
		body.mileageCeiling !== undefined &&
		body.mileageCeiling !== null &&
		(typeof body.mileageCeiling !== "number" ||
			!Number.isFinite(body.mileageCeiling))
	) {
		throw badRequest(
			"VALIDATION_ERROR",
			"mileageCeiling must be a valid number",
		);
	}

	/**
	 * Optional boolean fields.
	 */
	if (body.topOfDeal !== undefined && typeof body.topOfDeal !== "boolean") {
		throw badRequest("VALIDATION_ERROR", "topOfDeal must be a boolean");
	}

	if (
		body.vinException !== undefined &&
		typeof body.vinException !== "boolean"
	) {
		throw badRequest("VALIDATION_ERROR", "vinException must be a boolean");
	}

	/**
	 * Finance terms.
	 */
	if (
		body.financeTerms !== undefined &&
		(!Array.isArray(body.financeTerms) ||
			body.financeTerms.some(
				(value) => typeof value !== "number" || !Number.isInteger(value),
			))
	) {
		throw badRequest(
			"VALIDATION_ERROR",
			"financeTerms must contain integer values",
		);
	}

	/**
	 * Credit tiers.
	 */
	if (
		body.creditTiers !== undefined &&
		(!Array.isArray(body.creditTiers) ||
			body.creditTiers.some((value) => typeof value !== "string"))
	) {
		throw badRequest(
			"VALIDATION_ERROR",
			"creditTiers must contain string values",
		);
	}
}

/**
 * Build the API response for a setup revision.
 */
function setupResponse(
	program: Awaited<ReturnType<typeof readDb>>["programs"][number],
	revision: MockRevision,
) {
	return {
		programId: program.id,
		programIdentifier: program.identifier,
		revisionId: revision.id,
		majorRevision: revision.majorRevision,
		minorRevision: revision.minorRevision,
		revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,
		revisionStatus: revision.status,

		...revision.setup,
		programName: program.name,
	};
}

/**
 * GET
 *
 * /api/programs/:programId/revisions/:revisionId/setup
 */
setup.get("/programs/:programId/revisions/:revisionId/setup", async (c) => {
	currentUser(c);

	const { programId, revisionId } = getIds(c);

	const db = await readDb();

	const program = getProgramOrThrow(db, programId);

	const revision = getRevision(db, program.id, revisionId);

	return c.json(setupResponse(program, revision));
});

/**
 * PUT
 *
 * /api/programs/:programId/revisions/:revisionId/setup
 *
 * Saves the complete setup section.
 */
setup.put("/programs/:programId/revisions/:revisionId/setup", async (c) => {
	const user = requireRole(c, "AUTHOR", "ADMIN");

	const { programId, revisionId } = getIds(c);

	const body = await c.req.json<Partial<SetupInput>>().catch(() => null);

	if (!body) {
		throw badRequest("VALIDATION_ERROR", "Request body must be valid JSON");
	}

	validateSetup(body);

	const db = await readDb();

	const program = getProgramOrThrow(db, programId);

	const revision = getRevision(db, program.id, revisionId);

	/**
	 * Setup is editable only while
	 * the revision is DRAFT.
	 */
	if (revision.status !== "DRAFT") {
		throw conflict(
			"REVISION_NOT_EDITABLE",
			"Setup can only be edited while the revision is DRAFT",
		);
	}

	const now = new Date().toISOString();

	/**
	 * Save the complete setup snapshot.
	 *
	 * Optional fields use their existing value
	 * when omitted, except fields where null/default
	 * is explicitly expected.
	 */
	revision.setup = {
		...revision.setup,

		programName: body.programName!.trim(),

		programTypeCode: body.programTypeCode,

		purchaseType: body.purchaseType,

		customerTypeCodes: body.customerTypeCodes,

		contactName: body.contactName ?? null,

		contactEmail: body.contactEmail ?? null,

		contactPhone: body.contactPhone ?? null,

		financialProviderCode: body.financialProviderCode ?? null,

		conditionCode: body.conditionCode,

		mileageCeiling: body.mileageCeiling ?? null,

		topOfDeal: body.topOfDeal ?? false,

		vinException: body.vinException ?? false,

		mfpnText: body.mfpnText ?? null,

		disclosureText: body.disclosureText ?? null,

		localeCode: body.localeCode ?? "en-US",

		deliveryStartDate: body.deliveryStartDate,

		deliveryEndDate: body.deliveryEndDate,

		effectiveStartDate: body.effectiveStartDate ?? null,

		effectiveEndDate: body.effectiveEndDate ?? null,

		financeTerms: body.financeTerms ?? [],

		creditTiers: body.creditTiers ?? [],
	};

	/**
	 * Keep program-level fields synchronized.
	 */
	program.name = body.programName!.trim();

	program.programType = body.programTypeCode!;

	program.deliveryStartDate = body.deliveryStartDate!;

	program.deliveryEndDate = body.deliveryEndDate!;

	program.updatedAt = now;

	/**
	 * Editing setup on a major revision
	 * invalidates previous approval.
	 *
	 * Minor revisions are exempt.
	 */
	resetApprovalIfNeeded(revision);

	/**
	 * Audit activity.
	 */
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

	return c.json(setupResponse(program, revision));
});
