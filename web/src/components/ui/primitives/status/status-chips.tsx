import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import type { SxProps, Theme } from "@mui/material/styles";
import { Typography } from "../typography";

export interface StatusChipOption<T extends string = string> {
	label: string;
	value: T;
	count?: number;
}

export interface StatusChipsProps<T extends string = string> {
	options: StatusChipOption<T>[];
	value?: T;
	onChange?: (value: T) => void;
	sx?: SxProps<Theme>;
}

function StatusChips<T extends string = string>({
	options,
	value,
	onChange,
	sx,
}: StatusChipsProps<T>) {
	return (
		<Box
			sx={[
				{
					display: "flex",
					alignItems: "center",
					gap: 2,
					flexWrap: "wrap",
				},
				...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
			]}
		>
			{options.map((option) => {
				const selected = value === option.value;

				return (
					<Chip
						key={option.value}
						clickable={Boolean(onChange)}
						label={
							<Box
								component="span"
								sx={{
									display: "inline-flex",
									alignItems: "center",
									gap: 2,
									whiteSpace: "nowrap",
								}}
							>
								<Typography weight="bold" variant="bodyMedium">
									{option.label}
								</Typography>

								{option.count !== undefined && (
									<Box
										component="span"
										sx={{
											fontSize: 11,
											fontWeight: 600,
											lineHeight: 1,
											opacity: selected ? 0.9 : 0.7,
										}}
									>
										{option.count}
									</Box>
								)}
							</Box>
						}
						onClick={() => onChange?.(option.value)}
						sx={{
							height: 30,
							borderRadius: "15px",

							backgroundColor: selected ? "brandTeal.main" : "background.paper",

							color: selected ? "#FFFFFF" : "text.secondary",

							border: "1px solid",
							borderColor: selected ? "brandTeal.main" : "divider",

							boxShadow: "none",

							fontSize: 12,
							fontWeight: selected ? 700 : 600,
							lineHeight: 1,
							px: 3,

							cursor: onChange ? "pointer" : "default",

							"& .MuiChip-label": {
								px: 1.5,
								py: 0,
								display: "flex",
								alignItems: "center",
							},

							"&:hover": {
								backgroundColor: selected ? "brandTeal.main" : "action.hover",
							},

							"&.Mui-focusVisible": {
								backgroundColor: selected ? "brandTeal.main" : "action.hover",
							},
						}}
					/>
				);
			})}
		</Box>
	);
}

export { StatusChips };
