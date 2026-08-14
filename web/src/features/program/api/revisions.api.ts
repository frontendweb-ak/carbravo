import { http } from "@/infra/api";

import type { RevisionStatusDto } from "./programs.api";

/* -------------------------------------------------------------------------- */
/* DTOs                                                                       */
/* -------------------------------------------------------------------------- */

export interface RevisionHistoryItemDto {
	revisionId: number;
	revisionLabel: string;

	majorRevision: number;
	minorRevision: number;

	status: RevisionStatusDto;

	isMinorRevision: boolean;

	createdAt: string;
	createdBy: string;

	postedAt: string | null;
	postedBy: string | null;

	isSubmitted: boolean;

	approved: boolean;
	approvedAt: string | null;
	approvedBy: string | null;

	rejectedAt: string | null;
	rejectedBy: string | null;
	rejectionReason: string | null;

	copiedFromRevisionId: number | null;
}

export interface RevisionHistoryResponseDto {
	programId: number;
	programIdentifier: string;
	programName: string;

	activeRevisionId: number | null;
	draftRevisionId: number | null;

	revisions: RevisionHistoryItemDto[];
}

/* -------------------------------------------------------------------------- */
/* Create Revision                                                            */
/* -------------------------------------------------------------------------- */

export interface CreateRevisionRequestDto {
	overwrite?: boolean;
}

export interface CreateRevisionResponseDto {
	programId: number;
	programIdentifier: string;
	programName: string;

	revisionId: number;
	revisionStatus: RevisionStatusDto;

	majorRevision: number;
	minorRevision: number;

	revisionLabel: string;

	copiedFromRevisionId: number | null;
}

/* -------------------------------------------------------------------------- */
/* Minor Revision                                                             */
/* -------------------------------------------------------------------------- */

export interface CreateMinorRevisionRequestDto {
	overwrite?: boolean;
}

export interface CreateMinorRevisionResponseDto {
	programId: number;
	programIdentifier: string;
	programName: string;

	revisionId: number;
	revisionStatus: RevisionStatusDto;

	majorRevision: number;
	minorRevision: number;

	revisionLabel: string;

	isMinorRevision: boolean;

	copiedFromRevisionId: number | null;
}

/* -------------------------------------------------------------------------- */
/* Revision Detail                                                            */
/* -------------------------------------------------------------------------- */

export interface RevisionDetailDto {
	revisionId: number;
	revisionLabel: string;

	majorRevision: number;
	minorRevision: number;

	status: RevisionStatusDto;

	isMinorRevision: boolean;

	createdAt: string;
	createdBy: string;

	postedAt: string | null;
	postedBy: string | null;

	copiedFromRevisionId: number | null;

	setup: unknown;
	vehicles: unknown;
	geography: unknown;
	values: unknown;
	summary: unknown;
	approval: RevisionApprovalDto;
}

export interface RevisionDetailResponseDto {
	programId: number;
	programIdentifier: string;
	programName: string;

	revision: RevisionDetailDto;
}

/* -------------------------------------------------------------------------- */
/* Approval                                                                   */
/* -------------------------------------------------------------------------- */

export interface RevisionApprovalDto {
	isSubmitted: boolean;

	submittedAt: string | null;
	submittedBy: string | null;

	approved: boolean;
	approvedAt: string | null;
	approvedBy: string | null;

	approvalComment: string | null;

	rejectedAt: string | null;
	rejectedBy: string | null;
	rejectionReason: string | null;
}

/* -------------------------------------------------------------------------- */
/* Submit                                                                     */
/* -------------------------------------------------------------------------- */

export interface SubmitRevisionResponseDto {
	programId: number;
	programIdentifier: string;
	programName: string;

	revisionId: number;
	revisionLabel: string;

	revisionStatus: RevisionStatusDto;

	isMinorRevision: boolean;

	approval: RevisionApprovalDto;
}

/* -------------------------------------------------------------------------- */
/* Approve                                                                    */
/* -------------------------------------------------------------------------- */

export interface ApproveRevisionRequestDto {
	approvalComment?: string;
}

export interface ApproveRevisionResponseDto {
	programId: number;
	programIdentifier: string;
	programName: string;

	revisionId: number;
	revisionLabel: string;

	revisionStatus: RevisionStatusDto;

	isMinorRevision: boolean;

	approval: RevisionApprovalDto;
}

/* -------------------------------------------------------------------------- */
/* Reject                                                                     */
/* -------------------------------------------------------------------------- */

export interface RejectRevisionRequestDto {
	rejectionReason: string;
}

export interface RejectRevisionResponseDto {
	programId: number;
	programIdentifier: string;
	programName: string;

	revisionId: number;
	revisionLabel: string;

	revisionStatus: RevisionStatusDto;

	isMinorRevision: boolean;

	approval: RevisionApprovalDto;
}

/* -------------------------------------------------------------------------- */
/* Post To Production                                                         */
/* -------------------------------------------------------------------------- */

export interface PostRevisionResponseDto {
	programId: number;
	programIdentifier: string;
	programName: string;

	programStatus: string;

	revisionId: number;
	revisionLabel: string;
	revisionStatus: RevisionStatusDto;

	majorRevision: number;
	minorRevision: number;

	previousActiveRevisionId: number | null;

	postedAt: string | null;
	postedBy: string | null;
}

/* -------------------------------------------------------------------------- */
/* Expire                                                                     */
/* -------------------------------------------------------------------------- */

export interface ExpireRevisionResponseDto {
	programId: number;
	programIdentifier: string;
	programStatus: string;

	revisionId: number;
	revisionLabel: string;
	revisionStatus: RevisionStatusDto;

	activeRevisionId: number | null;
	draftRevisionId: number | null;

	expiredAt: string;
	expiredBy: string;
}

/* -------------------------------------------------------------------------- */
/* Delta                                                                      */
/* -------------------------------------------------------------------------- */

export type RevisionDeltaChangeType = "ADDED" | "REMOVED" | "CHANGED";

export interface RevisionDeltaChangeDto {
	section: string;
	path: string;
	type: RevisionDeltaChangeType;

	before?: unknown;
	after?: unknown;
}

export interface RevisionDeltaResponseDto {
	programId: number;
	programIdentifier?: string;
	programName?: string;

	revisionId: number;
	revisionLabel?: string;

	previousRevisionId: number | null;
	previousRevisionLabel?: string;

	hasChanges: boolean;
	changes: RevisionDeltaChangeDto[];
}

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

export const revisionsApi = {
	/**
	 * GET /programs/:programId/revisions
	 *
	 * Get all revisions for a program.
	 */
	async getHistory(programId: number): Promise<RevisionHistoryResponseDto> {
		const response = await http.get<RevisionHistoryResponseDto>(
			`/programs/${programId}/revisions`,
		);

		return response.data;
	},

	/**
	 * GET /programs/:programId/revisions/:revisionId/detail
	 *
	 * Get the complete revision snapshot.
	 */
	async getDetail(
		programId: number,
		revisionId: number,
	): Promise<RevisionDetailResponseDto> {
		const response = await http.get<RevisionDetailResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/detail`,
		);

		return response.data;
	},

	/**
	 * POST /programs/:programId/revisions
	 *
	 * Create a new major revision from the active revision.
	 */
	async create(
		programId: number,
		payload?: CreateRevisionRequestDto,
	): Promise<CreateRevisionResponseDto> {
		const response = await http.post<CreateRevisionResponseDto>(
			`/programs/${programId}/revisions`,
			payload ?? {},
		);

		return response.data;
	},

	/**
	 * POST /programs/:programId/revisions/:revisionId/minor-revise
	 *
	 * Create a minor revision from an active revision.
	 */
	async createMinor(
		programId: number,
		revisionId: number,
		payload?: CreateMinorRevisionRequestDto,
	): Promise<CreateMinorRevisionResponseDto> {
		const response = await http.post<CreateMinorRevisionResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/minor-revise`,
			payload ?? {},
		);

		return response.data;
	},

	/**
	 * POST /programs/:programId/revisions/:revisionId/submit
	 *
	 * Submit a draft revision for approval.
	 */
	async submit(
		programId: number,
		revisionId: number,
	): Promise<SubmitRevisionResponseDto> {
		const response = await http.post<SubmitRevisionResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/submit`,
		);

		return response.data;
	},

	/**
	 * POST /programs/:programId/revisions/:revisionId/approve
	 *
	 * Approve a submitted revision.
	 */
	async approve(
		programId: number,
		revisionId: number,
		payload?: ApproveRevisionRequestDto,
	): Promise<ApproveRevisionResponseDto> {
		const response = await http.post<ApproveRevisionResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/approve`,
			payload ?? {},
		);

		return response.data;
	},

	/**
	 * POST /programs/:programId/revisions/:revisionId/reject
	 *
	 * Reject a submitted revision.
	 */
	async reject(
		programId: number,
		revisionId: number,
		payload: RejectRevisionRequestDto,
	): Promise<RejectRevisionResponseDto> {
		const response = await http.post<RejectRevisionResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/reject`,
			payload,
		);

		return response.data;
	},

	/**
	 * POST /programs/:programId/revisions/:revisionId/post-to-production
	 *
	 * Promote a draft revision to ACTIVE.
	 */
	async postToProduction(
		programId: number,
		revisionId: number,
	): Promise<PostRevisionResponseDto> {
		const response = await http.post<PostRevisionResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/post-to-production`,
		);

		return response.data;
	},

	/**
	 * POST /programs/:programId/revisions/:revisionId/expire
	 *
	 * Manually expire an active revision.
	 */
	async expire(
		programId: number,
		revisionId: number,
	): Promise<ExpireRevisionResponseDto> {
		const response = await http.post<ExpireRevisionResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/expire`,
		);

		return response.data;
	},

	/**
	 * GET /programs/:programId/revisions/:revisionId/delta
	 *
	 * Compare the revision with its previous revision.
	 */
	async getDelta(
		programId: number,
		revisionId: number,
	): Promise<RevisionDeltaResponseDto> {
		const response = await http.get<RevisionDeltaResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/delta`,
		);

		return response.data;
	},
};
