import type { ReactNode } from "react";

import { FormControlLabel, FormHelperText, Switch } from "@mui/material";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

export interface FormSwitchProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	disabled?: boolean;

	size?: "small" | "medium";
}

function FormSwitch<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	disabled,
	size = "small",
}: FormSwitchProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const id = `${String(name)}-switch`;
				const descriptionId = description ? `${id}-description` : undefined;
				const errorId = fieldState.error ? `${id}-error` : undefined;

				return (
					<div>
						<FormControlLabel
							control={
								<Switch
									id={id}
									size={size}
									checked={Boolean(field.value)}
									disabled={disabled}
									onChange={(event) => {
										field.onChange(event.target.checked);
									}}
									onBlur={field.onBlur}
								/>
							}
							label={
								label ? (
									<>
										{label}

										{required && (
											<span
												style={{
													marginLeft: 6,
													color: "var(--mui-palette-error-main)",
												}}
											>
												*
											</span>
										)}
									</>
								) : undefined
							}
							sx={{
								margin: 0,
								alignItems: "center",

								"& .MuiFormControlLabel-label": {
									fontSize: 14,
									fontWeight: 500,
								},
							}}
						/>

						{description && !fieldState.error && (
							<FormHelperText
								id={descriptionId}
								sx={{
									marginLeft: 6,
									marginTop: 0.5,
								}}
							>
								{description}
							</FormHelperText>
						)}

						{fieldState.error && (
							<FormHelperText
								id={errorId}
								error
								sx={{
									marginLeft: 6,
									marginTop: 0.5,
								}}
							>
								{fieldState.error.message}
							</FormHelperText>
						)}
					</div>
				);
			}}
		/>
	);
}

export { FormSwitch };

