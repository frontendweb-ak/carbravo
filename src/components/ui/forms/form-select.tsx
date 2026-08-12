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



type FormSelectBaseProps<T, TFieldValues extends FieldValues> = Omit<
	SelectDataProps<T, "id">,
	"value" | "onValueChange" | "disabled" | "valueType"
> & {
	control: Control<TFieldValues>;
	name: Path<TFieldValues>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;

	disabled?: boolean;
};

/* -------------------------------------------------------------------------- */
/* ID mode                                                                     */
/* -------------------------------------------------------------------------- */

export type FormSelectIdProps<
	T,
	TFieldValues extends FieldValues,
> = FormSelectBaseProps<T, TFieldValues> & {
	valueType?: "id";
};

/* -------------------------------------------------------------------------- */
/* Object mode                                                                 */
/* -------------------------------------------------------------------------- */

export type FormSelectObjectProps<T, TFieldValues extends FieldValues> = Omit<
	SelectDataProps<T, "object">,
	"value" | "onValueChange" | "disabled" | "valueType"
> & {
	control: Control<TFieldValues>;
	name: Path<TFieldValues>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;

	disabled?: boolean;

	valueType: "object";
};

/* -------------------------------------------------------------------------- */
/* Props                                                                       */
/* -------------------------------------------------------------------------- */

export type FormSelectProps<T, TFieldValues extends FieldValues> =
	| FormSelectIdProps<T, TFieldValues>
	| FormSelectObjectProps<T, TFieldValues>;

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

function FormSelect<T, TFieldValues extends FieldValues>(
	props: FormSelectProps<T, TFieldValues>,
) {
	const {
		control,
		name,
		label,
		required = false,
		description,
		disabled = false,
	} = props;

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field invalid={fieldState.invalid} disabled={disabled}>
					{label && (
						<FieldLabel>
							{label}

							{required && <FieldRequired />}
						</FieldLabel>
					)}

					{props.valueType === "object" ? (
						<SelectData
							{...props}
							valueType="object"
							value={field.value as T | null}
							onValueChange={(value) => {
								field.onChange(value);
							}}
							disabled={disabled}
							aria-invalid={fieldState.invalid || undefined}
						/>
					) : (
						<SelectData
							{...props}
							valueType="id"
							value={String(field.value ?? "")}
							onValueChange={(value) => {
								field.onChange(value);
							}}
							disabled={disabled}
							aria-invalid={fieldState.invalid || undefined}
						/>
					)}

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

