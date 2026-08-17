// src/components/ui/forms/checkbox-field.tsx

import type { ReactNode } from "react";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { Checkbox, type CheckboxProps } from "./checkbox";

export interface CheckboxFieldProps extends Omit<CheckboxProps, "checked"> {
	label?: ReactNode;
	description?: ReactNode;
	helperText?: ReactNode;
	error?: boolean;
	checked?: boolean;
	required?: boolean;
}

function CheckboxField({
	label,
	description,
	helperText,
	error,
	checked,
	required,
	...props
}: CheckboxFieldProps) {
	return (
		<FormControl error={error}>
			<FormControlLabel
				control={<Checkbox checked={checked} {...props} />}
				label={
					required ? (
						<>
							{label}
							<span style={{ color: "#d32f2f" }}> *</span>
						</>
					) : (
						label
					)
				}
			/>

			{helperText && <FormHelperText>{helperText}</FormHelperText>}

			{!helperText && description && (
				<FormHelperText>{description}</FormHelperText>
			)}
		</FormControl>
	);
}

export { CheckboxField };
