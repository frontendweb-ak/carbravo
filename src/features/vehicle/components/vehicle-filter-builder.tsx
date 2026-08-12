import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/utils";

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
	disabled?: boolean;
}

function VehicleFilterBuilder({
	columns,
	onAddRow,
	addRowLabel = "Add row",
	disabled = false,
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
			<div className="mt-3 flex justify-end">
				<button
					type="button"
					disabled={disabled || !onAddRow}
					onClick={onAddRow}
					className={cn(
						"h-9 rounded-lg px-4",
						"bg-primary",
						"text-sm font-semibold",
						"text-primary-foreground",
						"transition-colors",

						"hover:bg-primary/90",

						"focus-visible:outline-none",
						"focus-visible:ring-3",
						"focus-visible:ring-ring/30",

						"disabled:pointer-events-none",
						"disabled:opacity-50",
					)}
				>
					{addRowLabel}
				</button>
			</div>
		</div>
	);
}

export { VehicleFilterBuilder };
