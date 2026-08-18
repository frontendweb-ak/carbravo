// src/features/program/api/programs.api.ts

import { http } from "@/infra/api";

// API Enums
export type ProgramStatusDto = "DRAFT" | "ACTIVE" | "EXPIRED";
export type ProgramTypeDto = "CUSTOMER_CASH" | "APR" | "BONUS_CASH";
export type RevisionStatusDto = "DRAFT" | "ACTIVE" | "EXPIRED";
export type PurchaseTypeDto = "CASH" | "FINANCE";
export type ConditionTierDto =
	| "CARBRAVO_CERTIFIED"
	| "MANUFACTURER_CERTIFIED"
	| "USED_INSPECTED"
	| "USED_AS_IS";
export type CreditTierDto = "A_PLUS" | "A1" | "A2" | "B";

// Api parameters
export interface ListProgramsParams {
	status?: ProgramStatusDto;
	programType?: ProgramTypeDto;
	search?: string;
	dateFrom?: string;
	dateTo?: string;
	pendingApproval?: boolean;
	page?: number;
	size?: number;
}

/* -------------------------------------------------------------------------- */
/* API DTOs                                                                   */
/* -------------------------------------------------------------------------- */

export interface RevisionRefDto {
	revisionId?: number;
	majorRevision?: number;
	minorRevision?: number;
	revisionLabel?: string;
	revisionStatus?: RevisionStatusDto;

	isMinorRevision?: boolean;
	isSubmitted?: boolean;
	approved?: boolean;
}
export interface ProgramVehicleDto {
	vehicleCatalogId: number;
	label: string;
}

export interface ProgramSummaryDto {
	programId?: number;
	programIdentifier?: string;
	programName?: string;

	programNumber?: string;
	incentiveCodes?: string;
	country?: string;

	programStatus?: ProgramStatusDto;
	programType?: ProgramTypeDto;

	deliveryStartDate?: string;
	deliveryEndDate?: string;

	effectiveStartDate?: string;
	effectiveEndDate?: string;

	vehicles?: ProgramVehicleDto[];
	geography?: string[];

	updatedAt?: string;
}

export interface ProgramListItemDto extends ProgramSummaryDto {
	currentRevision?: RevisionRefDto;
	hasDraft?: boolean;
}

export interface ProgramDetailDto extends ProgramSummaryDto {
	activeRevision?: RevisionRefDto;
	draftRevision?: RevisionRefDto;
}
export interface PaginationDto {
	page?: number;
	size?: number;
	totalElements?: number;
	totalPages?: number;
}
export interface ProgramStatusCountsDto {
	all?: number;
	draft?: number;
	review?: number;
	approved?: number;
	active?: number;
	expired?: number;
}
export interface ListProgramsResponseDto {
	content?: ProgramListItemDto[];
	pagination?: PaginationDto;
}

/* -------------------------------------------------------------------------- */
/* Create                                                                     */
/* -------------------------------------------------------------------------- */

export interface CreateProgramRequestDto {
	programName: string;
}

export interface CreateProgramResponseDto {
	programId?: number;
	programIdentifier?: string;
	programStatus?: ProgramStatusDto;

	revisionId?: number;
	revisionStatus?: RevisionStatusDto;

	majorRevision?: number;
	minorRevision?: number;
	revisionLabel?: string;
}

export interface CloneProgramResponseDto {
	programId?: number;
	programIdentifier?: string;
	programStatus?: ProgramStatusDto;

	revisionId?: number;
	revisionStatus?: RevisionStatusDto;

	majorRevision?: number;
	minorRevision?: number;
	revisionLabel?: string;
}

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

export const programsApi = {
	async getList(params?: ListProgramsParams): Promise<ListProgramsResponseDto> {
		const response = await http.get<ListProgramsResponseDto>("/programs", {
			params,
		});
		console.log("res", response.data);
		return response.data;
	},

	async getDetail(programId: number): Promise<ProgramDetailDto> {
		const response = await http.get<ProgramDetailDto>(`/programs/${programId}`);
		return response.data;
	},

	async create(
		payload: CreateProgramRequestDto,
	): Promise<CreateProgramResponseDto> {
		const response = await http.post<CreateProgramResponseDto>(
			"/programs",
			payload,
		);
		return response.data;
	},

	async clone(programId: number): Promise<CloneProgramResponseDto> {
		const response = await http.post<CloneProgramResponseDto>(
			`/programs/${programId}/clone`,
		);

		return response.data;
	},

	async deleteProgram(programId: number): Promise<void> {
		await http.delete(`/programs/${programId}`);
	},
};
