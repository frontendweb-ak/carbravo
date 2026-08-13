import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";
import { DateTimeInput, type DateTimeInputProps } from "../primitives";
import { FormField } from "./form-field";

export type FormDateTimeInputProps<T extends FieldValues> = Omit<
	DateTimeInputProps,
	"name" | "value" | "defaultValue" | "onChange" | "onBlur"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	rightElement?: ReactNode;
};

function FormDateTimeInput<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	rightElement,
	...props
}: FormDateTimeInputProps<T>) {
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
					<DateTimeInput
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

export { FormDateTimeInput };
