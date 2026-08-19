import { http } from "@/infra/api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type GeoLevel = "REGION" | "STATE" | "DMA" | "COUNTY";

export interface GeoNode {
	code: string;
	name: string;
}

export interface GeoSearchResult extends GeoNode {
	level: GeoLevel;
}

export interface GeoRuleDto {
	geoRuleId: number;
	isIncluded: boolean;
	level: GeoLevel;
	code: string;
	name: string;
}

export interface GeoRuleInput {
	isIncluded: boolean;
	level: GeoLevel;
	code: string;
	name: string;
}

export interface GeographyRegionsResponse {
	regions: GeoNode[];
}

export interface GeographyStatesResponse {
	states: GeoNode[];
}

export interface GeographyDmasResponse {
	dmas: GeoNode[];
}

export interface GeographyCountiesResponse {
	counties: GeoNode[];
}

export interface GeographySearchResponse {
	results: GeoSearchResult[];
}

export interface GeographyResponse {
	geoRules: GeoRuleDto[];
}

export interface UpdateGeographyRequest {
	geoRules: GeoRuleInput[];
}

/* -------------------------------------------------------------------------- */
/* Parameters                                                                 */
/* -------------------------------------------------------------------------- */

export interface GeographyStatesParams {
	region?: string;
}

export interface GeographyDmasParams {
	state: string;
	region?: string;
}

export interface GeographyCountiesParams {
	state: string;
	dma?: string;
}

export interface GeographySearchParams {
	search: string;
}

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

export const geographyApi = {
	async getRegions(): Promise<GeographyRegionsResponse> {
		const response =
			await http.get<GeographyRegionsResponse>("/geography/regions");

		return response.data;
	},

	async getStates(
		params?: GeographyStatesParams,
	): Promise<GeographyStatesResponse> {
		const response = await http.get<GeographyStatesResponse>(
			"/geography/states",
			{ params },
		);

		return response.data;
	},

	async getDmas(params: GeographyDmasParams): Promise<GeographyDmasResponse> {
		const response = await http.get<GeographyDmasResponse>("/geography/dmas", {
			params,
		});

		return response.data;
	},

	async getCounties(
		params: GeographyCountiesParams,
	): Promise<GeographyCountiesResponse> {
		const response = await http.get<GeographyCountiesResponse>(
			"/geography/counties",
			{ params },
		);

		return response.data;
	},

	async search(
		params: GeographySearchParams,
	): Promise<GeographySearchResponse> {
		const response = await http.get<GeographySearchResponse>(
			"/geography/search",
			{ params },
		);

		return response.data;
	},

	async getByRevision(
		programId: number,
		revisionId: number,
	): Promise<GeographyResponse> {
		const response = await http.get<GeographyResponse>(
			`/programs/${programId}/revisions/${revisionId}/geography`,
		);

		return response.data;
	},

	async update(
		programId: number,
		revisionId: number,
		payload: UpdateGeographyRequest,
	): Promise<GeographyResponse> {
		const response = await http.put<GeographyResponse>(
			`/programs/${programId}/revisions/${revisionId}/geography`,
			payload,
		);

		return response.data;
	},
};
