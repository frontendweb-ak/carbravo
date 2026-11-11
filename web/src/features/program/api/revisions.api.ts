import { http } from "@/infra/api";

import type { ProgramStatusDto, RevisionStatusDto } from "./programs.api";

export interface PaginationDto {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface RevisionHistoryItemDto {
  revisionId: number;
  majorRevision: number;
  minorRevision: number;
  revisionLabel: string;
  revisionStatus: RevisionStatusDto;
  isMinorRevision: boolean;
  isSubmitted: boolean;
  approved: boolean;
  postedAt: string | null;
  postedBy: string | null;
  createdAt: string;
  createdBy: string;
}

export interface RevisionHistoryResponseDto {
  content: RevisionHistoryItemDto[];
  pagination: PaginationDto;
}

export interface CreateRevisionRequestDto {
  overwrite?: boolean;
}

export interface CreateRevisionResponseDto {
  programId: number;
  revisionId: number;
  majorRevision: number;
  minorRevision: number;
  revisionLabel: string;
  revisionStatus: RevisionStatusDto;
  isMinorRevision: boolean;
  copiedFromRevisionId: number | null;
}

export type CreateMinorRevisionRequestDto = CreateRevisionRequestDto;
export type CreateMinorRevisionResponseDto = CreateRevisionResponseDto;

export interface RevisionDetailDto {
  revisionId: number;
  majorRevision: number;
  minorRevision: number;
  revisionLabel: string;
  revisionStatus: RevisionStatusDto;
  isMinorRevision: boolean;
  programName: string;
  programType: string;
  vehicleCount: number;
  createdAt: string;
  createdBy: string;
  postedAt: string | null;
  postedBy: string | null;
}

export type RevisionDetailResponseDto = RevisionDetailDto;

export type AuditOperationDto =
  | "CREATE"
  | "UPDATE"
  | "SUBMIT"
  | "APPROVE"
  | "REJECT"
  | "REVISE"
  | "MINOR_REVISE"
  | "POST_TO_PRODUCTION"
  | "EXPIRE";

export interface ApprovalAuditEventDto {
  operation: AuditOperationDto;
  changedBy: string;
  changedAt: string;
  comment: string | null;
}

export interface RevisionApprovalDto {
  revisionId: number;
  majorRevision: number;
  minorRevision: number;
  revisionLabel: string;
  revisionStatus: RevisionStatusDto;
  isMinorRevision: boolean;
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
  auditTimeline: ApprovalAuditEventDto[];
}

export type SubmitRevisionResponseDto = RevisionApprovalDto;
export type ApproveRevisionResponseDto = RevisionApprovalDto;
export type RejectRevisionResponseDto = RevisionApprovalDto;

export interface ApproveRevisionRequestDto {
  comment?: string;
}

export interface RejectRevisionRequestDto {
  rejectionReason: string;
}

export interface PostRevisionResponseDto {
  revisionId: number;
  majorRevision: number;
  minorRevision: number;
  revisionLabel: string;
  revisionStatus: RevisionStatusDto;
  isMinorRevision: boolean;
}

export interface ExpireRevisionResponseDto {
  programId: number;
  programStatus: ProgramStatusDto;
}

export type RevisionDeltaEntityDto = "SETUP" | "COMPONENT" | "VEHICLE" | "GEOGRAPHY";
export type RevisionDeltaActionDto = "ADDED" | "REMOVED" | "CHANGED";

export interface RevisionDeltaChangeDto {
  entity: RevisionDeltaEntityDto;
  field: string;
  action: RevisionDeltaActionDto;
  componentCode?: string;
  componentName?: string;
  label?: string;
  previousValue?: unknown;
  newValue?: unknown;
  changedBy?: string;
  changedAt?: string;
}

export interface RevisionDeltaResponseDto {
  fromRevisionLabel: string | null;
  toRevisionLabel: string;
  changes: RevisionDeltaChangeDto[];
}

export const revisionsApi = {
  async getHistory(programId: number, page = 0, size = 25): Promise<RevisionHistoryResponseDto> {
    const response = await http.get<RevisionHistoryResponseDto>(
      `/programs/${programId}/revisions`,
      { params: { page, size } },
    );
    return response.data;
  },

  async getDetail(programId: number, revisionId: number): Promise<RevisionDetailResponseDto> {
    const response = await http.get<RevisionDetailResponseDto>(
      `/programs/${programId}/revisions/${revisionId}/detail`,
    );
    return response.data;
  },

  async create(programId: number, payload?: CreateRevisionRequestDto): Promise<CreateRevisionResponseDto> {
    const response = await http.post<CreateRevisionResponseDto>(
      `/programs/${programId}/revise`,
      undefined,
      { params: { overwrite: payload?.overwrite ?? false } },
    );
    return response.data;
  },

  async createMinor(
    programId: number,
    _revisionId: number,
    payload?: CreateMinorRevisionRequestDto,
  ): Promise<CreateMinorRevisionResponseDto> {
    const response = await http.post<CreateMinorRevisionResponseDto>(
      `/programs/${programId}/minor-revise`,
      undefined,
      { params: { overwrite: payload?.overwrite ?? false } },
    );
    return response.data;
  },

  async getApproval(programId: number, revisionId: number): Promise<RevisionApprovalDto> {
    const response = await http.get<RevisionApprovalDto>(
      `/programs/${programId}/revisions/${revisionId}/approval`,
    );
    return response.data;
  },

  async submit(programId: number, revisionId: number): Promise<SubmitRevisionResponseDto> {
    const response = await http.post<SubmitRevisionResponseDto>(
      `/programs/${programId}/revisions/${revisionId}/submit`,
    );
    return response.data;
  },

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

  async postToProduction(programId: number, revisionId: number): Promise<PostRevisionResponseDto> {
    const response = await http.post<PostRevisionResponseDto>(
      `/programs/${programId}/revisions/${revisionId}/post-to-production`,
    );
    return response.data;
  },

  async expire(programId: number): Promise<ExpireRevisionResponseDto> {
    const response = await http.post<ExpireRevisionResponseDto>(
      `/programs/${programId}/expire`,
    );
    return response.data;
  },

  async getDelta(programId: number, revisionId: number): Promise<RevisionDeltaResponseDto> {
    const response = await http.get<RevisionDeltaResponseDto>(
      `/programs/${programId}/revisions/${revisionId}/delta`,
    );
    return response.data;
  },
};
