import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { readDb } from "./store";

const app = new Hono();

app.get("/dashboard/summary", async (c) => {
	const db = await readDb();

	const draft = db.programs.filter(
		(program) => program.status === "DRAFT",
	).length;

	const active = db.programs.filter(
		(program) => program.status === "ACTIVE",
	).length;

	const expired = db.programs.filter(
		(program) => program.status === "EXPIRED",
	).length;

	const review = db.revisions.filter(
		(revision) => revision.status === "REVIEW",
	).length;

	return c.json({
		counts: [
			{
				status: "DRAFT",
				total: draft,
				pendingApproval: review,
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
app.get("/dashboard/activity", async (c) => {
	const db = await readDb();
	const items = [...db.activity]
		.sort(
			(a, b) =>
				new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
		)
		.slice(0, 20);
	return c.json({ items });
});
app.get("/dashboard/expiring", async (c) => {
	const db = await readDb();
	return c.json({ items: db.expiringPrograms });
});

export function getNextId(values: Array<{ id: number }>): number {
	if (values.length === 0) {
		return 1;
	}

	return Math.max(...values.map((item) => item.id)) + 1;
}

app.get("/programs", async (c) => {
	const status = c.req.query("status");
	const programType = c.req.query("programType");
	const search = c.req.query("search");
	const dateFrom = c.req.query("dateFrom");
	const dateTo = c.req.query("dateTo");
	const pendingApproval = c.req.query("pendingApproval");

	const page = Number(c.req.query("page") ?? 0);
	const size = Number(c.req.query("size") ?? 20);

	let programs = MOCK_PROGRAMS;

	if (status) {
		programs = programs.filter((program) => program.status === status);
	}

	if (programType) {
		programs = programs.filter((program) => program.type === programType);
	}

	if (search) {
		const term = search.trim().toLowerCase();

		programs = programs.filter((program) =>
			[program.name, program.identifier]
				.filter(Boolean)
				.some((value) => value.toLowerCase().includes(term)),
		);
	}

	if (dateFrom) {
		programs = programs.filter(
			(program) => program.deliveryStartDate >= dateFrom,
		);
	}

	if (dateTo) {
		programs = programs.filter((program) => program.deliveryEndDate <= dateTo);
	}

	if (pendingApproval === "true") {
		programs = programs.filter(
			(program) =>
				program.revision?.isSubmitted === true &&
				program.revision?.approved !== true,
		);
	}

	const totalElements = programs.length;
	const totalPages = Math.ceil(totalElements / size);

	const start = page * size;
	const end = start + size;

	const content = programs.slice(start, end);

	return c.json({
		content,
		pagination: {
			page,
			size,
			totalElements,
			totalPages,
		},
		statusCounts: {
			all: MOCK_PROGRAMS.length,
			draft: MOCK_PROGRAMS.filter((program) => program.status === "DRAFT")
				.length,
			active: MOCK_PROGRAMS.filter((program) => program.status === "ACTIVE")
				.length,
			expired: MOCK_PROGRAMS.filter((program) => program.status === "EXPIRED")
				.length,
		},
	});
});
serve(
	{
		fetch: app.fetch,
		port: 3001,
	},
	(info) => {
		console.log(`Mock API running on http://localhost:${info.port}`);
	},
);
