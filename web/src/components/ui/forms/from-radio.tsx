import type { ReactNode } from "react";
import {
	type Control,
	type FieldValues,
	type Path,
	Controller,
} from "react-hook-form";

import {
	FormControl,
	FormControlLabel,
	FormHelperText,
	Radio,
	Typography,
} from "@mui/material";

export type FormRadioProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;

	value: string;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	disabled?: boolean;
};

function FormRadio<T extends FieldValues>({
	control,
	name,
	value,
	label,
	description,
	disabled = false,
}: FormRadioProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<FormControl error={fieldState.invalid} disabled={disabled}>
					<FormControlLabel
						control={
							<Radio
								checked={field.value === value}
								onChange={() => field.onChange(value)}
								onBlur={field.onBlur}
								value={value}
							/>
						}
						label={label}
					/>

					{description && (
						<Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
							{description}
						</Typography>
					)}

					{fieldState.error?.message && (
						<FormHelperText>{fieldState.error.message}</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	);
}

export { FormRadio };

