import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import { FormControl, FormHelperText, InputLabel } from "@mui/material";

import { TimeInput, type TimeInputProps } from "../primitives";

export type FormTimeInputProps<T extends FieldValues> = Omit<
	TimeInputProps,
	"value" | "onChange"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
};

function FormTimeInput<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	disabled = false,
	...props
}: FormTimeInputProps<T>) {
	const id = `${String(name)}-time`;

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<FormControl fullWidth error={fieldState.invalid} disabled={disabled}>
					{label && (
						<InputLabel shrink htmlFor={id} required={required}>
							{label}
						</InputLabel>
					)}

					<TimeInput
						{...props}
						value={field.value ?? null}
						onChange={field.onChange}
						disabled={disabled}
						error={fieldState.invalid}
						helperText={fieldState.error?.message}
					/>

					{!fieldState.error?.message && description && (
						<FormHelperText>{description}</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	);
}

export { FormTimeInput };
