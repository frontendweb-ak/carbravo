import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import { TimeInput, type TimeInputProps } from "../primitives";
import { FormField } from "./form-field";

export type FormTimeInputProps<T extends FieldValues> = Omit<
	TimeInputProps,
	"name" | "value" | "defaultValue" | "onChange" | "onBlur"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	rightElement?: ReactNode;
};

function FormTimeInput<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	rightElement,
	...props
}: FormTimeInputProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<FormField
					label={label}
					required={required}
					description={description}
					error={fieldState.error?.message}
					disabled={props.disabled}
					rightElement={rightElement}
				>
					<TimeInput
						{...props}
						{...field}
						value={field.value ?? ""}
						error={!!fieldState.error}
						aria-invalid={fieldState.error ? true : undefined}
					/>
				</FormField>
			)}
		/>
	);
}

export { FormTimeInput };
