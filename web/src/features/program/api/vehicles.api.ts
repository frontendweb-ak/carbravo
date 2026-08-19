import { http } from "@/infra/api";

/* -------------------------------------------------------------------------- */
/* Revision vehicles                                                          */
/* -------------------------------------------------------------------------- */

export interface ProgramVehicleDto {
	vehicleCatalogId: number;
	label: string;
}

export interface SelectedProgramVehicleDto {
	revisionVehicleId: number;
	vehicleCatalogId: number;
	label: string;
}

export interface GetProgramVehiclesResponseDto {
	selectedVehicles: SelectedProgramVehicleDto[];
}

export interface UpdateProgramVehiclesRequestDto {
	vehicleCatalogIds: number[];
}

export interface UpdateProgramVehiclesResponseDto {
	programId: number;
	revisionId: number;
	vehicles: ProgramVehicleDto[];
	approval: {
		isSubmitted: boolean;
		approved: boolean;
	};
}

/* -------------------------------------------------------------------------- */
/* Vehicle catalog                                                            */
/* -------------------------------------------------------------------------- */

export interface VehicleCatalogDto {
	vehicleCatalogId: number;

	year: number;
	make: string;
	model: string;

	trimName?: string;
	bodyStyle?: string;

	segment: string;
	fuelType: string;

	drivetrain?: string;
	oemCode?: string;
}

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

export interface SearchVehiclesParams {
	search?: string;

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

/* -------------------------------------------------------------------------- */
/* Browse                                                                      */
/* -------------------------------------------------------------------------- */

export interface VehicleYearsResponseDto {
	years: number[];
}

export interface VehicleMakeDto {
	make: string;
	oemCode: string;
}

export interface VehicleMakesResponseDto {
	makes: VehicleMakeDto[];
}

export interface VehicleModelDto {
	model: string;
	division: string;
}

export interface VehicleModelsResponseDto {
	models: VehicleModelDto[];
}

/**
 * FR-004 defines a segments browse endpoint.
 *
 * Keep this DTO ready for the backend endpoint:
 *
 * GET /vehicles/segments
 */
export interface VehicleSegmentsResponseDto {
	segments: string[];
}

/* -------------------------------------------------------------------------- */
/* API                                                                         */
/* -------------------------------------------------------------------------- */

export const vehiclesApi = {
	/* ---------------------------------------------------------------------- */
	/* Revision vehicles                                                      */
	/* ---------------------------------------------------------------------- */

	async getForRevision(
		programId: number,
		revisionId: number,
	): Promise<GetProgramVehiclesResponseDto> {
		const response = await http.get<GetProgramVehiclesResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/vehicles`,
		);

		return response.data;
	},

	async updateForRevision(
		programId: number,
		revisionId: number,
		payload: UpdateProgramVehiclesRequestDto,
	): Promise<UpdateProgramVehiclesResponseDto> {
		const response = await http.put<UpdateProgramVehiclesResponseDto>(
			`/programs/${programId}/revisions/${revisionId}/vehicles`,
			payload,
		);

		return response.data;
	},

	/* ---------------------------------------------------------------------- */
	/* Browse                                                                  */
	/* ---------------------------------------------------------------------- */

	async getYears(): Promise<VehicleYearsResponseDto> {
		const response = await http.get<VehicleYearsResponseDto>("/vehicles/years");
		return response.data;
	},

	async getMakes(year: number): Promise<VehicleMakesResponseDto> {
		const response = await http.get<VehicleMakesResponseDto>(
			"/vehicles/makes",
			{ params: { year } },
		);

		return response.data;
	},

	async getModels(
		year: number,
		make: string,
	): Promise<VehicleModelsResponseDto> {
		const response = await http.get<VehicleModelsResponseDto>(
			"/vehicles/models",
			{ params: { year, make } },
		);
		return response.data;
	},

	/**
	 * FR-004:
	 *
	 * GET /vehicles/segments
	 *
	 * Backend must expose this endpoint before this method
	 * is used by the form.
	 */
	async getSegments(): Promise<VehicleSegmentsResponseDto> {
		const response =
			await http.get<VehicleSegmentsResponseDto>("/vehicles/segments");
		return response.data;
	},

	// Search
	async search(
		params?: SearchVehiclesParams,
	): Promise<SearchVehiclesResponseDto> {
		const response = await http.get<SearchVehiclesResponseDto>(
			"/vehicles/search",
			{ params },
		);
		return response.data;
	},
};
