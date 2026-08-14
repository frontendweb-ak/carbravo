import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { ListProgramsParams, ProgramStatusDto } from "../api/programs.api";

function parseStatus(value: string | null): ProgramStatusDto | undefined {
	const status = value?.toUpperCase();

	return status === "DRAFT" || status === "ACTIVE" || status === "EXPIRED"
		? status
		: undefined;
}

export function useProgramFilters() {
	const [searchParams, setSearchParams] = useSearchParams();

	const [filters, setFilters] = useState<ListProgramsParams>(() => ({
		page: 0,
		size: 20,
		status: parseStatus(searchParams.get("status")),
	}));

	const setStatus = (status?: ProgramStatusDto) => {
		setFilters((current) => ({
			...current,
			status,
			page: 0,
		}));

		setSearchParams((current) => {
			if (status) {
				current.set("status", status);
			} else {
				current.delete("status");
			}

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
		setFilters,
		setStatus,
		setSearch,
		setPage,
	};
}