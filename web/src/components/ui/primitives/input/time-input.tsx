// src/components/ui/time-input.tsx

import { forwardRef } from "react";

import TextField from "@mui/material/TextField";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import Clock3 from "@mui/icons-material/AccessTime";
export interface TimeInputProps {
	value?: Date | null;
	onChange?: (value: Date | null) => void;
	disabled?: boolean;
	label?: string;
	placeholder?: string;
	error?: boolean;
	helperText?: string;
	fullWidth?: boolean;
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
	(
		{
			value,
			onChange,
			disabled,
			label,
			placeholder,
			error,
			helperText,
			fullWidth = true,
		},
		ref,
	) => {
		return (
			<TimePicker
				value={value}
				onChange={onChange}
				disabled={disabled}
				format="HH:mm"
				slots={{
					openPickerIcon: Clock3,
				}}
				slotProps={{
					textField: {
						inputRef: ref,
						label,

						error,
						helperText,
						fullWidth,
					} satisfies React.ComponentProps<typeof TextField>,
				}}
			/>
		);
	},
);

TimeInput.displayName = "TimeInput";

export { TimeInput };

