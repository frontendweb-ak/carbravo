import type { ComponentProps, ReactNode } from "react";

import { Box, Stack } from "@mui/material";

import { Button } from "@/components/ui";
import { ProgramSection } from "../program-section";
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
	onCancelEdit?: () => void;
	disabled?: boolean;
	editing?: boolean;
	addRowLabel?: ReactNode;
}

function VehicleFilterBuilder({
	columns,

	onCancelEdit,
	addRowLabel = "Add row",
	disabled = false,
	editing = false,
	...props
}: VehicleFilterBuilderProps) {
	return (
		<ProgramSection
			title="Add Vehicles"
			description="Author one row with model year, make, model, fuel and segment. Use
							* for wildcard values and search to find options quickly."
		>
			<Stack spacing={4}>
				{/* Columns */}
				<Box
					sx={{
						display: "grid",
						gap: 3,
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, 1fr)",
							lg: "repeat(3, 1fr)",
							xl: "repeat(5, 1fr)",
						},
					}}
				>
					{columns.map((column) => (
						<FilterSelectCard
							key={column.id}
							{...column}
							allowAny
							disabled={disabled || column.disabled}
						/>
					))}
				</Box>

				{/* Footer */}
				<Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
					{editing && onCancelEdit && (
						<Button
							type="button"
							variant="outline"
							onClick={onCancelEdit}
							disabled={disabled}
						>
							Cancel Edit
						</Button>
					)}

					<Button type="submit" size="small" disabled={disabled}>
						{editing ? "Update Row" : addRowLabel}
					</Button>
				</Stack>
			</Stack>
		</ProgramSection>
	);
}

export { VehicleFilterBuilder };

