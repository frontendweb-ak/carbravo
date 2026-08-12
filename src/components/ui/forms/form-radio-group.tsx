import { type OptionGroupAccessors, resolveOption } from "@/utils";
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
	Radio,
	RadioGroup,
	type RadioGroupProps,
} from "../primitives";

export type FormRadioGroupProps<
	T extends FieldValues,
	TOption = unknown,
> = Omit<RadioGroupProps, "value" | "onValueChange" | "disabled" | "children"> &
	OptionGroupAccessors<TOption> & {
		control: Control<T>;
		name: Path<T>;

		options: TOption[];

		label?: ReactNode;
		required?: boolean;
		description?: ReactNode;

		disabled?: boolean;
	};

function FormRadioGroup<T extends FieldValues, TOption = unknown>({
	control,
	name,
	options,
	label,
	required = false,
	description,
	disabled = false,
	getValue,
	getLabel,
	getDescription,
	getDisabled,
	...props
}: FormRadioGroupProps<T, TOption>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const groupId = `${String(name)}-radio-group`;

				return (
					<Field invalid={fieldState.invalid} disabled={disabled}>
						{label && (
							<FieldLabel>
								{label}
								{required && <FieldRequired />}
							</FieldLabel>
						)}

						<RadioGroup
							{...props}
							value={field.value ?? ""}
							onValueChange={field.onChange}
							disabled={disabled}
							aria-invalid={fieldState.invalid || undefined}
							aria-describedby={
								description ? `${groupId}-description` : undefined
							}
						>
							{options.map((option) => {
								const resolved = resolveOption(option, {
									getValue,
									getLabel,
									getDescription,
									getDisabled,
								});

								const id = `${groupId}-${resolved.value}`;

								const optionDisabled = disabled || resolved.disabled;

								return (
									<label
										key={resolved.value}
										htmlFor={id}
										className={[
											"flex items-start gap-2",
											optionDisabled
												? "cursor-not-allowed opacity-50"
												: "cursor-pointer",
										].join(" ")}
									>
										<Radio
											id={id}
											value={resolved.value}
											disabled={optionDisabled}
										/>

										<div className="flex flex-col gap-0.5">
											{resolved.label != null && (
												<span className="text-sm leading-5">
													{resolved.label}
												</span>
											)}

											{resolved.description != null && (
												<span className="text-xs text-muted-foreground">
													{resolved.description}
												</span>
											)}
										</div>
									</label>
								);
							})}
						</RadioGroup>

						{description && (
							<FieldDescription id={`${groupId}-description`}>
								{description}
							</FieldDescription>
						)}

						{fieldState.error && (
							<FieldError>{fieldState.error.message}</FieldError>
						)}
					</Field>
				);
			}}
		/>
	);
}

export { FormRadioGroup };
