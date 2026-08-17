import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import {
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
	Radio,
	RadioGroup,
} from "@mui/material";

import { type OptionGroupAccessors, resolveOption } from "@/utils";

export type FormRadioGroupProps<
	T extends FieldValues,
	TOption = unknown,
> = OptionGroupAccessors<TOption> & {
	control: Control<T>;
	name: Path<T>;

	options: TOption[];

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	disabled?: boolean;

	row?: boolean;
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
	row = false,
}: FormRadioGroupProps<T, TOption>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<FormControl fullWidth error={fieldState.invalid} disabled={disabled}>
					{label && <FormLabel required={required}>{label}</FormLabel>}

					<RadioGroup
						row={row}
						value={field.value ?? ""}
						onChange={(event) => field.onChange(event.target.value)}
						onBlur={field.onBlur}
					>
						{options.map((option) => {
							const resolved = resolveOption(option, {
								getValue,
								getLabel,
								getDescription,
								getDisabled,
							});

							return (
								<FormControlLabel
									key={resolved.value}
									value={resolved.value}
									disabled={disabled || resolved.disabled}
									control={<Radio />}
									label={
										<div>
											<div>{resolved.label}</div>

											{resolved.description && (
												<div
													style={{
														fontSize: 12,
														opacity: 0.7,
													}}
												>
													{resolved.description}
												</div>
											)}
										</div>
									}
								/>
							);
						})}
					</RadioGroup>

					{fieldState.error ? (
						<FormHelperText>{fieldState.error.message}</FormHelperText>
					) : (
						description && <FormHelperText>{description}</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	);
}

export { FormRadioGroup };
