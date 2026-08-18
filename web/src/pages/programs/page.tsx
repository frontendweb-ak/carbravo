import { PageState, StatusChips, type StatusChipOption } from "@/components/ui";
import { useDashboardSummary } from "@/features/dashboard";
import {
	useCloneProgram,
	useProgramFilters,
	usePrograms,
} from "@/features/program";
import type { ProgramStatusDto } from "@/features/program/api/programs.api";
import { ProgramPagination } from "@/features/program/components";
import { ProgramHeader } from "@/features/program/components/program-header";
import { ProgramList } from "@/features/program/components/program-list";

import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

type ProgramStatusTab = "all" | ProgramStatusDto;

const statusOptions = [
	{
		value: "DRAFT",
		label: "Draft",
	},
	{
		value: "ACTIVE",
		label: "Active",
	},
	{
		value: "EXPIRED",
		label: "Expired",
	},
] as const satisfies ReadonlyArray<{
	value: ProgramStatusDto;
	label: string;
}>;

export default function ProgramsPage() {
	const navigate = useNavigate();

	const { filters, setStatus, setSearch, setPage } = useProgramFilters();

	const summaryQuery = useDashboardSummary();

	const programsQuery = usePrograms(filters);

	const cloneProgram = useCloneProgram();

	const programs = programsQuery.data?.items ?? [];
	const pagination = programsQuery.data?.pagination;

	const hasActiveFilters =
		Boolean(filters.search) ||
		Boolean(filters.status) ||
		Boolean(filters.programType) ||
		Boolean(filters.dateFrom) ||
		Boolean(filters.dateTo) ||
		filters.pendingApproval === true;

	const summaryCounts = summaryQuery.data?.counts ?? [];

	const getStatusCount = (status: ProgramStatusDto) =>
		summaryCounts.find((item) => item.status === status)?.total ?? 0;

	const totalCount = summaryCounts.reduce(
		(total, item) => total + item.total,
		0,
	);

	const statusTabs: StatusChipOption<ProgramStatusTab>[] = [
		{
			value: "all",
			label: "All",
			count: totalCount,
		},
		...statusOptions.map((option) => ({
			value: option.value,
			label: option.label,
			count: getStatusCount(option.value),
		})),
	];

	const handleStatusChange = (value: ProgramStatusTab) => {
		setStatus(value === "all" ? undefined : value);
		setPage(0);
	};

	const handleClone = (programId: number) => {
		cloneProgram.mutate(programId, {
			onSuccess: ({ programId }) => {
				if (programId) {
					navigate(`/programs/${programId}`);
				}
			},
		});
	};

	return (
		<Box
			sx={{
				backgroundColor: "background.default",
			}}
		>
			<ProgramHeader search={filters.search ?? ""} onSearchChange={setSearch} />

			<StatusChips
				sx={{
					mt: 3,
					mb: 3,
				}}
				options={statusTabs}
				value={filters.status ?? "all"}
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
					onClone={handleClone}
				/>

				<Box sx={{ mt: 3 }}>
					<ProgramPagination
						page={pagination?.page ?? 0}
						size={pagination?.size ?? filters.size ?? 20}
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
