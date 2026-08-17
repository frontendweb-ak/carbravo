// src/lib/programs.ts

import {
  revisionLabel,
  type MockDb,
  type MockProgram,
  type MockRevision,
} from "../store.js";
import type { ProgramWorkflowStatus } from "../types/types.js";

import { notFound } from "./errors.js";

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

export function getProgramOrThrow(db: MockDb, programId: number): MockProgram {
  const program = db.programs.find(
    (item) => item.id === programId && item.deletedAt === null,
  );

  if (!program) {
    throw notFound("PROGRAM_NOT_FOUND", "Program not found");
  }

  return program;
}

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

export function getActiveRevision(db: MockDb, program: MockProgram) {
  if (!program.activeRevisionId) {
    return null;
  }

  return (
    db.revisions.find((revision) => revision.id === program.activeRevisionId) ??
    null
  );
}

export function getDraftRevision(db: MockDb, program: MockProgram) {
  if (!program.draftRevisionId) {
    return null;
  }

  return (
    db.revisions.find((revision) => revision.id === program.draftRevisionId) ??
    null
  );
}

export function revisionRef(revision: MockRevision) {
  return {
    revisionId: revision.id,
    majorRevision: revision.majorRevision,
    minorRevision: revision.minorRevision,
    revisionLabel: `${revision.majorRevision}.${revision.minorRevision}`,
    revisionStatus: revision.status,
    isMinorRevision: revision.isMinorRevision,
    isSubmitted: revision.approval.isSubmitted,
    approved: revision.approval.approved,
  };
}

export function programListItem(db: MockDb, program: MockProgram) {
  const active = getActiveRevision(db, program);
  const draft = getDraftRevision(db, program);

  const currentRevision = active
    ? {
        revisionId: active.id,
        majorRevision: active.majorRevision,
        minorRevision: active.minorRevision,
        revisionLabel: revisionLabel(active),
        revisionStatus: active.status,
        isMinorRevision: active.isMinorRevision,
        isSubmitted: active.approval.isSubmitted,
        approved: active.approval.approved,
      }
    : draft
      ? {
          revisionId: draft.id,
          majorRevision: draft.majorRevision,
          minorRevision: draft.minorRevision,
          revisionLabel: revisionLabel(draft),
          revisionStatus: draft.status,
          isMinorRevision: draft.isMinorRevision,
          isSubmitted: draft.approval.isSubmitted,
          approved: draft.approval.approved,
        }
      : undefined;

  return {
    programId: program.id,
    programIdentifier: program.identifier,
    programName: program.name,
    programStatus: program.status,
    programType: program.programType,
    currentRevision,
    hasDraft: Boolean(draft),
    deliveryStartDate: program.deliveryStartDate,
    deliveryEndDate: program.deliveryEndDate,
    updatedAt: program.updatedAt,
  };
}

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
        (revision.status === "ACTIVE" || revision.status === "EXPIRED"),
    )
    .sort((a, b) => {
      if (a.majorRevision !== b.majorRevision) {
        return b.majorRevision - a.majorRevision;
      }

      return b.minorRevision - a.minorRevision;
    });

  return revisions[0] ?? null;
}