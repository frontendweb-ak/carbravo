// src/components/ui/date-time-input.tsx

import { forwardRef } from "react";

import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import CalendarClock from "@mui/icons-material/EventAvailable";
export interface DateTimeInputProps {
	value?: Date | null;
	onChange?: (value: Date | null) => void;
	disabled?: boolean;
	label?: string;
	placeholder?: string;
	error?: boolean;
	helperText?: string;
	fullWidth?: boolean;
}

const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
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
			<DateTimePicker
				value={value}
				onChange={onChange}
				disabled={disabled}
				format="dd-MM-yyyy HH:mm"
				slots={{
					openPickerIcon: CalendarClock,
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

DateTimeInput.displayName = "DateTimeInput";

export { DateTimeInput };

