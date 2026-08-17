import SearchIcon from "@mui/icons-material/Search";
import {
	Box,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	InputAdornment,
	MenuItem,
	Select,
	Stack,
	TextField,
} from "@mui/material";
import type { ChangeEvent } from "react";

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
		<Box
			sx={{
				border: 1,
				borderColor: "divider",
				borderRadius: 2,
				p: 2,
				bgcolor: "background.paper",
			}}
		>
			<Stack
				direction={{
					xs: "column",
					xl: "row",
				}}
				spacing={2}
				sx={{
					alignItems: {
						xl: "center",
					},
				}}
			>
				<TextField
					fullWidth
					value={search}
					onChange={handleSearchChange}
					placeholder="Search programs..."
					size="small"
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" />
								</InputAdornment>
							),
						},
					}}
				/>
				<FormControl size="small" sx={{ minWidth: { xl: 190 } }}>
					<Select
						value={programType ?? "all"}
						onChange={(event) => {
							const value = event.target.value;

							onProgramTypeChange(
								value === "all"
									? undefined
									: (value as ListProgramsParams["programType"]),
							);
						}}
					>
						<MenuItem value="all">All types</MenuItem>

						<MenuItem value="CUSTOMER_CASH">Customer Cash</MenuItem>

						<MenuItem value="APR">APR</MenuItem>

						<MenuItem value="BONUS_CASH">Bonus Cash</MenuItem>
					</Select>
				</FormControl>

				<TextField
					type="date"
					size="small"
					value={dateFrom ?? ""}
					onChange={(event) =>
						onDateFromChange(event.target.value || undefined)
					}
					slotProps={{
						inputLabel: {
							shrink: true,
						},
					}}
				/>

				<TextField
					type="date"
					size="small"
					value={dateTo ?? ""}
					onChange={(event) => onDateToChange(event.target.value || undefined)}
					slotProps={{
						inputLabel: {
							shrink: true,
						},
					}}
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={pendingApproval === true}
							onChange={(event) =>
								onPendingApprovalChange(event.target.checked ? true : undefined)
							}
						/>
					}
					label="Pending approval"
					sx={{
						whiteSpace: "nowrap",
						m: 0,
					}}
				/>

				{hasFilters && (
					<Button variant="text" onClick={onClear}>
						Clear
					</Button>
				)}
			</Stack>
		</Box>
	);
}

export { ProgramFilters };

