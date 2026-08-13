import { Hono } from "hono";

import { currentUser } from "../lib/auth.js";
import { getActiveRevision } from "../lib/programs.js";

import { readDb, revisionLabel } from "../store.js";

export const dashboard = new Hono();

function vehicleLabel(vehicle: {
	year: number;
	make: string;
	model: string;
	trimName: string;
}): string {
	return `${vehicle.year} ${vehicle.make} ${vehicle.model}${
		vehicle.trimName ? ` ${vehicle.trimName}` : ""
	}`;
}

/**
 * GET /api/dashboard/summary
 */
dashboard.get("/dashboard/summary", async (c) => {
	currentUser(c);

	const db = await readDb();

	const programs = db.programs.filter((program) => program.deletedAt === null);

	const countFor = (status: "DRAFT" | "ACTIVE" | "EXPIRED") =>
		programs.filter((program) => program.status === status).length;

	const pendingApprovalFor = (status: "DRAFT" | "ACTIVE" | "EXPIRED") =>
		db.revisions.filter((revision) => {
			const program = programs.find((item) => item.id === revision.programId);

			if (!program) {
				return false;
			}

			return (
				program.status === status &&
				revision.status === "DRAFT" &&
				revision.approval.isSubmitted &&
				!revision.approval.approved
			);
		}).length;

	return c.json({
		counts: [
			{
				status: "DRAFT",
				total: countFor("DRAFT"),
				pendingApproval: pendingApprovalFor("DRAFT"),
			},
			{
				status: "ACTIVE",
				total: countFor("ACTIVE"),
				pendingApproval: pendingApprovalFor("ACTIVE"),
			},
			{
				status: "EXPIRED",
				total: countFor("EXPIRED"),
				pendingApproval: pendingApprovalFor("EXPIRED"),
			},
		],
	});
});

/**
 * GET /api/dashboard/activity
 */
dashboard.get("/dashboard/activity", async (c) => {
	currentUser(c);

	const db = await readDb();

	const items = [...db.activity]
		.sort(
			(a, b) =>
				new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
		)
		.slice(0, 20);

	return c.json({
		items,
	});
});

/**
 * GET /api/dashboard/expiring
 *
 * Returns ACTIVE programs whose active revision
 * has a delivery end date within the next 30 days.
 */
dashboard.get("/dashboard/expiring", async (c) => {
	currentUser(c);

	const db = await readDb();

	const now = Date.now();

	const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

	const items = db.programs
		.filter(
			(program) => program.deletedAt === null && program.status === "ACTIVE",
		)
		.map((program) => ({
			program,
			revision: getActiveRevision(db, program),
		}))
		.filter(
			(
				item,
			): item is {
				program: (typeof db.programs)[number];
				revision: NonNullable<typeof item.revision>;
			} => {
				if (!item.revision) {
					return false;
				}

				const endDate = item.revision.setup.deliveryEndDate;

				if (typeof endDate !== "string") {
					return false;
				}

				const endTime = new Date(endDate).getTime();

				return endTime >= now && endTime <= now + THIRTY_DAYS;
			},
		)
		.map(({ program, revision }) => ({
			programId: program.id,

			programIdentifier: program.identifier,

			programName: program.name,

			revisionId: revision.id,

			revisionLabel: revisionLabel(revision),

			deliveryStartDate: revision.setup.deliveryStartDate,

			deliveryEndDate: revision.setup.deliveryEndDate,

			vehicles: revision.vehicles.map((revisionVehicle) => {
				const vehicle = db.vehicles.find(
					(item) => item.vehicleCatalogId === revisionVehicle.vehicleCatalogId,
				);

				return {
					revisionVehicleId: revisionVehicle.revisionVehicleId,

					vehicleCatalogId: revisionVehicle.vehicleCatalogId,

					label: vehicle
						? vehicleLabel(vehicle)
						: `Vehicle ${revisionVehicle.vehicleCatalogId}`,
				};
			}),

			includedStates: revision.geography
				.filter((rule) => rule.isIncluded && rule.level === "STATE")
				.map((rule) => rule.code),
		}));

	return c.json({
		items,
	});
});
