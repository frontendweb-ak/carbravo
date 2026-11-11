import { http } from "@/infra/api";

export interface SelectedProgramVehicleDto {
  revisionVehicleId: number;
  vehicleCatalogId: number;
  year: number;
  make: string;
  model: string;
  trimName?: string;
  segment: string;
}

export interface RevisionVehiclesResponseDto {
  selectedVehicles: SelectedProgramVehicleDto[];
}

export interface UpdateProgramVehiclesRequestDto {
  vehicleCatalogIds: number[];
}

export interface VehicleCatalogDto {
  vehicleCatalogId: number;
  vehicleId: string;
  year: number;
  make: string;
  model: string;
  trimName?: string;
  bodyStyle?: string;
  segment: string;
  fuelType: string;
  drivetrain?: string;
}

export interface SearchVehiclesParams {
  year?: number;
  make?: string;
  model?: string;
  segment?: string;
  fuelType?: string;
  oemCode?: string;
}

export interface SearchVehiclesResponseDto {
  vehicles: VehicleCatalogDto[];
}

export interface VehicleYearsResponseDto {
  years: number[];
}

export interface VehicleMakeDto {
  make: string;
  oemCode?: string;
}

export interface VehicleMakesResponseDto {
  makes: VehicleMakeDto[];
}

export interface VehicleModelDto {
  model: string;
  division?: string;
}

export interface VehicleModelsResponseDto {
  models: VehicleModelDto[];
}

export const vehiclesApi = {
  async getForRevision(programId: number, revisionId: number): Promise<RevisionVehiclesResponseDto> {
    const response = await http.get<RevisionVehiclesResponseDto>(
      `/programs/${programId}/revisions/${revisionId}/vehicles`,
    );
    return response.data;
  },

  async updateForRevision(
    programId: number,
    revisionId: number,
    payload: UpdateProgramVehiclesRequestDto,
  ): Promise<RevisionVehiclesResponseDto> {
    const response = await http.put<RevisionVehiclesResponseDto>(
      `/programs/${programId}/revisions/${revisionId}/vehicles`,
      payload,
    );
    return response.data;
  },

  async getYears(): Promise<VehicleYearsResponseDto> {
    const response = await http.get<VehicleYearsResponseDto>("/vehicles/years");
    return response.data;
  },

  async getMakes(year: number): Promise<VehicleMakesResponseDto> {
    const response = await http.get<VehicleMakesResponseDto>("/vehicles/makes", {
      params: { year },
    });
    return response.data;
  },

  async getModels(year: number, make: string): Promise<VehicleModelsResponseDto> {
    const response = await http.get<VehicleModelsResponseDto>("/vehicles/models", {
      params: { year, make },
    });
    return response.data;
  },

  async search(params?: SearchVehiclesParams): Promise<SearchVehiclesResponseDto> {
    const response = await http.get<SearchVehiclesResponseDto>("/vehicles/search", {
      params,
    });
    return response.data;
  },
};
