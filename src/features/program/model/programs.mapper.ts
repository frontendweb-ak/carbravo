// src/features/program/model/programs.mapper.ts

import type {
	ConditionTierDto,
	CreditTierDto,
	PaginationDto,
	ProgramListItemDto,
	ProgramSetupDto,
	ProgramStatusCountsDto,
	ProgramTypeDto,
	PurchaseTypeDto,
} from "../api/programs.api";
import type { SetupFormValues } from "../schema";

import type {
	Program,
	ProgramRevision,
	ProgramsList,
	ProgramsPagination,
	ProgramsStatusCounts,
} from "./programs.types";

/* -------------------------------------------------------------------------- */
/* Revision                                                                   */
/* -------------------------------------------------------------------------- */

function mapRevision(
	dto?: ProgramListItemDto["currentRevision"],
): ProgramRevision | null {
	if (!dto) {
		return null;
	}

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

/* -------------------------------------------------------------------------- */
/* Setup mapper                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Form -> API DTO
 *
 * Keep this conversion here rather than leaking React Hook Form values
 * into the API layer.
 */
export function mapSetupFormToDto(values: SetupFormValues): ProgramSetupDto {
	return {
		programName: values.programName,
		programNumber: values.programNumber,
		incentiveCodes: values.incentiveCodes,
		country: values.country,

		deliveryStart: values.deliveryStart,
		deliveryEnd: values.deliveryEnd,

		firstVisibleDate: values.firstVisibleDate,
		firstVisibleTime: values.firstVisibleTime || undefined,

		programType: values.programType as ProgramTypeDto,
		purchaseType: values.purchaseType as PurchaseTypeDto,

		mileageMaximum:
			values.mileageMaximum === undefined ||
			values.mileageMaximum === null ||
			values.mileageMaximum === 0
				? undefined
				: Number(values.mileageMaximum),

		conditionTier: values.conditionTier as ConditionTierDto,

		creditTiers: values.creditTiers as CreditTierDto[],

		contact: values.contact,

		flags: {
			vinException: values.flags.vinException,
			topOfDeal: values.flags.topOfDeal,
			noAddOns: values.flags.noAddOns,
		},
	};
}