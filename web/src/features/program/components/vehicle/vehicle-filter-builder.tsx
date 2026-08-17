import type { ComponentProps, ReactNode } from "react";

import {
	Box,
	Button,
	Card,
	CardContent,
	Stack,
	Typography,
} from "@mui/material";

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
	...props
}: VehicleFilterBuilderProps) {
	return (
		<Card variant="outlined" {...props}>
			<CardContent>
				<Stack spacing={3}>
					{/* Header */}
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 700 }}>
							Add Vehicles
						</Typography>

						<Typography variant="body2" color="text.secondary">
							Author one row with model year, make, model, fuel and segment. Use
							* for wildcard values and search to find options quickly.
						</Typography>
					</Box>

					{/* Columns */}
					<Box
						sx={{
							display: "grid",
							gap: 2,
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
					<Stack
  direction="row"
  spacing={2}
  sx={{
    justifyContent: "flex-end",
  }}
>
						{editing && onCancelEdit && (
							<Button
								type="button"
								variant="outlined"
								onClick={onCancelEdit}
								disabled={disabled}
							>
								Cancel Edit
							</Button>
						)}

						<Button
							type="button"
							variant="contained"
							onClick={onAddRow}
							disabled={disabled || !onAddRow}
						>
							{editing ? "Update Row" : addRowLabel}
						</Button>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
}

export { VehicleFilterBuilder };

