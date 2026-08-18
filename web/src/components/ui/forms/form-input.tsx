import {
	type InputParseMode,
	type InputTransform,
	parseInputValue,
	transformValue,
} from "@/utils";
import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import { FormField, Input, type InputProps } from "../primitives";

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
	parseMode?: InputParseMode;
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
				const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
					let value = event.target.value;

					if (parseMode) {
						value = parseInputValue(value, parseMode);
					}

					if (transform !== "none") {
						value = transformValue(value, transform);
					}

					field.onChange(value);
				};

				return (
					<FormField
						label={label}
						required={required}
						description={description}
						error={fieldState.error?.message}
						disabled={props.disabled}
						rightElement={rightElement}
					>
						<Input
							{...props}
							{...field}
							value={field.value ?? ""}
							onChange={handleChange}
							error={fieldState.invalid}
						/>
					</FormField>
				);
			}}
		/>
	);
}

export { FormInput };

