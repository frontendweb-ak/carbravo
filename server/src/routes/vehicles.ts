import { Hono } from "hono";

import { currentUser, requireRole } from "../lib/auth.js";
import { badRequest, notFound } from "../lib/errors.js";

import { getProgramOrThrow } from "../lib/programs.js";
import type { Vehicle } from "../store.js";
import { getNextId, readDb, writeDb } from "../store.js";
export const vehicles = new Hono();

function vehicleLabel(vehicle: Vehicle): string {
	return `${vehicle.year} ${vehicle.make} ${vehicle.model}${
		vehicle.trimName ? ` ${vehicle.trimName}` : ""
	}`;
}
/**
 * GET /api/vehicles/years
 *
 * Returns available model years.
 */
vehicles.get("/vehicles/years", async (c) => {
	currentUser(c);

	const db = await readDb();

	const years = [...new Set(db.vehicles.map((vehicle) => vehicle.year))].sort(
		(a, b) => b - a,
	);

	return c.json({
		years,
	});
});

/**
 * GET /api/vehicles/makes
 *
 * Optional:
 * ?year=2026
 */
vehicles.get("/vehicles/makes", async (c) => {
  currentUser(c);
  const db = await readDb();
  const yearParam = c.req.query("year");

  if (!yearParam) {
    throw badRequest("BAD_REQUEST", "year is required");
  }
  let vehicles = db.vehicles;
  if (yearParam) {
    const year = Number(yearParam);
    if (!Number.isInteger(year)) {
      throw badRequest("BAD_REQUEST", "year must be a valid number");
    }
    vehicles = vehicles.filter((vehicle) => vehicle.year === year);
  }
  const makes = Array.from(
    new Map(
      vehicles.map((vehicle) => [
        vehicle.make,
        {
          make: vehicle.make,
          oemCode: vehicle.oemCode,
        },
      ]),
    ).values(),
  ).sort((a, b) => a.make.localeCompare(b.make));
  return c.json({ makes });
});

/**
 * GET /api/vehicles/models
 *
 * Optional:
 * ?year=2026&make=Chevrolet
 */
vehicles.get("/vehicles/models", async (c) => {
  currentUser(c);
  const db = await readDb();
  const yearParam = c.req.query("year");
  const make = c.req.query("make")?.trim();
  if (!yearParam) {
    throw badRequest("BAD_REQUEST", "year is required");
  }

  if (!make) {
    throw badRequest("BAD_REQUEST", "make is required");
  }
  let vehicles = db.vehicles;
  if (yearParam) {
    const year = Number(yearParam);
    if (!Number.isInteger(year)) {
      throw badRequest("BAD_REQUEST", "year must be a valid number");
    }
    vehicles = vehicles.filter((vehicle) => vehicle.year === year);
  }
  if (make) {
    vehicles = vehicles.filter(
      (vehicle) => vehicle.make.toLowerCase() === make.toLowerCase(),
    );
  }
  const models = Array.from(
    new Map(
      vehicles.map((vehicle) => [
        vehicle.model,
        { model: vehicle.model, division: vehicle.make },
      ]),
    ).values(),
  ).sort((a, b) => a.model.localeCompare(b.model));

  return c.json({ models });
});

/**
 * GET /api/vehicles/search
 *
 * Supports:
 * ?search=Silverado
 * ?year=2026
 * ?make=Chevrolet
 * ?model=Silverado
 */
vehicles.get("/vehicles/search", async (c) => {
  currentUser(c);

  const db = await readDb();
  const search = c.req.query("search")?.trim().toLowerCase();
  const yearParam = c.req.query("year");
  const make = c.req.query("make")?.trim().toLowerCase();
  const model = c.req.query("model")?.trim().toLowerCase();
  const segment = c.req.query("segment")?.trim().toLowerCase();
  const fuelType = c.req.query("fuelType")?.trim().toLowerCase();
  const oemCode = c.req.query("oemCode")?.trim().toLowerCase();

  let items = db.vehicles;

  if (yearParam) {
    const year = Number(yearParam);

    if (!Number.isInteger(year)) {
      throw badRequest("BAD_REQUEST", "year must be a valid number");
    }

    items = items.filter((vehicle) => vehicle.year === year);
  }

  if (make) {
    items = items.filter((vehicle) => vehicle.make.toLowerCase() === make);
  }

  if (model) {
    items = items.filter((vehicle) => vehicle.model.toLowerCase() === model);
  }

  if (segment) {
    items = items.filter(
      (vehicle) => vehicle.segment.toLowerCase() === segment,
    );
  }

  if (fuelType) {
    items = items.filter(
      (vehicle) => vehicle.fuelType.toLowerCase() === fuelType,
    );
  }

  if (search) {
    items = items.filter((vehicle) => {
      const value = [
        vehicle.year,
        vehicle.make,
        vehicle.model,
        vehicle.trimName,
        vehicle.bodyStyle,
        vehicle.segment,
        vehicle.fuelType,
        vehicle.drivetrain,
        vehicle.oemCode,
      ]
        .join(" ")
        .toLowerCase();

      return value.includes(search);
    });
  }

  return c.json({ vehicles: items });
});

/**
 * GET /api/programs/:programId/revisions/:revisionId/vehicles
 *
 * Returns the vehicles currently selected
 * by the revision.
 */
vehicles.get(
  "/programs/:programId/revisions/:revisionId/vehicles",
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

    const selected = revision.vehicles.map((revisionVehicle) => {
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
    });

    return c.json({ selectedVehicles: selected });
  },
);

/**
 * PUT /api/programs/:programId/revisions/:revisionId/vehicles
 *
 * Replaces the selected vehicle list.
 */
vehicles.put(
	"/programs/:programId/revisions/:revisionId/vehicles",
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

		const vehicleCatalogIds = (
			body as {
				vehicleCatalogIds?: unknown;
			}
		).vehicleCatalogIds;

		if (!Array.isArray(vehicleCatalogIds)) {
			throw badRequest("BAD_REQUEST", "vehicleCatalogIds must be an array");
		}

		if (
			vehicleCatalogIds.some(
				(id) => typeof id !== "number" || !Number.isInteger(id),
			)
		) {
			throw badRequest(
				"BAD_REQUEST",
				"vehicleCatalogIds must contain integer IDs",
			);
		}

		const uniqueIds = [...new Set(vehicleCatalogIds)];

		const invalidIds = uniqueIds.filter(
			(id) => !db.vehicles.some((vehicle) => vehicle.vehicleCatalogId === id),
		);

		if (invalidIds.length) {
			throw badRequest(
				"INVALID_VEHICLE",
				`Unknown vehicle catalog IDs: ${invalidIds.join(", ")}`,
			);
		}

		revision.vehicles = uniqueIds;

		/**
		 * Vehicle changes invalidate
		 * approval/submission state.
		 */
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

			vehicles: revision.vehicles.map((revisionVehicle) => {
				const vehicle = db.vehicles.find(
					(item) => item.vehicleCatalogId === revisionVehicle.vehicleCatalogId,
				);
				return {
					vehicleCatalogId: revisionVehicle.revisionVehicleId,
					label: vehicle
						? vehicleLabel(vehicle)
						: `Vehicle ${revisionVehicle.vehicleCatalogId}`,
				};
			}),

			approval: {
				isSubmitted: revision.approval.isSubmitted,

				approved: revision.approval.approved,
			},
		});
	},
);
