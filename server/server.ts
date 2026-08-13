import { Hono } from "hono";
import { cors } from "hono/cors";

import {
	getNextId,
	type MockActivity,
	type MockRevision,
	type ProgramStatus,
	readDb,
	revisionLabel,
	type UserRole,
	writeDb,
} from "./store";

const app = new Hono();

/* ============================================================
 * CONFIG
 * ============================================================ */

const PORT = Number(process.env.PORT ?? 3001);

const DEV_TOKEN = process.env.CARBRAVO_DEV_TOKEN ?? "mock-token";

/* ============================================================
 * CORS
 * ============================================================ */

app.use(
	"*",
	cors({
		origin: "http://localhost:5173",
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	}),
);

/* ============================================================
 * AUTH
 *
 * OpenAPI uses bearerAuth.
 *
 * This is only the development implementation.
 * Spring Boot will replace this later.
 * ============================================================ */

interface AuthUser {
	id: string;
	username: string;
	role: UserRole;
}

function getAuthUser(c: any): AuthUser {
	const authorization = c.req.header("Authorization");

	if (!authorization?.startsWith("Bearer ")) {
		throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
	}

	const token = authorization.slice("Bearer ".length);

	if (token !== DEV_TOKEN) {
		throw new ApiError(401, "UNAUTHORIZED", "Invalid access token");
	}

	return {
		id: "1",
		username: "admin",
		role: "ADMIN",
	};
}

function requireRole(user: AuthUser, ...roles: UserRole[]) {
	if (!roles.includes(user.role)) {
		throw new ApiError(
			403,
			"FORBIDDEN",
			"You do not have permission to perform this operation",
		);
	}
}

/* ============================================================
 * ERROR
 * ============================================================ */

class ApiError extends Error {
	constructor(
		public status: number,
		public code: string,
		message: string,
		public details: Record<string, unknown> = {},
	) {
		super(message);
	}
}

app.onError((error, c) => {
	if (error instanceof ApiError) {
		return c.json(
			{
				error: {
					code: error.code,
					message: error.message,
					timestamp: new Date().toISOString(),
					path: c.req.path,
					details: error.details,
				},
			},
			error.status as any,
		);
	}

	console.error(error);

	return c.json(
		{
			error: {
				code: "INTERNAL_SERVER_ERROR",
				message: "Unexpected server error",
				timestamp: new Date().toISOString(),
				path: c.req.path,
				details: {},
			},
		},
		500,
	);
});

/* ============================================================
 * HELPERS
 * ============================================================ */

function getProgramOrThrow(db: Awaited<ReturnType<typeof readDb>>, id: number) {
	const program = db.programs.find((item) => item.id === id && !item.deletedAt);

	if (!program) {
		throw new ApiError(404, "PROGRAM_NOT_FOUND", "Program not found");
	}

	return program;
}

function getRevisionOrThrow(
	db: Awaited<ReturnType<typeof readDb>>,
	programId: number,
	revisionId: number,
) {
	const revision = db.revisions.find(
		(item) => item.id === revisionId && item.programId === programId,
	);

	if (!revision) {
		throw new ApiError(404, "REVISION_NOT_FOUND", "Revision not found");
	}

	return revision;
}

function assertDraft(revision: MockRevision) {
	if (revision.status !== "DRAFT") {
		throw new ApiError(
			409,
			"REVISION_NOT_EDITABLE",
			"Only a DRAFT revision can be edited",
		);
	}
}

function resetApproval(revision: MockRevision) {
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
}

function createActivity(
	db: Awaited<ReturnType<typeof readDb>>,
	input: Omit<MockActivity, "id" | "changedAt">,
) {
	db.activity.unshift({
		id: getNextId(db.activity),
		changedAt: new Date().toISOString(),
		...input,
	});
}

function getProgramRevisionRef(revision: MockRevision) {
	return {
		revisionId: revision.id,
		majorRevision: revision.majorRevision,
		minorRevision: revision.minorRevision,
		revisionLabel: revisionLabel(revision),
		revisionStatus: revision.status,
		isMinorRevision: revision.isMinorRevision,
	};
}

function getDraft(db: Awaited<ReturnType<typeof readDb>>, programId: number) {
	const program = getProgramOrThrow(db, programId);

	if (!program.draftRevisionId) {
		return null;
	}

	return (
		db.revisions.find((revision) => revision.id === program.draftRevisionId) ??
		null
	);
}

function getActiveRevision(
	db: Awaited<ReturnType<typeof readDb>>,
	programId: number,
) {
	const program = getProgramOrThrow(db, programId);

	if (!program.activeRevisionId) {
		return null;
	}

	return (
		db.revisions.find((revision) => revision.id === program.activeRevisionId) ??
		null
	);
}

/* ============================================================
 * DASHBOARD
 * ============================================================ */

app.get("/api/dashboard/summary", async (c) => {
	getAuthUser(c);

	const db = await readDb();

	const draft = db.programs.filter(
		(p) => p.status === "DRAFT" && !p.deletedAt,
	).length;

	const active = db.programs.filter(
		(p) => p.status === "ACTIVE" && !p.deletedAt,
	).length;

	const expired = db.programs.filter(
		(p) => p.status === "EXPIRED" && !p.deletedAt,
	).length;

	const pendingApproval = db.revisions.filter(
		(r) =>
			r.status === "DRAFT" && r.approval.isSubmitted && !r.approval.approved,
	).length;

	return c.json({
		counts: [
			{
				status: "DRAFT",
				total: draft,
				pendingApproval,
			},
			{
				status: "ACTIVE",
				total: active,
				pendingApproval: 0,
			},
			{
				status: "EXPIRED",
				total: expired,
				pendingApproval: 0,
			},
		],
	});
});

app.get("/api/dashboard/activity", async (c) => {
	getAuthUser(c);

	const db = await readDb();

	return c.json({
		items: [...db.activity]
			.sort(
				(a, b) =>
					new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
			)
			.slice(0, 20),
	});
});

app.get("/api/dashboard/expiring", async (c) => {
	getAuthUser(c);

	const db = await readDb();

	const now = new Date();
	const limit = new Date(now);
	limit.setDate(limit.getDate() + 30);

	const items = db.programs
		.filter((program) => program.status === "ACTIVE" && !program.deletedAt)
		.map((program) => {
			const revision = getActiveRevision(db, program.id);

			if (!revision) {
				return null;
			}

			const end = revision.setup.deliveryEndDate;

			if (typeof end !== "string") {
				return null;
			}

			const endDate = new Date(end);

			if (endDate < now || endDate > limit) {
				return null;
			}

			const vehicles = revision.vehicles
				.map((id) =>
					db.vehicles.find((vehicle) => vehicle.vehicleCatalogId === id),
				)
				.filter(Boolean)
				.map((vehicle) => ({
					vehicleCatalogId: vehicle!.vehicleCatalogId,
					label: vehicle!.division,
				}));

			const includedStates = revision.geography
				.filter((rule) => rule.isIncluded && rule.level === "STATE")
				.map((rule) => rule.code);

			return {
				programId: program.id,
				programIdentifier: program.identifier,
				programName: program.name,
				revisionId: revision.id,
				revisionLabel: revisionLabel(revision),
				deliveryStartDate: revision.setup.deliveryStartDate,
				deliveryEndDate: revision.setup.deliveryEndDate,
				vehicles,
				includedStates,
			};
		})
		.filter(Boolean);

	return c.json({ items });
});

/* ============================================================
 * PROGRAM LIST
 * ============================================================ */

app.get("/api/programs", async (c) => {
	getAuthUser(c);

	const db = await readDb();

	const status = c.req.query("status") as ProgramStatus | undefined;

	const programType = c.req.query("programType");
	const search = c.req.query("search")?.trim().toLowerCase();
	const dateFrom = c.req.query("dateFrom");
	const dateTo = c.req.query("dateTo");
	const pendingApproval = c.req.query("pendingApproval");

	const page = Math.max(0, Number(c.req.query("page") ?? 0));

	const size = Math.min(100, Math.max(1, Number(c.req.query("size") ?? 20)));

	let programs = db.programs.filter((program) => !program.deletedAt);

	if (status) {
		programs = programs.filter((program) => program.status === status);
	}

	if (programType) {
		programs = programs.filter(
			(program) => program.programType === programType,
		);
	}

	if (search) {
		programs = programs.filter((program) =>
			[program.name, program.identifier].some((value) =>
				value.toLowerCase().includes(search),
			),
		);
	}

	if (dateFrom) {
		programs = programs.filter(
			(program) => (program.deliveryStartDate ?? "") >= dateFrom,
		);
	}

	if (dateTo) {
		programs = programs.filter(
			(program) => (program.deliveryEndDate ?? "") <= dateTo,
		);
	}

	if (pendingApproval === "true") {
		programs = programs.filter((program) => {
			const draft = getDraft(db, program.id);

			return Boolean(draft?.approval.isSubmitted && !draft.approval.approved);
		});
	}

	const totalElements = programs.length;
	const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / size);

	const content = programs
		.slice(page * size, page * size + size)
		.map((program) => {
			const active = getActiveRevision(db, program.id);

			const draft = getDraft(db, program.id);

			const current = active ?? draft;

			return {
				programId: program.id,
				programIdentifier: program.identifier,
				programName: program.name,
				programStatus: program.status,
				programType: program.programType,

				currentRevision: current
					? {
							...getProgramRevisionRef(current),
							isSubmitted: current.approval.isSubmitted,
							approved: current.approval.approved,
						}
					: null,

				hasDraft: Boolean(draft),

				deliveryStartDate: program.deliveryStartDate,

				deliveryEndDate: program.deliveryEndDate,

				updatedAt: program.updatedAt,
			};
		});

	return c.json({
		content,

		pagination: {
			page,
			size,
			totalElements,
			totalPages,
		},
	});
});

/* ============================================================
 * CREATE PROGRAM
 * ============================================================ */

app.post("/api/programs", async (c) => {
	const user = getAuthUser(c);

	requireRole(user, "AUTHOR", "ADMIN");

	const body = await c.req.json<{
		programName?: string;
	}>();

	const programName = body.programName?.trim();

	if (!programName) {
		throw new ApiError(400, "BAD_REQUEST", "programName is required");
	}

	const db = await readDb();

	const programId = getNextId(db.programs);
	const revisionId = getNextId(db.revisions);

	const identifier = `PROG-${new Date().getFullYear()}-${String(
		programId,
	).padStart(4, "0")}`;

	const now = new Date().toISOString();

	const revision: MockRevision = {
		id: revisionId,
		programId,

		majorRevision: 1,
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

		setup: {
			programName,
		},

		vehicles: [],
		geography: [],
		values: {},
		summary: {},
	};

	const program = {
		id: programId,
		identifier,
		name: programName,
		status: "DRAFT" as const,
		programType: "INC",

		activeRevisionId: null,
		draftRevisionId: revisionId,

		deliveryStartDate: null,
		deliveryEndDate: null,

		createdAt: now,
		updatedAt: now,

		deletedAt: null,
	};

	db.programs.push(program);
	db.revisions.push(revision);

	createActivity(db, {
		entityType: "INCENTIVE_PROGRAM",
		entityId: programId,
		operation: "CREATE",
		changedBy: user.username,
		programName: program.name,
		programIdentifier: program.identifier,
	});

	await writeDb(db);

	return c.json(
		{
			programId,
			programIdentifier: identifier,
			programStatus: "DRAFT",
			revisionId,
			revisionStatus: "DRAFT",
			majorRevision: 1,
			minorRevision: 0,
			revisionLabel: "1.0",
		},
		201,
	);
});

/* ============================================================
 * PROGRAM DETAIL
 * ============================================================ */

app.get("/api/programs/:programId", async (c) => {
	getAuthUser(c);

	const db = await readDb();

	const programId = Number(c.req.param("programId"));

	const program = getProgramOrThrow(db, programId);

	const active = getActiveRevision(db, programId);
	const draft = getDraft(db, programId);

	return c.json({
		programId: program.id,
		programIdentifier: program.identifier,
		programName: program.name,
		programStatus: program.status,
		programType: program.programType,

		activeRevision: active ? getProgramRevisionRef(active) : null,

		draftRevision: draft
			? {
					...getProgramRevisionRef(draft),
					isSubmitted: draft.approval.isSubmitted,
					approved: draft.approval.approved,
				}
			: null,

		deliveryStartDate: program.deliveryStartDate,

		deliveryEndDate: program.deliveryEndDate,

		updatedAt: program.updatedAt,
	});
});

/* ============================================================
 * DELETE PROGRAM
 * ============================================================ */

app.delete("/api/programs/:programId", async (c) => {
	const user = getAuthUser(c);

	requireRole(user, "ADMIN");

	const db = await readDb();

	const programId = Number(c.req.param("programId"));

	const program = getProgramOrThrow(db, programId);

	if (program.status !== "DRAFT" || program.activeRevisionId !== null) {
		throw new ApiError(
			409,
			"PROGRAM_NOT_DRAFT",
			"Only programs that have never been posted can be deleted",
		);
	}

	program.deletedAt = new Date().toISOString();
	program.updatedAt = new Date().toISOString();

	createActivity(db, {
		entityType: "INCENTIVE_PROGRAM",
		entityId: program.id,
		operation: "DELETE",
		changedBy: user.username,
		programName: program.name,
		programIdentifier: program.identifier,
	});

	await writeDb(db);

	return c.body(null, 204);
});
