import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import type { VehicleFilterRow } from "../../schema";
import { ProgramSection } from "../program-section";
import { SelectedVehicleRow } from "./selected-vehicle-row";

interface SelectedVehiclesSectionProps {
	rows: VehicleFilterRow[];
	onDelete?: (index: number) => void;
	onEdit?: (index: number) => void;
}

function SelectedVehiclesSection({
	rows,
	onDelete,
	onEdit,
}: SelectedVehiclesSectionProps) {
	return (
		<ProgramSection
			title="Selected Vehicles"
			headerAction={
				<Chip
					size="small"
					label={`${rows.length} ${rows.length === 1 ? "row" : "rows"}`}
				/>
			}
		>
			<Stack spacing={3}>
				{rows.length === 0 ? (
					<Paper
						variant="outlined"
						sx={{
							minHeight: 80,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							px: 2,
						}}
					>
						<Typography variant="body2" color="text.secondary">
							No vehicle rows yet. Build one above and click Add row.
						</Typography>
					</Paper>
				) : (
					<Stack spacing={1}>
						{rows.map((row, index) => (
							<SelectedVehicleRow
								key={`${index}-${row.makes.join("-")}`}
								row={row}
								index={index}
								onEdit={onEdit ? () => onEdit(index) : undefined}
								onRemove={onDelete ? () => onDelete(index) : undefined}
							/>
						))}
					</Stack>
				)}

				<Box>
					<Typography
						variant="overline"
						color="text.secondary"
						sx={{ fontWeight: 700 }}
					>
						Downstream Filter Preview
					</Typography>

					<Paper
						sx={{
							mt: 1,
							p: 2,
							bgcolor: "action.hover",
						}}
					>
						<Typography variant="body2" color="text.secondary">
							{rows.length === 0
								? "—"
								: rows.map(formatPreviewRow).join(" OR ")}
						</Typography>
					</Paper>
				</Box>
			</Stack>
		</ProgramSection>
	);
}

function formatValues(values: string[]) {
	if (values.length === 0 || values.includes("*")) {
		return "*";
	}

	return values.join(", ");
}

function formatPreviewRow(row: VehicleFilterRow) {
	return [
		`YEAR={${formatValues(row.modelYears)}}`,
		`MAKE=${formatValues(row.makes)}`,
		`MODEL=${formatValues(row.models)}`,
		`FUEL=${formatValues(row.fuelTypes)}`,
		`SEGMENT=${formatValues(row.segments)}`,
	].join("+");
}

export { SelectedVehiclesSection };
