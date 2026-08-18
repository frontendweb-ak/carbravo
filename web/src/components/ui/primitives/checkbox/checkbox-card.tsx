// src/components/ui/checkbox-card.tsx

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { Typography } from "../typography";
import { Checkbox } from "./checkbox";

export interface CheckboxCardProps {
	label: string;
	description?: string;
	checked?: boolean;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
}

export function CheckboxCard({
	label,
	description,
	checked = false,
	disabled = false,
	onChange,
}: CheckboxCardProps) {
	return (
		<Paper
			variant="outlined"
			sx={{ p: 2, cursor: disabled ? "default" : "pointer" }}
			onClick={() => {
				if (!disabled) {
					onChange?.(!checked);
				}
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "flex-start",
					gap: 1.5,
				}}
			>
				<Checkbox
					checked={checked}
					disabled={disabled}
					onChange={(e) => onChange?.(e.target.checked)}
					onClick={(e) => e.stopPropagation()}
				/>

				<Box>
					<Typography variant="body" weight="bold" sx={{ lineHeight: 1.3 }}>
						{label}
					</Typography>

					{description && (
						<Typography
							variant="bodyMedium"
							color="muted"
							sx={{ mt: 0.25, lineHeight: 1.4 }}
						>
							{description}
						</Typography>
					)}
				</Box>
			</Box>
		</Paper>
	);
}
