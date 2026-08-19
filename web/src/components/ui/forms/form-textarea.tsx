import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import { Box, Typography } from "@mui/material";

import { FormField, Textarea, type TextareaProps } from "../primitives";

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
	showCounter = false,
	maxLength,
	disabled = false,
	...props
}: FormTextareaProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const value = String(field.value ?? "");
				const currentLength = value.length;

				return (
					<FormField
						label={label}
						required={required}
						description={description}
						error={fieldState.error?.message}
						disabled={disabled}
					>
						<Box sx={{ position: "relative" }}>
							<Textarea
								{...props}
								value={value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								inputRef={field.ref}
								disabled={disabled}
								error={fieldState.invalid}
								maxLength={maxLength}
								sx={{
									...(showCounter &&
										maxLength != null && {
											"& textarea": {
												paddingBottom: "28px",
											},
										}),
									...(props.sx ?? {}),
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
					</FormField>
				);
			}}
		/>
	);
}

export { FormTextarea };

