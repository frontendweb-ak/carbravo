import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import { DateInput, type DateInputProps, FormField } from "../primitives";


export type FormDateInputProps<T extends FieldValues> = Omit<
	DateInputProps,
	"value" | "onChange"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	rightElement?: ReactNode;
};

function FormDateInput<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	rightElement,
	...props
}: FormDateInputProps<T>) {
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
					<DateInput
						{...props}
						value={field.value ?? ""}
						onChange={field.onChange}
						error={!!fieldState.error}
						helperText={fieldState.error?.message}
					/>
				</FormField>
			)}
		/>
	);
}

export { FormDateInput };

