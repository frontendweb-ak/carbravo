// src/components/ui/forms/form-label.tsx

import Box from "@mui/material/Box";
import type { ReactNode } from "react";

import { Typography } from "../typography";

export interface FormLabelProps {
	htmlFor?: string;
	children: ReactNode;
	required?: boolean;
	disabled?: boolean;
	showRequiredIndicator?: boolean;
	variant?: "label" | "labelSmall" | "overline";
}

function FormLabel({
	htmlFor,
	children,
	required = false,
	disabled = false,
	showRequiredIndicator = true,
	variant = "overline",
}: FormLabelProps) {
	return (
		<Box
			component="label"
			htmlFor={htmlFor}
			data-slot="form-label"
			data-disabled={disabled || undefined}
			data-required={required || undefined}
			sx={{
				display: "inline-flex",
				alignItems: "center",
				gap: 1,
				minWidth: 0,

				cursor: disabled ? "default" : "pointer",
			}}
		>
			<Typography
				variant={variant}
				color="secondary"
				weight="semibold"
				sx={{
					minWidth: 0,
					color: disabled ? "text.disabled" : "text.secondary",
				}}
			>
				{children}
			</Typography>

			{required && showRequiredIndicator && (
				<Typography
					component="span"
					variant="labelSmall"
					color="warning"
					aria-hidden="true"
					weight="bold"
					sx={{
						display: "inline-flex",
						alignItems: "center",
						height: 18,
						px: 0.75,

						borderRadius: 0.75,

						backgroundColor: "warning.soft",
						color: "warning.softForeground",

						//border: "1px solid",
						borderColor: "warning.softBorder",

						lineHeight: 1,
						textTransform: "uppercase",
						whiteSpace: "nowrap",
					}}
				>
					Required
				</Typography>
			)}
		</Box>
	);
}

export { FormLabel };
