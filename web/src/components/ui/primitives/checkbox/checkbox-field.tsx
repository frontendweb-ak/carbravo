// src/components/ui/primitives/checkbox/checkbox-field.tsx

import type { ReactNode } from "react";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

import { Typography } from "../typography";
import { Checkbox, type CheckboxProps } from "./checkbox";

export interface CheckboxFieldProps extends Omit<
	CheckboxProps,
	"checked" | "label" | "description"
> {
	label?: ReactNode;
	description?: ReactNode;
	helperText?: ReactNode;

	error?: boolean;
	checked?: boolean;
	required?: boolean;
	variant?: "card" | "inline";
}

function CheckboxField({
	label,
	description,
	helperText,
	error = false,
	checked = false,
	required = false,
	disabled = false,
	variant = "card",
	onChange,
	onBlur,
	...props
}: CheckboxFieldProps) {
	const hasHelperText = Boolean(helperText);

	if (variant === "inline") {
		return (
			<FormControl error={error} disabled={disabled}>
				<Box
					component="label"
					sx={{
						display: "inline-flex",
						alignItems: "center",
						gap: 0.75,

						cursor: disabled ? "not-allowed" : "pointer",

						"& .MuiCheckbox-root": {
							p: 0,
						},
					}}
				>
					<Checkbox
						{...props}
						checked={checked}
						disabled={disabled}
						onChange={onChange}
						onBlur={onBlur}
					/>

					{label !== undefined && (
						<Typography
							variant="body"
							weight="medium"
							sx={{
								lineHeight: 1.4,
								color: disabled ? "text.disabled" : "text.primary",
							}}
						>
							{label}

							{required && (
								<Box
									component="span"
									sx={{
										color: "error.main",
										ml: 0.25,
									}}
								>
									*
								</Box>
							)}
						</Typography>
					)}
				</Box>

				{hasHelperText && (
					<FormHelperText error={error} sx={{ ml: 3 }}>
						{helperText}
					</FormHelperText>
				)}

				{!hasHelperText && description && (
					<FormHelperText
						sx={{
							ml: 3,
							color: "text.secondary",
						}}
					>
						{description}
					</FormHelperText>
				)}
			</FormControl>
		);
	}

	// --------------------------------------------------
	// CARD
	// --------------------------------------------------

	return (
		<FormControl fullWidth error={error} disabled={disabled}>
			<Box
				component="label"
				sx={{
					width: "100%",
					boxSizing: "border-box",

					display: "flex",
					alignItems: "flex-start",

					gap: 1.25,

					padding: "12px 16px",

					border: "1px solid",
					borderColor: error ? "error.main" : "control.inputBorder",

					borderRadius: 2,

					backgroundColor: "background.paper",

					cursor: disabled ? "not-allowed" : "pointer",

					transition:
						"border-color 150ms ease, " +
						"background-color 150ms ease, " +
						"box-shadow 150ms ease",

					"&:hover": !disabled
						? {
								borderColor: error ? "error.main" : "control.borderStrong",
							}
						: undefined,

					"&:focus-within": !disabled
						? {
								borderColor: error ? "error.main" : "primary.main",

								boxShadow: (theme) =>
									`0 0 0 3px ${alphaColor(
										error
											? theme.palette.error.main
											: theme.palette.primary.main,
										0.15,
									)}`,
							}
						: undefined,

					...(disabled && {
						backgroundColor: "control.disabledBackground",
						borderColor: "control.disabledBorder",
					}),
				}}
			>
				<Box
					sx={{
						flexShrink: 0,
						display: "flex",
						alignItems: "flex-start",
						mt: -0.25,

						"& .MuiCheckbox-root": {
							padding: 2,
						},
					}}
				>
					<Checkbox
						{...props}
						checked={checked}
						disabled={disabled}
						onChange={onChange}
						onBlur={onBlur}
					/>
				</Box>

				<Box
					sx={{
						minWidth: 0,
						flex: 1,
					}}
				>
					{label !== undefined && (
						<Typography
							variant="body"
							weight="bold"
							sx={{
								lineHeight: 1.25,
								color: disabled ? "text.disabled" : "text.primary",
							}}
						>
							{label}

							{required && (
								<Box
									component="span"
									sx={{
										color: "error.main",
										ml: 0.25,
									}}
								>
									*
								</Box>
							)}
						</Typography>
					)}

					{description !== undefined && !hasHelperText && (
						<Typography
							variant="bodyMedium"
							color={disabled ? "muted" : "secondary"}
							sx={{
								mt: 0.25,
								lineHeight: 1.3,
							}}
						>
							{description}
						</Typography>
					)}

					{hasHelperText && (
						<FormHelperText
							error={error}
							sx={{
								margin: 0,
								mt: 0.5,
							}}
						>
							{helperText}
						</FormHelperText>
					)}
				</Box>
			</Box>
		</FormControl>
	);
}

function alphaColor(color: string, opacity: number) {
	return `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`;
}

export { CheckboxField };
