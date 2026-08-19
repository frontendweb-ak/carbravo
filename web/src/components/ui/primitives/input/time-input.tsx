// src/components/ui/primitives/time-input/time-input.tsx

import { forwardRef } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { pickerTextFieldSx } from "./picker-styles";

export interface TimeInputProps {
	value?: Date | null;
	onChange?: (value: Date | null) => void;

	disabled?: boolean;
	error?: boolean;
	helperText?: string;

	fullWidth?: boolean;
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
	(
		{
			value,
			onChange,
			disabled = false,
			error = false,
			helperText,
			fullWidth = true,
		},
		ref,
	) => {
		return (
			<TimePicker
				value={value ?? null}
				onChange={onChange}
				disabled={disabled}
				format="HH:mm"
				slots={{
					openPickerIcon: AccessTimeIcon,
				}}
				slotProps={{
					textField: {
						inputRef: ref,
						label: undefined,
						error,
						helperText,
						fullWidth,
						sx: pickerTextFieldSx,
					},
				}}
			/>
		);
	},
);

TimeInput.displayName = "TimeInput";

export { TimeInput };
