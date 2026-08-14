// src/lib/programs.ts

import {
  revisionLabel,
  type MockDb,
  type MockProgram,
  type MockRevision,
} from "../store.js";

import { notFound } from "./errors.js";

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
