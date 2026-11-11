import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { ListProgramsParams, ProgramStatusDto } from "../api/programs.api";

export type ProgramWorkflowFilter =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "ACTIVE"
  | "EXPIRED";

function parseStatus(value: string | null): ProgramStatusDto | undefined {
  const status = value?.toUpperCase();
  return status === "DRAFT" || status === "ACTIVE" || status === "EXPIRED"
    ? status
    : undefined;
}

function parseWorkflowFilter(value: string | null): ProgramWorkflowFilter | undefined {
  switch (value?.toUpperCase()) {
    case "DRAFT":
    case "REVIEW":
    case "APPROVED":
    case "ACTIVE":
    case "EXPIRED":
      return value.toUpperCase() as ProgramWorkflowFilter;
    default:
      return undefined;
  }
}

function buildApiFilters(
  workflowStatus: ProgramWorkflowFilter | undefined,
): Pick<ListProgramsParams, "status" | "pendingApproval" | "page" | "size"> {
  switch (workflowStatus) {
    case "DRAFT":
    case "APPROVED":
      return { status: "DRAFT", pendingApproval: false, page: 0, size: 100 };
    case "REVIEW":
      return { pendingApproval: true, page: 0, size: 100 };
    case "ACTIVE":
      return { status: "ACTIVE", page: 0, size: 20 };
    case "EXPIRED":
      return { status: "EXPIRED", page: 0, size: 20 };
    default:
      return { page: 0, size: 20 };
  }
}

export function useProgramFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialWorkflowStatus =
    parseWorkflowFilter(searchParams.get("workflowStatus")) ??
    (searchParams.get("pendingApproval") === "true" ? "REVIEW" : undefined);

  const [filters, setFilters] = useState<ListProgramsParams>(() => ({
    ...buildApiFilters(initialWorkflowStatus),
    ...(!initialWorkflowStatus
      ? {
          status: parseStatus(searchParams.get("status")),
          pendingApproval:
            searchParams.get("pendingApproval") === "true" ? true : undefined,
        }
      : {}),
  }));

  const workflowStatus = initialWorkflowStatus;

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      status: undefined,
      pendingApproval: undefined,
      ...buildApiFilters(workflowStatus),
      search: current.search,
    }));
  }, [workflowStatus]);

  const setWorkflowStatus = (nextStatus?: ProgramWorkflowFilter) => {
    setFilters((current) => ({
      ...current,
      ...buildApiFilters(nextStatus),
      search: current.search,
    }));

    setSearchParams((current) => {
      if (nextStatus) current.set("workflowStatus", nextStatus);
      else current.delete("workflowStatus");

      if (nextStatus === "DRAFT" || nextStatus === "APPROVED") {
        current.set("status", "DRAFT");
        current.set("pendingApproval", "false");
      } else if (nextStatus === "REVIEW") {
        current.delete("status");
        current.set("pendingApproval", "true");
      } else if (nextStatus === "ACTIVE" || nextStatus === "EXPIRED") {
        current.set("status", nextStatus);
        current.delete("pendingApproval");
      } else {
        current.delete("status");
        current.delete("pendingApproval");
      }
      return current;
    });
  };

  const setStatus = (status?: ProgramStatusDto) => {
    setWorkflowStatus(status);
  };

  const setPendingApproval = (pendingApproval?: boolean) => {
    setFilters((current) => ({
      ...current,
      status: undefined,
      pendingApproval,
      page: 0,
    }));
    setSearchParams((current) => {
      current.delete("status");
      current.delete("workflowStatus");
      if (pendingApproval === undefined) current.delete("pendingApproval");
      else current.set("pendingApproval", String(pendingApproval));
      return current;
    });
  };

  const setSearch = (search: string) => {
    setFilters((current) => ({
      ...current,
      search: search.trim() || undefined,
      page: 0,
    }));
  };

  const setPage = (page: number) => {
    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  return {
    filters,
    workflowStatus,
    setFilters,
    setStatus,
    setWorkflowStatus,
    setPendingApproval,
    setSearch,
    setPage,
  };
}
