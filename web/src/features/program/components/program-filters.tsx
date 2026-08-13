import { Search } from "lucide-react";
import type { ChangeEvent } from "react";

import {
	Button,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui";
import type { ListProgramsParams } from "../api/programs.api";

export interface ProgramFiltersProps {
	search: string;
	programType?: ListProgramsParams["programType"];
	dateFrom?: string;
	dateTo?: string;
	pendingApproval?: boolean;

	onSearchChange: (value: string) => void;
	onProgramTypeChange: (value?: ListProgramsParams["programType"]) => void;
	onDateFromChange: (value?: string) => void;
	onDateToChange: (value?: string) => void;
	onPendingApprovalChange: (value?: boolean) => void;

	onClear?: () => void;
}

function ProgramFilters({
	search,
	programType,
	dateFrom,
	dateTo,
	pendingApproval,

	onSearchChange,
	onProgramTypeChange,
	onDateFromChange,
	onDateToChange,
	onPendingApprovalChange,

	onClear,
}: ProgramFiltersProps) {
	const hasFilters =
		Boolean(search) ||
		Boolean(programType) ||
		Boolean(dateFrom) ||
		Boolean(dateTo) ||
		pendingApproval === true;

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		onSearchChange(event.target.value);
	};

	return (
		<div className="rounded-lg border border-border bg-card p-4">
			<div className="flex flex-col gap-3 xl:flex-row xl:items-center">
				{/* Search */}
				<div className="relative min-w-0 flex-1">
					<Search
						aria-hidden="true"
						className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					/>

					<Input
						value={search}
						onChange={handleSearchChange}
						placeholder="Search programs..."
						aria-label="Search programs"
						className="pl-9"
					/>
				</div>

				{/* Program type */}
				<Select
					value={programType ?? "all"}
					onValueChange={(value) => {
						onProgramTypeChange(
							value === "all"
								? undefined
								: (value as ListProgramsParams["programType"]),
						);
					}}
				>
					<SelectTrigger className="w-full xl:w-48">
						<SelectValue placeholder="Program type" />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="all">All types</SelectItem>
						<SelectItem value="CUSTOMER_CASH">Customer Cash</SelectItem>
						<SelectItem value="APR">APR</SelectItem>
						<SelectItem value="BONUS_CASH">Bonus Cash</SelectItem>
					</SelectContent>
				</Select>

				{/* Date from */}
				<Input
					type="date"
					value={dateFrom ?? ""}
					onChange={(event) =>
						onDateFromChange(event.target.value || undefined)
					}
					aria-label="Delivery start date"
					className="w-full xl:w-40"
				/>

				{/* Date to */}
				<Input
					type="date"
					value={dateTo ?? ""}
					onChange={(event) => onDateToChange(event.target.value || undefined)}
					aria-label="Delivery end date"
					className="w-full xl:w-40"
				/>

				{/* Pending approval */}
				<label className="flex h-9 shrink-0 items-center gap-2 text-sm">
					<input
						type="checkbox"
						checked={pendingApproval === true}
						onChange={(event) =>
							onPendingApprovalChange(event.target.checked ? true : undefined)
						}
						className="size-4 rounded border-input accent-primary"
					/>

					<span className="whitespace-nowrap">Pending approval</span>
				</label>

				{/* Clear */}
				{hasFilters && (
					<Button
						type="button"
						variant="ghost"
						onClick={onClear}
						className="shrink-0"
					>
						Clear
					</Button>
				)}
			</div>
		</div>
	);
}

export { ProgramFilters };
