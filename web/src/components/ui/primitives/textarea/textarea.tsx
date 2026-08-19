// src/components/ui/primitives/textarea/textarea.tsx

import TextField, { type TextFieldProps } from "@mui/material/TextField";

const textareaVariants = {
	sm: {
		minHeight: 88,
		borderRadius: 1,
		fontSize: "0.875rem",
		lineHeight: 1.5,
		padding: "8px 10px",
	},

	default: {
		minHeight: 104,
		borderRadius: 1,
		fontSize: "0.875rem",
		lineHeight: 1.5,
		padding: "10px 12px",
	},

	lg: {
		minHeight: 120,
		borderRadius: 1,
		fontSize: "1rem",
		lineHeight: 1.5,
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
	maxLength?: number;
}

function Textarea({
	className,
	size = "default",
	error = false,
	success = false,
	disabled = false,
	sx,
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
			className={className}
			slotProps={{
				htmlInput: {
					"data-slot": "textarea",
					"data-size": size,
					"data-error": error || undefined,
					"data-success": success || undefined,
					"aria-invalid": error || undefined,
				},
			}}
			sx={[
				{
					width: "100%",

					"& .MuiOutlinedInput-root": {
						minHeight: variant.minHeight,
						borderRadius: variant.borderRadius,
						fontSize: variant.fontSize,
						lineHeight: variant.lineHeight,

						alignItems: "flex-start",

						padding: 0,

						"& textarea": {
							boxSizing: "border-box",

							width: "100%",
							minHeight: variant.minHeight,

							margin: 0,

							padding: variant.padding,

							fontSize: variant.fontSize,
							lineHeight: variant.lineHeight,

							resize: "vertical",

							overflow: "auto",

							"&::placeholder": {
								opacity: 1,
								color: "text.secondary",
							},
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
				},

				...(Array.isArray(sx) ? sx : [sx]),
			]}
		/>
	);
}

export { Textarea };
