import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";
import { DateInput, type DateInputProps } from "../primitives";
import { FormField } from "./form-field";

export type FormDateInputProps<T extends FieldValues> = Omit<
	DateInputProps,
	"name" | "value" | "defaultValue" | "onChange" | "onBlur"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: React.ReactNode;
	required?: boolean;
	description?: React.ReactNode;
	rightElement?: React.ReactNode;
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

export { FormDateInput };
