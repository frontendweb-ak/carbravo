import { queryKeys } from "@/infra/query/keys";
import type { AppQueryOptions } from "@/infra/query/options";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	ProgramsApi,
	type CreateProgramPayload,
	type ListProgramsParams,
} from "../api/programs.api";

export const useProgramsList = (
	params?: ListProgramsParams,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.programs.list(params),
		queryFn: () => ProgramsApi.getList(params),
		...options,
	});

export const useProgramDetail = (
	programId: number,
	options?: AppQueryOptions<any>,
) =>
	useQuery({
		queryKey: queryKeys.programs.detail(programId),
		queryFn: () => ProgramsApi.getDetail(programId),
		enabled: !!programId,
		...options,
	});

export const useCreateProgram = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateProgramPayload) =>
			ProgramsApi.createProgram(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
		},
	});
};

export const useDeleteProgram = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (programId: number) => ProgramsApi.deleteProgram(programId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
		},
	});
};
