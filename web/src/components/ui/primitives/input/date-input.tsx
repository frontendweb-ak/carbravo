// src/components/ui/date-input.tsx


import CalendarDays from "@mui/icons-material/CalendarMonth";
import { forwardRef } from "react";

import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { displayToIso, isoToDisplay } from "@/utils";

export interface DateInputProps {
	value?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
	label?: string;
	placeholder?: string;
	error?: boolean;
	helperText?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
	(
		{
			value,
			onChange,
			disabled,
			label,
			placeholder = "DD-MM-YYYY",
			error,
			helperText,
		},
		ref,
	) => {
		return (
			<DatePicker
				disabled={disabled}
				format="dd-MM-yyyy"
				value={value ? new Date(displayToIso(value)) : null}
				onChange={(date) => {
					if (!date) {
						onChange?.("");
						return;
					}

					const iso = date.toISOString().split("T")[0];
					onChange?.(isoToDisplay(iso));
				}}
				slots={{
					openPickerIcon: CalendarDays,
				}}
				slotProps={{
					textField: {
						inputRef: ref,
						label,
						error,
						helperText,

						fullWidth: true,
					} satisfies React.ComponentProps<typeof TextField>,
				}}
			/>
		);
	},
);

DateInput.displayName = "DateInput";

export { DateInput };

