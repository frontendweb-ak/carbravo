// src/features/program/hooks/use-program-mutations.ts

import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/infra/query/keys";
import { useAppMutation } from "@/infra/query/mutation";
import { type CreateProgramRequestDto, programsApi } from "../api/programs.api";
import { setupApi } from "../api/setup.api";

/* -------------------------------------------------------------------------- */
/* Create program                                                             */
/* -------------------------------------------------------------------------- */

export function useCreateProgram() {
	const queryClient = useQueryClient();

	return useAppMutation({
		mutationFn: (payload: CreateProgramRequestDto) =>
			programsApi.create(payload),

		successMessage: "Program created successfully.",

		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.programs.all,
			});

			if (data.programId != null) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.programs.detail(data.programId),
				});
			}
		},
	});
}

export function useCloneProgram() {
	const queryClient = useQueryClient();

	return useAppMutation({
		mutationFn: (programId: number) => programsApi.clone(programId),

		successMessage: "Program cloned successfully.",

		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.programs.all,
			});

			if (data.programId != null) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.programs.detail(data.programId),
				});
			}
		},
	});
}

export function useDeleteProgram() {
	const queryClient = useQueryClient();

	return useAppMutation({
		mutationFn: (programId: number) => programsApi.deleteProgram(programId),

		successMessage: "Program deleted successfully.",

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.programs.all,
			});
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
			payload: Parameters<typeof setupApi.update>[2];
		}) => setupApi.update(programId, revisionId, payload),

		showSuccess: false,

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.programs.detail(variables.programId),
			});

			queryClient.invalidateQueries({
				queryKey: queryKeys.setup.byRevision(
					variables.programId,
					variables.revisionId,
				),
			});
		},
	});
}