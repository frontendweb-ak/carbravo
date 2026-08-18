// src/components/ui/primitives/button/button.tsx

import MuiButton, {
	type ButtonProps as MuiButtonProps,
} from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "danger"
	| "success";

export type ButtonProps = Omit<MuiButtonProps, "variant"> & {
	/**
	 * CarBravo semantic button variant.
	 *
	 * `contained`, `outlined` and `text` remain
	 * implementation details of the component.
	 */
	variant?: ButtonVariant;

	/**
	 * Shows a loading indicator and disables the button.
	 */
	loading?: boolean;
};

type ButtonConfig = {
	variant: MuiButtonProps["variant"];
	color: MuiButtonProps["color"];
};

const variantMap: Record<ButtonVariant, ButtonConfig> = {
	primary: {
		variant: "contained",
		color: "primary",
	},

	secondary: {
		variant: "contained",
		color: "secondary",
	},

	outline: {
		variant: "outlined",
		color: "primary",
	},

	ghost: {
		variant: "text",
		color: "primary",
	},

	danger: {
		variant: "contained",
		color: "error",
	},

	success: {
		variant: "contained",
		color: "success",
	},
};

function Button({
	variant = "primary",
	loading = false,
	disabled = false,
	children,
	startIcon,
	endIcon,
	...props
}: ButtonProps) {
	const config = variantMap[variant];

	return (
		<MuiButton
			{...props}
			variant={config.variant}
			color={config.color}
			disabled={disabled || loading}
			startIcon={
				loading ? <CircularProgress size={16} color="inherit" /> : startIcon
			}
			endIcon={loading ? undefined : endIcon}
		>
			{children}
		</MuiButton>
	);
}

export { Button };
