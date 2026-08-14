// src/features/program/model/programs.mapper.ts

import type {
	PaginationDto,
	ProgramDetailDto,
	ProgramListItemDto,
	ProgramStatusCountsDto,
	RevisionRefDto,
} from "../api/programs.api";

import type {
	Program,
	ProgramDetail,
	ProgramRevision,
	ProgramsList,
	ProgramsPagination,
	ProgramsStatusCounts,
	ProgramWorkflowStatus,
} from "./programs.types";

/* -------------------------------------------------------------------------- */
/* Revision                                                                   */
/* -------------------------------------------------------------------------- */

function mapRevision(dto?: RevisionRefDto): ProgramRevision | null {
	if (!dto) return null;

	return {
		id: dto.revisionId ?? null,
		label: dto.revisionLabel ?? null,
		major: dto.majorRevision ?? null,
		minor: dto.minorRevision ?? null,
		status: dto.revisionStatus ?? null,
		isMinorRevision: dto.isMinorRevision ?? false,
		isSubmitted: dto.isSubmitted ?? false,
		approved: dto.approved ?? false,
	};
}

/* -------------------------------------------------------------------------- */
/* Program                                                                    */
/* -------------------------------------------------------------------------- */

export function mapProgram(dto: ProgramListItemDto): Program {
	if (dto.programId == null) {
		throw new Error("Program response is missing programId");
	}

	if (!dto.programStatus) {
		throw new Error(
			`Program ${dto.programId} response is missing programStatus`,
		);
	}

	if (!dto.programType) {
		throw new Error(`Program ${dto.programId} response is missing programType`);
	}

	return {
		id: dto.programId,

		identifier: dto.programIdentifier ?? "",
		name: dto.programName ?? "Untitled program",

		status: dto.programStatus,
		type: dto.programType,

		revision: mapRevision(dto.currentRevision),

		hasDraft: dto.hasDraft ?? false,

		deliveryStartDate: dto.deliveryStartDate ?? null,
		deliveryEndDate: dto.deliveryEndDate ?? null,

		updatedAt: dto.updatedAt ?? null,
	};
}

/* -------------------------------------------------------------------------- */
/* Pagination                                                                 */
/* -------------------------------------------------------------------------- */

export function mapProgramsPagination(dto?: PaginationDto): ProgramsPagination {
	return {
		page: dto?.page ?? 0,
		size: dto?.size ?? 20,
		totalElements: dto?.totalElements ?? 0,
		totalPages: dto?.totalPages ?? 0,
	};
}
export function mapProgramsStatusCounts(
	dto?: ProgramStatusCountsDto,
): ProgramsStatusCounts {
	return {
		all: dto?.all ?? 0,
		draft: dto?.draft ?? 0,
		active: dto?.active ?? 0,
		expired: dto?.expired ?? 0,
	};
}
/* -------------------------------------------------------------------------- */
/* List                                                                       */
/* -------------------------------------------------------------------------- */

export function mapProgramsList(dto: {
	content?: ProgramListItemDto[];
	pagination?: PaginationDto;
	statusCounts?: ProgramStatusCountsDto;
}): ProgramsList {
	return {
		items: (dto.content ?? []).map(mapProgram),
		pagination: mapProgramsPagination(dto.pagination),
		statusCounts: mapProgramsStatusCounts(dto.statusCounts),
	};
}

export function getWorkflowStatus(
	program: ProgramListItemDto,
): ProgramWorkflowStatus {
	if (program.programStatus === "ACTIVE") return "ACTIVE";
	if (program.programStatus === "EXPIRED") return "EXPIRED";
	if (
		program.currentRevision?.isSubmitted &&
		!program.currentRevision?.approved
	) {
		return "REVIEW";
	}

	if (
		program.currentRevision?.isSubmitted &&
		program.currentRevision?.approved
	) {
		return "APPROVED";
	}

	return "DRAFT";
}

/**
 * Program detail mapper.
 *
 * The detail API exposes both the active and draft revisions.
 *
 * `revision` represents the active/current revision context.
 * `draftRevision` represents the revision that the editor can modify.
 */
export function mapProgramDetail(dto: ProgramDetailDto): ProgramDetail {
	if (dto.programId == null) {
		throw new Error("Program detail response is missing programId");
	}

	if (!dto.programStatus) {
		throw new Error(
			`Program ${dto.programId} response is missing programStatus`,
		);
	}

	if (!dto.programType) {
		throw new Error(`Program ${dto.programId} response is missing programType`);
	}

	return {
		id: dto.programId,

		identifier: dto.programIdentifier ?? "",
		name: dto.programName ?? "Untitled program",

		status: dto.programStatus,
		type: dto.programType,

		revision: mapRevision(dto.activeRevision),
		activeRevision: mapRevision(dto.activeRevision),
		draftRevision: mapRevision(dto.draftRevision),

		hasDraft: dto.draftRevision != null,

		deliveryStartDate: dto.deliveryStartDate ?? null,
		deliveryEndDate: dto.deliveryEndDate ?? null,

		updatedAt: dto.updatedAt ?? null,
	};
}