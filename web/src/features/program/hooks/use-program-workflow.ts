import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/infra/query/keys";
import { useAppMutation } from "@/infra/query/mutation";
import {
  revisionsApi,
  type ApproveRevisionRequestDto,
  type RejectRevisionRequestDto,
  type RevisionApprovalDto,
} from "../api/revisions.api";

function invalidateRevisionWorkflow(
  queryClient: QueryClient,
  programId: number,
  revisionId: number,
) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.approval.byRevision(programId, revisionId) });
  void queryClient.invalidateQueries({ queryKey: queryKeys.programs.detail(programId) });
  void queryClient.invalidateQueries({ queryKey: queryKeys.programs.revisions(programId) });
  void queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
  void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
}

export function useProgramApproval(programId?: number, revisionId?: number) {
  return useQuery({
    queryKey:
      programId != null && revisionId != null
        ? queryKeys.approval.byRevision(programId, revisionId)
        : ["approval", "revision", "disabled"],
    queryFn: () => revisionsApi.getApproval(programId!, revisionId!),
    enabled: programId != null && revisionId != null,
  });
}

export function useSubmitProgramRevision() {
  const queryClient = useQueryClient();
  return useAppMutation<
    RevisionApprovalDto,
    { programId: number; revisionId: number }
  >({
    mutationFn: ({ programId, revisionId }) => revisionsApi.submit(programId, revisionId),
    successMessage: "Revision submitted for review.",
    onSuccess: (_, variables) =>
      invalidateRevisionWorkflow(queryClient, variables.programId, variables.revisionId),
  });
}

export function useApproveProgramRevision() {
  const queryClient = useQueryClient();
  return useAppMutation<
    RevisionApprovalDto,
    { programId: number; revisionId: number; payload?: ApproveRevisionRequestDto }
  >({
    mutationFn: ({ programId, revisionId, payload }) =>
      revisionsApi.approve(programId, revisionId, payload),
    successMessage: "Revision approved.",
    onSuccess: (_, variables) =>
      invalidateRevisionWorkflow(queryClient, variables.programId, variables.revisionId),
  });
}

export function useRejectProgramRevision() {
  const queryClient = useQueryClient();
  return useAppMutation<
    RevisionApprovalDto,
    { programId: number; revisionId: number; payload: RejectRevisionRequestDto }
  >({
    mutationFn: ({ programId, revisionId, payload }) =>
      revisionsApi.reject(programId, revisionId, payload),
    successMessage: "Revision rejected and returned to draft.",
    onSuccess: (_, variables) =>
      invalidateRevisionWorkflow(queryClient, variables.programId, variables.revisionId),
  });
}

export function usePostProgramRevision() {
  const queryClient = useQueryClient();
  return useAppMutation<
    Awaited<ReturnType<typeof revisionsApi.postToProduction>>,
    { programId: number; revisionId: number }
  >({
    mutationFn: ({ programId, revisionId }) =>
      revisionsApi.postToProduction(programId, revisionId),
    successMessage: "Revision posted to production.",
    onSuccess: (_, variables) =>
      invalidateRevisionWorkflow(queryClient, variables.programId, variables.revisionId),
  });
}

export function useExpireProgram() {
  const queryClient = useQueryClient();
  return useAppMutation<
    Awaited<ReturnType<typeof revisionsApi.expire>>,
    { programId: number }
  >({
    mutationFn: ({ programId }) => revisionsApi.expire(programId),
    successMessage: "Program expired.",
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.programs.detail(variables.programId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}
