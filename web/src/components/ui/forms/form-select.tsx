import type { ReactNode } from "react";
import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form";

import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";

export interface SelectOption {
	value: string;
	label: string;
}

export interface FormSelectProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;

	options: SelectOption[];

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	disabled?: boolean;
}

function FormSelect<T extends FieldValues>({
	control,
	name,
	options,
	label,
	required = false,
	description,
	disabled = false,
}: FormSelectProps<T>) {
	const id = `${String(name)}-select`;

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<FormControl fullWidth disabled={disabled} error={fieldState.invalid}>
					{label && (
						<InputLabel id={`${id}-label`} required={required}>
							{label}
						</InputLabel>
					)}

					<Select
						{...field}
						labelId={`${id}-label`}
						id={id}
						label={typeof label === "string" ? label : undefined}
						value={field.value ?? ""}
					>
						{options.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</Select>

					{(fieldState.error?.message || description) && (
						<FormHelperText>
							{fieldState.error?.message ?? description}
						</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	);
}

export { FormSelect };

