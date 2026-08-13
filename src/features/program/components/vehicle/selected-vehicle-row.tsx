import { X } from "lucide-react";
import type { VehicleFilterRow } from "../../schema";
import { formatSelectedVehicle } from "../../utils";

interface SelectedVehicleRowProps {
	row: VehicleFilterRow;
	index: number;
	onEdit?: () => void;
	onRemove?: () => void;
}

function SelectedVehicleRow({
	row,
	index,
	onEdit,
	onRemove,
}: SelectedVehicleRowProps) {
	return (
		<div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
			<span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
				Row {index + 1}
			</span>

			<div className="min-w-0 flex-1 text-sm font-semibold text-foreground">
				{formatSelectedVehicle(row)}
			</div>

			{onEdit && (
				<button
					type="button"
					onClick={onEdit}
					className="shrink-0 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
				>
					Edit
				</button>
			)}

			{onRemove && (
				<button
					type="button"
					onClick={onRemove}
					aria-label={`Remove vehicle row ${index + 1}`}
					className="shrink-0 rounded-md p-1.5 text-lg leading-none text-destructive transition-colors hover:bg-destructive/10"
				>
					<X />
				</button>
			)}
		</div>
	);
}

export { SelectedVehicleRow };
