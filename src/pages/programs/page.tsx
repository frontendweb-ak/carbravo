import {
	Button,
	Container,
	type FilterTab,
	FilterTabs,
	Input,
	PageState,
} from "@/components/ui";
import { usePrograms } from "@/features/program";
import type {
	ListProgramsParams,
	ProgramStatusDto,
} from "@/features/program/api/programs.api";
import { ProgramPagination } from "@/features/program/components";
import { ProgramList } from "@/features/program/components/program-list";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ProgramStatusTab = "all" | ProgramStatusDto;
export default function ProgramsPage() {
	const navigate = useNavigate();

	const [filters, setFilters] = useState<ListProgramsParams>({
		page: 0,
		size: 20,
	});

	const { data, isLoading, isFetching, isError, refetch } =
		usePrograms(filters);

	const programs = data?.items ?? [];
	const pagination = data?.pagination;
	const statusCounts = data?.statusCounts;

	const hasActiveFilters =
		Boolean(filters.search) ||
		Boolean(filters.status) ||
		Boolean(filters.programType) ||
		Boolean(filters.dateFrom) ||
		Boolean(filters.dateTo) ||
		filters.pendingApproval === true;

	const handlePageChange = (page: number) => {
		setFilters((current) => ({ ...current, page }));
	};

	const handleSearch = (search: string) => {
		setFilters((current) => ({
			...current,
			search: search.trim() || undefined,
			page: 0,
		}));
	};

	const handleStatusChange = (status?: ListProgramsParams["status"]) => {
		setFilters((current) => ({
			...current,
			status,
			page: 0,
		}));
	};

	const handleProgramTypeChange = (
		programType?: ListProgramsParams["programType"],
	) => {
		setFilters((current) => ({
			...current,
			programType,
			page: 0,
		}));
	};

	const handleDateFromChange = (dateFrom?: string) => {
		setFilters((current) => ({
			...current,
			dateFrom,
			page: 0,
		}));
	};

	const handleDateToChange = (dateTo?: string) => {
		setFilters((current) => ({
			...current,
			dateTo,
			page: 0,
		}));
	};

	const handlePendingApprovalChange = (pendingApproval?: boolean) => {
		setFilters((current) => ({
			...current,
			pendingApproval,
			page: 0,
		}));
	};

	const handleClearFilters = () => {
		setFilters((current) => ({
			page: 0,
			size: current.size ?? 20,
		}));
	};
	const handleCreate = () => {
		navigate("/programs/new/setup");
	};

	const statusTabs = [
		{
			value: "all",
			label: "All",
			count: statusCounts?.all ?? 0,
		},
		{
			value: "DRAFT",
			label: "Draft",
			count: statusCounts?.draft ?? 0,
		},
		{
			value: "ACTIVE",
			label: "Active",
			count: statusCounts?.active ?? 0,
		},
		{
			value: "EXPIRED",
			label: "Expired",
			count: statusCounts?.expired ?? 0,
		},
	] satisfies FilterTab<ProgramStatusTab>[];

	return (
		<main className="min-h-[calc(100vh-60px)] bg-background">
			<Container size="2xl" className="py-7">
				<div className="flex items-center justify-between gap-4">
					<h1 className="text-2xl font-bold text-foreground">Programs</h1>
					<div className="relative w-full max-w-70">
						<Input
							value={filters.search ?? ""}
							leftIcon={<Search />}
							onChange={(event) => handleSearch(event.target.value)}
							placeholder="Search programs, codes, vehicles..."
							aria-label="Search programs, codes, vehicles"
							className="h-9 pl-8 bg-white"
						/>
					</div>
				</div>

				{/* Status tabs */}
				<div className="mt-6">
					<FilterTabs
						items={statusTabs}
						value={filters.status ?? "all"}
						onValueChange={(value) => {
							setFilters((current) => ({
								...current,
								status: value === "all" ? undefined : value,
								page: 0,
							}));
						}}
					/>
				</div>

				{/* Filters */}
				{/* <div className="mt-4">
					<ProgramFilters
						search={filters.search ?? ""}
						programType={filters.programType}
						dateFrom={filters.dateFrom}
						dateTo={filters.dateTo}
						pendingApproval={filters.pendingApproval}
						onSearchChange={handleSearch}
						onProgramTypeChange={handleProgramTypeChange}
						onDateFromChange={handleDateFromChange}
						onDateToChange={handleDateToChange}
						onPendingApprovalChange={handlePendingApprovalChange}
						onClear={handleClearFilters}
					/>
				</div> */}

				{/* Content */}
				<div className="mt-5">
					<PageState
						status={
							isLoading
								? "loading"
								: isError
									? "error"
									: programs.length === 0
										? "empty"
										: "ready"
						}
						onRetry={refetch}
						emptyTitle="No programs found"
						emptyDescription={
							hasActiveFilters
								? "Try changing your filters or search criteria."
								: "Create your first incentive program to get started."
						}
						emptyAction={
							!hasActiveFilters ? (
								<Button onClick={handleCreate}>Create program</Button>
							) : undefined
						}
					>
						<ProgramList
							programs={programs}
							isFetching={isFetching}
							onProgramClick={(programId) => navigate(`/programs/${programId}`)}
						/>
						<div className="mt-5">
							<ProgramPagination
								page={pagination?.page ?? 0}
								size={pagination?.size ?? filters.size ?? 20}
								totalElements={pagination?.totalElements ?? 0}
								totalPages={pagination?.totalPages ?? 0}
								disabled={isFetching}
								onPageChange={handlePageChange}
							/>
						</div>
					</PageState>
				</div>
			</Container>
		</main>
	);
}
