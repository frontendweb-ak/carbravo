import { queryKeys } from "@/infra/query/keys";
import { useQuery } from "@tanstack/react-query";
import { type ListProgramsParams, programsApi } from "../api/programs.api";
import { revisionsApi } from "../api/revisions.api";
import { setupApi } from "../api/setup.api";
import { mapProgramDetail, mapProgramsList } from "../model/programs.mapper";
import { mapRevisionHistory } from "../model/revisions.mapper";

export function usePrograms(params?: ListProgramsParams) {
	return useQuery({
		queryKey: queryKeys.programs.list(params),
		queryFn: async () => {
			const response = await programsApi.getList(params);
			console.log("RE", response);
			return mapProgramsList(response);
		},
		placeholderData: (previousData) => previousData,
	});
}

/**
 * Load a single program for the editor.
 *
 * The detail endpoint is required here because the program list
 * only exposes `currentRevision` and `hasDraft`.
 *
 * The detail endpoint provides the actual `draftRevision`,
 * which the editor needs in order to load revision-scoped data.
 *
 * Example:
 *
 *   GET /programs/6
 *
 *   program
 *     ├── activeRevision: 106
 *     └── draftRevision: 107
 *
 * The editor will use revision 107.
 */
export function useProgram(programId?: number) {
	return useQuery({
		queryKey: queryKeys.programs.detail(programId!),
		queryFn: async () => {
			const response = await programsApi.getDetail(programId!);
			console.log(
				"PROGRAM DETAIL API RESPONSE",
				JSON.stringify(response, null, 2),
			);
			const program = mapProgramDetail(response);
			console.log("PROGRAM DETAIL MAPPED", JSON.stringify(program, null, 2));
			return program;
		},
		enabled: programId != null,
	});
}

// revisons
export function useProgramRevisionHistory(programId?: number) {
	return useQuery({
		queryKey: queryKeys.programs.revisions(programId!),
		queryFn: async () => {
			const response = await revisionsApi.getHistory(programId!);
			return mapRevisionHistory(response);
		},
		enabled: programId != null,
	});
}

/**
 * Load setup data for a specific program revision.
 *
 * The query only runs when both IDs are available.
 *
 * GET:
 * /programs/:programId/revisions/:revisionId/setup
 */
export function useProgramSetup(programId?: number, revisionId?: number) {
	return useQuery({
		queryKey: queryKeys.setup.byRevision(programId!, revisionId!),
		queryFn: () => setupApi.get(programId!, revisionId!),
		enabled: programId != null && revisionId != null,
	});
}