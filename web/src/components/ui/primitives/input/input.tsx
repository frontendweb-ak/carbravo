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

const sizeStyles: Record<
	InputSize,
	{
		height: number;
		fontSize: string;
	}
> = {
	sm: {
		height: 32,
		fontSize: "0.8125rem",
	},
	default: {
		height: 36,
		fontSize: "0.875rem",
	},
	lg: {
		height: 40,
		fontSize: "1rem",
	},
};

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
		const dimensions = sizeStyles[size];

		return (
			<OutlinedInput
				{...props}
				inputRef={ref}
				error={error}
				disabled={disabled}
				sx={[
					(theme) => ({
						height: dimensions.height,
						backgroundColor: theme.palette.background.paper,
						// borderRadius: theme.shape.borderRadius,
						fontSize: dimensions.fontSize,
						color: theme.palette.text.primary,
						"& .MuiOutlinedInput-input": {
							height: "100%",
							padding: "0 12px",
							boxSizing: "border-box",
						},
						"& .MuiOutlinedInput-input::placeholder": {
							color: theme.palette.text.secondary,
							opacity: 1,
						},

						"& .MuiInputAdornment-root": {
							color: theme.palette.text.secondary,
						},

						"& .MuiOutlinedInput-notchedOutline": {
							borderColor: theme.palette.divider,
							borderWidth: 1,
						},

						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: theme.palette.text.secondary,
						},

						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: theme.palette.primary.main,
						},

						...(error && {
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: theme.palette.error.main,
							},

							"&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline":
								{
									borderColor: theme.palette.error.main,
								},
						}),

						...(success &&
							!error && {
								"& .MuiOutlinedInput-notchedOutline": {
									borderColor: theme.palette.success.main,
								},

								"&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline":
									{
										borderColor: theme.palette.success.main,
									},
							}),

						"& .MuiOutlinedInput-input[readonly]": {
							cursor: "default",
						},

						"&.Mui-disabled": {
							backgroundColor: theme.palette.action.disabledBackground,
						},
					}),

					...(Array.isArray(sx) ? sx : [sx]),
				]}
			/>
		);
	},
);

Input.displayName = "Input";

export { Input };

