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
}

function Checkbox({ label, description, ...props }: CheckboxProps) {
	if (!label) {
		return <MuiCheckbox {...props} />;
	}

	return (
		<FormControlLabel
			control={<MuiCheckbox {...props} />}
			label={
				<Box>
					<Typography variant="body" weight="bold">
						{label}
					</Typography>

					{description && (
						<Typography variant="caption" color="secondary">
							{description}
						</Typography>
					)}
				</Box>
			}
		/>
	);
}

export { Checkbox };

