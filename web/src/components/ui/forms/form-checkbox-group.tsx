import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";

export interface CheckboxOption<O> {
	label: ReactNode;
	value: O;
	disabled?: boolean;
}

export interface FormCheckboxGroupProps<
	T extends FieldValues,
	O extends string,
> {
	control: Control<T>;
	name: Path<T>;

	options: CheckboxOption<O>[];

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	disabled?: boolean;
}

function FormCheckboxGroup<T extends FieldValues, O extends string>({
	control,
	name,
	label,
	required = false,
	description,
	disabled = false,
	options,
}: FormCheckboxGroupProps<T, O>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const value: string[] = Array.isArray(field.value)
					? field.value.map(String)
					: [];

				const handleChange = (optionValue: string, checked: boolean) => {
					const nextValue = checked
						? [...value, optionValue]
						: value.filter((v) => v !== optionValue);

					field.onChange(nextValue);
				};

				return (
					<FormControl error={fieldState.invalid} disabled={disabled} fullWidth>
						{label && (
							<FormLabel sx={{ mb: 1 }}>
								{label}

								{required && (
									<Typography component="span" color="error" sx={{ ml: 0.5 }}>
										*
									</Typography>
								)}
							</FormLabel>
						)}

						<FormGroup>
							{options.map((option) => {
								const optionValue = String(option.value);

								return (
									<FormControlLabel
										key={optionValue}
										control={
											<Checkbox
												checked={value.includes(optionValue)}
												onChange={(event) =>
													handleChange(optionValue, event.target.checked)
												}
											/>
										}
										label={option.label}
										disabled={disabled || option.disabled}
									/>
								);
							})}
						</FormGroup>

						{fieldState.error ? (
							<FormHelperText>{fieldState.error.message}</FormHelperText>
						) : (
							description && <FormHelperText>{description}</FormHelperText>
						)}
					</FormControl>
				);
			}}
		/>
	);
}

export { FormCheckboxGroup };
