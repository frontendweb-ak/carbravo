// src/components/ui/forms/form-time-input.tsx

import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import { FormField, TimeInput, type TimeInputProps } from "../primitives";

export type FormTimeInputProps<T extends FieldValues> = Omit<
	TimeInputProps,
	"value" | "onChange"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;

	showRequiredIndicator?: boolean;
	showDescriptionWithError?: boolean;
};

function FormTimeInput<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	disabled = false,
	showRequiredIndicator = true,
	showDescriptionWithError = false,
	...props
}: FormTimeInputProps<T>) {
	const id = `${String(name)}-time`;

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
					<TimeInput
						{...props}
						value={field.value ?? null}
						onChange={field.onChange}
						disabled={disabled}
						error={fieldState.invalid}
						fullWidth
					/>
				</FormField>
			)}
		/>
	);
}

export { FormTimeInput };
