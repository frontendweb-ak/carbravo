import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import {
	DateTimeInput,
	type DateTimeInputProps,
	FormField,
} from "../primitives";


export type FormDateTimeInputProps<T extends FieldValues> = Omit<
	DateTimeInputProps,
	"value" | "onChange"
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
						value={field.value ? new Date(field.value) : null}
						onChange={(date) => {
							field.onChange(date ? date.toISOString() : "");
						}}
						error={!!fieldState.error}
						helperText={fieldState.error?.message}
					/>
				</FormField>
			)}
		/>
	);
}

export { FormDateTimeInput };

