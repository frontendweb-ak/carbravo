import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Button, Typography } from "@mui/material";

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
		<Box
			component="nav"
			aria-label="Program pagination"
			sx={{
				display: "flex",
				flexDirection: {
					xs: "column",
					sm: "row",
				},
				alignItems: {
					xs: "stretch",
					sm: "center",
				},
				justifyContent: "space-between",
				gap: 1.5,
			}}
		>
			<Typography variant="body2" color="text.secondary">
				Showing{" "}
				<Box
					component="span"
					sx={{
						fontWeight: 600,
						color: "text.primary",
					}}
				>
					{firstItem}
				</Box>{" "}
				–{" "}
				<Box
					component="span"
					sx={{
						fontWeight: 600,
						color: "text.primary",
					}}
				>
					{lastItem}
				</Box>{" "}
				of{" "}
				<Box
					component="span"
					sx={{
						fontWeight: 600,
						color: "text.primary",
					}}
				>
					{totalElements}
				</Box>{" "}
				programs
			</Typography>

			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 0.5,
				}}
			>
				<Button
					type="button"
					variant="outlined"
					size="small"
					disabled={disabled || !canPrevious}
					aria-label="Go to previous page"
					onClick={() => onPageChange(page - 1)}
					startIcon={<ChevronLeftIcon />}
				>
					<Box
						component="span"
						sx={{
							display: {
								xs: "none",
								sm: "inline",
							},
						}}
					>
						Previous
					</Box>
				</Button>

				<PageNumbers
					page={page}
					totalPages={totalPages}
					disabled={disabled}
					onPageChange={onPageChange}
				/>

				<Button
					type="button"
					variant="outlined"
					size="small"
					disabled={disabled || !canNext}
					aria-label="Go to next page"
					onClick={() => onPageChange(page + 1)}
					endIcon={<ChevronRightIcon />}
				>
					<Box
						component="span"
						sx={{
							display: {
								xs: "none",
								sm: "inline",
							},
						}}
					>
						Next
					</Box>
				</Button>
			</Box>
		</Box>
	);
}

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
		<Box
			sx={{
				display: {
					xs: "none",
					sm: "flex",
				},
				alignItems: "center",
				gap: 0.5,
			}}
		>
			{pages.map((item, index) => {
				if (item === "ellipsis") {
					return (
						<Box
							key={`ellipsis-${index}`}
							component="span"
							aria-hidden="true"
							sx={{
								width: 32,
								height: 32,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "text.secondary",
								fontSize: 14,
							}}
						>
							…
						</Box>
					);
				}

				const selected = item === page;

				return (
					<Button
						key={item}
						type="button"
						variant={selected ? "contained" : "outlined"}
						color="primary"
						size="small"
						disabled={disabled}
						aria-label={`Go to page ${item + 1}`}
						aria-current={selected ? "page" : undefined}
						onClick={() => onPageChange(item)}
						sx={{
							minWidth: 32,
							width: 32,
							height: 32,
							padding: 0,
						}}
					>
						{item + 1}
					</Button>
				);
			})}
		</Box>
	);
}

function getPageNumbers(
	currentPage: number,
	totalPages: number,
): Array<number | "ellipsis"> {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index);
	}

	const pages = new Set<number>();

	pages.add(0);

	for (let page = currentPage - 1; page <= currentPage + 1; page++) {
		if (page > 0 && page < totalPages - 1) {
			pages.add(page);
		}
	}

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
