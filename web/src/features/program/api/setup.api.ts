import { http } from "@/infra/api";

export interface ProgramSetupDto {
  programName: string;
  programTypeCode: string;
  customerTypeCodes: string[];
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  financialProviderCode?: string | null;
  conditionCode?: string | null;
  conditionTier?: string | null;
  mileageCeiling?: number | null;
  topOfDeal?: boolean;
  vinException?: boolean;
  mfpnText?: string | null;
  disclosureText?: string | null;
  localeCode?: string;
  deliveryStartDate: string;
  deliveryEndDate: string;
  effectiveStartDate?: string | null;
  effectiveEndDate?: string | null;
  financeTerms?: number[];
  creditTiers?: string[];
}

export interface ProgramSetupResponseDto extends ProgramSetupDto {
  programId: number;
  programIdentifier: string;
  revisionId: number;
  majorRevision: number;
  minorRevision: number;
  revisionLabel: string;
  revisionStatus: "DRAFT" | "ACTIVE" | "EXPIRED";
}

export type SaveProgramSetupResponseDto = ProgramSetupResponseDto;

export const setupApi = {
  async get(programId: number, revisionId: number): Promise<ProgramSetupResponseDto> {
    const response = await http.get<ProgramSetupResponseDto>(
      `/programs/${programId}/revisions/${revisionId}/setup`,
    );
    return response.data;
  },

  async update(
    programId: number,
    revisionId: number,
    payload: ProgramSetupDto,
  ): Promise<SaveProgramSetupResponseDto> {
    const response = await http.put<SaveProgramSetupResponseDto>(
      `/programs/${programId}/revisions/${revisionId}/setup`,
      payload,
    );
    return response.data;
  },
};
