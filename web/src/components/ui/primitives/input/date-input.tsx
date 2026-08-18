import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { forwardRef } from "react";

import { displayToIso, isoToDisplay } from "@/utils";
import { pickerTextFieldSx } from "./picker-styles";

export interface DateInputProps {
	value?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
	error?: boolean;
	helperText?: string;
	fullWidth?: boolean;
	minDate?: Date;
	maxDate?: Date;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
	(
		{
			value,
			onChange,
			disabled,
			error,
			helperText,
			fullWidth = true,
			minDate,
			maxDate,
		},
		ref,
	) => {
		const pickerValue = value ? new Date(displayToIso(value)) : null;

		return (
			<DatePicker
				value={pickerValue}
				disabled={disabled}
				minDate={minDate}
				maxDate={maxDate}
				format="dd-MM-yyyy"
				onChange={(date) => {
					if (!date) {
						onChange?.("");
						return;
					}

					const year = date.getFullYear();
					const month = String(date.getMonth() + 1).padStart(2, "0");
					const day = String(date.getDate()).padStart(2, "0");

					onChange?.(isoToDisplay(`${year}-${month}-${day}`));
				}}
				slots={{
					openPickerIcon: CalendarMonthIcon,
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

DateInput.displayName = "DateInput";

export { DateInput };
