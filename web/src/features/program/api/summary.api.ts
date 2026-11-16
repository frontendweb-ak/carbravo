import { http } from "@/infra/api";
import type { ProgramStatusDto, RevisionStatusDto } from "./programs.api";
import type { GeoLevel } from "./geography.api";

export interface RevisionSummaryDto {
  program: {
    programId: number;
    programIdentifier: string;
    programName: string;
    programStatus: ProgramStatusDto;
  };
  revision: {
    revisionId: number;
    majorRevision: number;
    minorRevision: number;
    revisionLabel: string;
    revisionStatus: RevisionStatusDto;
    isMinorRevision: boolean;
  };
  setup: {
    programTypeCode: string;
    customerTypeCode: string;
    deliveryStartDate: string | null;
    deliveryEndDate: string | null;
  };
  vehicles: Array<{ vehicleCatalogId: number; label: string }>;
  geoRules: Array<{
    isIncluded: boolean;
    level: GeoLevel;
    code: string;
    name?: string;
  }>;
  components: Array<{ componentCode: string; componentName: string }>;
  mfpnText: string;
  disclosureText: string;
}

export interface UpdateRevisionTextRequestDto {
  mfpnText?: string;
  disclosureText?: string;
}

export interface UpdateRevisionTextResponseDto {
  mfpnText: string;
  disclosureText: string;
}

export const summaryApi = {
  async get(programId: number, revisionId: number): Promise<RevisionSummaryDto> {
    const response = await http.get<RevisionSummaryDto>(
      `/programs/${programId}/revisions/${revisionId}/summary`,
    );
    return response.data;
  },

  async updateText(
    programId: number,
    revisionId: number,
    payload: UpdateRevisionTextRequestDto,
  ): Promise<UpdateRevisionTextResponseDto> {
    const response = await http.patch<UpdateRevisionTextResponseDto>(
      `/programs/${programId}/revisions/${revisionId}/summary`,
      payload,
    );
    return response.data;
  },
};
