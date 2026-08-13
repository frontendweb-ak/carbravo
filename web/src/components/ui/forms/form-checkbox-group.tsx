import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import {
	CheckboxGroup,
	type CheckboxGroupProps,
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "../primitives";

import { FieldRequired } from "../primitives/label";

export type FormCheckboxGroupProps<T extends FieldValues, O> = Omit<
	CheckboxGroupProps<O>,
	"value" | "onValueChange" | "disabled"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	disabled?: boolean;
};

function FormCheckboxGroup<T extends FieldValues, O>({
	control,
	name,
	label,
	required = false,
	description,
	disabled,
	options,
	...props
}: FormCheckboxGroupProps<T, O>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const value: string[] = Array.isArray(field.value)
					? field.value.map(String)
					: [];

				return (
					<Field invalid={fieldState.invalid} disabled={disabled}>
						{label && (
							<FieldLabel>
								{label}
								{required && <FieldRequired />}
							</FieldLabel>
						)}

						<CheckboxGroup<O>
							{...props}
							options={options}
							value={value}
							disabled={disabled}
							onValueChange={field.onChange}
							aria-invalid={fieldState.invalid || undefined}
						/>

						{description && <FieldDescription>{description}</FieldDescription>}
						{fieldState.error && (
							<FieldError>{fieldState.error.message}</FieldError>
						)}
					</Field>
				);
			}}
		/>
	);
}

export { FormCheckboxGroup };

