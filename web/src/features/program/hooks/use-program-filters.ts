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
		pendingApproval: searchParams.get("pendingApproval") === "true" ? true : undefined,
	}));

	const setStatus = (status?: ProgramStatusDto) => {
		setFilters((current) => ({
			...current,
			status,
			pendingApproval: undefined,
			page: 0,
		}));

		setSearchParams((current) => {
			if (status) {
				current.set("status", status);
			} else {
				current.delete("status");
			}
			current.delete("pendingApproval");
			return current;
		});
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
		setFilters,
		setStatus,
		setPendingApproval,
		setSearch,
		setPage,
	};
}