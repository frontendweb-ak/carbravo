import { Button } from "@/components/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ProgramPaginationProps {
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;

	onPageChange: (page: number) => void;

	disabled?: boolean;
}

function ProgramPagination({
	page,
	size,
	totalElements,
	totalPages,
	onPageChange,
	disabled = false,
}: ProgramPaginationProps) {
	if (totalElements === 0 || totalPages <= 1) {
		return null;
	}

	const firstItem = page * size + 1;
	const lastItem = Math.min((page + 1) * size, totalElements);

	const canPrevious = page > 0;
	const canNext = page < totalPages - 1;

	return (
		<nav
			aria-label="Program pagination"
			className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
		>
			{/* Result summary */}
			<p className="text-sm text-muted-foreground">
				Showing <span className="font-medium text-foreground">{firstItem}</span>{" "}
				– <span className="font-medium text-foreground">{lastItem}</span> of{" "}
				<span className="font-medium text-foreground">{totalElements}</span>{" "}
				programs
			</p>

			{/* Navigation */}
			<div className="flex items-center gap-1">
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={disabled || !canPrevious}
					aria-label="Go to previous page"
					onClick={() => onPageChange(page - 1)}
				>
					<ChevronLeft aria-hidden="true" className="size-4" />

					<span className="hidden sm:inline">Previous</span>
				</Button>

				<PageNumbers
					page={page}
					totalPages={totalPages}
					disabled={disabled}
					onPageChange={onPageChange}
				/>

				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={disabled || !canNext}
					aria-label="Go to next page"
					onClick={() => onPageChange(page + 1)}
				>
					<span className="hidden sm:inline">Next</span>

					<ChevronRight aria-hidden="true" className="size-4" />
				</Button>
			</div>
		</nav>
	);
}

/* -------------------------------------------------------------------------- */
/* Page numbers                                                                */
/* -------------------------------------------------------------------------- */

interface PageNumbersProps {
	page: number;
	totalPages: number;
	disabled: boolean;
	onPageChange: (page: number) => void;
}

function PageNumbers({
	page,
	totalPages,
	disabled,
	onPageChange,
}: PageNumbersProps) {
	const pages = getPageNumbers(page, totalPages);

	return (
		<div className="hidden items-center gap-1 sm:flex">
			{pages.map((item, index) => {
				if (item === "ellipsis") {
					return (
						<span
							key={`ellipsis-${index.toString()}`}
							aria-hidden="true"
							className="flex size-8 items-center justify-center text-sm text-muted-foreground"
						>
							…
						</span>
					);
				}

				const selected = item === page;

				return (
					<Button
						key={item}
						type="button"
						variant={selected ? "default" : "outline"}
						size="icon"
						className="size-8"
						disabled={disabled}
						aria-label={`Go to page ${item + 1}`}
						aria-current={selected ? "page" : undefined}
						onClick={() => onPageChange(item)}
					>
						{item + 1}
					</Button>
				);
			})}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Page calculation                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Backend pages are zero-based.
 *
 * Example:
 *
 * page = 0, totalPages = 10
 * → 1 2 3 4 5 … 10
 *
 * page = 5
 * → 1 … 4 5 6 7 8 … 10
 */
function getPageNumbers(
	currentPage: number,
	totalPages: number,
): Array<number | "ellipsis"> {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index);
	}

	const pages = new Set<number>();

	// Always show first page.
	pages.add(0);

	// Pages around current page.
	for (let page = currentPage - 1; page <= currentPage + 1; page++) {
		if (page > 0 && page < totalPages - 1) {
			pages.add(page);
		}
	}

	// Always show last page.
	pages.add(totalPages - 1);

	const sortedPages = [...pages].sort((a, b) => a - b);

	const result: Array<number | "ellipsis"> = [];

	for (let index = 0; index < sortedPages.length; index++) {
		const page = sortedPages[index];

		if (index > 0) {
			const previous = sortedPages[index - 1];

			if (page - previous > 1) {
				result.push("ellipsis");
			}
		}

		result.push(page);
	}

	return result;
}

export { ProgramPagination };
