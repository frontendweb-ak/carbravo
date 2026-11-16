import { http } from "@/infra/api";

export type ProgramStatusDto = "DRAFT" | "ACTIVE" | "EXPIRED";
export type ProgramTypeDto = string;
export type RevisionStatusDto = "DRAFT" | "ACTIVE" | "EXPIRED";

export interface ListProgramsParams {
  status?: ProgramStatusDto;
  programType?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  pendingApproval?: boolean;
  page?: number;
  size?: number;
}

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

export interface ProgramSummaryDto {
  programId?: number;
  programIdentifier?: string;
  programName?: string;
  programStatus?: ProgramStatusDto;
  programType?: string;
  deliveryStartDate?: string;
  deliveryEndDate?: string;
  updatedAt?: string;
}

export interface ProgramListItemDto extends ProgramSummaryDto {
  currentRevision?: RevisionRefDto;
  hasDraft?: boolean;
}

export interface ProgramDetailDto extends ProgramSummaryDto {
  activeRevision?: RevisionRefDto | null;
  draftRevision?: RevisionRefDto | null;
}

export interface PaginationDto {
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

export interface ListProgramsResponseDto {
  content?: ProgramListItemDto[];
  pagination?: PaginationDto;
}

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

export const programsApi = {
  async getList(params?: ListProgramsParams): Promise<ListProgramsResponseDto> {
    const response = await http.get<ListProgramsResponseDto>("/programs", { params });
    return response.data;
  },

  async getDetail(programId: number): Promise<ProgramDetailDto> {
    const response = await http.get<ProgramDetailDto>(`/programs/${programId}`);
    return response.data;
  },

  async create(payload: CreateProgramRequestDto): Promise<CreateProgramResponseDto> {
    const response = await http.post<CreateProgramResponseDto>("/programs", payload);
    return response.data;
  },

  async deleteProgram(programId: number): Promise<void> {
    await http.delete(`/programs/${programId}`);
  },
};
