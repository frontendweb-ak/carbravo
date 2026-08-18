// src/components/ui/date-time-input.tsx

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { forwardRef } from "react";
import { pickerTextFieldSx } from "./picker-styles";

export interface DateTimeInputProps {
	value?: Date | null;
	onChange?: (value: Date | null) => void;
	disabled?: boolean;
	error?: boolean;
	helperText?: string;
	fullWidth?: boolean;
	minDateTime?: Date;
	maxDateTime?: Date;
}

const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
	(
		{
			value,
			onChange,
			disabled,
			error,
			helperText,
			fullWidth = true,
			minDateTime,
			maxDateTime,
		},
		ref,
	) => {
		return (
			<DateTimePicker
				value={value}
				onChange={onChange}
				disabled={disabled}
				minDateTime={minDateTime}
				maxDateTime={maxDateTime}
				format="dd-MM-yyyy HH:mm"
				slots={{
					openPickerIcon: EventAvailableIcon,
				}}
				slotProps={{
					textField: {
						inputRef: ref,
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

DateTimeInput.displayName = "DateTimeInput";

export { DateTimeInput };

