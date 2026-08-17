import type { ReactNode } from "react";
import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export interface ChoiceOption<T> {
	label: ReactNode;
	value: T;
}

export interface FormChoiceChipGroupProps<
		T  extends {},
	TFieldValues extends FieldValues,
> {
	control: Control<TFieldValues>;
	name: Path<TFieldValues>;

	options: ChoiceOption<T>[];

	label?: ReactNode;
	description?: ReactNode;

	required?: boolean;
	disabled?: boolean;

	selectionMode?: "single" | "multiple";
}

function FormChoiceChipGroup<
	T  extends {},
	TFieldValues extends FieldValues,
>({
	control,
	name,
	options,
	label,
	description,
	required = false,
	disabled = false,
	selectionMode = "single",
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
								fontWeight: 600,
							}}
						>
							{label}
							{required && " *"}
						</FormLabel>
					)}

					<ToggleButtonGroup
						exclusive={selectionMode === "single"}
						value={
							selectionMode === "multiple"
								? (field.value ?? [])
								: (field.value ?? null)
						}
						onChange={(_, value) => field.onChange(value)}
						sx={{
							flexWrap: "wrap",
							gap: 1,
						}}
					>
						{options.map((option) => (
							<ToggleButton key={String(option.value)} value={option.value}>
								{option.label}
							</ToggleButton>
						))}
					</ToggleButtonGroup>

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

export { FormChoiceChipGroup };

