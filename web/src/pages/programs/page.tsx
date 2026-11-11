import { PageState, StatusChips, type StatusChipOption } from "@/components/ui";
import { useDashboardSummary } from "@/features/dashboard";
import { useProgramFilters, usePrograms } from "@/features/program";
import type { ProgramWorkflowStatus } from "@/features/program/model/programs.types";
import { ProgramPagination } from "@/features/program/components";
import { ProgramHeader } from "@/features/program/components/program-header";
import { ProgramList } from "@/features/program/components/program-list";

import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

type ProgramStatusTab = "all" | ProgramWorkflowStatus;

export default function ProgramsPage() {
  const navigate = useNavigate();
  const {
    filters,
    workflowStatus,
    setWorkflowStatus,
    setSearch,
    setPage,
  } = useProgramFilters();

  const summaryQuery = useDashboardSummary();
  const isClientWorkflowFilter =
    workflowStatus === "DRAFT" ||
    workflowStatus === "REVIEW" ||
    workflowStatus === "APPROVED";

  // The API only filters parent lifecycle and pending approval. Workflow
  // labels are derived from the current revision flags returned in each DTO.
  const apiFilters = {
    ...filters,
    page: isClientWorkflowFilter ? 0 : filters.page ?? 0,
    size: isClientWorkflowFilter ? 100 : filters.size ?? 20,
  };
  const programsQuery = usePrograms(apiFilters);

  const responseItems = programsQuery.data?.items ?? [];
  const matchingPrograms = workflowStatus
    ? responseItems.filter((program) => program.status === workflowStatus)
    : responseItems;

  const clientPageSize = 20;
  const programs = isClientWorkflowFilter
    ? matchingPrograms.slice(
        (filters.page ?? 0) * clientPageSize,
        (filters.page ?? 0) * clientPageSize + clientPageSize,
      )
    : matchingPrograms;

  const serverPagination = programsQuery.data?.pagination;
  const pagination = isClientWorkflowFilter
    ? {
        page: filters.page ?? 0,
        size: clientPageSize,
        totalElements: matchingPrograms.length,
        totalPages: Math.ceil(matchingPrograms.length / clientPageSize),
      }
    : serverPagination;

  const hasActiveFilters =
    Boolean(filters.search) || Boolean(workflowStatus);

  const summaryCounts = summaryQuery.data?.counts ?? [];
  const statusCounts = summaryQuery.data ? summaryQuery.data.counts : [];
  const totalCount = statusCounts.reduce((total, item) => total + item.total, 0);
  const workflowCounts = {
    draft: summaryCounts.find((item) => item.status === "DRAFT"),
    active: summaryCounts.find((item) => item.status === "ACTIVE"),
    expired: summaryCounts.find((item) => item.status === "EXPIRED"),
  };
  const reviewCount = Object.values(workflowCounts).reduce(
    (total, item) => total + (item?.pendingApproval ?? 0),
    0,
  );

  const options: StatusChipOption<ProgramStatusTab>[] = [
    { value: "all", label: "All", count: totalCount },
    {
      value: "DRAFT",
      label: "Draft",
      count: Math.max(0, (workflowCounts.draft?.total ?? 0) - (workflowCounts.draft?.pendingApproval ?? 0)),
    },
    { value: "REVIEW", label: "Review", count: reviewCount },
    { value: "APPROVED", label: "Approved" },
    {
      value: "ACTIVE",
      label: "Active",
      count: Math.max(0, (workflowCounts.active?.total ?? 0) - (workflowCounts.active?.pendingApproval ?? 0)),
    },
    { value: "EXPIRED", label: "Expired", count: workflowCounts.expired?.total ?? 0 },
  ];

  const handleStatusChange = (value: ProgramStatusTab) => {
    setWorkflowStatus(value === "all" ? undefined : value);
    setPage(0);
  };

  return (
    <Box sx={{ backgroundColor: "background.default" }}>
      <ProgramHeader search={filters.search ?? ""} onSearchChange={setSearch} />

      <StatusChips
        sx={{ mt: 3, mb: 3 }}
        options={options}
        value={workflowStatus ?? "all"}
        onChange={handleStatusChange}
      />

      <PageState
        status={
          programsQuery.isLoading
            ? "loading"
            : programsQuery.isError
              ? "error"
              : programs.length === 0
                ? "empty"
                : "ready"
        }
        onRetry={programsQuery.refetch}
        emptyTitle="No programs found"
        emptyDescription={
          hasActiveFilters
            ? "Try changing your filters or search criteria."
            : "Create your first incentive program to get started."
        }
        emptyAction={
          !hasActiveFilters ? (
            <Button onClick={() => navigate("/programs/new/setup")}>
              Create program
            </Button>
          ) : undefined
        }
      >
        <ProgramList
          programs={programs}
          isFetching={programsQuery.isFetching}
          onProgramClick={(programId) => navigate(`/programs/${programId}`)}
        />

        <Box sx={{ mt: 3 }}>
          <ProgramPagination
            page={pagination?.page ?? 0}
            size={pagination?.size ?? clientPageSize}
            totalElements={pagination?.totalElements ?? 0}
            totalPages={pagination?.totalPages ?? 0}
            disabled={programsQuery.isFetching}
            onPageChange={setPage}
          />
        </Box>
      </PageState>
    </Box>
  );
}
