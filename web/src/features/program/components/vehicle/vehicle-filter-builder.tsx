import { Button } from "@/components/ui";
import { cn } from "@/utils";
import type { ComponentProps, ReactNode } from "react";
import {
	FilterSelectCard,
	type FilterSelectCardProps,
} from "./filter-select-card";

export type VehicleFilterColumn = FilterSelectCardProps<any> & {
	id: string;
};

export interface VehicleFilterBuilderProps extends Omit<
	ComponentProps<"div">,
	"children"
> {
	columns: VehicleFilterColumn[];
	onAddRow?: () => void;
	addRowLabel?: ReactNode;
	onCancelEdit?: () => void;
	disabled?: boolean;
	editing?: boolean;
}

function VehicleFilterBuilder({
	columns,
	onAddRow,
	onCancelEdit,
	addRowLabel = "Add row",
	disabled = false,
	editing = false,
	className,
	...props
}: VehicleFilterBuilderProps) {
	return (
		<div
			{...props}
			className={cn(
				"rounded-2xl border border-border",
				"bg-card p-4",
				className,
			)}
		>
			{/* Header */}
			<div className="mb-3">
				<h2 className="text-base font-bold text-foreground">Add vehicles</h2>
				<p className="text-sm text-muted-foreground">
					Author one row with model year, make, model, fuel and segment. Use *
					for wildcard values and search to find options quickly.
				</p>
			</div>

			{/* Columns */}
			<div
				className={cn(
					"grid gap-3",
					"grid-cols-1",
					"sm:grid-cols-2",
					"lg:grid-cols-3",
					"xl:grid-cols-5",
				)}
			>
				{columns.map((column) => (
					<FilterSelectCard
						key={column.id}
						{...column}
						allowAny
						disabled={disabled || column.disabled}
					/>
				))}
			</div>

			{/* Footer */}
			<div className="mt-3 gap-4 flex justify-end">
				{editing && onCancelEdit && (
					<Button
						type="button"
						variant="outline"
						onClick={onCancelEdit}
						disabled={disabled}
					>
						Cancel edit
					</Button>
				)}
				<Button
					type="button"
					onClick={onAddRow}
					disabled={disabled || !onAddRow}
				>
					{editing ? "Update row" : "Add row"}
				</Button>
			</div>
		</div>
	);
}

export { VehicleFilterBuilder };
