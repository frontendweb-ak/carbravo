import { queryKeys } from "@/infra/query/keys";
import type { AppQueryOptions } from "@/infra/query/options";
import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "../api/dashboard.api";
import type {
	ActivityItem,
	DashboardSummary,
	ExpiringProgram,
} from "../model/dashboard.types";

export function useDashboardSummary(
	options?: AppQueryOptions<DashboardSummary>,
) {
	return useQuery({
		queryKey: queryKeys.dashboard.summary(),
		queryFn: dashboardApi.getSummary,
		...options,
	});
}

export function useDashboardActivity(
	options?: AppQueryOptions<{ items: ActivityItem[] }>,
) {
	return useQuery({
		queryKey: queryKeys.dashboard.activity(),
		queryFn: dashboardApi.getActivity,
		...options,
	});
}

export function useExpiringPrograms(
	options?: AppQueryOptions<{ items: ExpiringProgram[] }>,
) {
	return useQuery({
		queryKey: queryKeys.dashboard.expiring(),
		queryFn: dashboardApi.getExpiringPrograms,
		...options,
	});
}
