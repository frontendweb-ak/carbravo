// src/features/program/components/program-header.tsx

import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";

import { Input, Typography } from "@/components/ui";

export interface ProgramHeaderProps {
	title?: string;
	search?: string;
	onSearchChange?: (value: string) => void;
	placeholder?: string;
}

function ProgramHeader({
	title = "Programs",
	search = "",
	onSearchChange,
	placeholder = "Search programs, codes, vehicles...",
}: ProgramHeaderProps) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 4,
				mb: 4,
			}}
		>
			<Typography
				variant="h1"
				sx={{
					fontSize: "2rem",
					fontWeight: 700,
					lineHeight: 1.1,
				}}
			>
				{title}
			</Typography>

			<Input
				value={search}
				onChange={(event) => onSearchChange?.(event.target.value)}
				placeholder={placeholder}
				startAdornment={
					<InputAdornment position="start">
						<SearchIcon
							sx={{
								fontSize: 16,
								color: "text.secondary",
							}}
						/>
					</InputAdornment>
				}
				sx={{
					width: 280,

					"& .MuiOutlinedInput-input": {
						fontSize: "0.875rem",
					},
				}}
			/>
		</Box>
	);
}

export { ProgramHeader };
