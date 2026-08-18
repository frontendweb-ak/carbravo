import { Box, Button, TableCell, TableRow } from "@mui/material";

import type { Program } from "../model/programs.types";
import type { ProgramTableColumn } from "./program-table-columns";

export interface ProgramTableRowProps {
	program: Program;
	columns: ProgramTableColumn[];
	onClick?: () => void;
	onClone?: (programId: number) => void;
}

function ProgramTableRow({
	program,
	columns,
	onClick,
	onClone,
}: ProgramTableRowProps) {
	const canOpen = Boolean(onClick);

	return (
		<TableRow
			hover={canOpen}
			sx={{
				"&:last-child td": { borderBottom: 0 },
			}}
		>
			{columns.map((column) => (
				<TableCell
					key={column.id}
					align={column.align}
					sx={{ px: 2, py: 1.25 }}
				>
					{column.id === "program" && canOpen ? (
						<Box
							component="button"
							type="button"
							onClick={onClick}
							sx={{
								display: "block",
								width: "100%",
								border: 0,
								p: 0,
								m: 0,
								background: "transparent",
								textAlign: "left",
								cursor: "pointer",
								color: "inherit",
								font: "inherit",
							}}
						>
							{column.render(program)}
						</Box>
					) : (
						column.render(program)
					)}
				</TableCell>
			))}

			<TableCell
				align="right"
				sx={{
					px: 1.5,
					py: 1.25,
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						gap: 1,
					}}
				>
					<Button
						type="button"
						variant="contained"
						size="small"
						onClick={onClick}
						sx={{
							height: 32,
							minHeight: 32,
							padding: "0 12px",

							borderRadius: 1,

							backgroundColor: "#E9F2FB",
							color: "#1F7DC4",

							fontSize: "0.8125rem",
							fontWeight: 700,
							lineHeight: 1,

							boxShadow: "none",

							"&:hover": {
								backgroundColor: "#DCECF9",
								boxShadow: "none",
							},

							"&:active": {
								transform: "translateY(1px)",
							},
						}}
					>
						Open
					</Button>

					<Button
						type="button"
						variant="outlined"
						size="small"
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							onClone?.(program.id);
						}}
						sx={{
							height: 32,
							minHeight: 32,
							padding: "0 12px",

							borderRadius: 1,

							backgroundColor: "#FFFFFF",
							borderColor: "#D2DCDE",
							color: "#24485C",

							fontSize: "0.8125rem",
							fontWeight: 600,
							lineHeight: 1,

							boxShadow: "none",

							"&:hover": {
								backgroundColor: "#F5F7F8",
								borderColor: "#C4D0D3",
								boxShadow: "none",
							},

							"&:active": {
								transform: "translateY(1px)",
							},
						}}
					>
						Clone
					</Button>
				</Box>
			</TableCell>
		</TableRow>
	);
}

export { ProgramTableRow };
