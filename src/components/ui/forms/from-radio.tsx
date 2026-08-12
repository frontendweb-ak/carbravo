import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
	Radio,
	type RadioProps,
} from "../primitives";

import { FieldRequired } from "../primitives/label";

export type FormRadioProps<T extends FieldValues> = Omit<
	RadioProps,
	"checked"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
};

function FormRadio<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	disabled,
	value,
	...props
}: FormRadioProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const id = `${String(name)}-${String(value)}`;

				return (
					<Field
						orientation="horizontal"
						invalid={fieldState.invalid}
						disabled={disabled}
					>
						<Radio
							{...props}
							id={id}
							value={value}
							disabled={disabled}
							aria-invalid={fieldState.invalid || undefined}
							ref={field.ref}
						/>

						<FieldContent>
							{label && (
								<FieldLabel htmlFor={id}>
									{label}
									{required && <FieldRequired />}
								</FieldLabel>
							)}

							{description && (
								<FieldDescription>{description}</FieldDescription>
							)}

							{fieldState.error && (
								<FieldError>{fieldState.error.message}</FieldError>
							)}
						</FieldContent>
					</Field>
				);
			}}
		/>
	);
}

export { FormRadio };
