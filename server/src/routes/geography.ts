// src/routes/geography.ts

import { Hono } from "hono";

import { currentUser, requireRole } from "../lib/auth.js";
import { badRequest, notFound } from "../lib/errors.js";
import { getProgramOrThrow } from "../lib/programs.js";

import { type GeoRule, getNextId, readDb, writeDb } from "../store.js";

export const geography = new Hono();

/* ============================================================
 * GET /api/geography/regions
 * ============================================================ */

geography.get("/geography/regions", async (c) => {
	currentUser(c);

	const db = await readDb();

	return c.json({
		regions: db.geography.regions,
	});
});

/* ============================================================
 * GET /api/geography/states
 *
 * Optional:
 * ?region=WEST
 * ============================================================ */

geography.get("/geography/states", async (c) => {
	currentUser(c);

	const db = await readDb();

	const region = c.req.query("region")?.trim().toUpperCase();

	let states = db.geography.states;

	if (region) {
		states = states.filter(
			(state) => state.region.toUpperCase() === region,
		);
	}

	return c.json({
		states,
	});
});

/* ============================================================
 * GET /api/geography/dmas
 *
 * Required:
 * ?state=NY
 *
 * Optional:
 * ?region=NORTHEAST
 * ============================================================ */

geography.get("/geography/dmas", async (c) => {
	currentUser(c);

	const db = await readDb();

	const state = c.req.query("state")?.trim().toUpperCase();
	const region = c.req.query("region")?.trim().toUpperCase();

	if (!state) {
		throw badRequest("BAD_REQUEST", "state is required");
	}

	let dmas = db.geography.dmas.filter(
		(dma) => dma.state.toUpperCase() === state,
	);

	if (region) {
		dmas = dmas.filter(
			(dma) => dma.region.toUpperCase() === region,
		);
	}

	/*
	 * OpenAPI GeoNode only exposes:
	 *   code
	 *   name
	 *
	 * Do not return internal hierarchy fields here.
	 */
	return c.json({
		dmas: dmas.map(({ code, name }) => ({
			code,
			name,
		})),
	});
});

/* ============================================================
 * GET /api/geography/counties
 *
 * Required:
 * ?state=NY
 *
 * Optional:
 * ?dma=NYC
 * ============================================================ */

geography.get("/geography/counties", async (c) => {
	currentUser(c);

	const db = await readDb();

	const state = c.req.query("state")?.trim().toUpperCase();
	const dma = c.req.query("dma")?.trim().toUpperCase();

	if (!state) {
		throw badRequest("BAD_REQUEST", "state is required");
	}

	let counties = db.geography.counties.filter(
		(county) => county.state.toUpperCase() === state,
	);

	if (dma) {
		counties = counties.filter(
			(county) => county.dma?.toUpperCase() === dma,
		);
	}

	return c.json({
		counties: counties.map(({ code, name }) => ({
			code,
			name,
		})),
	});
});

/* ============================================================
 * GET /api/geography/search
 *
 * Required:
 * ?search=detroit
 *
 * Searches across:
 * REGION
 * STATE
 * DMA
 * COUNTY
 *
 * OpenAPI response:
 * {
 *   results: GeoSearchResult[]
 * }
 * ============================================================ */

geography.get("/geography/search", async (c) => {
	currentUser(c);

	const db = await readDb();

	const search = c.req.query("search")?.trim().toLowerCase();

	if (!search) {
		throw badRequest("BAD_REQUEST", "search is required");
	}

	const results: Array<{
		level: GeoLevel;
		code: string;
		name: string;
	}> = [];

	/* Regions */

	for (const item of db.geography.regions) {
		if (
			item.code.toLowerCase().includes(search) ||
			item.name.toLowerCase().includes(search)
		) {
			results.push({
				level: "REGION",
				code: item.code,
				name: item.name,
			});
		}
	}

	/* States */

	for (const item of db.geography.states) {
		if (
			item.code.toLowerCase().includes(search) ||
			item.name.toLowerCase().includes(search)
		) {
			results.push({
				level: "STATE",
				code: item.code,
				name: item.name,
			});
		}
	}

	/* DMAs */

	for (const item of db.geography.dmas) {
		if (
			item.code.toLowerCase().includes(search) ||
			item.name.toLowerCase().includes(search)
		) {
			results.push({
				level: "DMA",
				code: item.code,
				name: item.name,
			});
		}
	}

	/* Counties */

	for (const item of db.geography.counties) {
		if (
			item.code.toLowerCase().includes(search) ||
			item.name.toLowerCase().includes(search)
		) {
			results.push({
				level: "COUNTY",
				code: item.code,
				name: item.name,
			});
		}
	}

	return c.json({
		results,
	});
});

/* ============================================================
 * GET
 * /api/programs/:programId/revisions/:revisionId/geography
 *
 * OpenAPI response:
 * {
 *   geoRules: GeoRule[]
 * }
 * ============================================================ */

geography.get(
	"/programs/:programId/revisions/:revisionId/geography",
	async (c) => {
		currentUser(c);

		const db = await readDb();

		const programId = Number(c.req.param("programId"));
		const revisionId = Number(c.req.param("revisionId"));

		const program = getProgramOrThrow(db, programId);

		const revision = db.revisions.find(
			(item) =>
				item.id === revisionId &&
				item.programId === program.id,
		);

		if (!revision) {
			throw notFound(
				"REVISION_NOT_FOUND",
				"Revision not found",
			);
		}

		return c.json({
			geoRules: revision.geography,
		});
	},
);

/* ============================================================
 * PUT
 * /api/programs/:programId/revisions/:revisionId/geography
 *
 * Request:
 * {
 *   geoRules: GeoRuleInput[]
 * }
 *
 * Response:
 * {
 *   geoRules: GeoRule[]
 * }
 * ============================================================ */

geography.put(
	"/programs/:programId/revisions/:revisionId/geography",
	async (c) => {
		const user = requireRole(c, "AUTHOR", "ADMIN");

		const db = await readDb();

		const programId = Number(c.req.param("programId"));
		const revisionId = Number(c.req.param("revisionId"));

		const program = getProgramOrThrow(db, programId);

		const revision = db.revisions.find(
			(item) =>
				item.id === revisionId &&
				item.programId === program.id,
		);

		if (!revision) {
			throw notFound(
				"REVISION_NOT_FOUND",
				"Revision not found",
			);
		}

		/*
		 * OpenAPI guard:
		 * revision status must be DRAFT.
		 */
		if (revision.status !== "DRAFT") {
			throw badRequest(
				"REVISION_NOT_EDITABLE",
				"Only a draft revision can be edited",
			);
		}

		const body = await c.req.json().catch(() => null);

		if (!body || typeof body !== "object") {
			throw badRequest(
				"BAD_REQUEST",
				"Request body is required",
			);
		}

		const geoRules = (
			body as {
				geoRules?: unknown;
			}
		).geoRules;

		if (!Array.isArray(geoRules)) {
			throw badRequest(
				"BAD_REQUEST",
				"geoRules must be an array",
			);
		}

		/*
		 * OpenAPI says:
		 *
		 * at least one include rule required.
		 */
		const hasIncludeRule = geoRules.some(
			(rule) =>
				rule &&
				typeof rule === "object" &&
				(rule as { isIncluded?: unknown }).isIncluded === true,
		);

		if (!hasIncludeRule) {
			throw badRequest(
				"BAD_REQUEST",
				"At least one include geography rule is required",
			);
		}

		const validLevels: GeoLevel[] = [
			"REGION",
			"STATE",
			"DMA",
			"COUNTY",
		];

		/*
		 * IMPORTANT:
		 *
		 * Request uses GeoRuleInput.
		 *
		 * Therefore geoRuleId must NOT be required
		 * from the client.
		 */
		const normalizedRules: GeoRule[] = geoRules.map(
			(rule) => {
				if (!rule || typeof rule !== "object") {
					throw badRequest(
						"BAD_REQUEST",
						"Invalid geography rule",
					);
				}

				const value = rule as {
					isIncluded?: unknown;
					level?: unknown;
					code?: unknown;
					name?: unknown;
				};

				if (
					typeof value.isIncluded !== "boolean" ||
					typeof value.level !== "string" ||
					typeof value.code !== "string"
				) {
					throw badRequest(
						"BAD_REQUEST",
						"Invalid geography rule fields",
					);
				}

				if (
					!validLevels.includes(
						value.level as GeoLevel,
					)
				) {
					throw badRequest(
						"BAD_REQUEST",
						"Invalid geography level",
					);
				}

				const candidate: Omit<GeoRule, "geoRuleId"> = {
					isIncluded: value.isIncluded,
					level: value.level as GeoLevel,
					code: value.code.trim(),
					name:
						typeof value.name === "string"
							? value.name
							: undefined,
				};

				if (
					!geographyExists(db, candidate)
				) {
					throw badRequest(
						"INVALID_GEOGRAPHY",
						`Unknown geography: ${candidate.level}/${candidate.code}`,
					);
				}

				return {
					geoRuleId: getNextId(
						revision.geography.map(
							(item) => ({
								id: item.geoRuleId,
							}),
						),
					),
					...candidate,
				};
			},
		);

		/*
		 * Major revision edits reset approval.
		 *
		 * Minor revisions intentionally preserve approval state.
		 */
		if (!revision.isMinorRevision) {
			resetApproval(revision);
		}

		revision.geography = normalizedRules;

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
			geoRules: revision.geography,
		});
	},
);

/* ============================================================
 * Geography validation
 * ============================================================ */

function geographyExists(
	db: Awaited<ReturnType<typeof readDb>>,
	rule: Omit<GeoRule, "geoRuleId">,
): boolean {
	switch (rule.level) {
		case "REGION":
			return db.geography.regions.some(
				(item) => item.code === rule.code,
			);

		case "STATE":
			return db.geography.states.some(
				(item) => item.code === rule.code,
			);

		case "DMA":
			return db.geography.dmas.some(
				(item) => item.code === rule.code,
			);

		case "COUNTY":
			return db.geography.counties.some(
				(item) => item.code === rule.code,
			);

		default:
			return false;
	}
}

/* ============================================================
 * Approval reset
 * ============================================================ */

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
	revision.approval.rejectionReason = null;
	revision.approval.rejectedBy = null;
}