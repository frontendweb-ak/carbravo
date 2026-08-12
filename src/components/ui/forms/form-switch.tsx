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
	Switch,
	type SwitchProps,
} from "../primitives";

export type FormSwitchProps<T extends FieldValues> = Omit<
	SwitchProps,
	"checked" | "defaultChecked" | "onCheckedChange"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
};
function FormSwitch<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	disabled,
	...props
}: FormSwitchProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const id = `${String(name)}-switch`;
				const descriptionId = description ? `${id}-description` : undefined;

				return (
					<Field
						orientation="horizontal"
						invalid={fieldState.invalid}
						disabled={disabled}
					>
						<Switch
							{...props}
							id={id}
							checked={Boolean(field.value)}
							disabled={disabled}
							onCheckedChange={(checked) => {
								field.onChange(checked);
							}}
							onBlur={field.onBlur}
							ref={field.ref}
							aria-invalid={fieldState.invalid || undefined}
							aria-describedby={descriptionId}
						/>

						{(label || description || fieldState.error) && (
							<div className="flex flex-col gap-0.5">
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
							</div>
						)}
					</Field>
				);
			}}
		/>
	);
}

export { FormSwitch };
