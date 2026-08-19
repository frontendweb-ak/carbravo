// src/components/ui/primitives/input/input.tsx

import OutlinedInput, {
	type OutlinedInputProps,
} from "@mui/material/OutlinedInput";
import type { Theme } from "@mui/material/styles";
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
			disabled = false,
			sx,
			...props
		},
		ref,
	) => {
		const muiSize: OutlinedInputProps["size"] =
			size === "sm" ? "small" : size === "lg" ? "lg" : "medium";

		return (
			<OutlinedInput
				{...props}
				inputRef={ref}
				error={error}
				disabled={disabled}
				size={muiSize}
				sx={[
					(theme: Theme) => ({
						"& .MuiOutlinedInput-input[readonly]": {
							cursor: "default",
						},

						"&.Mui-disabled": {
							backgroundColor: theme.palette.action.disabledBackground,
						},
						"& .MuiInputAdornment-root": {
							color: theme.palette.text.secondary,
						},
						...(error && {
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: theme.palette.error.main,
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: theme.palette.error.main,
							},

							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderColor: theme.palette.error.main,
							},
						}),
						...(success &&
							!error && {
								"& .MuiOutlinedInput-notchedOutline": {
									borderColor: theme.palette.success.main,
								},

								"&:hover .MuiOutlinedInput-notchedOutline": {
									borderColor: theme.palette.success.main,
								},

								"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
									borderColor: theme.palette.success.main,
								},
							}),
					}),
					...(Array.isArray(sx) ? sx : [sx]),
				]}
			/>
		);
	},
);

Input.displayName = "Input";

export { Input };

