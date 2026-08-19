// src/components/ui/primitives/form-field/form-field.tsx

import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

import { FormLabel } from "../form-label";

export interface FormFieldProps {
	id?: string;
	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	error?: ReactNode;
	disabled?: boolean;
	rightElement?: ReactNode;
	children: ReactNode;

	labelVariant?: "label" | "labelSmall" | "overline";
	showRequiredIndicator?: boolean;
	showDescriptionWithError?: boolean;

	className?: string;
	sx?: SxProps<Theme>;
}

function FormField({
	id,
	label,
	required = false,
	description,
	error,
	disabled = false,
	rightElement,
	children,
	labelVariant = "overline",
	showRequiredIndicator = true,
	showDescriptionWithError = false,
	className,
	sx,
}: FormFieldProps) {
	const hasHeader = label !== undefined || rightElement !== undefined;
	const hasError = Boolean(error);
	const hasDescription = Boolean(description);

	const descriptionId = id ? `${id}-description` : undefined;
	const errorId = id ? `${id}-error` : undefined;

	return (
		<Box
			data-slot="form-field"
			data-disabled={disabled || undefined}
			data-invalid={hasError || undefined}
			data-required={required || undefined}
			className={className}
			sx={[
				{
					width: "100%",
					display: "flex",
					flexDirection: "column",
					gap: 1,
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			{hasHeader && (
				<Box
					data-slot="form-field-header"
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 1.5,
						mb: 0.5,
					}}
				>
					{label !== undefined && (
						<FormLabel
							htmlFor={id}
							required={required}
							disabled={disabled}
							variant={labelVariant}
							showRequiredIndicator={showRequiredIndicator}
						>
							{label}
						</FormLabel>
					)}

					{rightElement !== undefined && (
						<Box
							data-slot="form-field-right"
							sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
						>
							{rightElement}
						</Box>
					)}
				</Box>
			)}

			<Box data-slot="form-field-control" sx={{ width: "100%" }}>
				{children}
			</Box>

			{hasError ? (
				<FormHelperText
					id={errorId}
					error
					data-slot="form-field-error"
					sx={{
						mx: 0,
						mt: 0.75,
						fontSize: "0.75rem",
						lineHeight: 1.5,
						fontWeight: 500,
					}}
				>
					{error}
				</FormHelperText>
			) : hasDescription ? (
				<FormHelperText
					id={descriptionId}
					data-slot="form-field-description"
					sx={{
						mx: 0,
						mt: 0.75,
						color: "text.secondary",
						fontSize: "0.75rem",
						lineHeight: 1.5,
					}}
				>
					{description}
				</FormHelperText>
			) : null}

			{showDescriptionWithError && hasError && hasDescription && (
				<FormHelperText
					id={descriptionId}
					data-slot="form-field-description"
					sx={{
						mx: 0,
						mt: 0,
						color: "text.secondary",
						fontSize: "0.75rem",
						lineHeight: 1.5,
					}}
				>
					{description}
				</FormHelperText>
			)}
		</Box>
	);
}

export { FormField };
