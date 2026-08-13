// src/features/program/api/programs.api.ts

import { http } from "@/infra/api";

/* -------------------------------------------------------------------------- */
/* API enums                                                                  */
/* -------------------------------------------------------------------------- */

export type ProgramStatusDto = "DRAFT" | "ACTIVE" | "EXPIRED";

export type ProgramTypeDto = "CUSTOMER_CASH" | "APR" | "BONUS_CASH";

export type RevisionStatusDto = "DRAFT" | "ACTIVE" | "EXPIRED";

/* -------------------------------------------------------------------------- */
/* API parameters                                                             */
/* -------------------------------------------------------------------------- */

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

export interface ProgramListItemDto {
	programId?: number;
	programIdentifier?: string;
	programName?: string;

	programStatus?: ProgramStatusDto;
	programType?: ProgramTypeDto;

	currentRevision?: RevisionRefDto;

	hasDraft?: boolean;

	deliveryStartDate?: string;
	deliveryEndDate?: string;

	updatedAt?: string;
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
	active?: number;
	expired?: number;
}
export interface ListProgramsResponseDto {
	content?: ProgramListItemDto[];
	pagination?: PaginationDto;
	statusCounts?: ProgramStatusCountsDto;
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

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

export const programsApi = {
	async getList(params?: ListProgramsParams): Promise<ListProgramsResponseDto> {
		const response = await http.get<ListProgramsResponseDto>("/programs", {
			params,
		});

		return response.data;
	},

	async getDetail(programId: number) {
		const response = await http.get(`/programs/${programId}`);

		return response.data;
	},

	async createProgram(
		payload: CreateProgramRequestDto,
	): Promise<CreateProgramResponseDto> {
		const response = await http.post<CreateProgramResponseDto>(
			"/programs",
			payload,
		);

		return response.data;
	},

	async deleteProgram(programId: number) {
		const response = await http.delete(`/programs/${programId}`);

		return response.data;
	},
};
