import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import {
	Checkbox,
	type CheckboxProps,
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "../primitives";

import { FieldRequired } from "../primitives/label";

export type FormCheckboxProps<T extends FieldValues> = Omit<
	CheckboxProps,
	"checked" | "defaultChecked" | "onCheckedChange"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
};

function FormCheckbox<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	disabled,
	...props
}: FormCheckboxProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const id = `${String(name)}-checkbox`;
				const descriptionId = description ? `${id}-description` : undefined;

				return (
					<Field
						orientation="horizontal"
						invalid={fieldState.invalid}
						disabled={disabled}
					>
						<Checkbox
							{...props}
							id={id}
							checked={Boolean(field.value)}
							disabled={disabled}
							onCheckedChange={(checked) => field.onChange(checked === true)}
							onBlur={field.onBlur}
							ref={field.ref}
							aria-invalid={fieldState.invalid || undefined}
							aria-describedby={descriptionId}
						/>

						<FieldContent>
							{label && (
								<FieldLabel htmlFor={id}>
									{label}
									{required && <FieldRequired />}
								</FieldLabel>
							)}

							{description && (
								<FieldDescription id={descriptionId}>
									{description}
								</FieldDescription>
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

export { FormCheckbox };
