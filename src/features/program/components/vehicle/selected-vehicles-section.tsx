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
			title="Selected vehicles"
			description={undefined}
			headerAction={
				<span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
					{rows.length} {rows.length === 1 ? "row" : "rows"}
				</span>
			}
		>
			<div className="space-y-4">
				{rows.length === 0 ? (
					<div className="flex min-h-20 items-center justify-center rounded-xl border border-border px-4 text-sm text-muted-foreground">
						No vehicle rows yet. Build one above and click Add row.
					</div>
				) : (
					<div className="space-y-2">
						{rows.map((row, index) => (
							<SelectedVehicleRow
								key={JSON.stringify(index)}
								row={row}
								index={index}
								onEdit={onEdit ? () => onEdit(index) : undefined}
								onRemove={onDelete ? () => onDelete(index) : undefined}
							/>
						))}
					</div>
				)}

				{/* Downstream preview */}
				<div>
					<div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
						Downstream filter preview
					</div>
					<div className="rounded-xl bg-muted px-3 py-3 text-sm text-muted-foreground">
						{rows.length === 0 ? "—" : rows.map(formatPreviewRow).join(" OR ")}
					</div>
				</div>
			</div>
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
