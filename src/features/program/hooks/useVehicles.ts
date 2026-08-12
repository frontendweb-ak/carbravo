import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppQueryOptions } from "../../providers/QueryProvider";
import { api } from "../axios";
import { queryKeys } from "../queryKeys";

export const useVehicleYears = (
	options?: AppQueryOptions<{ years: number[] }>,
) =>
	useQuery({
		queryKey: queryKeys.vehicles.years(),
		queryFn: async () =>
			(await api.get<{ years: number[] }>("/vehicles/years")).data,
		...options,
	});

export const useVehicleMakes = (year: number, options?: AppQueryOptions<any>) =>
	useQuery({
		queryKey: queryKeys.vehicles.makes(year),
		queryFn: async () =>
			(await api.get("/vehicles/makes", { params: { year } })).data,
		enabled: !!year,
		...options,
	});

export const useVehicleModels = (
	year: number,
	make: string,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.vehicles.models(year, make),
		queryFn: async () =>
			(await api.get("/vehicles/models", { params: { year, make } })).data,
		enabled: !!year && !!make,
		...options,
	});

export const useSearchVehicles = (
	params: Record<string, unknown>,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.vehicles.search(params),
		queryFn: async () => (await api.get("/vehicles/search", { params })).data,
		...options,
	});

export const useSelectedVehicles = (
	programId: number,
	revisionId: number,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.vehicles.selected(programId, revisionId),
		queryFn: async () =>
			(await api.get(`/programs/${programId}/revisions/${revisionId}/vehicles`))
				.data,
		enabled: !!programId && !!revisionId,
		...options,
	});

export const useReplaceVehicles = (programId: number, revisionId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vehicleCatalogIds: number[]) =>
			(
				await api.put(
					`/programs/${programId}/revisions/${revisionId}/vehicles`,
					{ vehicleCatalogIds },
				)
			).data,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.vehicles.selected(programId, revisionId),
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
