// src/components/ui/forms/form-field.tsx

import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export interface FormFieldProps {
	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	error?: ReactNode;
	disabled?: boolean;
	rightElement?: ReactNode;
	children: ReactNode;
}

function FormField({
	label,
	required = false,
	description,
	error,
	disabled = false,
	rightElement,
	children,
}: FormFieldProps) {
	const hasHeader = label !== undefined || rightElement !== undefined;

	return (
		<Box
			data-slot="form-field"
			data-disabled={disabled || undefined}
			sx={{
				width: "100%",
				display: "flex",
				flexDirection: "column",
				gap: 1,
			}}
		>
			{hasHeader && (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 1.5,
					}}
				>
					{label !== undefined && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								minWidth: 0,
							}}
						>
							<Typography
								component="span"
								variant="overline"
								sx={{
									color: "text.primary",
									fontSize: "0.6875rem",
									lineHeight: 1.4,
									fontWeight: 700,
									letterSpacing: "0.04em",
								}}
							>
								{label}
							</Typography>

							{required && (
								<Typography
									component="span"
									aria-hidden="true"
									sx={{
										display: "inline-flex",
										alignItems: "center",
										height: 18,
										px: 0.75,

										borderRadius: 0.75,

										backgroundColor: "warning.soft",
										color: "warning.softForeground",
										border: "1px solid",
										borderColor: "warning.softBorder",

										fontSize: "0.625rem",
										lineHeight: 1,
										fontWeight: 700,
										letterSpacing: "0.03em",
										textTransform: "uppercase",
										whiteSpace: "nowrap",
									}}
								>
									Required
								</Typography>
							)}
						</Box>
					)}

					{rightElement !== undefined && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								flexShrink: 0,
							}}
						>
							{rightElement}
						</Box>
					)}
				</Box>
			)}

			{children}

			{error ? (
				<FormHelperText
					error
					sx={{
						mx: 0,
						mt: 0.75,
						fontSize: "0.75rem",
						fontWeight: 500,
					}}
				>
					{error}
				</FormHelperText>
			) : description ? (
				<FormHelperText
					sx={{
						mx: 0,
						mt: 0.75,
						color: "text.secondary",
						fontSize: "0.75rem",
					}}
				>
					{description}
				</FormHelperText>
			) : null}
		</Box>
	);
}

export { FormField };
