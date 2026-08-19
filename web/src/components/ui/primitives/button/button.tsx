// src/components/ui/primitives/button/button.tsx

import MuiButton, {
	type ButtonProps as MuiButtonProps,
} from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import type { SxProps, Theme } from "@mui/material/styles";

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "danger"
	| "success";

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
	variant?: ButtonVariant;
	soft?: boolean;
	loading?: boolean;
	height?: number | string;
	paddingX?: number | string;
	paddingY?: number | string;
	borderRadius?: number | string;
	fontSize?: number | string;
	fontWeight?: number;
	minWidth?: number | string;
	textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
	sx?: SxProps<Theme>;
}

type ButtonConfig = {
	variant: MuiButtonProps["variant"];
	color: "primary" | "secondary" | "error" | "success";
};

const variantMap: Record<ButtonVariant, ButtonConfig> = {
	primary: { variant: "contained", color: "primary" },
	secondary: { variant: "contained", color: "secondary" },
	outline: { variant: "outlined", color: "primary" },
	ghost: { variant: "text", color: "primary" },
	danger: { variant: "contained", color: "error" },
	success: { variant: "contained", color: "success" },
};

function Button({
	variant = "primary",
	soft = false,
	loading = false,
	disabled = false,
	children,
	startIcon,
	endIcon,

	height = 36,
	paddingX = 4,
	paddingY = 0,
	borderRadius = 1,
	fontSize = "0.8125rem",
	fontWeight = 700,
	minWidth,
	textTransform = "none",

	sx,

	...props
}: ButtonProps) {
	const config = variantMap[variant];

	const isSoftSuccess = soft && variant === "success";
	const isSoftDanger = soft && variant === "danger";

	return (
		<MuiButton
			{...props}
			variant={soft ? "outlined" : config.variant}
			color={config.color}
			disabled={disabled || loading}
			startIcon={
				loading ? <CircularProgress size={14} color="inherit" /> : startIcon
			}
			endIcon={loading ? undefined : endIcon}
			sx={[
				{
					minHeight: height,
					height,

					px: paddingX,
					py: paddingY,

					borderRadius,

					minWidth,

					fontSize,
					fontWeight,
					textTransform,

					boxShadow: "none",

					"&:hover": {
						boxShadow: "none",
					},
				},

				// Soft success
				...(isSoftSuccess
					? [
							{
								color: "success.main",
								backgroundColor: "success.soft",
								borderColor: "success.softBorder",

								"&:hover": {
									backgroundColor: "success.soft",
									borderColor: "success.main",
									boxShadow: "none",
								},
							},
						]
					: []),

				// Soft danger
				...(isSoftDanger
					? [
							{
								color: "error.main",
								backgroundColor: "error.soft",
								borderColor: "error.softBorder",

								"&:hover": {
									backgroundColor: "error.soft",
									borderColor: "error.main",
									boxShadow: "none",
								},
							},
						]
					: []),

				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			{children}
		</MuiButton>
	);
}

export { Button };

