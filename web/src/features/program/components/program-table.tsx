import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";

import type { Program } from "../model/programs.types";
import { programTableColumns } from "./program-table-columns";
import { ProgramTableRow } from "./program-table-row";

export interface ProgramTableProps {
	programs: Program[];
	onProgramClick?: (programId: number) => void;
	onClone?: (programId: number) => void;
}

function ProgramTable({
	programs,
	onProgramClick,
	onClone,
}: ProgramTableProps) {
	console.log("programs", programs);
	return (
		<TableContainer
			sx={{
				width: "100%",
				overflowX: "auto",

				backgroundColor: "#FFFFFF",

				// border: "1px solid #D9E1E4",
				// borderRadius: "15px",

				boxShadow: "0 1px 2px rgba(16, 42, 56, 0.04)",
			}}
		>
			<Table
				aria-label="Incentive programs"
				sx={{
					width: "100%",
					minWidth: 1265,
					borderCollapse: "separate",
					borderSpacing: 0,

					// Header
					"& thead th": {
						height: 37,
						padding: "0 20px",

						backgroundColor: "#EEF2F3",

						borderBottom: "1px solid #D9E1E4",

						fontSize: "11px",
						fontWeight: 700,
						lineHeight: 1,

						color: "#8296A2",

						textTransform: "uppercase",
						letterSpacing: "0.02em",

						whiteSpace: "nowrap",
					},

					// Body
					"& tbody td": {
						height: 57,
						padding: "8px 20px",

						borderBottom: "1px solid #E0E6E8",

						fontSize: "13px",
						fontWeight: 400,

						color: "#24485C",

						verticalAlign: "middle",
					},

					// Last row
					"& tbody tr:last-child td": {
						borderBottom: 0,
					},

					// Hover
					"& tbody tr:hover": {
						backgroundColor: "#FAFCFC",
					},
				}}
			>
				<caption style={visuallyHidden}>Incentive programs</caption>

				<TableHead>
					<TableRow>
						{programTableColumns.map((column) => (
							<TableCell key={column.id} align={column.align}>
								{column.label}
							</TableCell>
						))}

						<TableCell align="right" sx={{ minWidth: 120 }}>
							<Box component="span" sx={visuallyHidden}>
								Actions
							</Box>
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{programs.map((program) => (
						<ProgramTableRow
							key={program.id}
							program={program}
							columns={programTableColumns}
							onClick={
								onProgramClick ? () => onProgramClick(program.id) : undefined
							}
							onClone={onClone}
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

const visuallyHidden = {
	border: 0,
	clip: "rect(0 0 0 0)",
	height: "1px",
	margin: "-1px",
	overflow: "hidden",
	padding: 0,
	position: "absolute",
	whiteSpace: "nowrap",
	width: "1px",
} as const;

export { ProgramTable };
