import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

export interface FormFieldProps {
	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	error?: string;
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
			{(label || rightElement) && (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 1.5,
					}}
				>
					{label && (
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
								variant="caption"
								sx={{
									fontSize: 12,
									fontWeight: 600,
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									color: disabled ? "text.disabled" : "text.primary",
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
										borderRadius: 0.5,
										px: 0.75,
										py: 0.25,
										fontSize: 10,
										fontWeight: 700,
										lineHeight: 1,
										letterSpacing: "0.05em",
										backgroundColor: "warning.light",
										color: "warning.dark",
									}}
								>
									REQUIRED
								</Typography>
							)}
						</Box>
					)}

					{rightElement && (
						<Box
							sx={{
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
				<Typography
					role="alert"
					variant="caption"
					sx={{
						fontSize: 12,
						fontWeight: 500,
						color: "error.main",
					}}
				>
					{error}
				</Typography>
			) : description ? (
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{
						fontSize: 12,
					}}
				>
					{description}
				</Typography>
			) : null}
		</Box>
	);
}

export { FormField };
