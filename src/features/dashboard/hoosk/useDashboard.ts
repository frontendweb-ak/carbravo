import { queryKeys } from "@/infra/query/keys";
import type { AppQueryOptions } from "@/infra/query/options";
import { useQuery } from "@tanstack/react-query";
import {
	DashboardApi,
	type ActivityItem,
	type DashboardSummary,
	type ExpiringProgram,
} from "../api/dashboard.api";

export const useDashboardSummary = (
	options?: AppQueryOptions<DashboardSummary>,
) =>
	useQuery({
		queryKey: queryKeys.dashboard.summary(),
		queryFn: () => DashboardApi.getSummary(),
		...options,
	});

export const useDashboardActivity = (
	options?: AppQueryOptions<{ items: ActivityItem[] }>,
) =>
	useQuery({
		queryKey: queryKeys.dashboard.activity(),
		queryFn: () => DashboardApi.getActivity(),
		...options,
	});

export const useExpiringPrograms = (
	options?: AppQueryOptions<{ items: ExpiringProgram[] }>,
) =>
	useQuery({
		queryKey: queryKeys.dashboard.expiring(),
		queryFn: () => DashboardApi.getExpiringPrograms(),
		...options,
	});
