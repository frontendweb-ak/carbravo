import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import {
	Box,
	FormControl,
	FormHelperText,
	InputLabel,
	Typography,
} from "@mui/material";

import { Textarea, type TextareaProps } from "../primitives";

export type FormTextareaProps<T extends FieldValues> = Omit<
	TextareaProps,
	"name" | "value" | "defaultValue" | "onChange" | "onBlur"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	showCounter?: boolean;
};
function FormTextarea<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	showCounter = true,
	maxLength,
	disabled = false,
	...props
}: FormTextareaProps<T>) {
	const id = `${String(name)}-textarea`;

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const value = String(field.value ?? "");
				const currentLength = value.length;

				return (
					<FormControl fullWidth error={fieldState.invalid} disabled={disabled}>
						{label && (
							<InputLabel shrink htmlFor={id} required={required}>
								{label}
							</InputLabel>
						)}

						<Box sx={{ position: "relative" }}>
							<Textarea
								{...props}
								id={id}
								value={value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								inputRef={field.ref}
								disabled={disabled}
								error={fieldState.invalid}
								sx={{
									...(maxLength && {
										"& textarea": {
											paddingBottom: "28px",
										},
									}),
									...(props.sx || {}),
								}}
							/>

							{showCounter && maxLength != null && (
								<Typography
									variant="caption"
									component="span"
									sx={{
										position: "absolute",
										right: 12,
										bottom: 8,
										pointerEvents: "none",
										color:
											currentLength >= maxLength
												? "error.main"
												: "text.secondary",
									}}
								>
									{currentLength}/{maxLength}
								</Typography>
							)}
						</Box>

						{(fieldState.error?.message || description) && (
							<FormHelperText>
								{fieldState.error?.message ?? description}
							</FormHelperText>
						)}
					</FormControl>
				);
			}}
		/>
	);
}

export { FormTextarea };

