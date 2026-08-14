// src/routes/delta.ts

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
 * Compares the requested revision with the previous revision.
 *
 * OpenAPI response:
 *
 * {
 *   fromRevisionLabel: string | null,
 *   toRevisionLabel: string,
 *   changes: RevisionDeltaChange[]
 * }
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

  /**
   * Prefer the explicit copiedFromRevisionId relationship.
   *
   * Fall back to the immediately preceding revision
   * when the relationship is unavailable.
   */
  const previousRevision =
    revision.copiedFromRevisionId !== null
      ? db.revisions.find((item) => item.id === revision.copiedFromRevisionId)
      : findPreviousRevision(db.revisions, revision);

  /**
   * No previous revision.
   *
   * OpenAPI allows fromRevisionLabel to be null.
   */
  if (!previousRevision) {
    return c.json({
      fromRevisionLabel: null,

      toRevisionLabel: revisionLabel(revision),

      changes: [],
    });
  }

  const changes: RevisionDeltaChange[] = [];

  /**
   * --------------------------------------------------------
   * SETUP
   * --------------------------------------------------------
   *
   * Compare Setup fields individually.
   */
  compareSetup(changes, previousRevision.setup, revision.setup);

  /**
   * --------------------------------------------------------
   * COMPONENT / VALUES
   * --------------------------------------------------------
   */
  compareComponents(
    changes,
    previousRevision.values.components,
    revision.values.components,
  );

  /**
   * --------------------------------------------------------
   * VEHICLES
   * --------------------------------------------------------
   */
  compareVehicles(changes, previousRevision.vehicles, revision.vehicles, db);

  /**
   * --------------------------------------------------------
   * GEOGRAPHY
   * --------------------------------------------------------
   */
  compareGeography(changes, previousRevision.geography, revision.geography);

  return c.json({
    fromRevisionLabel: revisionLabel(previousRevision),

    toRevisionLabel: revisionLabel(revision),

    changes,
  });
});

/**
 * ============================================================
 * OpenAPI RevisionDelta change
 * ============================================================
 */

interface RevisionDeltaChange {
  entity: "SETUP" | "COMPONENT" | "VEHICLE" | "GEOGRAPHY";

  field: string;

  action: "ADDED" | "REMOVED" | "CHANGED";

  componentCode?: string;

  componentName?: string;

  label?: string;

  previousValue?: unknown;

  newValue?: unknown;

  changedBy?: string;

  changedAt?: string;
}

/**
 * ============================================================
 * Setup comparison
 * ============================================================
 */
function compareSetup<T extends object>(
  changes: RevisionDeltaChange[],
  before: T,
  after: T,
) {
  const beforeObject = before as Record<string, unknown>;
  const afterObject = after as Record<string, unknown>;

  const keys = new Set([
    ...Object.keys(beforeObject),
    ...Object.keys(afterObject),
  ]);

  for (const field of keys) {
    const previousValue = beforeObject[field];

    const newValue = afterObject[field];

    if (deepEqual(previousValue, newValue)) {
      continue;
    }

    if (previousValue === undefined && newValue !== undefined) {
      changes.push({
        entity: "SETUP",
        field,
        action: "ADDED",
        newValue,
      });

      continue;
    }

    if (previousValue !== undefined && newValue === undefined) {
      changes.push({
        entity: "SETUP",
        field,
        action: "REMOVED",
        previousValue,
      });

      continue;
    }

    changes.push({
      entity: "SETUP",
      field,
      action: "CHANGED",
      previousValue,
      newValue,
    });
  }
}
/**
 * ============================================================
 * Component comparison
 * ============================================================
 */

function compareComponents(
  changes: RevisionDeltaChange[],
  before: Array<{
    componentId: number;
    componentCode: string;
    componentName: string;
    sequenceNo: number;
    attributes: unknown[];
    vehicleOverrides: Record<string, unknown>[];
  }>,
  after: Array<{
    componentId: number;
    componentCode: string;
    componentName: string;
    sequenceNo: number;
    attributes: unknown[];
    vehicleOverrides: Record<string, unknown>[];
  }>,
) {
  const beforeByCode = new Map(
    before.map((component) => [component.componentCode, component]),
  );

  const afterByCode = new Map(
    after.map((component) => [component.componentCode, component]),
  );

  const codes = new Set([...beforeByCode.keys(), ...afterByCode.keys()]);

  for (const code of codes) {
    const previous = beforeByCode.get(code);

    const current = afterByCode.get(code);

    /**
     * Component added.
     */
    if (!previous && current) {
      changes.push({
        entity: "COMPONENT",
        field: "component",
        action: "ADDED",
        componentCode: current.componentCode,
        componentName: current.componentName,
        label: current.componentName,
        newValue: current,
      });

      continue;
    }

    /**
     * Component removed.
     */
    if (previous && !current) {
      changes.push({
        entity: "COMPONENT",
        field: "component",
        action: "REMOVED",
        componentCode: previous.componentCode,
        componentName: previous.componentName,
        label: previous.componentName,
        previousValue: previous,
      });

      continue;
    }

    if (!previous || !current) {
      continue;
    }

    /**
     * Component itself exists in both revisions.
     *
     * Compare its fields.
     */
    const fields: Array<keyof typeof current> = [
      "componentName",
      "sequenceNo",
      "attributes",
      "vehicleOverrides",
    ];

    for (const field of fields) {
      const previousValue = previous[field];

      const newValue = current[field];

      if (deepEqual(previousValue, newValue)) {
        continue;
      }

      changes.push({
        entity: "COMPONENT",
        field: String(field),
        action: "CHANGED",
        componentCode: current.componentCode,
        componentName: current.componentName,
        label: current.componentName,
        previousValue,
        newValue,
      });
    }
  }
}

/**
 * ============================================================
 * Vehicle comparison
 * ============================================================
 */

function compareVehicles(
  changes: RevisionDeltaChange[],
  before: Array<{
    revisionVehicleId: number;
    vehicleCatalogId: number;
  }>,
  after: Array<{
    revisionVehicleId: number;
    vehicleCatalogId: number;
  }>,
  db: Awaited<ReturnType<typeof readDb>>,
) {
  const beforeIds = new Set(before.map((vehicle) => vehicle.vehicleCatalogId));

  const afterIds = new Set(after.map((vehicle) => vehicle.vehicleCatalogId));

  /**
   * Added vehicles.
   */
  for (const vehicleCatalogId of afterIds) {
    if (beforeIds.has(vehicleCatalogId)) {
      continue;
    }

    const vehicle = db.vehicles.find(
      (item) => item.vehicleCatalogId === vehicleCatalogId,
    );

    changes.push({
      entity: "VEHICLE",
      field: "vehicleCatalogId",
      action: "ADDED",
      label: vehicle ? vehicleLabel(vehicle) : `Vehicle ${vehicleCatalogId}`,
      newValue: vehicleCatalogId,
    });
  }

  /**
   * Removed vehicles.
   */
  for (const vehicleCatalogId of beforeIds) {
    if (afterIds.has(vehicleCatalogId)) {
      continue;
    }

    const vehicle = db.vehicles.find(
      (item) => item.vehicleCatalogId === vehicleCatalogId,
    );

    changes.push({
      entity: "VEHICLE",
      field: "vehicleCatalogId",
      action: "REMOVED",
      label: vehicle ? vehicleLabel(vehicle) : `Vehicle ${vehicleCatalogId}`,
      previousValue: vehicleCatalogId,
    });
  }
}

/**
 * ============================================================
 * Geography comparison
 * ============================================================
 */

function compareGeography(
  changes: RevisionDeltaChange[],
  before: Array<{
    geoRuleId: number;
    isIncluded: boolean;
    level: "REGION" | "STATE" | "DMA" | "COUNTY";
    code: string;
    name?: string;
  }>,
  after: Array<{
    geoRuleId: number;
    isIncluded: boolean;
    level: "REGION" | "STATE" | "DMA" | "COUNTY";
    code: string;
    name?: string;
  }>,
) {
  /**
   * Use level + code as the business identity.
   *
   * geoRuleId may change because the PUT operation replaces
   * the complete geography snapshot.
   */
  const keyOf = (rule: {
    level: "REGION" | "STATE" | "DMA" | "COUNTY";
    code: string;
  }) => `${rule.level}:${rule.code}`;

  const beforeByKey = new Map(before.map((rule) => [keyOf(rule), rule]));

  const afterByKey = new Map(after.map((rule) => [keyOf(rule), rule]));

  const keys = new Set([...beforeByKey.keys(), ...afterByKey.keys()]);

  for (const key of keys) {
    const previous = beforeByKey.get(key);

    const current = afterByKey.get(key);

    if (!previous && current) {
      changes.push({
        entity: "GEOGRAPHY",
        field: "geographyRule",
        action: "ADDED",
        label: current.name ?? `${current.level}/${current.code}`,
        newValue: {
          isIncluded: current.isIncluded,
          level: current.level,
          code: current.code,
          name: current.name,
        },
      });

      continue;
    }

    if (previous && !current) {
      changes.push({
        entity: "GEOGRAPHY",
        field: "geographyRule",
        action: "REMOVED",
        label: previous.name ?? `${previous.level}/${previous.code}`,
        previousValue: {
          isIncluded: previous.isIncluded,
          level: previous.level,
          code: previous.code,
          name: previous.name,
        },
      });

      continue;
    }

    if (!previous || !current) {
      continue;
    }

    if (previous.isIncluded !== current.isIncluded) {
      changes.push({
        entity: "GEOGRAPHY",
        field: "isIncluded",
        action: "CHANGED",
        label: current.name ?? `${current.level}/${current.code}`,
        previousValue: previous.isIncluded,
        newValue: current.isIncluded,
      });
    }

    if (previous.name !== current.name) {
      changes.push({
        entity: "GEOGRAPHY",
        field: "name",
        action: "CHANGED",
        label: current.name ?? `${current.level}/${current.code}`,
        previousValue: previous.name,
        newValue: current.name,
      });
    }
  }
}

/**
 * ============================================================
 * Previous revision
 * ============================================================
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

/**
 * ============================================================
 * Helpers
 * ============================================================
 */

function revisionLabel(revision: {
  majorRevision: number;
  minorRevision: number;
}): string {
  return `${revision.majorRevision}.${revision.minorRevision}`;
}

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

  const aObject = a as Record<string, unknown>;

  const bObject = b as Record<string, unknown>;

  const keys = new Set([...Object.keys(aObject), ...Object.keys(bObject)]);

  for (const key of keys) {
    if (!deepEqual(aObject[key], bObject[key])) {
      return false;
    }
  }

  return true;
}
