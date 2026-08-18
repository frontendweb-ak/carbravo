// src/components/ui/composite/revision-chips/revision-chips.tsx

import { Typography } from "@/components/ui";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import type { SxProps, Theme } from "@mui/material/styles";

export interface RevisionChipOption<T extends string = string> {
	id: T;
	label: string;
	subtitle?: string;
	active?: boolean;
}

export interface RevisionChipsProps<T extends string = string> {
	options: RevisionChipOption<T>[];
	onChange?: (value: T) => void;
	sx?: SxProps<Theme>;
}

function RevisionChips<T extends string = string>({
	options,
	onChange,
	sx,
}: RevisionChipsProps<T>) {
	return (
		<Box
			role="tablist"
			aria-label="Program revisions"
			sx={[
				{
					display: "flex",
					alignItems: "center",
					gap: 1,
					mb: 2,
					flexWrap: "wrap",
				},
				...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
			]}
		>
			{options.map((option) => {
				const active = option.active === true;

				return (
					<Chip
						key={option.id}
						clickable={Boolean(onChange)}
						role="tab"
						aria-selected={active}
						onClick={() => onChange?.(option.id)}
						label={
							<Box
								component="span"
								sx={{
									display: "inline-flex",
									alignItems: "center",
									gap: 0.75,
									px: 2,
									whiteSpace: "nowrap",
								}}
							>
								<Typography
									component="span"
									sx={{
										fontSize: 11,
										lineHeight: 1,
										fontWeight: 700,
										color: "inherit",
									}}
								>
									{option.label}
								</Typography>

								{option.subtitle && (
									<Box
										component="span"
										sx={{
											fontSize: 10,
											lineHeight: 1,
											fontWeight: 600,

											color: active ? "rgba(255,255,255,0.72)" : "#8A9BA3",
										}}
									>
										{option.subtitle}
									</Box>
								)}
							</Box>
						}
						sx={{
							height: 32,
							borderRadius: "16px",

							backgroundColor: active ? "brandTeal.main" : "background.paper",

							color: active ? "#FFFFFF" : "text.secondary",

							border: "1px solid",
							borderColor: active ? "brandTeal.main" : "divider",

							boxShadow: "none",

							cursor: onChange ? "pointer" : "default",

							"& .MuiChip-label": {
								display: "flex",
								alignItems: "center",

								px: 1.5,
								py: 0,
							},

							"&:hover": {
								backgroundColor: active ? "brandTeal.main" : "action.hover",
							},

							"&.Mui-focusVisible": {
								backgroundColor: active ? "brandTeal.main" : "action.hover",
							},
						}}
					/>
				);
			})}
		</Box>
	);
}

export { RevisionChips };
