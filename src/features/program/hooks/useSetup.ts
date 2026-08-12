import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppQueryOptions } from "../../providers/QueryProvider";
import { api } from "../axios";
import { queryKeys } from "../queryKeys";

export interface SetupInput {
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

export const useReferenceSetup = (options?: AppQueryOptions<any>) =>
	useQuery({
		queryKey: queryKeys.setup.reference(),
		queryFn: async () => (await api.get("/reference/setup")).data,
		staleTime: 5 * 60 * 1000, // 5 min TTL
		...options,
	});

export const useSetup = (
	programId: number,
	revisionId: number,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.setup.byRevision(programId, revisionId),
		queryFn: async () =>
			(await api.get(`/programs/${programId}/revisions/${revisionId}/setup`))
				.data,
		enabled: !!programId && !!revisionId,
		...options,
	});

export const useSaveSetup = (programId: number, revisionId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: SetupInput) =>
			(
				await api.put(
					`/programs/${programId}/revisions/${revisionId}/setup`,
					payload,
				)
			).data,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.setup.byRevision(programId, revisionId),
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
