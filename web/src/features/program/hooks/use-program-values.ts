import { useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/infra/query/keys";
import { useAppMutation } from "@/infra/query/mutation";

import { valuesApi, type ReplaceProgramValuesRequestDto } from "../api/values.api";

export function useProgramValues(programId?: number, revisionId?: number) {
  return useQuery({
    queryKey:
      programId != null && revisionId != null
        ? queryKeys.values.byRevision(programId, revisionId)
        : ["values", "revision", "disabled"],
    queryFn: () => valuesApi.get(programId!, revisionId!),
    enabled: programId != null && revisionId != null,
  });
}

export function useUpdateProgramValues() {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: ({
      programId,
      revisionId,
      payload,
    }: {
      programId: number;
      revisionId: number;
      payload: ReplaceProgramValuesRequestDto;
    }) => valuesApi.replace(programId, revisionId, payload),
    showSuccess: false,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.values.byRevision(variables.programId, variables.revisionId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.summary.byRevision(variables.programId, variables.revisionId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.programs.detail(variables.programId),
      });
    },
  });
}
