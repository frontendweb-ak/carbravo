// src/components/ui/primitives/checkbox/checkbox.tsx

import Box from "@mui/material/Box";
import MuiCheckbox, {
	type CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { Typography } from "../typography";

export interface CheckboxProps extends Omit<MuiCheckboxProps, "checkedIcon"> {
	label?: string;
	description?: string;
	variant?: "default" | "compact";
}

function Checkbox({
	label,
	description,
	variant = "default",
	...props
}: CheckboxProps) {
	if (!label) {
		return <MuiCheckbox {...props} />;
	}

	if (variant === "compact") {
		return (
			<FormControlLabel
				control={<MuiCheckbox size="small" {...props} />}
				label={
					<Box sx={{ flex: 1 }}>
						<Typography variant="bodySmall">{label}</Typography>
					</Box>
				}
				sx={{
					width: "100%",
					m: 0,
					alignItems: "center",
					"& .MuiCheckbox-root": {
						p: 0.5,
						mr: 0.5,
					},
					"& .MuiFormControlLabel-label": {
						flex: 1,
					},
				}}
			/>
		);
	}

	return (
		<FormControlLabel
			control={<MuiCheckbox {...props} />}
			label={
				<Box sx={{ flex: 1 }}>
					<Typography variant="bodySmall">{label}</Typography>
					{description && (
						<Typography variant="caption" color="secondary">
							{description}
						</Typography>
					)}
				</Box>
			}
			sx={{
				width: "100%",
				m: 0,
				alignItems: "flex-start",
				"& .MuiFormControlLabel-label": {
					flex: 1,
				},
			}}
		/>
	);
}

export { Checkbox };

