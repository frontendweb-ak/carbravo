// src/features/program/api/programs.api.ts

import { http } from "@/infra/api";

/* -------------------------------------------------------------------------- */
/* API enums                                                                  */
/* -------------------------------------------------------------------------- */

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

export interface ProgramSetupDto {
	programName: string;
	programNumber: string;
	incentiveCodes: string;
	country: string;

	deliveryStart: string;
	deliveryEnd: string;

	firstVisibleDate: string;
	firstVisibleTime?: string;

	programType: ProgramTypeDto;
	purchaseType: PurchaseTypeDto;

	mileageMaximum?: number;

	conditionTier: ConditionTierDto;
	creditTiers: CreditTierDto[];

	contact: string;

	flags: {
		vinException: boolean;
		topOfDeal: boolean;
		noAddOns: boolean;
	};
}

export interface SaveProgramSetupResponseDto {
	programId?: number;
	revisionId?: number;

	programIdentifier?: string;
	programName?: string;

	programStatus?: ProgramStatusDto;

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

	// setup
	async saveSetup(
		payload: ProgramSetupDto,
	): Promise<SaveProgramSetupResponseDto> {
		const response = await http.post<SaveProgramSetupResponseDto>(
			"/programs/setup",
			payload,
		);

		return response.data;
	},

	async updateSetup(
		programId: number,
		revisionId: number,
		payload: ProgramSetupDto,
	): Promise<SaveProgramSetupResponseDto> {
		const response = await http.patch<SaveProgramSetupResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/setup`,
			payload,
		);

		return response.data;
	},
};
