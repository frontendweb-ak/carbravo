import { http } from "@/infra/api";

export type IncentiveAttributeKey = "TERM_MONTHS" | "APR_RATE" | "CASH_AMOUNT";

export interface IncentiveAttributeDto {
  attributeId: number;
  key: IncentiveAttributeKey;
  numberValue: number | null;
  textValue: string | null;
}

export interface IncentiveComponentDto {
  componentId: number;
  componentCode: string;
  componentName: string;
  sequenceNo: number;
  attributes: IncentiveAttributeDto[];
  vehicleOverrides?: unknown[];
}

export interface ScopeVehicleDto {
  revisionVehicleId: number;
  vehicleCatalogId: number;
  label: string;
}

export interface ProgramValuesResponseDto {
  financeTerms: number[];
  scopeVehicles: ScopeVehicleDto[];
  components: IncentiveComponentDto[];
}

export interface IncentiveAttributeInput {
  key: IncentiveAttributeKey;
  numberValue?: number | null;
  textValue?: string | null;
}

export interface IncentiveComponentInput {
  componentCode: string;
  componentName: string;
  sequenceNo?: number;
  attributes: IncentiveAttributeInput[];
}

export interface ReplaceProgramValuesRequestDto {
  components: IncentiveComponentInput[];
}

export const valuesApi = {
  async get(programId: number, revisionId: number): Promise<ProgramValuesResponseDto> {
    const response = await http.get<ProgramValuesResponseDto>(
      `/programs/${programId}/revisions/${revisionId}/values`,
    );
    return response.data;
  },

  async replace(
    programId: number,
    revisionId: number,
    payload: ReplaceProgramValuesRequestDto,
  ): Promise<ProgramValuesResponseDto> {
    const response = await http.put<ProgramValuesResponseDto>(
      `/programs/${programId}/revisions/${revisionId}/values`,
      payload,
    );
    return response.data;
  },
};
