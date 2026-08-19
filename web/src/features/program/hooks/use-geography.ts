import { useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/infra/query/keys";
import { useAppMutation } from "@/infra/query/mutation";

import {
	geographyApi,
	type GeographyCountiesParams,
	type GeographyDmasParams,
	type GeographySearchParams,
	type GeographyStatesParams,
	type UpdateGeographyRequest,
} from "../api/geography.api";

/* -------------------------------------------------------------------------- */
/* Reference geography                                                        */
/* -------------------------------------------------------------------------- */

export function useGeographyRegions() {
	return useQuery({
		queryKey: queryKeys.geography.regions(),
		queryFn: geographyApi.getRegions,
	});
}

export function useGeographyStates(params?: GeographyStatesParams) {
	return useQuery({
		queryKey: queryKeys.geography.states(params),
		queryFn: () => geographyApi.getStates(params),
	});
}

export function useGeographyDmas(params?: GeographyDmasParams) {
	return useQuery({
		queryKey: queryKeys.geography.dmas(params),
		queryFn: () => geographyApi.getDmas(params!),
		enabled: Boolean(params?.state),
	});
}

export function useGeographyCounties(params?: GeographyCountiesParams) {
	return useQuery({
		queryKey: queryKeys.geography.counties(params),
		queryFn: () => geographyApi.getCounties(params!),
		enabled: Boolean(params?.state),
	});
}

export function useGeographySearch(params?: GeographySearchParams) {
	return useQuery({
		queryKey: queryKeys.geography.search(params),
		queryFn: () => geographyApi.search(params!),
		enabled: Boolean(params?.search?.trim()),
	});
}

/* -------------------------------------------------------------------------- */
/* Revision geography                                                         */
/* -------------------------------------------------------------------------- */

export function useProgramGeography(programId?: number, revisionId?: number) {
	return useQuery({
		queryKey:
			programId != null && revisionId != null
				? queryKeys.geography.byRevision(programId, revisionId)
				: ["geography", "revision", "disabled"],

		queryFn: () => geographyApi.getByRevision(programId!, revisionId!),

		enabled: programId != null && revisionId != null,
	});
}

/* -------------------------------------------------------------------------- */
/* Update                                                                     */
/* -------------------------------------------------------------------------- */

export function useUpdateProgramGeography() {
	const queryClient = useQueryClient();

	return useAppMutation({
		mutationFn: ({
			programId,
			revisionId,
			payload,
		}: {
			programId: number;
			revisionId: number;
			payload: UpdateGeographyRequest;
		}) => geographyApi.update(programId, revisionId, payload),

		showSuccess: false,

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.geography.byRevision(
					variables.programId,
					variables.revisionId,
				),
			});

			queryClient.invalidateQueries({
				queryKey: queryKeys.programs.detail(variables.programId),
			});
		},
	});
}
