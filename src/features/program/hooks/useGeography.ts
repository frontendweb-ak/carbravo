import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppQueryOptions } from "../../providers/QueryProvider";
import { api } from "../axios";
import { queryKeys } from "../queryKeys";

export interface GeoRuleInput {
	isIncluded: boolean;
	level: "REGION" | "STATE" | "DMA" | "COUNTY";
	code: string;
	name?: string;
}

export const useGeoRegions = (options?: AppQueryOptions<any>) =>
	useQuery({
		queryKey: queryKeys.geography.regions(),
		queryFn: async () => (await api.get("/geography/regions")).data,
		...options,
	});

export const useGeoStates = (region?: string, options?: AppQueryOptions<any>) =>
	useQuery({
		queryKey: queryKeys.geography.states(region),
		queryFn: async () =>
			(await api.get("/geography/states", { params: { region } })).data,
		...options,
	});

export const useGeoDmas = (
	state: string,
	region?: string,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.geography.dmas(state, region),
		queryFn: async () =>
			(await api.get("/geography/dmas", { params: { state, region } })).data,
		enabled: !!state,
		...options,
	});

export const useGeoCounties = (
	state: string,
	dma?: string,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.geography.counties(state, dma),
		queryFn: async () =>
			(await api.get("/geography/counties", { params: { state, dma } })).data,
		enabled: !!state,
		...options,
	});

export const useSearchGeography = (
	searchTerm: string,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.geography.search(searchTerm),
		queryFn: async () =>
			(await api.get("/geography/search", { params: { search: searchTerm } }))
				.data,
		enabled: !!searchTerm,
		...options,
	});

export const useGeographyRules = (
	programId: number,
	revisionId: number,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.geography.rules(programId, revisionId),
		queryFn: async () =>
			(
				await api.get(
					`/programs/${programId}/revisions/${revisionId}/geography`,
				)
			).data,
		enabled: !!programId && !!revisionId,
		...options,
	});

export const useReplaceGeographyRules = (
	programId: number,
	revisionId: number,
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (geoRules: GeoRuleInput[]) =>
			(
				await api.put(
					`/programs/${programId}/revisions/${revisionId}/geography`,
					{ geoRules },
				)
			).data,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.geography.rules(programId, revisionId),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.summary.byRevision(programId, revisionId),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.approval.byRevision(programId, revisionId),
			});
		},
	});
};
