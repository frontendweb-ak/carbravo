// src/components/ui/forms/form-checkbox.tsx

import type { ReactNode } from "react";

import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form";
import { CheckboxField } from "../primitives/checkbox/checkbox-field";

export interface FormCheckboxProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	description?: ReactNode;
	required?: boolean;
	disabled?: boolean;
}

function FormCheckbox<T extends FieldValues>({
	control,
	name,
	label,
	description,
	required,
	disabled,
}: FormCheckboxProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<CheckboxField
					label={label}
					description={description}
					required={required}
					disabled={disabled}
					checked={Boolean(field.value)}
					error={fieldState.invalid}
					helperText={fieldState.error?.message}
					onBlur={field.onBlur}
					onChange={(event) =>
						field.onChange((event.target as HTMLInputElement).checked)
					}
				/>
			)}
		/>
	);
}

export { FormCheckbox };
