import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppQueryOptions } from "../../providers/QueryProvider";
import { api } from "../axios";
import { queryKeys } from "../queryKeys";

// --- Incentive Values ---
export const useIncentiveValues = (
	programId: number,
	revisionId: number,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.values.byRevision(programId, revisionId),
		queryFn: async () =>
			(await api.get(`/programs/${programId}/revisions/${revisionId}/values`))
				.data,
		enabled: !!programId && !!revisionId,
		...options,
	});

export const useReplaceIncentiveValues = (
	programId: number,
	revisionId: number,
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (components: any[]) =>
			(
				await api.put(`/programs/${programId}/revisions/${revisionId}/values`, {
					components,
				})
			).data,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.values.byRevision(programId, revisionId),
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

// --- Summary Hub ---
export const useRevisionSummary = (
	programId: number,
	revisionId: number,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.summary.byRevision(programId, revisionId),
		queryFn: async () =>
			(await api.get(`/programs/${programId}/revisions/${revisionId}/summary`))
				.data,
		enabled: !!programId && !!revisionId,
		...options,
	});

export const usePatchMinorRevisionText = (
	programId: number,
	revisionId: number,
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: {
			mfpnText?: string;
			disclosureText?: string;
		}) =>
			(
				await api.patch(
					`/programs/${programId}/revisions/${revisionId}/summary`,
					payload,
				)
			).data,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.summary.byRevision(programId, revisionId),
			});
		},
	});
};

// --- Approval Workflow ---
export const useApprovalState = (
	programId: number,
	revisionId: number,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.approval.byRevision(programId, revisionId),
		queryFn: async () =>
			(await api.get(`/programs/${programId}/revisions/${revisionId}/approval`))
				.data,
		enabled: !!programId && !!revisionId,
		...options,
	});

export const useSubmitRevision = (programId: number, revisionId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () =>
			(await api.post(`/programs/${programId}/revisions/${revisionId}/submit`))
				.data,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.approval.byRevision(programId, revisionId),
			});
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
		},
	});
};

export const useApproveRevision = (programId: number, revisionId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload?: { comment?: string }) =>
			(
				await api.post(
					`/programs/${programId}/revisions/${revisionId}/approve`,
					payload,
				)
			).data,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.approval.byRevision(programId, revisionId),
			});
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
		},
	});
};

export const useRejectRevision = (programId: number, revisionId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: { rejectionReason: string }) =>
			(
				await api.post(
					`/programs/${programId}/revisions/${revisionId}/reject`,
					payload,
				)
			).data,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.approval.byRevision(programId, revisionId),
			});
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
		},
	});
};

export const usePostToProduction = (programId: number, revisionId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () =>
			(
				await api.post(
					`/programs/${programId}/revisions/${revisionId}/post-to-production`,
				)
			).data,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
		},
	});
};
