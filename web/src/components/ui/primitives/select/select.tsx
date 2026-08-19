// src/components/ui/primitives/select/select.tsx

import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import MuiSelect, {
	type SelectProps as MuiSelectProps,
} from "@mui/material/Select";
import type { ReactNode } from "react";
import { forwardRef } from "react";

export type SelectSize = "sm" | "default" | "lg";

export interface SelectOption {
	value: string;
	label: ReactNode;
	disabled?: boolean;
}

export interface SelectProps extends Omit<
	MuiSelectProps<string>,
	"size" | "ref"
> {
	size?: SelectSize;
	options?: SelectOption[];
	placeholder?: ReactNode;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
	(
		{
			size = "default",
			options = [],
			placeholder,
			value = "",
			disabled = false,
			error = false,
			sx,
			...props
		},
		ref,
	) => {
		const height = size === "sm" ? 32 : size === "lg" ? 40 : 36;

		const padding =
			size === "sm" ? "6px 10px" : size === "lg" ? "10px 14px" : "8.5px 12px";

		return (
			<MuiSelect
				{...props}
				ref={ref}
				variant="outlined"
				value={value ?? ""}
				disabled={disabled}
				error={error}
				fullWidth
				displayEmpty
				size={size === "sm" ? "small" : "medium"}
				input={
					<OutlinedInput
						notched={false}
						sx={{
							minHeight: height,

							"& .MuiOutlinedInput-notchedOutline": {
								border: "1px solid",
								borderColor: "divider",
							},

							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "text.secondary",
							},

							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderColor: "primary.main",
							},

							"&.Mui-error .MuiOutlinedInput-notchedOutline": {
								borderColor: "error.main",
							},

							"&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
								borderColor: "divider",
							},

							"& .MuiSelect-select": {
								padding,
							},
						}}
					/>
				}
				sx={[
					{
						width: "100%",

						"& .MuiSelect-select": {
							display: "flex",
							alignItems: "center",
							boxSizing: "border-box",
						},

						"& .MuiSelect-icon": {
							right: 10,
						},
					},

					...(Array.isArray(sx) ? sx : [sx]),
				]}
			>
				{placeholder && (
					<MenuItem value="" disabled>
						{placeholder}
					</MenuItem>
				)}

				{options.map((option) => (
					<MenuItem
						key={option.value}
						value={option.value}
						disabled={option.disabled}
					>
						{option.label}
					</MenuItem>
				))}
			</MuiSelect>
		);
	},
);

Select.displayName = "Select";

export { Select };
