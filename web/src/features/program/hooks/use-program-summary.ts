import { useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/infra/query/keys";
import { useAppMutation } from "@/infra/query/mutation";

import {
  summaryApi,
  type UpdateRevisionTextRequestDto,
} from "../api/summary.api";

export function useProgramSummary(programId?: number, revisionId?: number) {
  return useQuery({
    queryKey:
      programId != null && revisionId != null
        ? queryKeys.summary.byRevision(programId, revisionId)
        : ["summary", "revision", "disabled"],
    queryFn: () => summaryApi.get(programId!, revisionId!),
    enabled: programId != null && revisionId != null,
  });
}

export function useUpdateProgramSummaryText() {
  const queryClient = useQueryClient();

  return useAppMutation<
    Awaited<ReturnType<typeof summaryApi.updateText>>,
    { programId: number; revisionId: number; payload: UpdateRevisionTextRequestDto }
  >({
    mutationFn: ({ programId, revisionId, payload }) =>
      summaryApi.updateText(programId, revisionId, payload),
    successMessage: "Marketing text saved.",
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.summary.byRevision(variables.programId, variables.revisionId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.setup.byRevision(variables.programId, variables.revisionId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.approval.byRevision(variables.programId, variables.revisionId),
      });
    },
  });
}
