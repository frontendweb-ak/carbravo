import { type InputTransform, parseInputValue, transformValue } from "@/utils";
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
	Input,
	type InputProps,
} from "../primitives";
import { FieldRequired } from "../primitives/label";

export type FormInputProps<T extends FieldValues> = Omit<
	InputProps,
	"name" | "value" | "defaultValue" | "onChange" | "onBlur"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	rightElement?: ReactNode;
	transform?: InputTransform;
};

function FormInput<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	rightElement,
	transform = "none",
	parseMode,
	...props
}: FormInputProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const id = `${String(name)}-input`;

				const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
					let value = event.target.value;

					// First sanitize/parse the input.
					if (parseMode) {
						value = parseInputValue(value, parseMode);
					}

					// Then apply presentation/business transformation.
					if (transform !== "none") {
						value = transformValue(value, transform);
					}

					field.onChange(value);
				};

				return (
					<Field invalid={fieldState.invalid} disabled={props.disabled}>
						{(label || rightElement) && (
							<div className="flex items-center justify-between gap-3">
								{label && (
									<FieldLabel htmlFor={id}>
										{label}
										{required && <FieldRequired />}
									</FieldLabel>
								)}

								{rightElement}
							</div>
						)}

						<Input
							{...props}
							{...field}
							id={id}
							value={field.value ?? ""}
							onChange={handleChange}
							error={fieldState.invalid}
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

export { FormInput };
