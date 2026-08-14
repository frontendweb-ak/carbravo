import { http } from "@/infra/api";

/* -------------------------------------------------------------------------- */
/* API DTOs                                                                   */
/* -------------------------------------------------------------------------- */
export interface ProgramSetupDto {
	programName: string;

	programTypeCode: string;
	purchaseType: string;

	customerTypeCodes: string[];

	contactName: string | null;
	contactEmail: string | null;
	contactPhone: string | null;

	financialProviderCode: string | null;
	conditionCode: string;

	mileageCeiling: number | null;

	topOfDeal: boolean;
	vinException: boolean;

	mfpnText: string | null;
	disclosureText: string | null;

	localeCode: string;

	deliveryStartDate: string | null;
	deliveryEndDate: string | null;

	effectiveStartDate: string | null;
	effectiveEndDate: string | null;

	financeTerms: number[];
	creditTiers: string[];
}

export interface ProgramSetupResponseDto extends ProgramSetupDto {
	programId: number;
	programIdentifier: string;

	revisionId: number;

	majorRevision: number;
	minorRevision: number;

	revisionLabel: string;
	revisionStatus: string;
}

export type SaveProgramSetupResponseDto = ProgramSetupResponseDto;
/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

export const setupApi = {
	/**
	 * Get setup data for an existing program revision.
	 *
	 * GET /programs/:programId/revisions/:revisionId/setup
	 */
	async get(
		programId: number,
		revisionId: number,
	): Promise<ProgramSetupResponseDto> {
		const response = await http.get<ProgramSetupResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/setup`,
		);

		return response.data;
	},


	/**
	 * Update setup for an existing draft revision.
	 *
	 * PUT /programs/:programId/revisions/:revisionId/setup
	 */
	async update(
		programId: number,
		revisionId: number,
		payload: ProgramSetupDto,
	): Promise<SaveProgramSetupResponseDto> {
		console.log("UPDATE", programId, revisionId, payload);
		const response = await http.put<SaveProgramSetupResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/setup`,
			payload,
		);

		console.log("RES", response);
		return response.data;
	},
};
