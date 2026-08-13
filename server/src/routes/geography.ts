// src/routes/geography.ts

import { Hono } from "hono";

import { currentUser, requireRole } from "../lib/auth.js";
import { badRequest, notFound } from "../lib/errors.js";
import { getProgramOrThrow } from "../lib/programs.js";

import {
	type GeoLevel,
	type GeoRule,
	getNextId,
	readDb,
	writeDb,
} from "../store.js";

export const geography = new Hono();

/**
 * GET /api/geography/regions
 */
geography.get("/geography/regions", async (c) => {
	currentUser(c);

	const db = await readDb();

	return c.json({
		items: db.geography.regions,
	});
});

/**
 * GET /api/geography/states
 *
 * Optional:
 * ?region=WEST
 */
geography.get("/geography/states", async (c) => {
	currentUser(c);

	const db = await readDb();

	const region = c.req.query("region")?.trim().toUpperCase();

	let items = db.geography.states;

	if (region) {
		items = items.filter((state) => state.region.toUpperCase() === region);
	}

	return c.json({
		items,
	});
});

/**
 * GET /api/geography/dmas
 *
 * Optional:
 * ?state=NY
 */
geography.get("/geography/dmas", async (c) => {
	currentUser(c);

	const db = await readDb();

	const state = c.req.query("state")?.trim().toUpperCase();

	let items = db.geography.dmas;

	if (state) {
		items = items.filter((dma) => dma.state.toUpperCase() === state);
	}

	return c.json({
		items,
	});
});

/**
 * GET /api/geography/counties
 *
 * Optional:
 * ?state=NY
 * ?dma=NYC
 */
geography.get("/geography/counties", async (c) => {
	currentUser(c);

	const db = await readDb();

	const state = c.req.query("state")?.trim().toUpperCase();
	const dma = c.req.query("dma")?.trim().toUpperCase();

	let items = db.geography.counties;

	if (state) {
		items = items.filter((county) => county.state.toUpperCase() === state);
	}

	if (dma) {
		items = items.filter((county) => county.dma?.toUpperCase() === dma);
	}

	return c.json({
		items,
	});
});

/**
 * GET /api/geography/search
 *
 * Examples:
 *
 * ?q=California
 * ?q=New&level=STATE
 * ?q=York&level=COUNTY
 */
geography.get("/geography/search", async (c) => {
	currentUser(c);

	const db = await readDb();

	const query = c.req.query("q")?.trim().toLowerCase();

	const levelParam = c.req.query("level")?.trim().toUpperCase();

	if (!query) {
		throw badRequest("BAD_REQUEST", "q is required");
	}

	const validLevels: GeoLevel[] = ["REGION", "STATE", "DMA", "COUNTY"];

	if (levelParam && !validLevels.includes(levelParam as GeoLevel)) {
		throw badRequest("BAD_REQUEST", "Invalid geography level");
	}

	const level = levelParam as GeoLevel | undefined;

	const items: Array<{
		level: GeoLevel;
		code: string;
		name: string;
		region?: string;
		state?: string;
		dma?: string;
	}> = [];

	if (!level || level === "REGION") {
		for (const item of db.geography.regions) {
			if (
				item.code.toLowerCase().includes(query) ||
				item.name.toLowerCase().includes(query)
			) {
				items.push({
					level: "REGION",
					code: item.code,
					name: item.name,
				});
			}
		}
	}

	if (!level || level === "STATE") {
		for (const item of db.geography.states) {
			if (
				item.code.toLowerCase().includes(query) ||
				item.name.toLowerCase().includes(query)
			) {
				items.push({
					level: "STATE",
					code: item.code,
					name: item.name,
					region: item.region,
				});
			}
		}
	}

	if (!level || level === "DMA") {
		for (const item of db.geography.dmas) {
			if (
				item.code.toLowerCase().includes(query) ||
				item.name.toLowerCase().includes(query)
			) {
				items.push({
					level: "DMA",
					code: item.code,
					name: item.name,
					state: item.state,
					region: item.region,
				});
			}
		}
	}

	if (!level || level === "COUNTY") {
		for (const item of db.geography.counties) {
			if (
				item.code.toLowerCase().includes(query) ||
				item.name.toLowerCase().includes(query)
			) {
				items.push({
					level: "COUNTY",
					code: item.code,
					name: item.name,
					state: item.state,
					dma: item.dma,
				});
			}
		}
	}

	return c.json({
		items,
	});
});

/**
 * GET
 * /api/programs/:programId/revisions/:revisionId/geography
 */
geography.get(
	"/programs/:programId/revisions/:revisionId/geography",
	async (c) => {
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

		return c.json({
			programId: program.id,
			revisionId: revision.id,
			rules: revision.geography,
		});
	},
);

/**
 * PUT
 * /api/programs/:programId/revisions/:revisionId/geography
 */
geography.put(
	"/programs/:programId/revisions/:revisionId/geography",
	async (c) => {
		const user = requireRole(c, "AUTHOR", "ADMIN");

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

		if (revision.status !== "DRAFT") {
			throw badRequest(
				"REVISION_NOT_EDITABLE",
				"Only a draft revision can be edited",
			);
		}

		const body = await c.req.json().catch(() => null);

		if (!body || typeof body !== "object") {
			throw badRequest("BAD_REQUEST", "Request body is required");
		}

		const rules = (
			body as {
				rules?: unknown;
			}
		).rules;

		if (!Array.isArray(rules)) {
			throw badRequest("BAD_REQUEST", "rules must be an array");
		}

		const validLevels: GeoLevel[] = ["REGION", "STATE", "DMA", "COUNTY"];

		const normalizedRules: GeoRule[] = rules.map((rule) => {
			if (!rule || typeof rule !== "object") {
				throw badRequest("BAD_REQUEST", "Invalid geography rule");
			}

			const value = rule as Partial<GeoRule>;

			if (
				typeof value.geoRuleId !== "number" ||
				typeof value.isIncluded !== "boolean" ||
				typeof value.level !== "string" ||
				typeof value.code !== "string"
			) {
				throw badRequest("BAD_REQUEST", "Invalid geography rule fields");
			}

			if (!validLevels.includes(value.level as GeoLevel)) {
				throw badRequest("BAD_REQUEST", "Invalid geography level");
			}

			return {
				geoRuleId: value.geoRuleId,

				isIncluded: value.isIncluded,

				level: value.level as GeoLevel,

				code: value.code,

				name: value.name,
			};
		});

		/**
		 * Validate every geography
		 * reference against db.json.
		 */
		for (const rule of normalizedRules) {
			if (!geographyExists(db, rule)) {
				throw badRequest(
					"INVALID_GEOGRAPHY",
					`Unknown geography: ${rule.level}/${rule.code}`,
				);
			}
		}

		revision.geography = normalizedRules;

		/**
		 * Geography changes reset
		 * approval state for major revisions.
		 */
		if (!revision.isMinorRevision) {
			resetApproval(revision);
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

			revisionId: revision.id,

			rules: revision.geography,

			approval: {
				isSubmitted: revision.approval.isSubmitted,

				approved: revision.approval.approved,
			},
		});
	},
);

/**
 * Validate that a geography rule
 * references a real geography node.
 */
function geographyExists(
	db: Awaited<ReturnType<typeof readDb>>,
	rule: GeoRule,
): boolean {
	switch (rule.level) {
		case "REGION":
			return db.geography.regions.some((item) => item.code === rule.code);

		case "STATE":
			return db.geography.states.some((item) => item.code === rule.code);

		case "DMA":
			return db.geography.dmas.some((item) => item.code === rule.code);

		case "COUNTY":
			return db.geography.counties.some((item) => item.code === rule.code);

		default:
			return false;
	}
}

/**
 * Reset approval state after
 * a major revision edit.
 */
function resetApproval(revision: {
	approval: {
		isSubmitted: boolean;
		submittedAt: string | null;
		submittedBy: string | null;
		approved: boolean;
		approvedAt: string | null;
		approvedBy: string | null;
		approvalComment: string | null;
		rejectedAt: string | null;
		rejectedBy: string | null;
		rejectionReason: string | null;
	};
}) {
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
