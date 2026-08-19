import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";

import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form";

import { Box } from "@mui/material";
import type { ReactNode } from "react";
import {
	ChoiceChipGroup,
	type ChoiceChipColor,
	type ChoiceChipOption,
	type ChoiceChipVariant,
} from "../primitives";

export interface FormChoiceChipGroupProps<T, TFieldValues extends FieldValues> {
	control: Control<TFieldValues>;
	name: Path<TFieldValues>;
	options: ChoiceChipOption<T>[];
	label?: ReactNode;
	description?: ReactNode;
	required?: boolean;
	disabled?: boolean;
	selectionMode?: "single" | "multiple";
	color?: ChoiceChipColor;
	variant?: ChoiceChipVariant;
	showCheck?: boolean;
	borderRadius?: number | string;
	minHeight?: number;
	paddingX?: number | string;
	fontSize?: number | string;
	fontWeight?: number;
	gap?: number;
}
function FormChoiceChipGroup<T, TFieldValues extends FieldValues>({
	control,
	name,
	options,
	label,
	description,
	required = false,
	disabled = false,
	selectionMode = "single",
	color = "primary",
	variant = "soft",
	borderRadius,
	fontSize,
	fontWeight,
	minHeight,
	paddingX,
	showCheck,
	gap = 2,
}: FormChoiceChipGroupProps<T, TFieldValues>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<FormControl fullWidth error={fieldState.invalid} disabled={disabled}>
					{label && (
						<FormLabel
							sx={{
								mb: 1,
								color: "text.secondary",
								fontSize: "0.75rem",
								lineHeight: 1.4,
								fontWeight: 700,
								textTransform: "uppercase",
								letterSpacing: "0.02em",

								"&.Mui-focused": {
									color: "text.secondary",
								},
							}}
						>
							{label}
							{required && (
								<Box
									component="span"
									sx={{
										ml: 0.5,
										color: "warning.main",
										fontSize: "0.625rem",
									}}
								>
									REQUIRED
								</Box>
							)}
						</FormLabel>
					)}

					<ChoiceChipGroup
						options={options}
						value={field.value}
						onChange={field.onChange}
						selectionMode={selectionMode}
						color={color}
						variant={variant}
						showCheck={showCheck}
						borderRadius={borderRadius}
						minHeight={minHeight}
						paddingX={paddingX}
						fontSize={fontSize}
						fontWeight={fontWeight}
						gap={gap}
						disabled={disabled}
					/>

					{fieldState.error ? (
						<FormHelperText>{fieldState.error.message}</FormHelperText>
					) : (
						description && (
							<FormHelperText
								sx={{
									mt: 0.75,
									ml: 0,
									fontSize: "0.6875rem",
								}}
							>
								{description}
							</FormHelperText>
						)
					)}
				</FormControl>
			)}
		/>
	);
}

export { FormChoiceChipGroup };

