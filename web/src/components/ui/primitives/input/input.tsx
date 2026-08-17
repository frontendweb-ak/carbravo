// src/components/ui/primitives/input/input.tsx

import OutlinedInput, {
	type OutlinedInputProps,
} from "@mui/material/OutlinedInput";
import { forwardRef } from "react";

export type InputSize = "sm" | "default" | "lg";

export interface InputProps extends Omit<OutlinedInputProps, "size"> {
	size?: InputSize;
	success?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			size = "default",
			success = false,
			error = false,
			disabled,
			readOnly,
			sx,
			...props
		},
		ref,
	) => {
		return (
			<OutlinedInput
				{...props}
				inputRef={ref}
				error={error}
				disabled={disabled}
				readOnly={readOnly}
				fullWidth
				sx={(theme) => ({
					backgroundColor: theme.palette.background.paper,

					...(size === "sm" && {
						height: 32,
						fontSize: 14,
					}),

					...(size === "default" && {
						height: 36,
						fontSize: 14,
					}),

					...(size === "lg" && {
						height: 40,
						fontSize: 16,
					}),

					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: theme.palette.divider,
					},

					"&:hover .MuiOutlinedInput-notchedOutline": {
						borderColor: theme.palette.primary.main,
					},

					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: theme.palette.primary.main,
						borderWidth: 1,
					},
				})}
				{...props}
			/>
		);
	},
);

Input.displayName = "Input";

export { Input };
