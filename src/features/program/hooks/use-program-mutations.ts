// src/features/program/hooks/use-program-mutations.ts

import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/infra/query/keys";
import { useAppMutation } from "@/infra/query/mutation";
import { type CreateProgramRequestDto, programsApi } from "../api/programs.api";

/* -------------------------------------------------------------------------- */
/* Create program                                                             */
/* -------------------------------------------------------------------------- */

export function useCreateProgram() {
	const queryClient = useQueryClient();
	return useAppMutation({
		mutationFn: (payload: CreateProgramRequestDto) =>
			programsApi.createProgram(payload),
		successMessage: "Program created successfully.",
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
		},
	});
}

/* -------------------------------------------------------------------------- */
/* Update Setup                                                               */
/* -------------------------------------------------------------------------- */

export function useUpdateProgramSetup() {
	const queryClient = useQueryClient();

	return useAppMutation({
		mutationFn: ({
			programId,
			revisionId,
			payload,
		}: {
			programId: number;
			revisionId: number;
			payload: Parameters<typeof programsApi.updateSetup>[2];
		}) => programsApi.updateSetup(programId, revisionId, payload),

		showSuccess: false,

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.programs.detail(variables.programId),
			});
		},
	});
}
