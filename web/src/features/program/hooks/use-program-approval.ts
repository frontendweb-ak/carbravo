import { useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/infra/query/keys";
import { useAppMutation } from "@/infra/query/mutation";

import {
  revisionsApi,
  type ApproveRevisionRequestDto,
  type RejectRevisionRequestDto,
} from "../api/revisions.api";

interface RevisionActionVariables {
  programId: number;
  revisionId: number;
}

interface ExpireProgramVariables {
  programId: number;
}

function invalidateWorkflowQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  programId: number,
  revisionId?: number,
) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.programs.detail(programId) });
  void queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
  void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });

  if (revisionId != null) {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.approval.byRevision(programId, revisionId),
    });
    void queryClient.invalidateQueries({
      queryKey: queryKeys.programs.revisions(programId),
    });
    void queryClient.invalidateQueries({
      queryKey: queryKeys.summary.byRevision(programId, revisionId),
    });
  }
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

export function useSubmitRevision() {
  const queryClient = useQueryClient();
  return useAppMutation({
    mutationFn: ({ programId, revisionId }: RevisionActionVariables) =>
      revisionsApi.submit(programId, revisionId),
    successMessage: "Revision submitted for review.",
    onSuccess: (_, variables) =>
      invalidateWorkflowQueries(queryClient, variables.programId, variables.revisionId),
  });
}

export function useApproveRevision() {
  const queryClient = useQueryClient();
  return useAppMutation({
    mutationFn: ({
      programId,
      revisionId,
      payload,
    }: RevisionActionVariables & { payload?: ApproveRevisionRequestDto }) =>
      revisionsApi.approve(programId, revisionId, payload),
    successMessage: "Revision approved.",
    onSuccess: (_, variables) =>
      invalidateWorkflowQueries(queryClient, variables.programId, variables.revisionId),
  });
}

export function useRejectRevision() {
  const queryClient = useQueryClient();
  return useAppMutation({
    mutationFn: ({
      programId,
      revisionId,
      payload,
    }: RevisionActionVariables & { payload: RejectRevisionRequestDto }) =>
      revisionsApi.reject(programId, revisionId, payload),
    successMessage: "Revision returned to the author.",
    onSuccess: (_, variables) =>
      invalidateWorkflowQueries(queryClient, variables.programId, variables.revisionId),
  });
}

export function usePostRevisionToProduction() {
  const queryClient = useQueryClient();
  return useAppMutation({
    mutationFn: ({ programId, revisionId }: RevisionActionVariables) =>
      revisionsApi.postToProduction(programId, revisionId),
    successMessage: "Revision posted to production.",
    onSuccess: (_, variables) =>
      invalidateWorkflowQueries(queryClient, variables.programId, variables.revisionId),
  });
}

export function useExpireProgram() {
  const queryClient = useQueryClient();
  return useAppMutation({
    mutationFn: ({ programId }: ExpireProgramVariables) =>
      revisionsApi.expire(programId),
    successMessage: "Program expired.",
    onSuccess: (_, variables) =>
      invalidateWorkflowQueries(queryClient, variables.programId),
  });
}
