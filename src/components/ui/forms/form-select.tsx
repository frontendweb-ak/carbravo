import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldRequired,
	SelectData,
	type SelectDataProps,
} from "../primitives";

export type FormSelectProps<T, TFieldValues extends FieldValues> = Omit<
	SelectDataProps<T>,
	"value" | "onValueChange" | "disabled"
> & {
	control: Control<TFieldValues>;
	name: Path<TFieldValues>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;

	disabled?: boolean;
};

function FormSelect<T, TFieldValues extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	disabled = false,
	...props
}: FormSelectProps<T, TFieldValues>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field invalid={fieldState.invalid} disabled={disabled}>
					{label && (
						<FieldLabel htmlFor={`${String(name)}-select`}>
							{label}
							{required && <FieldRequired />}
						</FieldLabel>
					)}

					<SelectData
						{...props}
						value={field.value ?? ""}
						onValueChange={field.onChange}
						disabled={disabled}
						triggerProps={{
							id: `${String(name)}-select`,
							"aria-invalid": fieldState.invalid || undefined,
						}}
					/>

					{description && <FieldDescription>{description}</FieldDescription>}

					{fieldState.error && (
						<FieldError>{fieldState.error.message}</FieldError>
					)}
				</Field>
			)}
		/>
	);
}

export { FormSelect };
