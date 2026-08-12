import type { ReactNode } from "react";

import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import {
	ChipGroup,
	type ChipGroupProps,
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldRequired,
} from "../primitives";

export type FormChoiceChipGroupProps<
	T,
	TFieldValues extends FieldValues,
> = Omit<ChipGroupProps<T>, "value" | "onValueChange" | "disabled"> & {
	control: Control<TFieldValues>;
	name: Path<TFieldValues>;
	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	disabled?: boolean;
};

function FormChoiceChipGroup<T, TFieldValues extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	disabled = false,
	selectionMode = "single",
	...props
}: FormChoiceChipGroupProps<T, TFieldValues>) {
	const id = `${String(name)}-choice-chip-group`;

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const value =
					selectionMode === "multiple"
						? Array.isArray(field.value)
							? field.value
							: []
						: typeof field.value === "string"
							? field.value
							: "";

				return (
					<Field invalid={fieldState.invalid} disabled={disabled}>
						{label && (
							<FieldLabel htmlFor={id}>
								{label}

								{required && <FieldRequired />}
							</FieldLabel>
						)}

						<ChipGroup
							{...props}
							id={id}
							selectionMode={selectionMode}
							value={value}
							onValueChange={field.onChange}
							disabled={disabled}
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

export { FormChoiceChipGroup };
