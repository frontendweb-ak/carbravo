import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { ListProgramsParams, ProgramStatusDto } from "../api/programs.api";

export function useProgramFilters() {
	const [searchParams, setSearchParams] = useSearchParams();

	const statusParam = searchParams.get("status")?.toUpperCase();
	const initialStatus: ProgramStatusDto | undefined =
		statusParam === "DRAFT" ||
		statusParam === "ACTIVE" ||
		statusParam === "EXPIRED"
			? statusParam
			: undefined;

	const [filters, setFilters] = useState<ListProgramsParams>({
		page: 0,
		size: 20,
		status: initialStatus,
	});

	const setStatus = (status?: ProgramStatusDto) => {
		setFilters((current) => ({
			...current,
			status,
			page: 0,
		}));

		if (status) {
			setSearchParams({ status });
		} else {
			setSearchParams({});
		}
	};

	const setSearch = (search: string) => {
		setFilters((current) => ({
			...current,
			search: search.trim() || undefined,
			page: 0,
		}));
	};

	const setPage = (page: number) => {
		setFilters((current) => ({ ...current, page }));
	};

	return {
		filters,
		setFilters,
		setStatus,
		setSearch,
		setPage,
	};
}
