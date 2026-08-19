// src/components/ui/forms/form-select.tsx

import type { ReactNode } from "react";
import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form";

import { FormField, Select, type SelectProps } from "../primitives";

export interface FormSelectProps<T extends FieldValues> extends Omit<
	SelectProps,
	"name" | "value" | "defaultValue" | "onChange" | "onBlur"
> {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;

	showRequiredIndicator?: boolean;
	showDescriptionWithError?: boolean;
}

function FormSelect<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	disabled = false,
	showRequiredIndicator = true,
	showDescriptionWithError = false,
	...props
}: FormSelectProps<T>) {
	const id = `${String(name)}-select`;

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<FormField
					id={id}
					label={label}
					required={required}
					description={description}
					error={fieldState.error?.message}
					disabled={disabled}
					showRequiredIndicator={showRequiredIndicator}
					showDescriptionWithError={showDescriptionWithError}
				>
					<Select
						{...props}
						id={id}
						name={field.name}
						value={String(field.value ?? "")}
						onChange={(event) => {
							field.onChange(event.target.value);
						}}
						onBlur={field.onBlur}
						disabled={disabled}
						error={fieldState.invalid}
					/>
				</FormField>
			)}
		/>
	);
}

export { FormSelect };
