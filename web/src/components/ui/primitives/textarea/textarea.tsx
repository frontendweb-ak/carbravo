import type { TextFieldProps } from "@mui/material/TextField";
import TextField from "@mui/material/TextField";

import { cn } from "@/utils";

const textareaVariants = {
	sm: {
		minHeight: 80,
		borderRadius: 1,
		fontSize: "0.875rem",
		padding: "8px 10px",
	},
	default: {
		minHeight: 96,
		borderRadius: 1,
		fontSize: "0.875rem",
		padding: "10px 12px",
	},
	lg: {
		minHeight: 112,
		borderRadius: 1,
		fontSize: "1rem",
		padding: "12px 14px",
	},
} as const;

type TextareaSize = keyof typeof textareaVariants;

export interface TextareaProps extends Omit<
	TextFieldProps,
	"size" | "variant" | "multiline"
> {
	size?: TextareaSize;
	success?: boolean;
}

function Textarea({
	className,
	size = "default",
	error = false,
	success = false,
	disabled,
	...props
}: TextareaProps) {
	const variant = textareaVariants[size];

	return (
		<TextField
			{...props}
			multiline
			fullWidth
			variant="outlined"
			error={error}
			disabled={disabled}
			className={cn(className)}
			slotProps={{
				htmlInput: {
					"data-slot": "textarea",
					"data-size": size,
					"data-error": error || undefined,
					"data-success": success || undefined,
					"aria-invalid": error || undefined,
				},
			}}
			sx={{
				"& .MuiOutlinedInput-root": {
					minHeight: variant.minHeight,
					borderRadius: variant.borderRadius,
					fontSize: variant.fontSize,
					alignItems: "flex-start",

					"& textarea": {
						padding: variant.padding,
						resize: "vertical",
					},
				},

				...(success && {
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: "success.main",
					},

					"& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
						borderColor: "success.main",
					},

					"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
						{
							borderColor: "success.main",
						},
				}),
			}}
		/>
	);
}

export { Textarea };
