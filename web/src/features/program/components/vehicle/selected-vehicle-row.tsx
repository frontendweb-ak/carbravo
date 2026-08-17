import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Chip, IconButton, Typography } from "@mui/material";

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
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1.5,
				border: 1,
				borderColor: "divider",
				borderRadius: 3,
				px: 2,
				py: 1.5,
			}}
		>
			<Chip
				label={`Row ${index + 1}`}
				size="small"
				sx={{
					flexShrink: 0,
					borderRadius: 1.5,
					backgroundColor: "rgba(108, 174, 64, 0.1)",
					color: "primary.main",
					fontWeight: 600,
					"& .MuiChip-label": {
						px: 1,
					},
				}}
			/>

			<Typography
				variant="body2"
				sx={{
					minWidth: 0,
					flex: 1,
					fontWeight: 600,
					color: "text.primary",
				}}
			>
				{formatSelectedVehicle(row)}
			</Typography>

			{onEdit && (
				<Button
					type="button"
					variant="outlined"
					size="small"
					onClick={onEdit}
					sx={{
						flexShrink: 0,
						borderColor: "rgba(108, 174, 64, 0.3)",
						backgroundColor: "rgba(108, 174, 64, 0.05)",
						color: "primary.main",
						fontWeight: 600,
						"&:hover": {
							borderColor: "rgba(108, 174, 64, 0.3)",
							backgroundColor: "rgba(108, 174, 64, 0.1)",
						},
					}}
				>
					Edit
				</Button>
			)}

			{onRemove && (
				<IconButton
					type="button"
					size="small"
					onClick={onRemove}
					aria-label={`Remove vehicle row ${index + 1}`}
					sx={{
						flexShrink: 0,
						color: "error.main",
						borderRadius: 1.5,
						"&:hover": {
							backgroundColor: "error.main",
							"& .MuiSvgIcon-root": {
								color: "common.white",
							},
						},
					}}
				>
					<CloseIcon fontSize="small" />
				</IconButton>
			)}
		</Box>
	);
}

export { SelectedVehicleRow };
