import {
	Button,
	Container,
	type FilterTab,
	FilterTabs,
	Input,
	PageState,
} from "@/components/ui";
import {
	useCloneProgram,
	useProgramFilters,
	usePrograms,
} from "@/features/program";
import type { ProgramStatusDto } from "@/features/program/api/programs.api";
import { ProgramPagination } from "@/features/program/components";
import { ProgramList } from "@/features/program/components/program-list";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ProgramStatusTab = "all" | ProgramStatusDto;
export default function ProgramsPage() {
	const navigate = useNavigate();
	const { filters, setStatus, setSearch, setPage } = useProgramFilters();

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

	const handleCreate = () => {
		navigate("/programs/new/setup");
	};

	const cloneProgram = useCloneProgram();

	const handleClone = (programId: number) => {
		console.log("ProgramId", programId);
		cloneProgram.mutate(programId, {
			onSuccess: (data) => {
				if (data.programId) {
					navigate(`/programs/${data.programId}`);
				}
			},
		});
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
							onChange={(event) => setSearch(event.target.value)}
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
						onValueChange={(value) =>
							setStatus(value === "all" ? undefined : value)
						}
					/>
				</div>

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
							onClone={handleClone}
						/>
						<div className="mt-5">
							<ProgramPagination
								page={pagination?.page ?? 0}
								size={pagination?.size ?? filters.size ?? 20}
								totalElements={pagination?.totalElements ?? 0}
								totalPages={pagination?.totalPages ?? 0}
								disabled={isFetching}
								onPageChange={setPage}
							/>
						</div>
					</PageState>
				</div>
			</Container>
		</main>
	);
}
